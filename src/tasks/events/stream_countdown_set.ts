// YapCraft <https://github.com/dada78641/yapcraft-server>
// © MIT license

import {type stream_countdown_data} from './stream_countdown.ts';
import {eventHandler} from '@yapcraft/lib/tasks/index.ts';
import {server} from '@yapcraft/server/index.ts';

/**
 * Stream countdown update event.
 */
export interface stream_countdown_set {
  realm: 'stream_countdown_set'
  data: stream_countdown_data
};

export default eventHandler<stream_countdown_data>(
  'stream_countdown_set',
  async function(eventData) {
    server.data.setKeyValue<stream_countdown_data>('stream_countdown', eventData);
    server.obs.sendRealmEvent<stream_countdown_data>('stream_countdown', eventData);
  }
);
