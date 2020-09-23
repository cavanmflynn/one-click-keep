import { Module, Mutation, VuexModule, Action } from 'vuex-module-decorators';
import { store } from '../store';
import {
  AddNetworkArgs,
  Network,
  Status,
  OpenPorts,
  CommonNode,
  BitcoinNode,
} from '@/types';
import { docker } from '@/lib/docker/docker-service';
import {
  createNetwork,
  getNetworkById,
  getOpenPorts,
  delay,
  bitcoindService,
} from '@/lib/utils';
import { system, bitcoind } from '..';
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
    const setNodeStatus = (n: CommonNode) => {
      n.status = status;
      n.errorMsg = error?.message;
    };
    if (only) {
      // Only update a specific node's status
      // network.nodes.lightning.filter(n => n.name === only).forEach(setNodeStatus);
      network.nodes.bitcoin
        .filter((n) => n.name === only)
        .forEach(setNodeStatus);
    } else if (all) {
      // Update all node statuses
      network.status = status;
      network.nodes.bitcoin.forEach(setNodeStatus);
      // network.nodes.lightning.forEach(setNodeStatus);
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
    // network.nodes.lightning
    //   .filter(n => !!ports[n.name])
    //   .forEach(n => (n.ports = { ...n.ports, ...ports[n.name] }));
  }

  @Action({ rawError: true })
  async add(args: AddNetworkArgs) {
    const nextId = Math.max(0, ...this.networks.map((n) => n.id)) + 1;
    const network = createNetwork({
      ...args,
      id: nextId,
      dockerRepoState: system.dockerRepoState,
    });
    await docker.saveComposeFile(network);
    this.addNetwork(network);
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
        // Re-fetch the network with the updated ports
        network = getNetworkById(this._networks, id);
        await this.save();
        await docker.saveComposeFile(network);
      }
      // Start the docker containers
      await docker.start(network);
      // Update the list of docker images pulled since new images may be pulled
      await system.getDockerImages();
      // set the status of only the network to Started
      this.setStatus({ id, status: Status.Started, all: false });
      // Wait for nodes to startup before updating their status
      await this.monitorStartup([
        // ...network.nodes.lightning,
        ...network.nodes.bitcoin,
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
      // charts: getStoreState().designer.allCharts,
    });
  }

  @Action({ rawError: true })
  async monitorStartup(nodes: CommonNode[]) {
    if (!nodes.length) return;
    const id = nodes[0].networkId;
    const network = getNetworkById(this._networks, id);

    // const lnNodesOnline: Promise<void>[] = [];
    const btcNodesOnline: Promise<void>[] = [];
    for (const node of nodes) {
      // Wait for lnd nodes to come online before updating their status TODO
      switch (node.type) {
        case 'ethereum': {
          // const ln = node as LightningNode;
          // // use .then() to continue execution while the promises are waiting to complete
          // const promise = injections.lightningFactory
          //   .getService(ln)
          //   .waitUntilOnline(ln)
          //   .then(async () => {
          //     actions.setStatus({ id, status: Status.Started, only: ln.name });
          //   })
          //   .catch(error =>
          //     actions.setStatus({ id, status: Status.Error, only: ln.name, error }),
          //   );
          // lnNodesOnline.push(promise);
          break;
        }
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
      }
    }
    // After all bitcoin nodes are online, mine one block so that Eclair nodes will start
    if (btcNodesOnline.length) {
      const [node] = network.nodes.bitcoin;
      await Promise.all(btcNodesOnline)
        .then(async () => {
          await delay(2000);
          await bitcoind.mine({ node, blocks: 1 });
        })
        .catch((e) => info('Failed to mine a block after network startup', e));
    }
    // after all LN nodes are online, connect each of them to each other. This helps
    // ensure that each node is aware of the entire graph and can route payments properly
    // if (lnNodesOnline.length) {
    //   await Promise.all(lnNodesOnline)
    //     .then(async () => await getStoreActions().lightning.connectAllPeers(network))
    //     .catch(e => info('Failed to connect all LN peers', e));
    // }
  }
}
