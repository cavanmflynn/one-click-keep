import { LANGUAGE_TO_LOCALE, languageLibrary } from '@/localization';
import { ChainInfo, WalletInfo } from 'bitcoin-core';

//#region Localization

export type ValidLanguage = keyof typeof LANGUAGE_TO_LOCALE;

export type TranslationKey = keyof typeof languageLibrary['en']['keys'];

//#endregion

//#region App

export interface NotificationConfig {
  message: string;
  description?: string;
  error?: Error;
}

export interface BadgeStatus {
  [key: number]: 'success' | 'processing' | 'default' | 'error' | 'warning';
}

//#endregion

//#region Node

export enum Status {
  Starting,
  Started,
  Stopping,
  Stopped,
  Error,
}

export type NodeType = 'bitcoin' | 'ethereum' | 'electrum' | 'beacon' | 'ecdsa';

export interface CommonNode {
  id: number;
  networkId: number;
  name: string;
  type: NodeType;
  version: string;
  status: Status;
  errorMsg?: string;
  docker: {
    image: string;
    command: string;
  };
}

export interface BitcoinNode extends CommonNode {
  type: 'bitcoin';
  implementation: 'bitcoind' | 'btcd';
  peers: string[];
  ports: {
    rpc: number;
    p2p: number;
    zmqBlock: number;
    zmqTx: number;
  };
}

export interface EthereumNode extends CommonNode {
  type: 'ethereum';
  implementation: 'ganache';
  peers: string[];
  ports: {
    rpc: number;
  };
}

export interface ElectrumNode extends CommonNode {
  type: 'electrum';
  implementation: 'electrumx';
  peers: string[];
  ports: {
    tcp: number;
    ssl: number;
    ws: number;
    wss: number;
    rpc: number;
  };
}

export interface BeaconNode extends CommonNode {
  type: 'beacon';
  implementation: 'keep-beacon';
  peers: string[];
  ports: {
    p2p: number;
  };
}

export interface EcdsaNode extends CommonNode {
  type: 'ecdsa';
  implementation: 'keep-ecdsa';
  peers: string[];
  ports: {
    p2p: number;
  };
}

export type NodeImplementation =
  | BitcoinNode['implementation']
  | EthereumNode['implementation']
  | ElectrumNode['implementation']
  | BeaconNode['implementation']
  | EcdsaNode['implementation'];

export interface CommonApp {
  id: number;
  networkId: number;
  name: string;
  version: string;
  status: Status;
  errorMsg?: string;
  docker: {
    image: string;
    command: string;
  };
}

export interface TbtcApp extends CommonApp {
  app: 'tbtc-dapp';
  ports: {
    http: number;
  };
}

export interface KeepApp extends CommonApp {
  app: 'keep-dashboard';
  ports: {
    http: number;
  };
}

export type AppName = TbtcApp['app'] | KeepApp['app'];

export interface EthereumNodeInfo {
  blockHeight?: number;
}

export interface BitcoindNodeInfo {
  chainInfo?: ChainInfo;
  walletInfo?: WalletInfo;
}

export interface AddNetworkArgs {
  name: string;
  beaconNodes: number;
  ecdsaNodes: number;
}

export interface CreateNetworkConfig extends AddNetworkArgs {
  id: number;
  dockerRepoState: DockerRepoState;
}

export interface Network {
  id: number;
  name: string;
  status: Status;
  path: string;
  nodes: {
    bitcoin: BitcoinNode[];
    ethereum: EthereumNode[];
    electrum: ElectrumNode[];
    beacon: BeaconNode[];
    ecdsa: EcdsaNode[];
  };
  apps: {
    tbtc: TbtcApp;
    keep: KeepApp;
  };
}

export interface NetworksFile {
  version: string;
  networks: Network[];
}

export interface ManagedNodeImage {
  implementation: NodeImplementation;
  version: string;
  command: string;
}

export interface ManagedAppImage {
  name: AppName;
  version: string;
  command: string;
}

/**
 * Managed images are hard-coded with docker images pushed to the
 * Docker Hub repo
 */
export type ManagedImage = ManagedNodeImage | ManagedAppImage;

//#endregion

//#region Docker

export type SupportedPlatform = 'mac' | 'linux' | 'windows';

export type Platform = SupportedPlatform | 'unknown';

export interface DockerConfig {
  name: string;
  imageName: string;
  platforms: SupportedPlatform[];
  volumeDirName: string;
  command: string;
  variables: string[];
  dataDir?: string;
  apiDir?: string;
}

export interface DockerVersions {
  docker: string;
  compose: string;
}

export interface DockerRepoImage {
  latest: string;
  versions: string[];
  /** A mapping of the image version to the highest compatible bitcoind version */
  compatibility?: Record<string, string>;
}

export interface DockerRepoState {
  /** The version of the repo state file. Used to quickly identify updates */
  version: number;
  nodeImages: Record<NodeImplementation, DockerRepoImage>;
  appImages: Record<AppName, DockerRepoImage>;
}

export interface OpenPorts {
  [key: string]: {
    rpc?: number;
    grpc?: number;
    rest?: number;
    zmqBlock?: number;
    zmqTx?: number;
    p2p?: number;
    tcp?: number;
    ssl?: number;
    ws?: number;
    wss?: number;
    http?: number;
  };
}

//#endregion
