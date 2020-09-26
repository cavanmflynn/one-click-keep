import { Network } from '@/types';
import { info } from 'electron-log';
import { write } from './files';
import { join } from 'path';
import { nodePath } from './config';
import { ensureDir } from 'fs-extra';
import { ETHEREUM_KEYSTORES } from '../constants';

class KeystoreService {
  /**
   * Save a keystore file for every beacon and ecdsa node
   * @param network The network containing the nodes
   */
  async saveKeystoreFiles(network: Network) {
    const { beacon, ecdsa } = network.nodes;

    const beaconWritePromises = beacon.map(async (node) => {
      const directory = join(
        nodePath(network, 'keep-beacon', node.name),
        'keystore',
      );
      await ensureDir(directory);
      return write(
        join(directory, `account-${node.id + 2}`),
        JSON.stringify(ETHEREUM_KEYSTORES[node.id + 2]),
      );
    });
    const ecdsaWritePromises = ecdsa.map(async (node) => {
      const directory = join(
        nodePath(network, 'keep-ecdsa', node.name),
        'keystore',
      );
      await ensureDir(directory);
      return write(
        join(directory, `account-${node.id + 2}`),
        JSON.stringify(ETHEREUM_KEYSTORES[node.id + 2]),
      );
    });

    await Promise.all([...beaconWritePromises, ...ecdsaWritePromises]);
    info(`Saved keystore files for '${network.name}'`);
  }
}

export const keystore = new KeystoreService();
