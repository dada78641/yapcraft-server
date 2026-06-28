// YapCraft <https://github.com/dada78641/yapcraft-server>
// © MIT license

import {server} from '@yapcraft/server/index.ts';
import {sleep} from '@yapcraft/util/promise.ts';
import {isOnlyInstance} from '@yapcraft/util/lockfile.ts';

async function main() {
  if (!(await isOnlyInstance())) {
    console.error('Another instance is already running.');
    process.exitCode = 1;
    return;
  }
  await server.initialize();
}

main();

export type * from './types.ts';
export * from './services/tts/index.ts';
