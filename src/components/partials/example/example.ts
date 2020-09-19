import { example } from '@/store';
import { Component, Prop, Vue } from 'vue-property-decorator';
import WithRender from './example.html';

@WithRender
@Component
export class Example extends Vue {
  @Prop() public msgKey: string;

  // Module usage example
  public e = example;
}
