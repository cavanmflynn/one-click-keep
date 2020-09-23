import { Component, Vue } from 'vue-property-decorator';
import WithRender from './new-network.html';
import { WrappedFormUtils } from 'ant-design-vue/types/form/form';
import { AddNetworkArgs } from '@/types';
import { network } from '@/store';

@WithRender
@Component
export default class NewNetwork extends Vue {
  public loading = false;
  public form: WrappedFormUtils;

  public beforeCreate() {
    this.form = this.$form.createForm(this);
  }

  /**
   * Create a new KEEP Network
   * @param e The submit event
   */
  public createNetwork(e: Event) {
    e.preventDefault();
    this.form.validateFields(
      async (err: Error[], newNetwork: AddNetworkArgs) => {
        if (!err) {
          try {
            this.loading = true;
            const { id } = await network.add(newNetwork);
            this.$router.replace({
              name: 'network-view',
              params: {
                id: id.toString(),
              },
            });
          } catch (error) {
            this.$message.error(
              `Failed to create network with error: ${error.message}`,
            );
          } finally {
            this.loading = false;
          }
        }
      },
    );
  }
}
