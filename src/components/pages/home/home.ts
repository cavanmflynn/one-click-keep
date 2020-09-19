import { Example } from '@/components/partials/example';
import VueIcon from '@/images/ui-icons/vue.svg';
import { Component, Vue } from 'vue-property-decorator';
import WithRender from './home.html';

@WithRender
@Component({
  components: {
    Example,
    VueIcon,
  },
})
export default class Home extends Vue {}
