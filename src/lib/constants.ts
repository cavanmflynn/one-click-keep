import { DockerConfig, NodeImplementation, DockerRepoState } from '@/types';
import packageJson from '../../package.json';
import bitcoindLogo from '@/images/ui-icons/bitcoind-logo.svg';
import ganacheLogo from '@/images/ui-icons/ganache-logo.svg';

// App
export const APP_VERSION = packageJson.version;

// Bitcoin
export const BITCOIN_CREDENTIALS = {
  user: 'keepuser',
  pass: 'keeppass',
  rpcauth:
    '5e5e98c21f5c814568f8b55d83b23c1c$$066b03f92df30b11de8e4b1b1cd5b1b4281aa25205bd57df9be82caf97a05526',
};

// bitcoind
export const INITIAL_BLOCK_REWARD = 50;
export const BLOCKS_TIL_CONFIRMED = 6;
export const COINBASE_MATURITY_DELAY = 100;
export const HALVING_INTERVAL = 150; // https://github.com/bitcoin/bitcoin/blob/v0.19.0.1/src/chainparams.cpp#L258

// Docker
export const DOCKER_REPO = 'oneclickkeep';
export const DOCKER_CONFIGS: Record<NodeImplementation, DockerConfig> = {
  bitcoind: {
    name: 'Bitcoin Core',
    imageName: 'oneclickkeep/bitcoind',
    logo: bitcoindLogo,
    platforms: ['mac', 'linux', 'windows'],
    volumeDirName: 'bitcoind',
    command: [
      'bitcoind',
      '-server=1',
      '-regtest=1',
      '-rpcauth={{rpcUser}}:{{rpcAuth}}',
      '-debug=1',
      '-zmqpubrawblock=tcp://0.0.0.0:28334',
      '-zmqpubrawtx=tcp://0.0.0.0:28335',
      '-txindex=1',
      '-dnsseed=0',
      '-upnp=0',
      '-rpcbind=0.0.0.0',
      '-rpcallowip=0.0.0.0/0',
      '-rpcport=18443',
      '-listen=1',
      '-listenonion=0',
      '-fallbackfee=0.0002',
    ].join('\n  '),
    // If vars are modified, also update compose-file.ts & the i18n strings for cmps.nodes.CommandVariables
    variables: ['rpcUser', 'rpcAuth'],
  },
  btcd: {
    name: 'btcd',
    imageName: '',
    logo: '',
    platforms: ['mac', 'linux', 'windows'],
    volumeDirName: 'btcd',
    command: '',
    variables: [],
  },
  ganache: {
    name: 'ganache',
    imageName: 'oneclickkeep/ganache',
    logo: ganacheLogo,
    platforms: ['mac', 'linux', 'windows'],
    volumeDirName: 'ganache',
    command: '',
    variables: [],
  },
};

/**
 * This defines the hard-coded list of docker images available in the Polar app. When new images
 * are pushed to Docker Hub, this list should be updated along with the /docker/nodes.json file.
 */
export const DEFAULT_REPO_STATE: DockerRepoState = {
  version: 1,
  images: {
    bitcoind: {
      latest: '0.20.1',
      versions: ['0.20.1'],
    },
    btcd: {
      latest: '',
      versions: [],
    },
    ganache: {
      latest: '6.10.2',
      versions: ['6.10.2'],
    },
  },
};

/**
 * The starting port numbers for the different node types. These should
 * be sufficiently spaced apart to allow a dozen or so numbers higher and
 * not cause conflicts
 */
export const BASE_PORTS: Record<NodeImplementation, Record<string, number>> = {
  bitcoind: {
    rest: 18443,
    p2p: 19444,
    zmqBlock: 28334,
    zmqTx: 29335,
  },
  btcd: {},
  ganache: {
    rpc: 8545,
  },
};
