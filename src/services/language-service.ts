import { PluggableService } from '@/lib';
import { languageLibrary } from '@/localization';
import { system } from '@/store';
import { Substitutions, TranslationKey } from '@/types';
import { Service } from 'typedi';

declare module 'vue/types/vue' {
  interface Vue {
    $lang: LanguageService;
  }
}

@Service()
@PluggableService('lang')
export class LanguageService {
  /**
   * Translate keys from the language files reactively using the currently
   * selected language in Vuex system state.
   * @param translationKey The translation key to use
   * @param substitutions A map of substitutions to mrake in the translated
   * message. Keys are prefixed with `'%'` automatically. So `{ foo: 'bar' }`
   * would replace any instance of `'%foo'` with `'bar'` in the final message.
   */
  public translate<TKey extends TranslationKey>(
    translationKey?: TKey,
    ...substitutions: Substitutions<Exclude<TKey, ''>>
  ) {
    if (!translationKey) return '';
    const subs = substitutions[0] || {};

    // If the translation key is not defined, return it as the display text.
    if (!languageLibrary[system.language || 'en'].keys[translationKey]) {
      return translationKey;
    }

    return languageLibrary[system.language || 'en']
      .get(translationKey)
      .toString(subs);
  }
}
