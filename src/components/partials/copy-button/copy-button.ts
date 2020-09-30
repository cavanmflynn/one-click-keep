import { Component, Vue, Prop } from 'vue-property-decorator';
import WithRender from './copy-button.html';

@WithRender
@Component
export class CopyButton extends Vue {
  @Prop({ type: String, required: true })
  public copyText: string;

  @Prop({ type: String, required: false })
  public displayText: string;

  @Prop({ type: String, default: '13px' })
  public fontSize: string;

  @Prop({ type: Boolean, default: true })
  public showText: string;

  public onCopy() {
    this.$message.success('Copied to clipboard');
  }

  public onError() {
    this.$message.error('Unable to copy to clipboard');
  }
}
