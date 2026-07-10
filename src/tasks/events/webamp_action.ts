// YapCraft <https://github.com/dada78641/yapcraft-server>
// © MIT license

export type webamp_action_data = {
  action: 'previous' | 'play' | 'pause' | 'stop' | 'next'
};

export interface webamp_action {
  realm: 'webamp_action',
  data: webamp_action_data,
};
