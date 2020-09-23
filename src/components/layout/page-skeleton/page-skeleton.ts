import { Component, Vue } from 'vue-property-decorator';
import WithRender from './page-skeleton.html';
import { NavBar } from '@/components/partials/nav-bar';
import { Footer as Foot } from '@/components/partials/footer';
import { system } from '@/store';

@WithRender
@Component({
  components: {
    NavBar,
    Foot,
  },
})
export class PageSkeleton extends Vue {
  get initialized() {
    return system.initialized;
  }
}
