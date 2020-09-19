import { getModule } from 'vuex-module-decorators';
import { ExampleModule, SystemModule } from './modules';
import { store } from './store';

// Store Export
export { store } from './store';

// Module Exports
export const example = getModule(ExampleModule, store);
export const system = getModule(SystemModule, store);
