import { Module, Mutation, VuexModule } from 'vuex-module-decorators';
import { store } from '../store';

@Module({ store, name: 'example', dynamic: true, namespaced: true })
export class ExampleModule extends VuexModule {
  private _counter = 0;

  public get count() {
    return this._counter;
  }

  @Mutation
  public increment() {
    this._counter++;
  }

  @Mutation
  public decrement() {
    this._counter--;
  }
}
