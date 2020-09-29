import { DockerConfig, NodeImplementation, DockerRepoState } from '@/types';
import packageJson from '../../package.json';

// App
export const APP_VERSION = packageJson.version;

// Docker
export const DOCKER_REPO = 'oneclickkeep';
export const DOCKER_CONFIGS: Record<NodeImplementation, DockerConfig> = {
  bitcoind: {
    name: 'Bitcoin Core',
    imageName: 'oneclickkeep/bitcoind',
    platforms: ['mac', 'linux', 'windows'],
    volumeDirName: 'bitcoind',
    command: [
      'bitcoind',
      '-server=1',
      '-regtest=1',
      '-rpcuser={{rpcUser}}',
      '-rpcpassword={{rpcPass}}',
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
    variables: ['rpcUser', 'rpcPass'],
  },
  btcd: {
    name: 'btcd',
    imageName: '',
    platforms: ['mac', 'linux', 'windows'],
    volumeDirName: 'btcd',
    command: '',
    variables: [],
  },
  ganache: {
    name: 'ganache',
    imageName: 'oneclickkeep/ganache',
    platforms: ['mac', 'linux', 'windows'],
    volumeDirName: 'ganache',
    command: '',
    variables: [],
  },
  electrumx: {
    name: 'ElectrumX',
    imageName: 'oneclickkeep/electrumx',
    platforms: ['mac', 'linux', 'windows'],
    volumeDirName: 'electrumx',
    command: '',
    variables: [],
  },
  'keep-beacon': {
    name: 'KEEP Random Beacon',
    imageName: 'oneclickkeep/keep-beacon',
    platforms: ['mac', 'linux', 'windows'],
    volumeDirName: 'keep-beacon',
    command: ['--config', './config/config.toml', 'start'].join('\n  '),
    variables: [],
  },
  'keep-ecdsa': {
    name: 'KEEP ECDSA',
    imageName: 'oneclickkeep/keep-ecdsa',
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
    electrumx: {
      latest: '1.15.0',
      versions: ['1.15.0'],
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
  electrumx: {
    tcp: 50001,
    ssl: 50002,
    ws: 50003,
    wss: 50004,
    rpc: 8000,
  },
  'keep-beacon': {
    p2p: 3819,
  },
  'keep-ecdsa': {
    p2p: 3919,
  },
};

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
export const KEEP_ECDSA_PEER_IDS = [
  '16Uiu2HAmDLCM1u8me5pDJRdNtwc5jKFEEbKfL5XXbYyMwXYrmhzY',
  '16Uiu2HAmTdhwwTe8rYodjE4wFJE6h6ECfUDdC7ZYA7wag2HPWk8L',
  '16Uiu2HAmRGrPJ6Ybz6KvU4SU7YCDeporxBqnHFvLTVxQTQ8xenbh',
  '16Uiu2HAmK7DUaPqq9zfJDLc9KG9YvQYjxjs8u8Ua1KTXTT8Ldfkb',
  '16Uiu2HAmVU4WPY3jJbCFrnhTFJ9rfoayC8sDiRa6dJJzZGcLDect',
  '16Uiu2HAmRRzaPauLTSCyVQg2JfgCSi5j4BGangTpemMiYpr9pTFS',
  '16Uiu2HAmQFVJxPqTcyXRhnjNFXn4a47k2UkqiA5JS6tgmTjMa8V4',
  '16Uiu2HAkwBADLmtWyJFX9okZk8rVxhaU8C6GqHxxdRRQHxMYo9SN',
  '16Uiu2HAmFhhMAXRpwHPuyyBGp9mLcSYJD5WRGtLS7vpqVK1uBBLA',
];

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

// Contracts
// prettier-ignore
export const CONTRACTS = {
  KEEP: {
    CORE: {
      ALT_BN_128: {
        ADDRESS: '0x0B1ba0af832d7C05fD64161E0Db78E85978E8082',
        TRANSACTION_HASH: '0xc1dae578d6c1272a3469e23e265c187ed1f9dd09d61fbab4bacd7660c522084a',
      },
      BLS: {
        ADDRESS: '0x48BaCB9266a570d521063EF5dD96e61686DbE788',
        TRANSACTION_HASH: '0x6bb992e59bc61a816a5951556b410749a7861b0ec17e5b2a0f4e40d438e072cf',
      },
      DELAY_FACTOR: {
        ADDRESS: '0x32EeCaF51DFEA9618e9Bc94e9fBFDdB1bBdcbA15',
        TRANSACTION_HASH: '0xaf3d6ef14666310b22934dd9a15d3295697f24f018f4f12b81dcc614addbf649',
      },
      DKG_RESULT_VERIFICATION: {
        ADDRESS: '0x6000EcA38b8B5Bba64986182Fe2a69c57f6b5414',
        TRANSACTION_HASH: '0x4c93ec3b2013c65e09af5727a9178643a90df82bfba631557fd8a039935ceb6d',
      },
      GAS_PRICE_ORACLE: {
        ADDRESS: '0xE86bB98fcF9BFf3512C74589B78Fb168200CC546',
        TRANSACTION_HASH: '0x639a2c8b68b59d091fe7a8751e317d3761b199374f0d4bac02a21dfa9f9b6fb6',
      },
      GRANT_STAKING: {
        ADDRESS: '0x07f96Aa816C1F244CbC6ef114bB2b023Ba54a2EB',
        TRANSACTION_HASH: '0xa284a17b9eda70fe3a64d5b985558e029b9b36511ca1a4c26c68425181540004',
      },
      GROUPS: {
        ADDRESS: '0xb7C9b454221E26880Eb9C3101B3295cA7D8279EF',
        TRANSACTION_HASH: '0x970c5b2d9a66ce08f0935b463582c316a2ca3d987d2da06981ea0786bc185ae3',
      },
      GROUP_SELECTION: {
        ADDRESS: '0xDc688D29394a3f1E6f1E5100862776691afAf3d2',
        TRANSACTION_HASH: '0xb28de5e62693429d60768d10281c36fc2158b73065f110ec9749a26c36e5c0d8',
      },
      GUARANTEED_MINIMUM_STAKING_POLICY: {
        ADDRESS: '0x131855DDa0AaFF096F6854854C55A4deBF61077a',
        TRANSACTION_HASH: '0x536d39ea142cc26ed221683a257da00ecbc9217b0a6ad8b02d3d82f034b25817',
      },
      KEEP_RANDOM_BEACON_OPERATOR: {
        ADDRESS: '0x4112f5fc3f737e813ca8cC1A48D1da3dc8719435',
        TRANSACTION_HASH: '0x9791424c8c02ab031b29a7c746072799a18b89c133028355362dcc3aed423387',
      },
      KEEP_RANDOM_BEACON_OPERATOR_STATISTICS: {
        ADDRESS: '0x7Bf7bb74C43dc141293aFf12A2D7DE350E9b09E0',
        TRANSACTION_HASH: '0xad1b2aa0cc5fa6ce903e8a8c2bd77e6af606c74d1cea7a1a238a2b5eef516130',
      },
      KEEP_RANDOM_BEACON_SERVICE: {
        ADDRESS: '0x8726C7414ac023D23348326B47AF3205185Fd035',
        TRANSACTION_HASH: '0x442a7ca6c3650bc8bf8b15c405a12a2051a8c9cf620e34d8814285cc30981d6f',
      },
      KEEP_RANDOM_BEACON_SERVICE_IMPL_V1: {
        ADDRESS: '0x04B5dAdd2c0D6a261bfafBc964E0cAc48585dEF3',
        TRANSACTION_HASH: '0xe320ecc22c4bab52fdddcef54822d56d2ba76557cf01c6e153c3a3cfb1794702',
      },
      KEEP_REGISTRY: {
        ADDRESS: '0xcdB594a32B1CC3479d8746279712c39D18a07FC0',
        TRANSACTION_HASH: '0x0a1c537a8a1d7ddcf41d8b6b1f5210b93395e69f90c021e1c9a6e563b44827a2',
      },
      KEEP_TOKEN: {
        ADDRESS: '0x34D402F14D58E001D8EfBe6585051BF9706AA064',
        TRANSACTION_HASH: '0x9a47dd7d17af7802fd8c781d978dad7e4b9a60fadbb39e89408d41a502a6c36c',
      },
      LOCKS: {
        ADDRESS: '0x6A4A62E5A7eD13c361b176A5F62C2eE620Ac0DF8',
        TRANSACTION_HASH: '0x1cc3367b323e31d60e9a779af25d120e6bdf747fe0eda120373700353e805f4c',
      },
      MANAGED_GRANT_FACTORY: {
        ADDRESS: '0xB69e673309512a9D726F87304C6984054f87a93b',
        TRANSACTION_HASH: '0x4a17bfecd66870d212ca253b4923d5b2b97fd73dca72f5f3773ebbcb2d646e7b',
      },
      MINIMUM_STAKE_SCHEDULE: {
        ADDRESS: '0xbe0037eAf2d64fe5529BCa93c18C9702D3930376',
        TRANSACTION_HASH: '0x4e3dd2a33d0454d011e0f4b2653fda6c3087d0efa4592b6b8cd37a89bcad1dff',
      },
      MOD_UTILS: {
        ADDRESS: '0x871DD7C2B4b25E1Aa18728e9D5f2Af4C4e431f5c',
        TRANSACTION_HASH: '0x46efe6cbc3ace258a28af5aac729c85cb74e6baacab7c163100a78b093dd0803',
      },
      OLD_TOKEN_STAKING: {
        ADDRESS: '0xF22469F31527adc53284441bae1665A7b9214DBA',
        TRANSACTION_HASH: '0xe78b313525b6e2bdd913eff7ad589bd56cc6b3efb0e6b01cb579bf1ea69a7bf3',
      },
      PERMISSIVE_STAKING_POLICY: {
        ADDRESS: '0x8d61158a366019aC78Db4149D75FfF9DdA51160D',
        TRANSACTION_HASH: '0xe0b28f5e2cad0a254e18db0a42377a39ad6803842aa44de05525242ea4062568',
      },
      REIMBURSEMENTS: {
        ADDRESS: '0x7e3f4E1deB8D3A05d9d2DA87d9521268D0Ec3239',
        TRANSACTION_HASH: '0xb8235a6283e7456b610a06f81ede24aa42d0e80a577ec2e53110c41979f59a57',
      },
      STAKING_PORT_BACKER: {
        ADDRESS: '0x10aDd991dE718a69DeC2117cB6aA28098836511B',
        TRANSACTION_HASH: '0x8d9a4cb4ca144fae4d4cb9fd3ec516d3363a6e26549b6667b7cb0d1132e7f349',
      },
      TOKEN_GRANT: {
        ADDRESS: '0x25B8Fe1DE9dAf8BA351890744FF28cf7dFa8f5e3',
        TRANSACTION_HASH: '0xaaa5c1023b9c37a08a8841135aabc7c80eb68907982be78a53108d6788d4c2da',
      },
      TOKEN_STAKING: {
        ADDRESS: '0xcFC18CEc799fBD1793B5C43E773C98D4d61Cc2dB',
        TRANSACTION_HASH: '0xbba7da6e67fb040a4866aea019dd3561ad792c93272a826efbb74e4003f1a2cc',
      },
      TOKEN_STAKING_ESCROW: {
        ADDRESS: '0x1E2F9E10D02a6b8F8f69fcBf515e75039D2EA30d',
        TRANSACTION_HASH: '0x131d371ef9218606029fa65141b5c02b9cef8fcdeba3b3328d109d8e7205e5a3',
      },
      TOP_UPS: {
        ADDRESS: '0x6DfFF22588BE9b3ef8cf0aD6Dc9B84796F9fB45f',
        TRANSACTION_HASH: '0xbbbd56e0102e8a237736727aa4a0be79c7f645eb5954d0dead943b05532eb349',
      },
    },
    ECDSA: {
      BONDED_ECDSA_KEEP: {
        ADDRESS: '0x72D5A2213bfE46dF9FbDa08E22f536aC6Ca8907e',
        TRANSACTION_HASH: '0xcf0c21c858dd78ac57742dec5917b7ca4127a42d3c0dc3d82139851932dcba34',
      },
      BONDED_ECDSA_KEEP_FACTORY: {
        ADDRESS: '0x2eBb94Cc79D7D0F1195300aAf191d118F53292a8',
        TRANSACTION_HASH: '0x4d397b1f4ff8e5c675243f8cd93937ac7075c2fa36f815807de8699edf02aa1e',
      },
      BONDED_ECDSA_KEEP_VENDOR: {
        ADDRESS: '0xDFF540fE764855D3175DcfAe9d91AE8aEE5C6D6F',
        TRANSACTION_HASH: '0xaee2d6dd04cf80cb277cde19854b61af6c511a39140d66ba527f339bed998dbd',
      },
      BONDED_ECDSA_KEEP_VENDOR_IMPL_V1: {
        ADDRESS: '0x5315e44798395d4a952530d131249fE00f554565',
        TRANSACTION_HASH: '0x5aeb7bdbf30fc4dfcd553e1361946f5e2668ef6b64c46f08122353e1a303a7af',
      },
      BONDED_SORTITION_POOL_FACTORY: {
        ADDRESS: '0xA4b3e1659c473623287b2cc13b194705cd792525',
        TRANSACTION_HASH: '0xfcc044b871dcd93b06082fcf218a612888ceeed7b3b52e0cc8375ab895b38bab',
      },
      BRANCH: {
        ADDRESS: '0x5D3AD3561A1235273cbCb4E82fCe63A0073d19be',
        TRANSACTION_HASH: '0xc077d715c3abc3f0c96fd3ae490301f0abf7aaf092bd78227d78947234312eb6',
      },
      KEEP_BONDING: {
        ADDRESS: '0x2C530e4Ecc573F11bd72CF5Fdf580d134d25f15F',
        TRANSACTION_HASH: '0x5fc072fffd48fc078eabe88287165868fd24f0b06ebf770c48c69afc9a027758',
      },
      LEAF: {
        ADDRESS: '0xe704967449b57b2382B7FA482718748c13C63190',
        TRANSACTION_HASH: '0xaf9b88b9883c1d45ea09c94d9148a2a6180bf17becccc260ec2e20fa47deb157',
      },
      POSITION: {
        ADDRESS: '0xB48E1B16829C7f5Bd62B76cb878A6Bb1c4625D7A',
        TRANSACTION_HASH: '0xd903bb50baabc304524271ccb3249afefd94a7148f58bb897eca11428c6c71ef',
      },
      STACK_LIB: {
        ADDRESS: '0xc4CC602A7345518d0B7A84049d4Bc8575eBF3398',
        TRANSACTION_HASH: '0x55ebd9a607e57f7544dace09ce306ee939a0efc2f1de3b71b94cea66024b1034',
      },
    },
    TBTC: {
      BTC_UTILS: {
        ADDRESS: '0x7209185959D7227FB77274e1e88151D7C4c368D3',
        TRANSACTION_HASH: '0x4048e5221727c6983be5aaef549e62822819767abf6882017c952ee54cc004b5',
      },
      BYTES_LIB: {
        ADDRESS: '0xC6B0D3C45A6b5092808196cB00dF5C357d55E1d5',
        TRANSACTION_HASH: '0x71ad90eb233e1980d4e7a78933a906ecc3d961367641f73a1595e672d6705e9c',
      },
      CHECK_BITCOIN_SIGS: {
        ADDRESS: '0x99356167eDba8FBdC36959E3F5D0C43d1BA9c6DB',
        TRANSACTION_HASH: '0x7b4fec068f5199b87eed6660a2144e5ea26c6761951daefa1945ca6394e9e6ba',
      },
      DEPOSIT: {
        ADDRESS: '0x9a1df498af690a7EB43E10A28AB51345a3A33F75',
        TRANSACTION_HASH: '0xc2107d5a47ac7ee78bf07ab12e987f786a7211e9b90cc0159d1f67c668fd5318',
      },
      DEPOSIT_FACTORY: {
        ADDRESS: '0x96EccEa4E124322a6aA0a004da1b91d9a3024C73',
        TRANSACTION_HASH: '0xd252930e6130ec0f998979a36276edd274fa31b5272996456730a13dbfc09c25',
      },
      DEPOSIT_FUNDING: {
        ADDRESS: '0x965D352283a3C8A016b9BBbC9bf6306665d495E7',
        TRANSACTION_HASH: '0xd7e595f22ca695b0f2a04b463d5d63f4869813433735ed3cc9640903aae4dc77',
      },
      DEPOSIT_LIQUIDATION: {
        ADDRESS: '0x46c6A737C75cE3a58c6b2De14970E8841c72DcEF',
        TRANSACTION_HASH: '0x0e71c4887993a982ad54cc597875624c11f77ebbd728034d8ae05769ae062330',
      },
      DEPOSIT_REDEMPTION: {
        ADDRESS: '0x1a488d7B42C1Ec1539b78f772BF13eCCB723f5fa',
        TRANSACTION_HASH: '0xb13443149aed12faffc198548455a3ceadee35b8b1ca340402ea69a380ddbd6c',
      },
      DEPOSIT_STATES: {
        ADDRESS: '0xd2aa8d362b1CaA68553642831b86Abb3D24B4579',
        TRANSACTION_HASH: '0x17f829152759b49b2fa16da953afdbd81ded815fde24b3d000c7f22d56d7ebb9',
      },
      DEPOSIT_UTILS: {
        ADDRESS: '0x434f1EB003B78c0EAbe034313F1aFf47920e0860',
        TRANSACTION_HASH: '0x10c82defab1f2bdd48907a88c98260edcc9a764a579b51c677cb5030e33d6a81',
      },
      ETHBTC_PRICE_FEED_MOCK: {
        ADDRESS: '0x4609e0ED27A8BAAc57b753D36a5D2971915588f9',
        TRANSACTION_HASH: '0xab4eb3a97244c50341d7390a7c971e7f54d5ec4a768209ce1129a6c22f337461',
      },
      FEE_REBATE_TOKEN: {
        ADDRESS: '0x53b56c2dB09865a21B3242B8Bd5Fae00a0dFf119',
        TRANSACTION_HASH: '0x4e15e5d13c4c67f6b10476bf12cdbc212257a996fcffa27d1cb1a46edcf55d99',
      },
      FUNDING_SCRIPT: {
        ADDRESS: '0x588352A251aAC2EC0e868fC13612Fa2edd604f23',
        TRANSACTION_HASH: '0xe5895beaec70a2a19b7e7ce2d398d24733ec91a4e849ceda2f032285e9155c0a',
      },
      KEEP_FACTORY_SELECTION: {
        ADDRESS: '0x404C55a936f3006B13B020efAaf5771A600Ec04d',
        TRANSACTION_HASH: '0xf2a76fb99e93cb8b09457bde00d3ea2cd961c55be13edcb6c131f8c757da4c26',
      },
      MOCK_RELAY: {
        ADDRESS: '0xd7e3593d3d8A22480e2136EaB9497286D87C0231',
        TRANSACTION_HASH: '0xe05a5ffbd0b63fb07bf5c18238f41d5d9bf9a9b9bee33b1b37d5ca37d8b6c59c',
      },
      OUTSOURCE_DEPOSIT_LOGGING: {
        ADDRESS: '0xdD66C23e07b4D6925b6089b5Fe6fc9E62941aFE8',
        TRANSACTION_HASH: '0x3a8db642b912387f4b136bf26dd65c9fc9376678d81baa5ab873821ad0ba0ddf',
      },
      REDEMPTION_SCRIPT: {
        ADDRESS: '0xdc1e388E6548d8E7D7a3Dfe4BFa6acd33EfB03f1',
        TRANSACTION_HASH: '0x9ece16409d2f4725c127c30427d7d03a8025bf38c80e7c52a79e5e73390cd450',
      },
      SAT_WEI_PRICE_FEED: {
        ADDRESS: '0x2579D2B186BbA16999016dB077b4874A7520f92e',
        TRANSACTION_HASH: '0x6b01384b8d505a3a4522262fc14fda6753eb057795bca1e5004197f3c53dbcb8',
      },
      TBTC_CONSTANTS: {
        ADDRESS: '0x45B3A72221E571017C0f0ec42189E11d149D0ACE',
        TRANSACTION_HASH: '0xa2cccb362838840796f39b4247d4eccc4f1f1bebdeb87b3fbe7559c7a21488ae',
      },
      TBTC_DEPOSIT_TOKEN: {
        ADDRESS: '0xe092f6C9fDC20D23207E96A9845E0989ab94385c',
        TRANSACTION_HASH: '0x12387df4402432b86a1bb385c8d5c7b928418f2f7b91844851754e5bc2f7b0a6',
      },
      TBTC_SYSTEM: {
        ADDRESS: '0xfD946D47d3dB1e06126d16281Fb3E222A1bA8179',
        TRANSACTION_HASH: '0xcd241b93f0056fa275cf6fb2870b292c9b44c31c4904d3ebf6d5b9aeb23c7bd9',
      },
      TBTC_TOKEN: {
        ADDRESS: '0xBDFcAAd0072d2976C9Eaee1a5c36BECC888738c8',
        TRANSACTION_HASH: '0xa657e173422db43e24b22e142699cd4b2fee8ceba15effde031075f0fb8dd764',
      },
      VALIDATE_SPV: {
        ADDRESS: '0x3f16cA81691dAB9184cb4606C361D73c4FD2510a',
        TRANSACTION_HASH: '0x631cba98d0a90ddf458b8c94cf754afff80d3de7d8e796dd59a2073cb4ffc49b',
      },
      VENDING_MACHINE: {
        ADDRESS: '0xDDb2B738682AD218eD87CF6f3a466798644e5d8D',
        TRANSACTION_HASH: '0xb537d9f2472de6ee1f7aab8b0019869c1e6e560b83cfc8d0fa5d6b8b1cbe5593',
      },
    },
  },
};
