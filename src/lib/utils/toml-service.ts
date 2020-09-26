import { Network, BeaconNode, EcdsaNode, EthereumNode } from '@/types';
import { info } from 'electron-log';
import { write } from './files';
import { join } from 'path';
import TOML from '@iarna/toml';
import { getContainerName } from '../docker';
import { nodePath } from './config';
import { ensureDir } from 'fs-extra';
import { CONTRACTS } from '../constants';

class TomlService {
  /**
   * Save a config.toml for every beacon and ecdsa node
   * @param network The network containing the nodes
   */
  async saveTomlFiles(network: Network) {
    const { ethereum, beacon, ecdsa } = network.nodes;
    const [ethereumNode] = ethereum; // Currently only one ETH node supported

    const beaconWritePromises = beacon.map(async (node) => {
      const directory = join(
        nodePath(network, 'keep-beacon', node.name),
        'config',
      );
      await ensureDir(directory);
      return write(
        join(directory, 'config.toml'),
        this.getBeaconConfig(ethereumNode, node),
      );
    });
    const ecdsaWritePromises = ecdsa.map(async (node) => {
      const directory = join(
        nodePath(network, 'keep-ecdsa', node.name),
        'config',
      );
      await ensureDir(directory);
      return write(
        join(directory, 'config.toml'),
        this.getEcdsaConfig(ethereumNode, node),
      );
    });

    await Promise.all([...beaconWritePromises, ...ecdsaWritePromises]);
    info(`Saved config.toml files for '${network.name}'`);
  }

  /**
   * Build a TOML config for the passed Beacon node
   * @param ethereum The ethereum node
   * @param beacon The Beacon node
   */
  // prettier-ignore
  getBeaconConfig(ethereum: EthereumNode, beacon: BeaconNode): string {
    return TOML.stringify({
      ethereum: {
        URL: `ws://${getContainerName(ethereum)}:${ethereum.ports.rpc}`,
        URLRPC: `http://${getContainerName(ethereum)}:${ethereum.ports.rpc}`,
        account: {
          KeyFile: `/keystore/account-${beacon.id + 2}`, // Index offset + skip owner account
        },
        ContractAddresses: {
          KeepRandomBeaconOperator: CONTRACTS.KEEP.CORE.KEEP_RANDOM_BEACON_OPERATOR.ADDRESS,
          TokenStaking: CONTRACTS.KEEP.CORE.TOKEN_STAKING.ADDRESS,
        },
      },
      LibP2P: {
        Port: 3919,
      },
      Storage: {
        DataDir: '/storage',
      },
    });
  }

  /**
   * Build a TOML config for the passed ECDSA node
   * @param ethereum The ethereum node
   * @param ecdsa The ECDSA node
   */
  // prettier-ignore
  getEcdsaConfig(ethereum: EthereumNode, ecdsa: EcdsaNode): string {
    return TOML.stringify({
      ethereum: {
        URL: `ws://${getContainerName(ethereum)}:${ethereum.ports.rpc}`,
        URLRPC: `http://${getContainerName(ethereum)}:${ethereum.ports.rpc}`,
        account: {
          KeyFile: `/keystore/account-${ecdsa.id + 2}`, // Index offset + skip owner account
        },
        ContractAddresses: {
          BondedECDSAKeepFactory: CONTRACTS.KEEP.ECDSA.BONDED_ECDSA_KEEP_FACTORY.ADDRESS,
        },
      },
      LibP2P: {
        Port: 3919,
      },
      Storage: {
        DataDir: '/storage',
      },
    });
  }
}

export const toml = new TomlService();
