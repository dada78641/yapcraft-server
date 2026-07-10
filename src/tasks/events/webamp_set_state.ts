// YapCraft <https://github.com/dada78641/yapcraft-server>
// © MIT license

export type webamp_set_state_data = {
  shuffle?: boolean,
  repeat?: 'track' | 'playlist' | false,
  layout?: 'large' | 'medium' | 'medium-minus' | 'small' | 'default',
  skin?: {url: string} | null,
};

export interface webamp_set_state {
  realm: 'webamp_set_state',
  data: webamp_set_state_data,
};
