import {
  CreateNetworkConfig,
  Network,
  Status,
  NodeImplementation,
  BitcoinNode,
  CommonNode,
  ManagedImage,
  OpenPorts,
} from '@/types';
import { networksPath } from './config';
import { join } from 'path';
import { BASE_PORTS, DOCKER_REPO } from '../constants';
import { debug } from 'electron-log';
import detectPort from 'detect-port';
import { languageLibrary } from '@/localization';
import { system } from '@/store';

export const createNetwork = (config: CreateNetworkConfig) => {
  const {
    id,
    name,
    // ecdsaNodeCount, TODO
    // randomBeaconNodeCount,
    dockerRepoState,
  } = config;

  const status = Status.Stopped;
  const network: Network = {
    id: id,
    name,
    status: Status.Stopped,
    path: join(networksPath, id.toString()),
    nodes: {
      bitcoin: [],
    },
  };
  const { bitcoin } = network.nodes;
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
  const cmd = getImageCommand(images, 'bitcoind', bitcoindVersion);
  bitcoin.push(
    createBitcoindNetworkNode(
      network,
      bitcoindVersion,
      dockerWrap(cmd),
      status,
    ),
  );

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

  const name = `backend${id + 1}`;
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

  // TODO: Probably unnecessary
  // peer up with the previous node on both sides
  if (bitcoin.length > 0) {
    const prev = bitcoin[bitcoin.length - 1];
    node.peers.push(prev.name);
    prev.peers.push(node.name);
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
  const { bitcoin } = network.nodes;
  const requiredImages = [...bitcoin /*...lightning*/].map((n) => {
    // use the custom image name if specified
    if (n.docker.image) return n.docker.image;
    // convert implementation to image name: LND -> lnd, c-lightning -> clightning
    const impl = n.implementation.toLocaleLowerCase().replace(/-/g, '');
    return `${DOCKER_REPO}/${impl}:${n.version}`;
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

  // let { lnd, clightning, eclair } = groupNodes(network);

  // // filter out nodes that are already started since their ports are in use by themselves
  // lnd = lnd.filter(n => n.status !== Status.Started);
  // if (lnd.length) {
  //   let existingPorts = lnd.map(n => n.ports.grpc);
  //   let openPorts = await getOpenPortRange(existingPorts);
  //   if (openPorts.join() !== existingPorts.join()) {
  //     openPorts.forEach((port, index) => {
  //       ports[lnd[index].name] = { grpc: port };
  //     });
  //   }

  //   existingPorts = lnd.map(n => n.ports.rest);
  //   openPorts = await getOpenPortRange(existingPorts);
  //   if (openPorts.join() !== existingPorts.join()) {
  //     openPorts.forEach((port, index) => {
  //       ports[lnd[index].name] = {
  //         ...(ports[lnd[index].name] || {}),
  //         rest: port,
  //       };
  //     });
  //   }

  //   existingPorts = lnd.map(n => n.ports.p2p);
  //   openPorts = await getOpenPortRange(existingPorts);
  //   if (openPorts.join() !== existingPorts.join()) {
  //     openPorts.forEach((port, index) => {
  //       ports[lnd[index].name] = {
  //         ...(ports[lnd[index].name] || {}),
  //         p2p: port,
  //       };
  //     });
  //   }
  // }

  // clightning = clightning.filter(n => n.status !== Status.Started);
  // if (clightning.length) {
  //   let existingPorts = clightning.map(n => n.ports.rest);
  //   let openPorts = await getOpenPortRange(existingPorts);
  //   if (openPorts.join() !== existingPorts.join()) {
  //     openPorts.forEach((port, index) => {
  //       ports[clightning[index].name] = { rest: port };
  //     });
  //   }

  //   existingPorts = clightning.map(n => n.ports.p2p);
  //   openPorts = await getOpenPortRange(existingPorts);
  //   if (openPorts.join() !== existingPorts.join()) {
  //     openPorts.forEach((port, index) => {
  //       ports[clightning[index].name] = {
  //         ...(ports[clightning[index].name] || {}),
  //         p2p: port,
  //       };
  //     });
  //   }
  // }

  // eclair = eclair.filter(n => n.status !== Status.Started);
  // if (eclair.length) {
  //   let existingPorts = eclair.map(n => n.ports.rest);
  //   let openPorts = await getOpenPortRange(existingPorts);
  //   if (openPorts.join() !== existingPorts.join()) {
  //     openPorts.forEach((port, index) => {
  //       ports[eclair[index].name] = { rest: port };
  //     });
  //   }

  //   existingPorts = eclair.map(n => n.ports.p2p);
  //   openPorts = await getOpenPortRange(existingPorts);
  //   if (openPorts.join() !== existingPorts.join()) {
  //     openPorts.forEach((port, index) => {
  //       ports[eclair[index].name] = {
  //         ...(ports[eclair[index].name] || {}),
  //         p2p: port,
  //       };
  //     });
  //   }
  // }

  // return undefined if no ports where updated
  return Object.keys(ports).length > 0 ? ports : undefined;
};
