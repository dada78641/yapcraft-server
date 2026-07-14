// YapCraft <https://github.com/dada78641/yapcraft-server>
// © MIT license

import {type Track} from 'webamp';

export type webamp_tracks_data = {
  tracks: Track[],
  action: 'replace' | 'replace_and_play' | 'enqueue',
};

export interface webamp_tracks {
  realm: 'webamp_tracks',
  data: webamp_tracks_data,
};
