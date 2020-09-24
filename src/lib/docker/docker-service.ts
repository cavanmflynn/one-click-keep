import { remote } from 'electron';
import { debug, info } from 'electron-log';
import { ensureDir } from 'fs-extra';
import { join } from 'path';
import * as compose from 'docker-compose';
import Dockerode from 'dockerode';
import yaml from 'js-yaml';
import os from 'os';
import {
  BitcoinNode,
  CommonNode,
  DockerVersions,
  Network,
  NetworksFile,
  EthereumNode,
} from '@/types';
import stripAnsi from 'strip-ansi';
import { APP_VERSION } from '../constants';
import { exists, read, write, isLinux, networksPath, nodePath } from '../utils';
import { ComposeFile } from './compose-file';

class DockerService {
  /**
   * Gets the versions of docker and docker-compose installed
   * @param throwOnError set to true to throw an Error if detection fails
   */
  async getVersions(throwOnError?: boolean): Promise<DockerVersions> {
    const versions = { docker: '', compose: '' };

    try {
      debug('fetching docker version');
      const dockerVersion = await new Dockerode().version();
      debug(`Result: ${JSON.stringify(dockerVersion)}`);
      versions.docker = dockerVersion.Version;
    } catch (error) {
      debug(`Failed: ${error.message}`);
      if (throwOnError) throw error;
    }

    try {
      debug('getting docker-compose version');
      const composeVersion = await this.execute(
        compose.version,
        this.getArgs(),
      );
      debug(`Result: ${JSON.stringify(composeVersion)}`);
      versions.compose = composeVersion.out.trim();
    } catch (error) {
      debug(`Failed: ${error.message}`);
      if (throwOnError) throw error;
    }

    return versions;
  }

  /**
   * Gets a list of the polar images that have already been pulled
   */
  async getImages(): Promise<string[]> {
    try {
      debug('fetching docker images');
      const allImages = await new Dockerode().listImages();
      debug(`All Images: ${JSON.stringify(allImages)}`);
      const imageNames = ([] as string[])
        .concat(...allImages.map((i) => i.RepoTags || []))
        .filter((n) => n !== '<none>:<none>'); // ignore untagged images
      const uniqueNames = imageNames.filter(
        (image, index) => imageNames.indexOf(image) === index,
      );
      debug(`Image Names: ${JSON.stringify(uniqueNames)}`);
      return uniqueNames;
    } catch (error) {
      debug(`Failed: ${error.message}`);
      return [];
    }
  }

  /**
   * Save a docker-compose.yml file for the given network
   * @param network the network to save a compose file for
   */
  async saveComposeFile(network: Network) {
    const file = new ComposeFile();
    const { bitcoin, ethereum } = network.nodes;

    bitcoin.forEach((node) => file.addBitcoind(node));
    ethereum.forEach((node) => file.addGanache(node));
    // lightning.forEach(node => {
    //   if (node.implementation === 'LND') {
    //     const lnd = node as LndNode;
    //     const backend = bitcoin.find(n => n.name === lnd.backendName) || bitcoin[0];
    //     file.addLnd(lnd, backend);
    //   }
    //   if (node.implementation === 'c-lightning') {
    //     const cln = node as CLightningNode;
    //     const backend = bitcoin.find(n => n.name === cln.backendName) || bitcoin[0];
    //     file.addClightning(cln, backend);
    //   }
    //   if (node.implementation === 'eclair') {
    //     const eclair = node as EclairNode;
    //     const backend = bitcoin.find(n => n.name === eclair.backendName) || bitcoin[0];
    //     file.addEclair(eclair, backend);
    //   }
    // });

    const yml = yaml.dump(file.content);
    const path = join(network.path, 'docker-compose.yml');
    await write(path, yml);
    info(`Saved compose file for '${network.name}' at '${path}'`);
  }

  /**
   * Start a network using docker-compose
   * @param network the network to start
   */
  async start(network: Network) {
    const { bitcoin, ethereum } = network.nodes;
    await this.ensureDirs(network, [...bitcoin, ...ethereum]);

    info(`Starting docker containers for ${network.name}`);
    info(` - path: ${network.path}`);
    const result = await this.execute(compose.upAll, this.getArgs(network));
    info(`Network started:\n ${result.out || result.err}`);
  }

  /**
   * Stop a network using docker-compose
   * @param network the network to stop
   */
  async stop(network: Network) {
    info(`Stopping docker containers for ${network.name}`);
    info(` - path: ${network.path}`);
    const result = await this.execute(compose.down, this.getArgs(network));
    info(`Network stopped:\n ${result.out || result.err}`);
  }

  /**
   * Starts a single service using docker-compose
   * @param network The network containing the node
   * @param node The node to start
   */
  async startNode(network: Network, node: CommonNode) {
    await this.ensureDirs(network, [node]);
    // Make sure the docker container is stopped. If it is already started in an error state
    // then starting it would have no effect
    await this.stopNode(network, node);

    info(`Starting docker container for ${node.name}`);
    info(` - path: ${network.path}`);
    const result = await this.execute(
      compose.upOne,
      node.name,
      this.getArgs(network),
    );
    info(`Container started:\n ${result.out || result.err}`);
  }

  /**
   * Stops a single service using docker-compose
   * @param network The network containing the node
   * @param node The node to stop
   */
  async stopNode(network: Network, node: CommonNode) {
    info(`Stopping docker container for ${node.name}`);
    info(` - path: ${network.path}`);
    const result = await this.execute(
      compose.stopOne,
      node.name,
      this.getArgs(network),
    );
    info(`Container stopped:\n ${result.out || result.err}`);
  }

  /**
   * Removes a single service from the network using docker-compose
   * @param network the network containing the node
   * @param node the node to remove
   */
  async removeNode(network: Network, node: CommonNode) {
    info(`Stopping docker container for ${node.name}`);
    info(` - path: ${network.path}`);
    let result = await this.execute(
      compose.stopOne,
      node.name,
      this.getArgs(network),
    );
    info(`Container stopped:\n ${result.out || result.err}`);

    info(`Removing stopped docker containers`);
    // The `any` cast is used because `rm` is the only method on compose that takes the
    // IDockerComposeOptions as the first param and a spread for the remaining
    result = await this.execute(compose.rm as any, this.getArgs(network));
    info(`Removed:\n ${result.out || result.err}`);
  }

  /**
   * Saves the given networks to disk
   * @param networks the list of networks to save
   */
  async saveNetworks(data: NetworksFile) {
    const json = JSON.stringify(data, null, 2);
    const path = join(networksPath, 'networks.json');
    await write(path, json);
    info(`saved networks to '${path}'`);
  }

  /**
   * Loads a list of networks from the file system
   */
  async loadNetworks(): Promise<NetworksFile> {
    const path = join(networksPath, 'networks.json');
    if (await exists(path)) {
      const json = await read(path);
      const data = JSON.parse(json);
      info(`loaded ${data.networks.length} networks from '${path}'`);
      return data;
    } else {
      info(`skipped loading networks because the file '${path}' doesn't exist`);
      return { version: APP_VERSION, networks: [] };
    }
  }

  /**
   * Helper method to trap and format exceptions thrown and
   * @param cmd the compose function to call
   * @param args the arguments to the compose function
   */
  private async execute<A, B>(
    cmd: (arg1: A, arg2?: B) => Promise<compose.IDockerComposeResult>,
    arg1: A,
    arg2?: B,
  ): Promise<compose.IDockerComposeResult> {
    try {
      const result = await cmd(arg1, arg2);
      result.out = stripAnsi(result.out);
      result.err = stripAnsi(result.err);
      return result;
    } catch (e) {
      e.err = stripAnsi(e.err);
      info(`docker cmd failed: ${JSON.stringify(e)}`);
      throw new Error(e.err || JSON.stringify(e));
    }
  }

  private getArgs(network?: Network) {
    const args = {
      cwd: network ? network.path : remote.app.getAppPath(),
      env: {
        ...process.env,
        ...(remote?.process?.env || {}),
      },
    };

    if (isLinux()) {
      const { uid, gid } = os.userInfo();
      debug(`env: uid=${uid} gid=${gid}`);
      args.env = {
        ...args.env,
        // add user/group id's to env so that file permissions on the
        // docker volumes are set correctly. containers cannot write
        // to disk on linux if permissions aren't set correctly
        USERID: `${uid}`,
        GROUPID: `${gid}`,
      };
    }

    return args;
  }

  private async ensureDirs(network: Network, nodes: CommonNode[]) {
    // Create the directory so the owner is the current host user
    // if this isn't done, then docker will create the folders
    // owned by root and linux containers won't start up due to
    // permission errors
    for (const commonNode of nodes) {
      // need to cast so typescript doesn't complain about 'implementation'
      const node = commonNode as BitcoinNode | EthereumNode;
      const nodeDir = nodePath(network, node.implementation, node.name);
      await ensureDir(nodeDir);
    }
  }
}

export const docker = new DockerService();
