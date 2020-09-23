import { shell } from 'electron';

/**
 * Open the passed URL in the browser
 * @param url The URL to open
 */
export const openInBrowser = (url: string) => shell.openExternal(url);
