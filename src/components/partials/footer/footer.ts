import { Component, Vue } from 'vue-property-decorator';
import WithRender from './footer.html';
import { system } from '@/store';

@WithRender
@Component
export class Footer extends Vue {
  get dockerVersion() {
    return system.dockerVersions.docker;
  }

  get composeVersion() {
    return system.dockerVersions.compose;
  }
}
