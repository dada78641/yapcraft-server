// YapCraft <https://github.com/dada78641/yapcraft-server>
// © MIT license

// This is a subset of the Track object from the Webamp codebase.
interface Track {
  id: number,
  artist?: string,
  title?: string,
  album?: string,
  url: string,
  duration: number | null,
};

export type webamp_state_data = {
  currentTrack: Track | null,
  currentStatus: 'PLAYING' | 'STOPPED' | 'PAUSED',
  shuffle: boolean,
  repeat: boolean,
  layout: 'large' | 'medium' | 'medium-minus' | 'small',
  skin: {url: string} | null,
  timestamp: string,
};

export interface webamp_state {
  realm: 'webamp_state',
  data: webamp_state_data,
};
