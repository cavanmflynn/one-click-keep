import { KeepContracts } from './keep-contracts';

class Contracts {
  get keep() {
    return new KeepContracts();
  }
}

export const contracts = new Contracts();
