import { Component, Vue, Prop } from 'vue-property-decorator';
import WithRender from './node-drawer.html';
import { CommonNode, EthereumNode, BitcoinNode } from '@/types';
import { CopyButton } from '../copy-button';
import {
  BITCOIN_CREDENTIALS,
  ETHEREUM_ACCOUNTS,
  getContainerName,
  CONTRACT_ARTIFACTS_URL,
} from '@/lib';
import { system, bitcoind, ethereum } from '@/store';

@WithRender
@Component({
  components: {
    CopyButton,
  },
})
export class NodeDrawer extends Vue {
  @Prop({ type: Object, required: false })
  public node: CommonNode;

  @Prop({ type: Function, required: true })
  public onClose: () => void;

  public ethereumMining = false;
  public ethereumMineBlockCount = 1;

  public bitcoinMining = false;
  public bitcoinMineBlockCount = 1;

  get titleCase() {
    return this.node?.type === 'ecdsa' ? 'uppercase' : 'startcase';
  }

  get bitcoinCredentials() {
    return BITCOIN_CREDENTIALS;
  }

  get bitcoinBlockHeight() {
    return bitcoind.nodes[this.node.name]?.chainInfo?.blocks ?? 'Unknown';
  }

  get ethereumAccounts() {
    return ETHEREUM_ACCOUNTS;
  }

  get ethereumBlockHeight() {
    return ethereum.nodes[this.node.name]?.blockHeight ?? 'Unknown';
  }

  public async openContainerLogs() {
    const url = `logs/${getContainerName(this.node)}`;
    await system.openWindow(url);
  }

  public async downloadContractArtifacts() {
    await system.downloadFile(CONTRACT_ARTIFACTS_URL);
  }

  public async mineEthereumBlocks(node: EthereumNode) {
    try {
      this.ethereumMining = true;
      await ethereum.mine({
        node,
        blocks: this.ethereumMineBlockCount,
      });
    } catch (error) {
      system.notify({ message: 'Ethereum block mining failed', error });
    } finally {
      this.ethereumMining = false;
    }
  }

  public async mineBitcoinBlocks(node: BitcoinNode) {
    try {
      this.bitcoinMining = true;
      await bitcoind.mine({
        node,
        blocks: this.bitcoinMineBlockCount,
      });
    } catch (error) {
      system.notify({ message: 'Bitcoin block mining failed', error });
    } finally {
      this.bitcoinMining = false;
    }
  }
}
