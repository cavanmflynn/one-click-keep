import { providers, Contract } from 'ethers';
import { EthereumNode } from '@/types';
import { waitFor } from './async';
import { range } from './numbers';
import { ETHEREUM_ACCOUNTS, CONTRACTS } from '../constants';
import { KeepRandomBeaconOperatorABI } from '../abis';
import { info } from 'electron-log';

class EthereumService {
  createClient(node: EthereumNode) {
    return new providers.JsonRpcProvider(`http://localhost:${node.ports.rpc}`);
  }

  async getLatestBlock(node: EthereumNode) {
    return this.createClient(node).getBlock('latest');
  }

  async getBlockHeight(node: EthereumNode) {
    return this.createClient(node).getBlockNumber();
  }

  async triggerKeepBeaconGenesis(node: EthereumNode) {
    try {
      const [owner] = ETHEREUM_ACCOUNTS;
      const signer = this.createClient(node).getSigner(owner);
      const contract = new Contract(
        CONTRACTS.KEEP.CORE.KEEP_RANDOM_BEACON_OPERATOR.ADDRESS,
        KeepRandomBeaconOperatorABI,
        signer,
      );
      const dkgGas = await contract.dkgGasEstimate();
      const gasPrice = await contract.gasPriceCeiling();
      const dkgFee = dkgGas.mul(gasPrice);

      await contract.genesis({ value: dkgFee });
      info('Beacon genesis successful');
    } catch (error) {
      error('Beacon genesis failed with error', error);
    }
  }

  /**
   * Helper function to continually query the ganache node until a successful
   * response is received or it times out
   */
  async waitUntilOnline(
    node: EthereumNode,
    interval = 3 * 1000, // check every 3 seconds
    timeout = 60 * 1000, // timeout after 60 seconds
  ): Promise<void> {
    return waitFor(
      async () => {
        await this.getLatestBlock(node);
      },
      interval,
      timeout,
    );
  }

  async mine(numBlocks: number, node: EthereumNode) {
    const client = this.createClient(node);
    // Ganache only supports mining of a single block and ethers does not support batch requests
    return Promise.all(range(numBlocks).map(() => client.send('evm_mine', [])));
  }

  async increaseTime(increaseSeconds: number, node: EthereumNode) {
    const client = this.createClient(node);
    return client.send('evm_increaseTime', [increaseSeconds]);
  }
}

export const ethereumService = new EthereumService();
