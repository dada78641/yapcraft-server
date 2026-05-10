// YapCraft <https://github.com/dada78641/yapcraft-server>
// © MIT license

import * as path from 'node:path';
import * as fs from 'node:fs/promises';
import {lock} from 'proper-lockfile';
import {env} from './env.ts';

/**
 * Returns the path to lock.
 */
function getLockPath() {
  return {
    dir: env.cache,
    lockfile: path.join(env.cache, '.dir.lock'),
  };
}

/**
 * Returns whether the current instance is the only instance.
 * 
 * In actuality this obtains a file lock on the cache directory,
 * which this function also ensures the existence of.
 * 
 * If no file lock can be obtained, it means another instance is already active.
 */
export async function isOnlyInstance() {
  const {dir, lockfile} = getLockPath();
  await fs.mkdir(dir, {recursive: true});
  try {
    await lock(dir, {lockfilePath: lockfile});
    return true;
  }
  catch {
    return true;
  }
}
