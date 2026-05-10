// YapCraft <https://github.com/dada78641/yapcraft-server>
// © MIT license

import * as fs from 'node:fs/promises';
import {createEnvPaths, type EnvPaths} from '@dada78641/env-paths';

// The global environment paths for YapCraft.
export const env: EnvPaths = createEnvPaths('yapcraft');

/**
 * Ensures that all relevant environment paths exist.
 */
export async function ensureEnvPaths() {
  await fs.mkdir(env.cache, {recursive: true});
  await fs.mkdir(env.config, {recursive: true});
}
