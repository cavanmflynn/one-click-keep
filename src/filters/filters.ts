import { LanguageService } from '@/services';
import { TranslationKey } from '@/types';
import Container from 'typedi';
import Vue from 'vue';

/**
 * Retrieve and format the translation for the specified translation key
 */
Vue.filter(
  'translate',
  <TKey extends TranslationKey>(
    translationKey: TKey,
    substitutions: unknown,
  ) => {
    if (!translationKey) return '';
    return Container.get(LanguageService).translate(
      translationKey,
      substitutions,
    );
  },
);

/**
 * Convert the passed value to a lowercase string
 */
Vue.filter('lowercase', (value: string | number) => {
  if (!value) return '';
  return String(value).toLowerCase();
});

/**
 * Convert the passed value to an uppercase string
 */
Vue.filter('uppercase', (value: string | number) => {
  if (!value) return '';
  return String(value).toUpperCase();
});
