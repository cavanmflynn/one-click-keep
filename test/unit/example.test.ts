import { shallowMount } from '@vue/test-utils';
import { expect } from 'chai';
import { Example } from '../../src/components/partials/example';
import '../../src/filters';

describe('Example Component', () => {
  it('increments the counter when the + button is clicked', () => {
    const wrapper = shallowMount(Example, {
      propsData: { msgKey: '' },
    });
    wrapper.find('button').trigger('click');
    expect(wrapper.text()).to.include('1');
  });
});
