import { getModule } from 'vuex-module-decorators';
import {
  NetworkModule,
  SystemModule,
  BitcoindModule,
  EthereumModule,
} from './modules';
import { store } from './store';

// Store Export
export { store } from './store';

// Module Exports
export const bitcoind = getModule(BitcoindModule, store);
export const ethereum = getModule(EthereumModule, store);
export const network = getModule(NetworkModule, store);
export const system = getModule(SystemModule, store);
