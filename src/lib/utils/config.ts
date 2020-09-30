import { remote } from 'electron';
import { join } from 'path';
import { Network, NodeImplementation } from '@/types';
import { DOCKER_CONFIGS } from '../constants';

/**
 * Root path where application data is stored
 */
export const dataPath = remote
  ? join(remote.app.getPath('home'), '.one-click-keep')
  : '';

/**
 * Path where networks data is stored
 */
export const networksPath = join(dataPath, 'networks');

/**
 * Returns a path to store data for an individual node
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
