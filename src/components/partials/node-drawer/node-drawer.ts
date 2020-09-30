import { Component, Vue, Prop } from 'vue-property-decorator';
import WithRender from './node-drawer.html';
import { CommonNode, EthereumNode, BitcoinNode } from '@/types';
import { CopyButton } from '../copy-button';
import {
  BITCOIN_CREDENTIALS,
  ETHEREUM_ACCOUNTS,
  getContainerName,
  ethereumService,
  delay,
  bitcoindService,
} from '@/lib';
import { system } from '@/store';

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

  get ethereumAccounts() {
    return ETHEREUM_ACCOUNTS;
  }

  public async openContainerLogs() {
    const url = `logs/${getContainerName(this.node)}`;
    await system.openWindow(url);
  }

  public async mineEthereumBlocks(node: EthereumNode) {
    try {
      this.ethereumMining = true;
      await Promise.all([
        ethereumService.mine(this.ethereumMineBlockCount, node),
        delay(1000),
      ]);
    } catch (error) {
      system.notify({ message: 'Ethereum block mining failed', error });
    } finally {
      this.ethereumMining = false;
    }
  }

  public async mineBitcoinBlocks(node: BitcoinNode) {
    try {
      this.bitcoinMining = true;
      await Promise.all([
        bitcoindService.mine(this.bitcoinMineBlockCount, node),
        delay(1000),
      ]);
    } catch (error) {
      system.notify({ message: 'Bitcoin block mining failed', error });
    } finally {
      this.bitcoinMining = false;
    }
  }
}
