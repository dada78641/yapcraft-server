// YapCraft <https://github.com/dada78641/yapcraft-server>
// © MIT license

import {BWInfo, Region, type BWProfile} from '@dada78641/strim-bwinfo';
import {type ServicesConfig} from '@yapcraft/util/config.ts';
import {rejectAfter} from '@yapcraft/util/data.ts';
import {server} from '@yapcraft/server/index.ts';

const simulated: BWProfile = {
  id: 1234,
  profile: {
    battleTag: 'dada78641',
    country: 'KOR',
  },
  toon: {
    name: 'dada78641',
    region: 'KOR',
    rating: 1234,
    rank: 'E',
    wins: 12,
    losses: 9,
    disconnects: 1,
    season: 12,
  },
};

/**
 * Brood War service.
 * 
 * This is a basic wrapper for bwinfo, which makes API requests to cwal.gg.
 */
export class BWService {
  private config: ServicesConfig['bw'];
  public bwinfo: BWInfo;

  constructor() {
    this.config = server.config.services.bw;
    this.bwinfo = new BWInfo(this.config.cwal.address, this.config.cwal.apiKey, {ignoreSSLErrors: false});
  }

  /**
   * Returns the rank of a given player by name and region.
   */
  public async getPlayerRank(toon: string, region: number): Promise<BWProfile> {
    try {
      const res = await Promise.race([
        this.bwinfo.getProfile(toon, region),
        rejectAfter(5000),
      ]);
      return res as BWProfile;
    }
    catch (err: unknown) {
      return simulated;
    }
  }

  /**
   * Initializes the Brood War service.
   */
  public async initialize() {
  }
}
