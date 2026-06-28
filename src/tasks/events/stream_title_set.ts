// YapCraft <https://github.com/dada78641/yapcraft-server>
// © MIT license

import {type stream_title_data} from './stream_title.ts';
import {eventHandler} from '@yapcraft/lib/tasks/index.ts';
import {server} from '@yapcraft/server/index.ts';

/**
 * Stream title update event.
 */
export interface stream_title_set {
  realm: 'stream_title_set'
  data: stream_title_data
};

export default eventHandler<stream_title_data>(
  'stream_title_set',
  async function(eventData) {
    server.data.setKeyValue<stream_title_data>('stream_title', eventData);
    server.obs.sendRealmEvent<stream_title_data>('stream_title', eventData);
  }
);
