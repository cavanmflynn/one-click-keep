import { remote } from 'electron';
import { join } from 'path';
import { Network, NodeImplementation } from '@/types';
import { DOCKER_CONFIGS } from '../constants';

/**
 * Root path where application data is stored
 */
export const dataPath = join(remote.app.getPath('home'), '.one-click-keep');

/**
 * Path where networks data is stored
 */
export const networksPath = join(dataPath, 'networks');

/**
 * returns a path to store dtat for an individual node
 */
export const nodePath = (
  network: Network,
  implementation: NodeImplementation,
  name: string,
): string =>
  join(
    network.path,
    'volumes',
    DOCKER_CONFIGS[implementation].volumeDirName,
    name,
  );
