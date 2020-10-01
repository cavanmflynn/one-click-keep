import { Module, Mutation, VuexModule, Action } from 'vuex-module-decorators';
import { store } from '../store';
import {
  AddNetworkArgs,
  Network,
  Status,
  OpenPorts,
  CommonNode,
  BitcoinNode,
  EthereumNode,
  CommonApp,
} from '@/types';
import { docker } from '@/lib/docker/docker-service';
import {
  createNetwork,
  getNetworkById,
  getOpenPorts,
  bitcoindService,
  ethereumService,
  toml,
  keystore,
  rm,
} from '@/lib/utils';
import { system, bitcoind, ethereum } from '..';
import { info } from 'electron-log';
import { APP_VERSION } from '@/lib/constants';

@Module({ store, name: 'network', dynamic: true, namespaced: true })
export class NetworkModule extends VuexModule {
  private _networks: Network[] = [];

  public get networks() {
    return this._networks;
  }

  @Mutation
  public setNetworks(networks: Network[]) {
    this._networks = networks;
  }

  @Mutation
  public addNetwork(network: Network) {
    this._networks.push(network);
  }

  @Mutation
  public setStatus({
    id,
    status,
    only,
    all = true,
    error,
  }: {
    id: string | number;
    status: Status;
    only?: string;
    all?: boolean;
    error?: Error;
  }) {
    const network = getNetworkById(this._networks, id);
    const setStatus = (n: CommonNode | CommonApp) => {
      n.status = status;
      n.errorMsg = error?.message;
    };
    if (only) {
      // Only update a specific node's status
      network.nodes.bitcoin.filter((n) => n.name === only).forEach(setStatus);
      network.nodes.ethereum.filter((n) => n.name === only).forEach(setStatus);
      network.nodes.electrum.filter((n) => n.name === only).forEach(setStatus);
      network.nodes.beacon.filter((n) => n.name === only).forEach(setStatus);
      network.nodes.ecdsa.filter((n) => n.name === only).forEach(setStatus);
      if (network.apps.tbtc?.name === only) {
        setStatus(network.apps.tbtc);
      }
      if (network.apps.keep?.name === only) {
        setStatus(network.apps.keep);
      }
    } else if (all) {
      // Update all node statuses
      network.status = status;
      network.nodes.bitcoin.forEach(setStatus);
      network.nodes.ethereum.forEach(setStatus);
      network.nodes.electrum.forEach(setStatus);
      network.nodes.beacon.forEach(setStatus);
      network.nodes.ecdsa.forEach(setStatus);
      network.apps.tbtc && setStatus(network.apps.tbtc);
      network.apps.keep && setStatus(network.apps.keep);
    } else {
      // If no specific node name provided, just update the network status
      network.status = status;
    }
  }

  @Mutation
  public updateNodePorts({
    id,
    ports,
  }: {
    id: string | number;
    ports: OpenPorts;
  }) {
    const network = getNetworkById(this._networks, id);
    network.nodes.bitcoin
      .filter((n) => !!ports[n.name])
      .forEach((n) => (n.ports = { ...n.ports, ...ports[n.name] }));
    network.nodes.ethereum
      .filter((n) => !!ports[n.name])
      .forEach((n) => (n.ports = { ...n.ports, ...ports[n.name] }));
    network.nodes.electrum
      .filter((n) => !!ports[n.name])
      .forEach((n) => (n.ports = { ...n.ports, ...ports[n.name] }));
    network.nodes.beacon
      .filter((n) => !!ports[n.name])
      .forEach((n) => (n.ports = { ...n.ports, ...ports[n.name] }));
    network.nodes.ecdsa
      .filter((n) => !!ports[n.name])
      .forEach((n) => (n.ports = { ...n.ports, ...ports[n.name] }));
  }

  @Mutation
  public updateAppPorts({
    id,
    ports,
  }: {
    id: string | number;
    ports: OpenPorts;
  }) {
    const network = getNetworkById(this._networks, id);
    const { tbtc, keep } = network.apps;
    if (tbtc?.ports?.[tbtc?.name]) {
      tbtc.ports = { http: ports[tbtc.name].http! };
    }
    if (keep?.ports?.[keep?.name]) {
      keep.ports = { http: ports[keep.name].http! };
    }
  }

  @Action({ rawError: true })
  async load() {
    const { networks } = await docker.loadNetworks();
    if (networks?.length) {
      this.setNetworks(networks);
    }
  }

  @Action({ rawError: true })
  async add(args: AddNetworkArgs) {
    const nextId = Math.max(0, ...this.networks.map((n) => n.id)) + 1;
    const network = createNetwork({
      ...args,
      id: nextId,
      dockerRepoState: system.dockerRepoState,
    });
    await Promise.all([
      toml.saveTomlFiles(network),
      docker.saveComposeFile(network),
      keystore.saveKeystoreFiles(network),
    ]);
    this.addNetwork(network);
    await this.save();
    return network;
  }

  @Action({ rawError: true })
  async toggle(id: string | number) {
    const network = getNetworkById(this._networks, id);
    if (network.status === Status.Stopped || network.status === Status.Error) {
      await this.start(id);
    } else if (network.status === Status.Started) {
      await this.stop(id);
    }
    await this.save();
  }

  @Action({ rawError: true })
  async start(id: string | number) {
    let network = getNetworkById(this._networks, id);
    this.setStatus({ id, status: Status.Starting });
    try {
      // Make sure the node ports are available
      const ports = await getOpenPorts(network);
      if (ports) {
        // At least one port was updated. Save the network & composeFile
        this.updateNodePorts({ id, ports });
        this.updateAppPorts({ id, ports });
        // Re-fetch the network with the updated ports
        network = getNetworkById(this._networks, id);
        await this.save();
        await docker.saveComposeFile(network);
      }
      // Start the docker containers
      await docker.start(network);
      // Update the list of docker images pulled since new images may be pulled
      await system.getDockerImages();
      // Set the status of only the network to Started
      this.setStatus({ id, status: Status.Started, all: false });
      // Wait for nodes to startup before updating their status
      await this.monitorStartup([
        ...network.nodes.bitcoin,
        ...network.nodes.ethereum,
        ...network.nodes.electrum,
        ...network.nodes.beacon,
        ...network.nodes.ecdsa,
      ]);
    } catch (error) {
      this.setStatus({ id, status: Status.Error });
      info(`Unable to start network '${network.name}'`, error.message);
      throw error;
    }
  }

  @Action({ rawError: true })
  async stop(id: string | number) {
    const network = getNetworkById(this._networks, id);
    this.setStatus({ id, status: Status.Stopping });
    try {
      await docker.stop(network);
      this.setStatus({ id, status: Status.Stopped });
    } catch (e) {
      this.setStatus({ id, status: Status.Error });
      info(`Unable to stop network '${network.name}'`, e.message);
      throw e;
    }
  }

  @Action({ rawError: true })
  async save() {
    await docker.saveNetworks({
      version: APP_VERSION,
      networks: this.networks,
    });
  }

  @Action({ rawError: true })
  async monitorStartup(nodes: CommonNode[]) {
    if (!nodes.length) return;
    const id = nodes[0].networkId;

    const btcNodesOnline: Promise<void>[] = [];
    const ethNodesOnline: Promise<void>[] = [];
    for (const node of nodes) {
      switch (node.type) {
        case 'bitcoin': {
          const btc = node as BitcoinNode;
          // Wait for bitcoind nodes to come online before updating their status
          // use .then() to continue execution while the promises are waiting to complete
          const promise = bitcoindService
            .waitUntilOnline(btc)
            .then(async () => {
              this.setStatus({ id, status: Status.Started, only: btc.name });
              // Connect each bitcoin node to it's peers so tx & block propagation is fast
              await bitcoindService.connectPeers(btc);
              await bitcoind.getInfo(btc);
            })
            .catch((error) =>
              this.setStatus({
                id,
                status: Status.Error,
                only: btc.name,
                error,
              }),
            );
          btcNodesOnline.push(promise);
          break;
        }
        case 'ethereum': {
          const eth = node as EthereumNode;
          const promise = ethereumService
            .waitUntilOnline(eth)
            .then(async () => {
              this.setStatus({ id, status: Status.Started, only: eth.name });
              await ethereum.getInfo(eth);
            })
            .catch((error) =>
              this.setStatus({
                id,
                status: Status.Error,
                only: eth.name,
                error,
              }),
            );
          ethNodesOnline.push(promise);
          break;
        }
        case 'electrum': {
          // TODO
          break;
        }
        case 'beacon': {
          // TODO
          break;
        }
        case 'ecdsa': {
          // TODO
          break;
        }
      }
    }
  }

  @Action({ rawError: true })
  async remove(id: string | number) {
    const network = getNetworkById(this._networks, id);
    const statuses = [
      network.status,
      // Nodes
      ...network.nodes.bitcoin.map((n) => n.status),
      ...network.nodes.ethereum.map((n) => n.status),
      ...network.nodes.electrum.map((n) => n.status),
      ...network.nodes.beacon.map((n) => n.status),
      ...network.nodes.ecdsa.map((n) => n.status),
      // Apps
      network.apps.tbtc.status,
      network.apps.keep.status,
    ];
    if (statuses.find((n) => n !== Status.Stopped)) {
      await this.stop(id);
    }
    await rm(network.path);
    const newNetworks = this.networks.filter((n) => n.id !== id);
    this.setNetworks(newNetworks);
    network.nodes.bitcoin.forEach((n) => bitcoind.removeNode(n.name));
    network.nodes.ethereum.forEach((n) => ethereum.removeNode(n.name));
    await this.save();
  }
}
