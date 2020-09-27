import {
  DOCKER_CONFIGS,
  KEEP_BEACON_CREDENTIALS,
  KEEP_ECDSA_CREDENTIALS,
  BITCOIN_CREDENTIALS,
} from '../constants';
import { ComposeService } from './compose-file';
import { BitcoinNode } from '@/types';
import { getContainerName } from './docker-utils';

// Simple function to remove all line-breaks and extra white-space inside of a string
const trimInside = (text: string): string => text.replace(/\s+/g, ' ').trim();

export const bitcoind = (
  name: string,
  container: string,
  image: string,
  rpcPort: number,
  zmqBlockPort: number,
  zmqTxPort: number,
  command: string,
): ComposeService => ({
  image,
  container_name: container,
  environment: {
    USERID: '${USERID:-1000}',
    GROUPID: '${GROUPID:-1000}',
  },
  hostname: name,
  command: trimInside(command),
  volumes: [
    `./volumes/${DOCKER_CONFIGS.bitcoind.volumeDirName}/${name}:/home/bitcoin/.bitcoin`,
  ],
  expose: [
    '18443', // RPC
    '18444', // p2p
    '28334', // ZMQ blocks
    '28335', // ZMQ txns
  ],
  ports: [
    `${rpcPort}:18443`, // RPC
    `${zmqBlockPort}:28334`, // ZMQ blocks
    `${zmqTxPort}:28335`, // ZMQ txns
  ],
});

export const ganache = (
  name: string,
  container: string,
  image: string,
  rpcPort: number,
): ComposeService => ({
  image,
  container_name: container,
  environment: {},
  hostname: name,
  command: '',
  volumes: [
    `./volumes/${DOCKER_CONFIGS.ganache.volumeDirName}/${name}:/home/ethereum/.ethereum`,
  ],
  expose: [
    '8545', // RPC
  ],
  ports: [
    `${rpcPort}:8545`, // RPC
  ],
});

// prettier-ignore
export const electrumx = (
  name: string,
  container: string,
  image: string,
  tcpPort: number,
  sslPort: number,
  wsPort: number,
  wssPort: number,
  rpcPort: number,
  backend: BitcoinNode,
): ComposeService => ({
  image,
  container_name: container,
  environment: {
    DAEMON_URL: `http://${BITCOIN_CREDENTIALS.user}:${BITCOIN_CREDENTIALS.pass}@${getContainerName(backend)}:18443`,
    COIN: 'BitcoinSegwit',
    NET: 'regtest',
    SERVICES: 'tcp://0.0.0.0:50001,ssl://0.0.0.0:50002,ws://0.0.0.0:50003,wss://127.0.0.1:50004,rpc://0.0.0.0:8000',
    COST_SOFT_LIMIT: 0,
    COST_HARD_LIMIT: 0,
  },
  hostname: name,
  command: '',
  volumes: [
    `./volumes/${DOCKER_CONFIGS.electrumx.volumeDirName}/${name}:/home/electrumx/.electrumx`,
  ],
  expose: [
    '50001', // TCP
    '50002', // SSL
    '50003', // WS
    '50004', // WSS
    '8000', // RPC
  ],
  ports: [
    `${tcpPort}:50001`, // TCP
    `${sslPort}:50002`, // SSL
    `${wsPort}:50003`, // WS
    `${wssPort}:50004`, // WSS
    `${rpcPort}:8000`, // RPC
  ],
});

export const keepBeacon = (
  name: string,
  container: string,
  image: string,
  p2pPort: number,
  command: string,
): ComposeService => ({
  image,
  container_name: container,
  environment: {
    KEEP_ETHEREUM_PASSWORD: KEEP_BEACON_CREDENTIALS.ethereumPassword,
  },
  hostname: name,
  command: trimInside(command),
  restart: 'always',
  volumes: [
    `./volumes/${DOCKER_CONFIGS['keep-beacon'].volumeDirName}/${name}:/home/keep-beacon/.keep-beacon`,
    `./volumes/${DOCKER_CONFIGS['keep-beacon'].volumeDirName}/${name}/keystore:/keystore`,
    `./volumes/${DOCKER_CONFIGS['keep-beacon'].volumeDirName}/${name}/storage:/storage`,
    `./volumes/${DOCKER_CONFIGS['keep-beacon'].volumeDirName}/${name}/config:/config`,
  ],
  expose: [
    '3919', // P2P
  ],
  ports: [
    `${p2pPort}:3919`, // P2P
  ],
});

export const keepEcdsa = (
  name: string,
  container: string,
  image: string,
  p2pPort: number,
  command: string,
): ComposeService => ({
  image,
  container_name: container,
  environment: {
    KEEP_ETHEREUM_PASSWORD: KEEP_ECDSA_CREDENTIALS.ethereumPassword,
  },
  hostname: name,
  command: trimInside(command),
  restart: 'always',
  volumes: [
    `./volumes/${DOCKER_CONFIGS['keep-ecdsa'].volumeDirName}/${name}:/home/keep-ecdsa/.keep-ecdsa`,
    `./volumes/${DOCKER_CONFIGS['keep-ecdsa'].volumeDirName}/${name}/keystore:/keystore`,
    `./volumes/${DOCKER_CONFIGS['keep-ecdsa'].volumeDirName}/${name}/storage:/storage`,
    `./volumes/${DOCKER_CONFIGS['keep-ecdsa'].volumeDirName}/${name}/config:/config`,
  ],
  expose: [
    '3919', // P2P
  ],
  ports: [
    `${p2pPort}:3919`, // P2P
  ],
});
