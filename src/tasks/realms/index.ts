// YapCraft <https://github.com/dada78641/yapcraft-server>
// © MIT license

import type * as realmTypes from './types.ts'
export type * from './types.ts';

type RealmEntry<T, Methods extends readonly string[]> = {
  methods: Methods
  _data?: T
}

function realm<T>() {
  return <const Methods extends readonly string[]>(methods: Methods): RealmEntry<T, Methods> => ({methods})
}

export const realms = {
  stream_title: realm<realmTypes.stream_title_data>()(['get', 'set']),
  stream_countdown: realm<realmTypes.stream_countdown_data>()(['get', 'set']),
  webamp_state: realm<realmTypes.webamp_state_data>()(['get', 'set']),
  bw_rank: realm<realmTypes.bw_rank_data>()(['get']),
} as const;
