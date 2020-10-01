import {
  CreateNetworkConfig,
  Network,
  Status,
  NodeImplementation,
  BitcoinNode,
  CommonNode,
  ManagedImage,
  OpenPorts,
  EthereumNode,
  BeaconNode,
  EcdsaNode,
  ElectrumNode,
  CommonApp,
  TbtcApp,
  KeepApp,
  AppName,
  ManagedNodeImage,
  ManagedAppImage,
} from '@/types';
import { networksPath } from './config';
import { join } from 'path';
import { NODE_BASE_PORTS, DOCKER_REPO, APP_BASE_PORTS } from '../constants';
import { debug } from 'electron-log';
import detectPort from 'detect-port';
import { languageLibrary } from '@/localization';
import { system } from '@/store';
import { getKeepNodePeer } from './keep';

export const createNetwork = (config: CreateNetworkConfig) => {
  const { id, name, ecdsaNodes, beaconNodes, dockerRepoState } = config;

  const status = Status.Stopped;
  const network: Network = {
    id: id,
    name,
    status: Status.Stopped,
    path: join(networksPath, id.toString()),
    nodes: {
      bitcoin: [],
      ethereum: [],
      electrum: [],
      beacon: [],
      ecdsa: [],
    },
    apps: {
      tbtc: {} as TbtcApp, // Populated below
      keep: {} as KeepApp, // Populated below
    },
  };
  const { bitcoin, ethereum, electrum, beacon, ecdsa } = network.nodes;
  const dockerWrap = (command: string) => ({ image: '', command });
  const nodeImages: ManagedNodeImage[] = [];
  const appImages: ManagedAppImage[] = [];
  Object.entries(dockerRepoState.nodeImages).forEach(([key, entry]) => {
    entry.versions.forEach((version) => {
      nodeImages.push({
        implementation: key as NodeImplementation,
        version,
        command: '',
      });
    });
  });
  Object.entries(dockerRepoState.appImages).forEach(([key, entry]) => {
    entry.versions.forEach((version) => {
      appImages.push({
        name: key as AppName,
        version,
        command: '',
      });
    });
  });

  // Add bitcoin node
  const bitcoindVersion = dockerRepoState.nodeImages.bitcoind.latest;
  const bitcoindCmd = getNodeImageCommand(
    nodeImages,
    'bitcoind',
    bitcoindVersion,
  );
  bitcoin.push(
    createBitcoindNetworkNode(
      network,
      bitcoindVersion,
      dockerWrap(bitcoindCmd),
      status,
    ),
  );

  // Add ethereum node
  const ganacheVersion = dockerRepoState.nodeImages.ganache.latest;
  const ganacheCmd = getNodeImageCommand(nodeImages, 'ganache', ganacheVersion);
  ethereum.push(
    createGanacheNetworkNode(
      network,
      ganacheVersion,
      dockerWrap(ganacheCmd),
      status,
    ),
  );

  // Add electrum node
  const electrumxVersion = dockerRepoState.nodeImages.electrumx.latest;
  const electrumxCmd = getNodeImageCommand(
    nodeImages,
    'electrumx',
    electrumxVersion,
  );
  electrum.push(
    createElectrumXNetworkNode(
      network,
      electrumxVersion,
      dockerWrap(electrumxCmd),
      status,
    ),
  );

  // Add beacon nodes
  for (let i = 0; i < beaconNodes; i++) {
    const beaconVersion = dockerRepoState.nodeImages['keep-beacon'].latest;
    const beaconCmd = getNodeImageCommand(
      nodeImages,
      'keep-beacon',
      beaconVersion,
    );
    beacon.push(
      createBeaconNetworkNode(
        network,
        beaconVersion,
        dockerWrap(beaconCmd),
        status,
      ),
    );
  }

  // Add ecdsa nodes
  for (let i = 0; i < ecdsaNodes; i++) {
    const ecdsaVersion = dockerRepoState.nodeImages['keep-ecdsa'].latest;
    const ecdsaCmd = getNodeImageCommand(
      nodeImages,
      'keep-ecdsa',
      ecdsaVersion,
    );
    ecdsa.push(
      createEcdsaNetworkNode(
        network,
        ecdsaVersion,
        dockerWrap(ecdsaCmd),
        status,
      ),
    );
  }

  // Add tBTC dApp
  const tbtcDappVersion = dockerRepoState.appImages['tbtc-dapp'].latest;
  const tbtcDappCmd = getAppImageCommand(
    appImages,
    'tbtc-dapp',
    tbtcDappVersion,
  );
  network.apps.tbtc = createTbtcNetworkApp(
    network,
    tbtcDappVersion,
    dockerWrap(tbtcDappCmd),
    status,
  );

  // Add KEEP Dashboard
  const keepDashboardVersion =
    dockerRepoState.appImages['keep-dashboard'].latest;
  const keepDashboardCmd = getAppImageCommand(
    appImages,
    'keep-dashboard',
    keepDashboardVersion,
  );
  network.apps.keep = createKeepNetworkApp(
    network,
    keepDashboardVersion,
    dockerWrap(keepDashboardCmd),
    status,
  );

  return network;
};

export const getNodeImageCommand = (
  images: ManagedNodeImage[],
  implementation: NodeImplementation,
  version: string,
): string => {
  const image = images.find(
    (i) => i.implementation === implementation && i.version === version,
  );
  if (!image) {
    throw new Error(
      `Unable to set docker image command for ${implementation} v${version}`,
    );
  }
  return image.command;
};

export const getAppImageCommand = (
  images: ManagedAppImage[],
  name: AppName,
  version: string,
): string => {
  const image = images.find((i) => i.name === name && i.version === version);
  if (!image) {
    throw new Error(
      `Unable to set docker image command for ${name} v${version}`,
    );
  }
  return image.command;
};

export const createBitcoindNetworkNode = (
  network: Network,
  version: string,
  docker: CommonNode['docker'],
  status = Status.Stopped,
): BitcoinNode => {
  const { bitcoin } = network.nodes;
  const id = bitcoin.length ? Math.max(...bitcoin.map((n) => n.id)) + 1 : 0;

  const name = `bitcoin-${id + 1}`;
  const node: BitcoinNode = {
    id,
    networkId: network.id,
    name: name,
    type: 'bitcoin',
    implementation: 'bitcoind',
    version,
    peers: [],
    status,
    ports: {
      rpc: NODE_BASE_PORTS.bitcoind.rest + id,
      p2p: NODE_BASE_PORTS.bitcoind.p2p + id,
      zmqBlock: NODE_BASE_PORTS.bitcoind.zmqBlock + id,
      zmqTx: NODE_BASE_PORTS.bitcoind.zmqTx + id,
    },
    docker,
  };

  // peer up with the previous node on both sides
  if (bitcoin.length > 0) {
    const prev = bitcoin[bitcoin.length - 1];
    node.peers.push(prev.name);
    prev.peers.push(node.name);
  }

  return node;
};

export const createGanacheNetworkNode = (
  network: Network,
  version: string,
  docker: CommonNode['docker'],
  status = Status.Stopped,
): EthereumNode => {
  const { ethereum } = network.nodes;
  const id = ethereum.length ? Math.max(...ethereum.map((n) => n.id)) + 1 : 0;

  const name = `ethereum-${id + 1}`;
  const node: EthereumNode = {
    id,
    networkId: network.id,
    name: name,
    type: 'ethereum',
    implementation: 'ganache',
    version,
    peers: [],
    status,
    ports: {
      rpc: NODE_BASE_PORTS.ganache.rpc + id,
    },
    docker,
  };

  return node;
};

export const createElectrumXNetworkNode = (
  network: Network,
  version: string,
  docker: CommonNode['docker'],
  status = Status.Stopped,
): ElectrumNode => {
  const { electrum } = network.nodes;
  const id = electrum.length ? Math.max(...electrum.map((n) => n.id)) + 1 : 0;

  const name = `electrum-${id + 1}`;
  const node: ElectrumNode = {
    id,
    networkId: network.id,
    name: name,
    type: 'electrum',
    implementation: 'electrumx',
    version,
    peers: [],
    status,
    ports: {
      tcp: NODE_BASE_PORTS.electrumx.tcp + id,
      ssl: NODE_BASE_PORTS.electrumx.ssl + id,
      ws: NODE_BASE_PORTS.electrumx.ws + id,
      wss: NODE_BASE_PORTS.electrumx.wss + id,
      rpc: NODE_BASE_PORTS.electrumx.rpc + id,
    },
    docker,
  };

  return node;
};

export const createBeaconNetworkNode = (
  network: Network,
  version: string,
  docker: CommonNode['docker'],
  status = Status.Stopped,
): BeaconNode => {
  const { beacon } = network.nodes;
  const id = beacon.length ? Math.max(...beacon.map((n) => n.id)) + 1 : 0;

  const name = `beacon-${id + 1}`;
  const node: BeaconNode = {
    id,
    networkId: network.id,
    name: name,
    type: 'beacon',
    implementation: 'keep-beacon',
    version,
    peers: [],
    status,
    ports: {
      p2p: NODE_BASE_PORTS['keep-beacon'].p2p + id,
    },
    docker,
  };

  // peer up with the previous node on both sides
  if (beacon.length > 0) {
    const prev = beacon[beacon.length - 1];
    node.peers.push(getKeepNodePeer(prev));
    prev.peers.push(getKeepNodePeer(node));
  }

  return node;
};

export const createEcdsaNetworkNode = (
  network: Network,
  version: string,
  docker: CommonNode['docker'],
  status = Status.Stopped,
): EcdsaNode => {
  const { ecdsa } = network.nodes;
  const id = ecdsa.length ? Math.max(...ecdsa.map((n) => n.id)) + 1 : 0;

  const name = `ecdsa-${id + 1}`;
  const node: EcdsaNode = {
    id,
    networkId: network.id,
    name: name,
    type: 'ecdsa',
    implementation: 'keep-ecdsa',
    version,
    peers: [],
    status,
    ports: {
      p2p: NODE_BASE_PORTS['keep-ecdsa'].p2p + id,
    },
    docker,
  };

  // peer up with the previous node on both sides
  if (ecdsa.length > 0) {
    const prev = ecdsa[ecdsa.length - 1];
    node.peers.push(getKeepNodePeer(prev));
    prev.peers.push(getKeepNodePeer(node));
  }

  return node;
};

export const createTbtcNetworkApp = (
  network: Network,
  version: string,
  docker: CommonApp['docker'],
  status = Status.Stopped,
): TbtcApp => {
  const { tbtc } = network.apps;
  const id = 0;

  const name = `tbtc-dapp-${id + 1}`;
  const node: TbtcApp = {
    id,
    networkId: network.id,
    name: name,
    app: 'tbtc-dapp',
    version,
    status,
    ports: {
      http: APP_BASE_PORTS['tbtc-dapp'].http + id,
    },
    docker,
  };

  return node;
};

export const createKeepNetworkApp = (
  network: Network,
  version: string,
  docker: CommonApp['docker'],
  status = Status.Stopped,
): KeepApp => {
  const { keep } = network.apps;
  const id = 0;

  const name = `keep-dashboard-${id + 1}`;
  const node: KeepApp = {
    id,
    networkId: network.id,
    name: name,
    app: 'keep-dashboard',
    version,
    status,
    ports: {
      http: APP_BASE_PORTS['keep-dashboard'].http + id,
    },
    docker,
  };

  return node;
};

/**
 * Get a network by its id
 * @param networks All networks
 * @param id The network id
 */
export const getNetworkById = (networks: Network[], id: string | number) => {
  const networkId = typeof id === 'number' ? id : parseInt(id || '');
  const record = networks.find((n) => n.id === networkId);
  if (!record) {
    throw new Error(
      languageLibrary[system.language || 'en']
        .get('NETWORK_NOT_FOUND')
        .toString({
          networkId: networkId.toString(),
        }),
    );
  }
  return record;
};

/**
 * Returns the images needed to start a network that are not included in the list
 * of images already pulled
 * @param network The network to check
 * @param pulled The list of images already pulled
 */
export const getMissingImages = (
  network: Network,
  pulled: string[],
): string[] => {
  const { bitcoin, ethereum, electrum, beacon, ecdsa } = network.nodes;
  const { tbtc, keep } = network.apps;
  const requiredImages = [
    ...bitcoin,
    ...ethereum,
    ...electrum,
    ...beacon,
    ...ecdsa,
    tbtc,
    keep,
  ].map((n) => {
    // Use the custom image name if specified
    if (n.docker.image) return n.docker.image;
    // Convert implementation to image name if node
    if (n['implementation']) {
      const impl = n['implementation'].toLocaleLowerCase().replace(/-/g, '');
      return `${DOCKER_REPO}/${impl}:${n.version}`;
    }
    const app = n['app'].toLocaleLowerCase().replace(/-/g, '');
    return `${DOCKER_REPO}/${app}:${n.version}`;
  });
  // Exclude images already pulled
  const missing = requiredImages.filter((i) => !pulled.includes(i));
  // Filter out duplicates
  const unique = missing.filter(
    (image, index) => missing.indexOf(image) === index,
  );
  if (unique.length) {
    debug(`The network '${network.name}' is missing docker images`, unique);
  }
  return unique;
};

/**
 * Checks a range of port numbers to see if they are open on the current operating system.
 * Returns a new array of port numbers that are confirmed available
 * @param requestedPorts the ports to check for availability. ** must be in ascending order
 *
 * @example if port 10002 is in use
 * getOpenPortRange([10001, 10002, 10003]) -> [10001, 10004, 10005]
 */
export const getOpenPortRange = async (
  requestedPorts: number[],
): Promise<number[]> => {
  const openPorts: number[] = [];

  for (let port of requestedPorts) {
    if (openPorts.length) {
      // adjust to check after the previous open port if necessary, since the last
      // open port may have increased
      const lastOpenPort = openPorts[openPorts.length - 1];
      if (port <= lastOpenPort) {
        port = lastOpenPort + 1;
      }
    }
    openPorts.push(await detectPort(port));
  }
  return openPorts;
};

/**
 * Checks if the ports specified on the nodes are available on the host OS. If not,
 * return new ports that are confirmed available
 * @param network the network with nodes to verify ports of
 */
export const getOpenPorts = async (
  network: Network,
): Promise<OpenPorts | undefined> => {
  const ports: OpenPorts = {};

  // Filter out nodes that are already started since their ports are in use by themselves
  const bitcoin = network.nodes.bitcoin.filter(
    (n) => n.status !== Status.Started,
  );
  if (bitcoin.length) {
    let existingPorts = bitcoin.map((n) => n.ports.rpc);
    let openPorts = await getOpenPortRange(existingPorts);
    if (openPorts.join() !== existingPorts.join()) {
      openPorts.forEach((port, index) => {
        ports[bitcoin[index].name] = { rpc: port };
      });
    }

    existingPorts = bitcoin.map((n) => n.ports.p2p);
    openPorts = await getOpenPortRange(existingPorts);
    if (openPorts.join() !== existingPorts.join()) {
      openPorts.forEach((port, index) => {
        ports[bitcoin[index].name] = {
          ...(ports[bitcoin[index].name] || {}),
          p2p: port,
        };
      });
    }

    existingPorts = bitcoin.map((n) => n.ports.zmqBlock);
    openPorts = await getOpenPortRange(existingPorts);
    if (openPorts.join() !== existingPorts.join()) {
      openPorts.forEach((port, index) => {
        ports[bitcoin[index].name] = {
          ...(ports[bitcoin[index].name] || {}),
          zmqBlock: port,
        };
      });
    }

    existingPorts = bitcoin.map((n) => n.ports.zmqTx);
    openPorts = await getOpenPortRange(existingPorts);
    if (openPorts.join() !== existingPorts.join()) {
      openPorts.forEach((port, index) => {
        ports[bitcoin[index].name] = {
          ...(ports[bitcoin[index].name] || {}),
          zmqTx: port,
        };
      });
    }
  }

  // Filter out nodes that are already started since their ports are in use by themselves
  const ethereum = network.nodes.ethereum.filter(
    (n) => n.status !== Status.Started,
  );
  if (ethereum.length) {
    const existingPorts = ethereum.map((n) => n.ports.rpc);
    const openPorts = await getOpenPortRange(existingPorts);
    if (openPorts.join() !== existingPorts.join()) {
      openPorts.forEach((port, index) => {
        ports[ethereum[index].name] = { rpc: port };
      });
    }
  }

  // Filter out nodes that are already started since their ports are in use by themselves
  const electrum = network.nodes.electrum.filter(
    (n) => n.status !== Status.Started,
  );
  if (electrum.length) {
    let existingPorts = electrum.map((n) => n.ports.tcp);
    let openPorts = await getOpenPortRange(existingPorts);
    if (openPorts.join() !== existingPorts.join()) {
      openPorts.forEach((port, index) => {
        ports[electrum[index].name] = { tcp: port };
      });
    }

    existingPorts = electrum.map((n) => n.ports.ssl);
    openPorts = await getOpenPortRange(existingPorts);
    if (openPorts.join() !== existingPorts.join()) {
      openPorts.forEach((port, index) => {
        ports[electrum[index].name] = {
          ...(ports[electrum[index].name] || {}),
          ssl: port,
        };
      });
    }

    existingPorts = electrum.map((n) => n.ports.ws);
    openPorts = await getOpenPortRange(existingPorts);
    if (openPorts.join() !== existingPorts.join()) {
      openPorts.forEach((port, index) => {
        ports[electrum[index].name] = {
          ...(ports[electrum[index].name] || {}),
          ws: port,
        };
      });
    }

    existingPorts = electrum.map((n) => n.ports.wss);
    openPorts = await getOpenPortRange(existingPorts);
    if (openPorts.join() !== existingPorts.join()) {
      openPorts.forEach((port, index) => {
        ports[electrum[index].name] = {
          ...(ports[electrum[index].name] || {}),
          wss: port,
        };
      });
    }

    existingPorts = electrum.map((n) => n.ports.rpc);
    openPorts = await getOpenPortRange(existingPorts);
    if (openPorts.join() !== existingPorts.join()) {
      openPorts.forEach((port, index) => {
        ports[electrum[index].name] = {
          ...(ports[electrum[index].name] || {}),
          rpc: port,
        };
      });
    }
  }

  // Filter out nodes that are already started since their ports are in use by themselves
  const beacon = network.nodes.beacon.filter(
    (n) => n.status !== Status.Started,
  );
  if (beacon.length) {
    const existingPorts = beacon.map((n) => n.ports.p2p);
    const openPorts = await getOpenPortRange(existingPorts);
    if (openPorts.join() !== existingPorts.join()) {
      openPorts.forEach((port, index) => {
        ports[beacon[index].name] = { p2p: port };
      });
    }
  }

  // Filter out nodes that are already started since their ports are in use by themselves
  const ecdsa = network.nodes.ecdsa.filter((n) => n.status !== Status.Started);
  if (ecdsa.length) {
    const existingPorts = ecdsa.map((n) => n.ports.p2p);
    const openPorts = await getOpenPortRange(existingPorts);
    if (openPorts.join() !== existingPorts.join()) {
      openPorts.forEach((port, index) => {
        ports[ecdsa[index].name] = { p2p: port };
      });
    }
  }

  const tbtcDapp = network.apps.tbtc;
  if (tbtcDapp.status !== Status.Started) {
    const existingPort = tbtcDapp.ports.http;
    const [openPort] = await getOpenPortRange([existingPort]);
    if (openPort !== existingPort) {
      ports[tbtcDapp.name] = { http: openPort };
    }
  }

  const keepDashboard = network.apps.keep;
  if (keepDashboard.status !== Status.Started) {
    const existingPort = keepDashboard.ports.http;
    const [openPort] = await getOpenPortRange([existingPort]);
    if (openPort !== existingPort) {
      ports[keepDashboard.name] = { http: openPort };
    }
  }

  // Return undefined if no ports where updated
  return Object.keys(ports).length > 0 ? ports : undefined;
};
