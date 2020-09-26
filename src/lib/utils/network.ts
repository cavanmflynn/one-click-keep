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
} from '@/types';
import { networksPath } from './config';
import { join } from 'path';
import { BASE_PORTS, DOCKER_REPO } from '../constants';
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
      beacon: [],
      ecdsa: [],
    },
  };
  const { bitcoin, ethereum, beacon, ecdsa } = network.nodes;
  const dockerWrap = (command: string) => ({ image: '', command });
  const images: ManagedImage[] = [];
  Object.entries(dockerRepoState.images).forEach(([type, entry]) => {
    entry.versions.forEach((version) => {
      images.push({
        implementation: type as NodeImplementation,
        version,
        command: '',
      });
    });
  });

  // Add bitcoin node
  const bitcoindVersion = dockerRepoState.images.bitcoind.latest;
  const bitcoindCmd = getImageCommand(images, 'bitcoind', bitcoindVersion);
  bitcoin.push(
    createBitcoindNetworkNode(
      network,
      bitcoindVersion,
      dockerWrap(bitcoindCmd),
      status,
    ),
  );

  // Add ethereum node
  const ganacheVersion = dockerRepoState.images.ganache.latest;
  const ganacheCmd = getImageCommand(images, 'ganache', ganacheVersion);
  ethereum.push(
    createGanacheNetworkNode(
      network,
      ganacheVersion,
      dockerWrap(ganacheCmd),
      status,
    ),
  );

  // Add beacon nodes
  for (let i = 0; i < beaconNodes; i++) {
    const beaconVersion = dockerRepoState.images['keep-beacon'].latest;
    const beaconCmd = getImageCommand(images, 'keep-beacon', beaconVersion);
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
    const ecdsaVersion = dockerRepoState.images['keep-ecdsa'].latest;
    const ecdsaCmd = getImageCommand(images, 'keep-ecdsa', ecdsaVersion);
    ecdsa.push(
      createEcdsaNetworkNode(
        network,
        ecdsaVersion,
        dockerWrap(ecdsaCmd),
        status,
      ),
    );
  }

  return network;
};

export const getImageCommand = (
  images: ManagedImage[],
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
      rpc: BASE_PORTS.bitcoind.rest + id,
      p2p: BASE_PORTS.bitcoind.p2p + id,
      zmqBlock: BASE_PORTS.bitcoind.zmqBlock + id,
      zmqTx: BASE_PORTS.bitcoind.zmqTx + id,
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
      rpc: BASE_PORTS.ganache.rpc + id,
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
      p2p: BASE_PORTS['keep-beacon'].p2p + id,
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
      p2p: BASE_PORTS['keep-ecdsa'].p2p + id,
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
  const { bitcoin, ethereum, beacon, ecdsa } = network.nodes;
  const requiredImages = [...bitcoin, ...ethereum, ...beacon, ...ecdsa].map(
    (n) => {
      // Use the custom image name if specified
      if (n.docker.image) return n.docker.image;
      // Convert implementation to image name
      const impl = n.implementation.toLocaleLowerCase().replace(/-/g, '');
      return `${DOCKER_REPO}/${impl}:${n.version}`;
    },
  );
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

  // Return undefined if no ports where updated
  return Object.keys(ports).length > 0 ? ports : undefined;
};
