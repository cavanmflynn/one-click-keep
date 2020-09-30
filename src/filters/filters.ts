import { LanguageService } from '@/services';
import { TranslationKey, Status } from '@/types';
import Container from 'typedi';
import Vue from 'vue';
import { startCase, lowerCase, upperCase } from 'lodash';
import { ETHEREUM_ACCOUNTS } from '@/lib';

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
Vue.filter('lowercase', (value: string) => {
  return lowerCase(value);
});

/**
 * Convert the passed value to an uppercase string
 */
Vue.filter('uppercase', (value: string) => {
  return upperCase(value);
});

/**
 * Convert the passed value to a start case string
 */
Vue.filter('startcase', (value: string) => {
  return startCase(value);
});

/**
 * Get the name for the passed status
 */
Vue.filter('statusName', (status: Status) => {
  return Status[status];
});

/**
 * Get the color for the passed status
 */
Vue.filter('statusColor', (status: Status) => {
  const statusColors = {
    [Status.Starting]: 'blue',
    [Status.Started]: 'green',
    [Status.Stopping]: 'blue',
    [Status.Stopped]: 'gray',
    [Status.Error]: 'red',
  };
  return statusColors[status];
});

/**
 * Get the etheum address at the passed index
 */
Vue.filter('ethereumAddress', (index: string | number) => {
  return ETHEREUM_ACCOUNTS[index];
});

/**
 * Convert address to shorten address
 */
Vue.filter('shorten', (value: string) => {
  if (!value) {
    return '';
  }
  const val = String(value);
  return val.length > 16 ? `${val.slice(0, 8)}...${val.slice(-6)}` : val;
});
