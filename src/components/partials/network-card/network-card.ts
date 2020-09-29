import { Component, Vue, Prop } from 'vue-property-decorator';
import WithRender from './network-card.html';
import { Network, BadgeStatus, Status } from '@/types';
import { system } from '@/store';

@WithRender
@Component
export class NetworkCard extends Vue {
  @Prop({ type: Object, required: true })
  public network: Network;

  public badgeStatuses: BadgeStatus = {
    [Status.Starting]: 'processing',
    [Status.Started]: 'success',
    [Status.Stopping]: 'processing',
    [Status.Stopped]: 'default',
    [Status.Error]: 'error',
  };

  navigateToNetwork() {
    system.navigateToNetwork(this.network.id);
  }
}
