import { DetectDockerModal } from '@/components/partials/detect-docker-modal';
import { GetStarted } from '@/components/partials/get-started';
import { Component, Vue } from 'vue-property-decorator';
import WithRender from './home.html';
import { system } from '@/store';

@WithRender
@Component({
  components: {
    DetectDockerModal,
    GetStarted,
  },
})
export default class Home extends Vue {
  get initialized() {
    return system.initialized;
  }
}
