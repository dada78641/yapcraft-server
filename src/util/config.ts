// YapCraft <https://github.com/dada78641/yapcraft-server>
// © MIT license

import * as path from 'node:path';
import * as fs from 'node:fs/promises';
import {env} from './env.ts';

export interface TwitchConfig {
  userID: string;
  clientID: string;
  clientSecret: string;
  redirectURI: string;
}

export interface ObsConfig {
  address: string;
  password: string;
}

export interface ServicesConfig {
  bw: {
    cwal: {
      address: string;
      apiKey: string;
    };
  };
  tts: {
    sayserver: {
      address: string;
    };
  };
}

export interface YapConfig {
  twitch: TwitchConfig;
  obs: ObsConfig;
  services: ServicesConfig;
}

/**
 * Returns the path to the config file.
 */
function getConfigPath() {
  return path.join(env.config, 'config.json');
}

/**
 * Returns the path to lock.
 */
export async function getConfig(): Promise<YapConfig> {
  const config = await fs.readFile(getConfigPath(), 'utf8');
  const configData = JSON.parse(config);
  return configData;
}
