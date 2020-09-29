import { Component, Vue } from 'vue-property-decorator';
import WithRender from './network-view.html';
import { network, system } from '@/store';
import { getNetworkById } from '@/lib/utils';
import { Status } from '@/types';
import { NodeCard } from '../../partials/node-card';

@WithRender
@Component({
  components: {
    NodeCard,
  },
})
export default class NetworkView extends Vue {
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
}
