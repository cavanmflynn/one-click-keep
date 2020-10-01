import { Component, Vue, Prop } from 'vue-property-decorator';
import WithRender from './node-card.html';
import { CommonNode } from '@/types';

@WithRender
@Component
export class NodeCard extends Vue {
  @Prop({ type: Object, required: true })
  public node: CommonNode;

  @Prop({ type: Boolean, required: true })
  public disabled: boolean;

  get titleCase() {
    return this.node?.type === 'ecdsa' ? 'uppercase' : 'startcase';
  }

  get cardStyle() {
    if (this.disabled) {
      return {
        opacity: '0.65',
        cursor: 'not-allowed',
      };
    }
  }
}
