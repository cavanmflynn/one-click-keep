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

// KEEP Beacon
export const KEEP_BEACON_CREDENTIALS = {
  ethereumPassword: 'keeppass',
};

// KEEP ECDSA
export const KEEP_ECDSA_CREDENTIALS = {
  ethereumPassword: 'keeppass',
};

// Ethereum
export const ETHEREUM_ACCOUNTS = [
  '0x5409ed021d9299bf6814279a6a1411a7e866a631',
  '0x6ecbe1db9ef729cbe972c83fb886247691fb6beb',
  '0xe36ea790bc9d7ab70c55260c66d52b1eca985f84',
  '0xe834ec434daba538cd1b9fe1582052b880bd7e63',
  '0x78dc5d2d739606d31509c31d654056a45185ecb6',
  '0xa8dda8d7f5310e4a9e24f8eba77e091ac264f872',
  '0x06cef8e666768cc40cc78cf93d9611019ddcb628',
  '0x4404ac8bd8f9618d27ad2f1485aa1b2cfd82482d',
  '0x7457d5e02197480db681d3fdf256c7aca21bdc12',
  '0x91c987bf62d25945db517bdaa840a6c661374402',
];
export const ETHEREUM_PRIVATE_KEYS = [
  '0xf2f48ee19680706196e2e339e5da3491186e0c4c5030670656b0e0164837257d',
  '0x5d862464fe9303452126c8bc94274b8c5f9874cbd219789b3eb2128075a76f72',
  '0xdf02719c4df8b9b8ac7f551fcb5d9ef48fa27eef7a66453879f4d8fdc6e78fb1',
  '0xff12e391b79415e941a94de3bf3a9aee577aed0731e297d5cfa0b8a1e02fa1d0',
  '0x752dd9cf65e68cfaba7d60225cbdbc1f4729dd5e5507def72815ed0d8abc6249',
  '0xefb595a0178eb79a8df953f87c5148402a224cdf725e88c0146727c6aceadccd',
  '0x83c6d2cc5ddcf9711a6d59b417dc20eb48afd58d45290099e5987e3d768f328f',
  '0xbb2d3f7c9583780a7d3904a2f55d792707c345f21de1bacb2d389934d82796b2',
  '0xb2fd4d29c1390b71b8795ae81196bfd60293adf99f9d32a0aff06288fcdac55f',
  '0x23cb7121166b9a2f93ae0b7c05bde02eae50d64449b2cbb42bc84e9d38d6cc89',
];
export const ETHEREUM_ACCOUNT_TO_PRIVATE_KEY = {
  [ETHEREUM_ACCOUNTS[0]]: ETHEREUM_PRIVATE_KEYS[0],
  [ETHEREUM_ACCOUNTS[1]]: ETHEREUM_PRIVATE_KEYS[1],
  [ETHEREUM_ACCOUNTS[2]]: ETHEREUM_PRIVATE_KEYS[2],
  [ETHEREUM_ACCOUNTS[3]]: ETHEREUM_PRIVATE_KEYS[3],
  [ETHEREUM_ACCOUNTS[4]]: ETHEREUM_PRIVATE_KEYS[4],
  [ETHEREUM_ACCOUNTS[5]]: ETHEREUM_PRIVATE_KEYS[5],
  [ETHEREUM_ACCOUNTS[6]]: ETHEREUM_PRIVATE_KEYS[6],
  [ETHEREUM_ACCOUNTS[7]]: ETHEREUM_PRIVATE_KEYS[7],
  [ETHEREUM_ACCOUNTS[8]]: ETHEREUM_PRIVATE_KEYS[8],
  [ETHEREUM_ACCOUNTS[9]]: ETHEREUM_PRIVATE_KEYS[9],
};
// prettier-ignore
export const ETHEREUM_KEYSTORES = [
  { address: '5409ed021d9299bf6814279a6a1411a7e866a631', id: '2f18693e-ab1f-472a-a564-ca101cbca023' , version: 3, Crypto: { cipher: 'aes-128-ctr', cipherparams: { iv: 'd15994e3191054f8a5d61c381c49121d' }, ciphertext: '5992780160ad9421532c5724d1ed187b40ef9382ef3685d6bc32b8fe7d14e563', kdf: 'scrypt', kdfparams: { salt: 'e7da51b571b8ddf58205c59d808d941342108942cae0acd0e125483830a96a86', n: 131072, dklen: 32, p: 1, r: 8 }, mac: '6eeafd050f0e388dfc7e46ae317de23723100144d1c0813105267bbf605c2f05' }},
  { address: '6ecbe1db9ef729cbe972c83fb886247691fb6beb', id: '54b86abe-0623-4c70-b81e-3080851c9da7' , version: 3, Crypto: { cipher: 'aes-128-ctr', cipherparams: { iv: '725f62ff512766c43e857ed6307668cd' }, ciphertext: '2c865b19431ecfa912a5c7a609f0fc54c1ea9eb6c41c3a871e9ff1d1d2f0fc46', kdf: 'scrypt', kdfparams: { salt: 'a575112b3564e7a0d981dd4477f1fc46c21d227a7c7a3fbf4ac7624ec4e77b43', n: 131072, dklen: 32, p: 1, r: 8 }, mac: '3e677a7b3f4bd2b7b43a4ec66eeaf5f9107d3fd1158518641792fed8d5f34b04' }},
  { address: 'e36ea790bc9d7ab70c55260c66d52b1eca985f84', id: '37a85dc4-9924-49c6-b92f-16ae08e841d3' , version: 3, Crypto: { cipher: 'aes-128-ctr', cipherparams: { iv: '9b61cd93db00550caf4ac615ad09bb9a' }, ciphertext: '19810a659de9401ea6f4c6c009dc5a04e97a570fbceac51e5cc21ab2a7e6a38e', kdf: 'scrypt', kdfparams: { salt: 'fd65063a70cd316f359c7000b8eef16f26fa1d327f673924cd4683527ae45e6a', n: 131072, dklen: 32, p: 1, r: 8 }, mac: '315ab5370de500fba33b5cca55d6c0434c5d0fd707f78b6e60f8cac6164d88a4' }},
  { address: 'e834ec434daba538cd1b9fe1582052b880bd7e63', id: 'ea840b2d-81e9-4bc2-92f1-9422ac84b0c0' , version: 3, Crypto: { cipher: 'aes-128-ctr', cipherparams: { iv: 'b84dcd84b97715d8bd33cf64f841d20a' }, ciphertext: '6f1d222f8f089a3f0fa1461702c06805aee35790d8dc454ae9f5e10f617b6b13', kdf: 'scrypt', kdfparams: { salt: '7af1368baf7676c49e8aa204a585ff847dcb1c619660d9b98648d2c5859629b7', n: 131072, dklen: 32, p: 1, r: 8 }, mac: 'f2e060fe365d1555f6cc75f55f0556d741252324330a276e208af1925e281db3' }},
  { address: '78dc5d2d739606d31509c31d654056a45185ecb6', id: '99053f8f-74cc-4d81-8cdf-1c3293aad11b' , version: 3, Crypto: { cipher: 'aes-128-ctr', cipherparams: { iv: '01e135f5ff86698b14d1d87b339c3aec' }, ciphertext: 'bd281d1b3e27f233841b69a82ee8647a16d24ef4e3fe487ae5b11dc872ac86e8', kdf: 'scrypt', kdfparams: { salt: 'd70c7294f2e7c3b17c65f92303a6ccfc9d86c9889b61914c95e6c3e111a94a50', n: 131072, dklen: 32, p: 1, r: 8 }, mac: 'b84b8b162ddf7cfb12014faa1d94cfd5523a929810cec6d182eb332474bae997' }},
  { address: 'a8dda8d7f5310e4a9e24f8eba77e091ac264f872', id: '67c499b8-c6f4-485b-bd72-5fb4925c7780' , version: 3, Crypto: { cipher: 'aes-128-ctr', cipherparams: { iv: '3de03199eb8b5c96f214325f46db3892' }, ciphertext: 'ff3a11b17ce03f5978a7341a313c887f5baa2ef0a95c69d91f6903e861d5cb7d', kdf: 'scrypt', kdfparams: { salt: '427faa9bf703f04ccb9fb3ebc7065921ec19732b77e1ad5292b3434490b2b556', n: 131072, dklen: 32, p: 1, r: 8 }, mac: '0807fb7812875d16e44ed2a7d3ab5c81e43e3ebb3ef2ed7a53d951a704f0af08' }},
  { address: '06cef8e666768cc40cc78cf93d9611019ddcb628', id: 'c42a1c4d-36cd-4042-8171-2fed2b97ba55' , version: 3, Crypto: { cipher: 'aes-128-ctr', cipherparams: { iv: '2bcdf58c9d70d11244519a7a0a332dcd' }, ciphertext: '37db12edbafc4c516a2fe7463b90c05bda243f59dd5fc10bf7dada22d673e0a0', kdf: 'scrypt', kdfparams: { salt: 'e5136d2ca542c5a4a0d41b5bdae26fbfd1b4a141d187ac7afae1b09743b74346', n: 131072, dklen: 32, p: 1, r: 8 }, mac: 'c622185bcd0e1d54f5e97b8865c86614f6fd50d87abbf891209a280382935efb' }},
  { address: '4404ac8bd8f9618d27ad2f1485aa1b2cfd82482d', id: '3b9942f1-37de-42f2-843a-763cdc1da62e' , version: 3, Crypto: { cipher: 'aes-128-ctr', cipherparams: { iv: 'a97c5c3b793b9c177c411f56fc7fae81' }, ciphertext: 'e9aba62728d409809b17805f884296c6d96479b75825ec86cc83723505009a05', kdf: 'scrypt', kdfparams: { salt: '78ecf210cb2ff72ae8168f0e6aed7066ff644d1d2115f588bafe672f1d574221', n: 131072, dklen: 32, p: 1, r: 8 }, mac: 'a462685d754b7f171189274b8e21f0740be0959daa2dd27f62254a51875d8a56' }},
  { address: '7457d5e02197480db681d3fdf256c7aca21bdc12', id: '25ef6bdd-31c0-48e9-a588-25cbcd55f2be' , version: 3, Crypto: { cipher: 'aes-128-ctr', cipherparams: { iv: 'c44b5fecbc3fb74615e691676816567e' }, ciphertext: '25d670f2c5a8ac719d95f48472e9620ef9b6d50710516c260ceeb2553985d704', kdf: 'scrypt', kdfparams: { salt: 'ba6a74c4cab4d192e09378aeb4c7cad7232bcaf309db1dd1475948b3b729aa7a', n: 131072, dklen: 32, p: 1, r: 8 }, mac: 'e6c8c5e79b07f0edef4c04004eb5ce71d2abc92032fb19936fafb24784e3dfa4' }},
  { address: '91c987bf62d25945db517bdaa840a6c661374402', id: '15146bc2-e2ef-41e8-9c11-126a69b5013e' , version: 3, Crypto: { cipher: 'aes-128-ctr', cipherparams: { iv: '5f7a9cfc1374d7b105ac16171ee090c5' }, ciphertext: 'e59e09feb2d20ff75d726dea9f0235847cd0ad3bab714d6fec0ed614b74f0954', kdf: 'scrypt', kdfparams: { salt: '6ee91bec73020d72f033c5bd97b7cad7dbd95af9a7aeae86d7684a5177f17df7', n: 131072, dklen: 32, p: 1, r: 8 }, mac: '0a33a624101e0449921c5275590e3180f9e539ad9aa0f45eb70e4666306241d0' }},
];

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
    // If vars are modified, also update compose-file.ts
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
  'keep-beacon': {
    name: 'KEEP Random Beacon',
    imageName: 'oneclickkeep/keep-beacon',
    logo: '',
    platforms: ['mac', 'linux', 'windows'],
    volumeDirName: 'keep-beacon',
    command: ['--config', './config/config.toml', 'start'].join('\n  '),
    variables: [],
  },
  'keep-ecdsa': {
    name: 'KEEP ECDSA',
    imageName: 'oneclickkeep/keep-ecdsa',
    logo: '',
    platforms: ['mac', 'linux', 'windows'],
    volumeDirName: 'keep-ecdsa',
    command: ['--config', './config/config.toml', 'start'].join('\n  '),
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
    'keep-beacon': {
      latest: '1.3.0',
      versions: ['1.3.0'],
    },
    'keep-ecdsa': {
      latest: '1.2.0',
      versions: ['1.2.0'],
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
  'keep-beacon': {
    p2p: 3819,
  },
  'keep-ecdsa': {
    p2p: 3919,
  },
};
