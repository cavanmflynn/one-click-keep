import { Component, Vue, Prop } from 'vue-property-decorator';
import WithRender from './contract-address-modal.html';
import { CONTRACTS } from '@/lib';
import { startCase, sortBy } from 'lodash';

@WithRender
@Component
export class ContractAddressModal extends Vue {
  @Prop({ type: Boolean, default: false })
  public visible: boolean;
  @Prop({ type: Function, required: true })
  public handleCloseModal: boolean;

  public contracts = sortBy(
    Object.values(CONTRACTS.KEEP)
      .map((groups) => {
        return Object.entries(groups).map(([name, { ADDRESS }]) => {
          return {
            name: startCase(name),
            address: ADDRESS,
          };
        });
      })
      .flat(),
    ['name'],
  );
  public columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      scopedSlots: { customRender: 'name' },
    },
    {
      title: 'Address',
      dataIndex: 'address',
    },
  ];
}
