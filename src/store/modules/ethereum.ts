import { Module, Mutation, VuexModule, Action } from 'vuex-module-decorators';
import { store } from '../store';
import { Status, EthereumNodeInfo, EthereumNode } from '@/types';
import { getNetworkById, delay, ethereumService } from '@/lib/utils';
import { system, network } from '..';
import { languageLibrary } from '@/localization';
import Vue from 'vue';

@Module({ store, name: 'ethereum', dynamic: true, namespaced: true })
export class EthereumModule extends VuexModule {
  private _nodes: Record<string, EthereumNodeInfo> = {};

  get nodes() {
    return this._nodes;
  }

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
    blockHeight,
  }: {
    node: EthereumNode;
    blockHeight: number;
  }) {
    if (!this._nodes[node.name]) {
      Vue.set(this._nodes, node.name, {});
    }
    Vue.set(this._nodes[node.name], 'blockHeight', blockHeight);
  }

  @Action({ rawError: true })
  async getInfo(node: EthereumNode) {
    const blockHeight = await ethereumService.getBlockHeight(node);
    this.setInfo({ node, blockHeight });
  }

  @Action({ rawError: true })
  async mine({ blocks, node }: { blocks: number; node: EthereumNode }) {
    if (blocks < 0)
      throw new Error(
        languageLibrary[system.language || 'en'].get('MINE_ERROR').toString({}),
      );

    await ethereumService.mine(blocks, node);
    // Add a small delay to allow the block to propagate to all nodes
    await delay(1000);
    // Update info for all ethereum nodes
    const net = getNetworkById(network.networks, node.networkId);
    await Promise.all(
      net.nodes.ethereum
        .filter((n) => n.status === Status.Started)
        .map(this.getInfo),
    );
  }
}
