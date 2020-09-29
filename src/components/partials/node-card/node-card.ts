import { Component, Vue, Prop } from 'vue-property-decorator';
import WithRender from './node-card.html';
import { CommonNode } from '@/types';

@WithRender
@Component
export class NodeCard extends Vue {
  @Prop({ type: Object, required: true })
  public node: CommonNode;

  @Prop({ type: String, default: 'startcase' })
  public titleCase: 'lowercase' | 'uppercase' | 'startcase';
}
