import { Component, Vue } from 'vue-property-decorator';
import WithRender from './network-view.html';
import { network, system } from '@/store';
import { getNetworkById, openInBrowser } from '@/lib/utils';
import { Status, CommonNode } from '@/types';
import { NodeCard } from '../../partials/node-card';
import { NodeDrawer } from '../../partials/node-drawer';

@WithRender
@Component({
  components: {
    NodeCard,
    NodeDrawer,
  },
})
export default class NetworkView extends Vue {
  public selectedNode: CommonNode | null = null;
  public config: {
    [key: number]: {
      label: string;
      type: 'primary' | 'danger' | 'dashed' | 'ghost' | 'default';
      icon: string;
    };
  } = {
    [Status.Starting]: {
      label: 'Starting',
      type: 'primary',
      icon: '',
    },
    [Status.Started]: {
      label: 'Stop',
      type: 'danger',
      icon: 'stop',
    },
    [Status.Stopping]: {
      label: 'Stopping',
      type: 'default',
      icon: '',
    },
    [Status.Stopped]: {
      label: 'Start',
      type: 'primary',
      icon: 'play-circle',
    },
    [Status.Error]: {
      label: 'Restart',
      type: 'danger',
      icon: 'warning',
    },
  };

  get network() {
    return getNetworkById(network.networks, this.$route.params.id);
  }

  get isStarted() {
    return this.network.status === Status.Started;
  }

  get nodeList() {
    return Object.values(this.network.nodes).flat();
  }

  get loading() {
    return (
      this.network.status === Status.Starting ||
      this.network.status === Status.Stopping
    );
  }

  get started() {
    return this.network.status === Status.Started;
  }

  get button() {
    return this.config[this.network.status];
  }

  public async toggleNetwork() {
    network.toggle(this.network.id);
  }

  public async deleteNetwork() {
    this.$confirm({
      title: this.$lang.translate('NETWORK_DELETE_CONFIRM'),
      content: () => this.$lang.translate('NETWORK_DELETE_WARNING'),
      okText: this.$lang.translate('YES'),
      okType: 'danger',
      cancelText: this.$lang.translate('CANCEL'),
      onOk: async () => {
        try {
          const { id, name } = this.network;
          await network.remove(id);
          system.notify({
            message: this.$lang.translate('NETWORK_DELETE_SUCCESS', {
              name,
            }),
          });
          this.$router.replace('/');
        } catch (error) {
          system.notify({
            message: this.$lang.translate('NETWORK_DELETE_FAILED'),
            error,
          });
          throw error;
        }
      },
    });
  }

  public openTbtcDapp() {
    openInBrowser(`http://localhost:${this.network.apps.tbtc.ports.http}`);
  }

  public openKeepDashboard() {
    openInBrowser(`http://localhost:${this.network.apps.keep.ports.http}`);
  }

  public onNodeSelected(node: CommonNode) {
    if (!this.isStarted) {
      this.$message.warning('Start network to view node details');
      return;
    }
    this.selectedNode = node;
  }

  public onNodeDrawerClosed() {
    this.selectedNode = null;
  }
}
