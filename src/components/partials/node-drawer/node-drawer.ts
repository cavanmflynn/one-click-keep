import { Component, Vue, Prop } from 'vue-property-decorator';
import WithRender from './node-drawer.html';
import { CommonNode, EthereumNode, BitcoinNode } from '@/types';
import { CopyButton } from '../copy-button';
import {
  BITCOIN_CREDENTIALS,
  ETHEREUM_ACCOUNTS,
  getContainerName,
  CONTRACT_ARTIFACTS_URL,
  ETHEREUM_MNEMONIC,
  ETHEREUM_PRIVATE_KEYS,
} from '@/lib';
import { system, bitcoind, ethereum } from '@/store';
import { ContractAddressModal } from '../contract-address-modal';

@WithRender
@Component({
  components: {
    CopyButton,
    ContractAddressModal,
  },
})
export class NodeDrawer extends Vue {
  @Prop({ type: Object, required: false })
  public node: CommonNode;

  @Prop({ type: Function, required: true })
  public onClose: () => void;

  public contractModalVisible = false;

  public ethereumMining = false;
  public ethereumMineBlockCount = 1;

  public bitcoinMining = false;
  public bitcoinMineBlockCount = 1;
  public bitcoinSending = false;
  public bitcoinSendTo = '';
  public bitcoinSendAmount: number | null = null;

  get titleCase() {
    return this.node?.type === 'ecdsa' ? 'uppercase' : 'startcase';
  }

  get bitcoinCredentials() {
    return BITCOIN_CREDENTIALS;
  }

  get bitcoinBlockHeight() {
    return bitcoind.nodes[this.node.name]?.chainInfo?.blocks ?? 'Unknown';
  }

  get ethereumMnemonic() {
    return ETHEREUM_MNEMONIC;
  }

  get ethereumAccounts() {
    return ETHEREUM_ACCOUNTS;
  }

  get ethereumPrivateKeys() {
    return ETHEREUM_PRIVATE_KEYS;
  }

  get ethereumBlockHeight() {
    return ethereum.nodes[this.node.name]?.blockHeight ?? 'Unknown';
  }

  public async openContainerLogs() {
    const url = `logs/${getContainerName(this.node)}`;
    await system.openWindow(url);
  }

  public openContractsModal() {
    this.contractModalVisible = true;
  }

  public closeContractsModal() {
    this.contractModalVisible = false;
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
      this.bitcoinMineBlockCount = 1;
    } catch (error) {
      system.notify({ message: 'Bitcoin block mining failed', error });
    } finally {
      this.bitcoinMining = false;
    }
  }

  public async sendBitcoin(node: BitcoinNode) {
    try {
      this.bitcoinSending = true;
      if (!this.bitcoinSendAmount) {
        this.$message.error('Please enter a send amount');
        return;
      }
      await bitcoind.sendFunds({
        node,
        toAddress: this.bitcoinSendTo,
        amount: this.bitcoinSendAmount,
      });
      this.bitcoinSendTo = '';
      this.bitcoinSendAmount = null;
      this.$message.success('Bitcoin sent!');
    } catch (error) {
      system.notify({ message: 'Failed to send bitcoin', error });
    } finally {
      this.bitcoinSending = false;
    }
  }
}
