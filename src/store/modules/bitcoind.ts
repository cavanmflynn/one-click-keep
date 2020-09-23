import { Module, Mutation, VuexModule, Action } from 'vuex-module-decorators';
import { store } from '../store';
import { Status, BitcoinNode } from '@/types';
import { getNetworkById, delay, bitcoindService } from '@/lib/utils';
import { system, network } from '..';
import { languageLibrary } from '@/localization';
import { ChainInfo, WalletInfo } from 'bitcoin-core';

export interface BitcoindNodeInfo {
  chainInfo?: ChainInfo;
  walletInfo?: WalletInfo;
}

@Module({ store, name: 'bitcoind', dynamic: true, namespaced: true })
export class BitcoindModule extends VuexModule {
  private _nodes: Record<string, BitcoindNodeInfo> = {};

  @Mutation
  public removeNode(name: string) {
    delete this._nodes[name];
  }

  @Mutation
  public clearNodes() {
    this._nodes = {};
  }

  @Mutation
  public setInfo({
    node,
    chainInfo,
    walletInfo,
  }: {
    node: BitcoinNode;
    chainInfo: ChainInfo;
    walletInfo: WalletInfo;
  }) {
    if (!this._nodes[node.name]) {
      this._nodes[node.name] = {};
    }
    this._nodes[node.name].chainInfo = chainInfo;
    this._nodes[node.name].walletInfo = walletInfo;
  }

  @Action({ rawError: true })
  async getInfo(node: BitcoinNode) {
    const chainInfo = await bitcoindService.getBlockchainInfo(node);
    const walletInfo = await bitcoindService.getWalletInfo(node);
    this.setInfo({ node, chainInfo, walletInfo });
  }

  @Action({ rawError: true })
  async mine({ blocks, node }: { blocks: number; node: BitcoinNode }) {
    if (blocks < 0)
      throw new Error(
        languageLibrary[system.language || 'en']
          .get('BITCOIND_MINE_ERROR')
          .toString({}),
      );

    await bitcoindService.mine(blocks, node);
    // Add a small delay to allow the block to propagate to all nodes
    await delay(500);
    // Update info for all bitcoin nodes
    const net = getNetworkById(network.networks, node.networkId);
    await Promise.all(
      net.nodes.bitcoin
        .filter((n) => n.status === Status.Started)
        .map(this.getInfo),
    );
  }
}
