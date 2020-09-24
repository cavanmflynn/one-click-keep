import { providers } from 'ethers';
import { EthereumNode } from '@/types';
import { waitFor } from './async';

class EthereumService {
  createClient(node: EthereumNode) {
    return new providers.JsonRpcProvider(`127.0.0.1:${node.ports.rpc}`);
  }

  async getLatestBlock(node: EthereumNode) {
    return await this.createClient(node).getBlock('latest');
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
}

export const ethereumService = new EthereumService();
