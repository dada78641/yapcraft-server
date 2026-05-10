// YapCraft <https://github.com/dada78641/yapcraft-server>
// © MIT license

import {type BWProfileFound, type BWProfileNotFound} from '@dada78641/strim-bwinfo';

/**
 * Brood War rank event.
 * 
 * This includes all the current rank information needed to display the rank widget.
 */
export interface bw_rank_data {
  profile: BWProfileFound | BWProfileNotFound;
};

export interface bw_rank {
  realm: 'bw_rank'
  data: bw_rank_data
};
