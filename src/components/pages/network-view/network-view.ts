import { Component, Vue } from 'vue-property-decorator';
import WithRender from './network-view.html';
import { network } from '@/store';
import { getNetworkById } from '@/lib/utils';
import { Status } from '@/types';

@WithRender
@Component
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
}
