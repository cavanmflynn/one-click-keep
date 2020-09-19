import { LANGUAGE_TO_LOCALE, languageLibrary } from '@/localization';

//#region Localization

export type ValidLanguage = keyof typeof LANGUAGE_TO_LOCALE;

export type TranslationKey = keyof typeof languageLibrary['en']['keys'];

export type Substitutions<TKey extends TranslationKey> = Parameters<
  Required<typeof languageLibrary['en']['messages']>[TKey]['toString']
> extends never
  ? [void]
  : Parameters<
      Required<typeof languageLibrary['en']['messages']>[TKey]['toString']
    >;

//#endregion
