import { Component, Vue } from 'vue-property-decorator';
import '../scss/main.scss';
import WithRender from './app.html';
import { PageSkeleton } from './layout/page-skeleton';
import { system } from '@/store';

@WithRender
@Component({
  components: {
    PageSkeleton,
  },
})
export default class App extends Vue {
  async created() {
    await system.initialize();
  }
}
