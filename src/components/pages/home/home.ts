import { DetectDockerModal } from '@/components/partials/detect-docker-modal';
import { NetworkCard } from '@/components/partials/network-card';
import { GetStarted } from '@/components/partials/get-started';
import { Component, Vue } from 'vue-property-decorator';
import WithRender from './home.html';
import { system, network } from '@/store';

@WithRender
@Component({
  components: {
    GetStarted,
    NetworkCard,
    DetectDockerModal,
  },
})
export default class Home extends Vue {
  get initialized() {
    return system.initialized;
  }

  get networks() {
    return network.networks;
  }
}
