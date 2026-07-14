// YapCraft <https://github.com/dada78641/yapcraft-server>
// © MIT license

// Only some items can be set. The others are read-only.
export type webamp_state_set_data = {
  shuffle?: boolean,
  repeat?: boolean,
  layout?: 'large' | 'medium' | 'medium-minus' | 'small',
  skin?: {url: string} | null,
};

export interface webamp_state_set {
  realm: 'webamp_state_set'
  data: webamp_state_set_data
};

// Note that there is no callback here.
// This event is caught by the Webamp instance, and the data is not stored anywhere.
