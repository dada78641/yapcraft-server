// YapCraft <https://github.com/dada78641/yapcraft-server>
// © MIT license

import {Region} from '@dada78641/strim-bwinfo';
import {type bw_rank_data} from './bw_rank.ts';
import {eventHandler} from '@yapcraft/lib/tasks/index.ts';
import {server} from '@yapcraft/server/index.ts';

// Key-value data type for the player info.
export interface PlayerInfo {
  name: string
  region: number
};

/**
 * Brood War rank get event.
 * 
 * Simply says: please send me the bw_rank event.
 */
export interface bw_rank_get_data {};

export interface bw_rank_get {
  realm: 'bw_rank_get'
  data: bw_rank_get_data
};

/**
 * Returns the name of the player we're tracking.
 * 
 * Returns a sensible default if none is found.
 */
function getPlayerInfo(): PlayerInfo {
  const player = server.data.getKeyValue<PlayerInfo>('bw_rank_player');
  if (player == null) {
    return {name: 'Dada78641', region: Region.Europe};
  }
  return player;
}

export default eventHandler<bw_rank_get_data>(
  'bw_rank_get',
  async function(eventData) {
    const playerInfo = getPlayerInfo();
    const cachedPlayerRank = server.data.getKeyValue<bw_rank_data>(`bw_rank_data:${playerInfo.name} ${playerInfo.region}`, 25000);
    if (cachedPlayerRank != null) {
      return server.obs.sendRealmEvent<bw_rank_data>('bw_rank', cachedPlayerRank);
    }
    const profileData = await server.services.bw.getPlayerRank(playerInfo.name, playerInfo.region);
    server.obs.sendRealmEvent<bw_rank_data>('bw_rank', {profile: profileData});
  }
);
