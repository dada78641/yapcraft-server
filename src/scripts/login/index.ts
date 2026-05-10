// YapCraft <https://github.com/dada78641/yapcraft-server>
// © MIT license

import open from 'open';
import {ensureEnvPaths} from '@yapcraft/util/env.ts';
import {getConfig, type YapConfig} from '@yapcraft/util/config.ts';
import {createLoginApp} from './login.ts';

async function getAppConfig(): Promise<YapConfig> {
  try {
    console.log(`Starting Twitch login flow.`);
    const config = await getConfig();
    return config;
  }
  catch {
    console.error('Set up a config file at ~/.config/yapcraft/config.json per the readme.');
    process.exit(1);
  }
}

async function main() {
  await ensureEnvPaths();
  const config = await getAppConfig();
  const app = await createLoginApp(config.twitch);
  await open(app.loginURL);
}

main();
