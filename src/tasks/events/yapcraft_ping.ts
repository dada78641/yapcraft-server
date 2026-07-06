// YapCraft <https://github.com/dada78641/yapcraft-server>
// © MIT license

import {getPongResponse, type yapcraft_pong_data} from '@yapcraft/tasks/events/yapcraft_pong.ts';
import {eventHandler} from '@yapcraft/lib/tasks/index.ts';
import {server} from '@yapcraft/server/index.ts';

/**
 * Ping request event.
 */
export interface yapcraft_ping_data {};

export interface yapcraft_ping {
  realm: 'yapcraft_ping'
  data: yapcraft_ping_data
};

export default eventHandler<yapcraft_ping_data>(
  'yapcraft_ping',
  async function(eventData) {
    server.obs.sendRealmEvent<yapcraft_pong_data>('yapcraft_pong', getPongResponse());
  },
  {
    silent: true
  },
);
