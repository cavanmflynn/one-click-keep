// Import all supported locales
import 'dayjs/locale/en';

import { LANGUAGE_TO_LOCALE } from '@/localization';
import { ValidLanguage } from '@/types';
import dayjs from 'dayjs';
import { Module, Mutation, VuexModule } from 'vuex-module-decorators';
import { store } from '../store';

@Module({ store, name: 'system', dynamic: true, namespaced: true })
export class SystemModule extends VuexModule {
  private _language: ValidLanguage = 'en';

  public get language() {
    return this._language;
  }

  @Mutation
  public setLanguage(language: ValidLanguage) {
    dayjs.locale(LANGUAGE_TO_LOCALE[language]);
    this._language = language;
  }
}
