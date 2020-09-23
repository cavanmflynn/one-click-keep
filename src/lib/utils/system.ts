import os from 'os';
import { Platform } from '@/types';

/**
 * A wrapper function to simplify os detection throughout the app
 */
export const getPlatform = () => {
  switch (os.platform()) {
    case 'darwin':
      return 'mac';
    case 'win32':
      return 'windows';
    case 'linux':
      return 'linux';
    default:
      return 'unknown';
  }
};

const is = (p: Platform) => p === getPlatform();

export const isMac = () => is('mac');

export const isWindows = () => is('windows');

export const isLinux = () => is('linux');
