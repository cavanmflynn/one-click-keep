import { MessageCollection } from 'message-map';
import en from './languages/en.json';

export const LANGUAGE_TO_LOCALE = {
  en: 'en',
};

// Build a dictionary of MessageCollection instances from the `message-map` library
export const languageLibrary = {
  en: new MessageCollection(en),
};
