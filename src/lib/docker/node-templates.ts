import { DOCKER_CONFIGS } from '../constants';
import { ComposeService } from './compose-file';

// simple function to remove all line-breaks and extra white-space inside of a string
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
