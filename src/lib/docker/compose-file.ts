import {
  BitcoinNode,
  EthereumNode,
  BeaconNode,
  EcdsaNode,
  ElectrumNode,
  TbtcApp,
  KeepApp,
} from '@/types';
import {
  BITCOIN_CREDENTIALS,
  NODE_DOCKER_CONFIGS,
  KEEP_BEACON_CREDENTIALS,
  KEEP_ECDSA_CREDENTIALS,
  APP_DOCKER_CONFIGS,
} from '../constants';
import { getContainerName } from './docker-utils';
import {
  bitcoind,
  ganache,
  keepBeacon,
  keepEcdsa,
  electrumx,
  tbtcDapp,
  keepDashboard,
} from './node-templates';

export interface ComposeService {
  image: string;
  container_name: string;
  environment: Record<string, string | number>;
  hostname: string;
  command: string;
  volumes: string[];
  expose: string[];
  ports: string[];
  restart?: 'always';
}

export interface ComposeContent {
  version: string;
  services: {
    [key: string]: ComposeService;
  };
}

export class ComposeFile {
  content: ComposeContent;

  constructor() {
    this.content = {
      version: '3.3',
      services: {},
    };
  }

  addBitcoind(node: BitcoinNode) {
    const { name, version, ports } = node;
    const { rpc, zmqBlock, zmqTx } = ports;
    const container = getContainerName(node);
    // Define the variable substitutions
    const variables = {
      rpcUser: BITCOIN_CREDENTIALS.user,
      rpcPass: BITCOIN_CREDENTIALS.pass,
    };
    // Use the node's custom image or the default for the implementation
    const image =
      node.docker.image ||
      `${NODE_DOCKER_CONFIGS.bitcoind.imageName}:${version}`;
    // Use the node's custom command or the default for the implementation
    const nodeCommand =
      node.docker.command || NODE_DOCKER_CONFIGS.bitcoind.command;
    // Replace the variables in the command
    const command = this.mergeCommand(nodeCommand, variables);
    // Add the docker service
    this.content.services[name] = bitcoind(
      name,
      container,
      image,
      rpc,
      zmqBlock,
      zmqTx,
      command,
    );
  }

  addGanache(node: EthereumNode) {
    const { name, version, ports } = node;
    const { rpc } = ports;
    const container = getContainerName(node);
    // Use the node's custom image or the default for the implementation
    const image =
      node.docker.image ||
      `${NODE_DOCKER_CONFIGS.ganache.imageName}:${version}`;
    // Add the docker service
    this.content.services[name] = ganache(name, container, image, rpc);
  }

  addElectrumX(node: ElectrumNode, backend: BitcoinNode) {
    const { name, version, ports } = node;
    const { tcp, ssl, ws, wss, rpc } = ports;
    const container = getContainerName(node);
    // Use the node's custom image or the default for the implementation
    const image =
      node.docker.image ||
      `${NODE_DOCKER_CONFIGS.electrumx.imageName}:${version}`;
    // Add the docker service
    this.content.services[name] = electrumx(
      name,
      container,
      image,
      tcp,
      ssl,
      ws,
      wss,
      rpc,
      backend,
    );
  }

  addKeepBeacon(node: BeaconNode) {
    const { name, version, ports } = node;
    const { p2p } = ports;
    const container = getContainerName(node);
    // Define the variable substitutions
    const variables = {
      ethereumPassword: KEEP_BEACON_CREDENTIALS.ethereumPassword,
    };
    // Use the node's custom image or the default for the implementation
    const image =
      node.docker.image ||
      `${NODE_DOCKER_CONFIGS['keep-beacon'].imageName}:${version}`;
    // Use the node's custom command or the default for the implementation
    const nodeCommand =
      node.docker.command || NODE_DOCKER_CONFIGS['keep-beacon'].command;
    // Replace the variables in the command
    const command = this.mergeCommand(nodeCommand, variables);
    // Add the docker service
    this.content.services[name] = keepBeacon(
      name,
      container,
      image,
      p2p,
      command,
    );
  }

  addKeepEcdsa(node: EcdsaNode) {
    const { name, version, ports } = node;
    const { p2p } = ports;
    const container = getContainerName(node);
    // Define the variable substitutions
    const variables = {
      ethereumPassword: KEEP_ECDSA_CREDENTIALS.ethereumPassword,
    };
    // Use the node's custom image or the default for the implementation
    const image =
      node.docker.image ||
      `${NODE_DOCKER_CONFIGS['keep-ecdsa'].imageName}:${version}`;
    // Use the node's custom command or the default for the implementation
    const nodeCommand =
      node.docker.command || NODE_DOCKER_CONFIGS['keep-ecdsa'].command;
    // Replace the variables in the command
    const command = this.mergeCommand(nodeCommand, variables);
    // Add the docker service
    this.content.services[name] = keepEcdsa(
      name,
      container,
      image,
      p2p,
      command,
    );
  }

  addTbtcDapp(app: TbtcApp) {
    const { name, version, ports } = app;
    const { http } = ports;
    const container = getContainerName(app);
    // Use the node's custom image or the default for the implementation
    const image =
      app.docker.image ||
      `${APP_DOCKER_CONFIGS['tbtc-dapp'].imageName}:${version}`;
    // Add the docker service
    this.content.services[name] = tbtcDapp(name, container, image, http);
  }

  addKeepDashboard(app: KeepApp) {
    const { name, version, ports } = app;
    const { http } = ports;
    const container = getContainerName(app);
    // Use the node's custom image or the default for the implementation
    const image =
      app.docker.image ||
      `${APP_DOCKER_CONFIGS['keep-dashboard'].imageName}:${version}`;
    // Add the docker service
    this.content.services[name] = keepDashboard(name, container, image, http);
  }

  private mergeCommand(command: string, variables: Record<string, string>) {
    let merged = command;
    Object.keys(variables).forEach((key) => {
      // intentionally not using .replace() because if a string is passed in, then only the first occurrence
      // is replaced. A RegExp could be used but the code would be more confusing because of escape chars
      merged = merged.split(`{{${key}}}`).join(variables[key]);
    });
    return merged;
  }
}
