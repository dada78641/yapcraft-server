// YapCraft <https://github.com/dada78641/yapcraft-server>
// © MIT license

import {type stream_title_data} from './stream_title.ts';
import {eventHandler} from '@yapcraft/lib/tasks/index.ts';
import {server} from '@yapcraft/server/index.ts';

/**
 * Stream title request event.
 */
export interface stream_title_get_data {};

export interface stream_title_get {
  realm: 'stream_title_get'
  data: stream_title_get_data
};

/**
 * Ensures we always return some valid stream title data.
 * 
 * If our stream title has not been stored at all yet, we don't want to send null.
 * Instead we'll send some sensible defaults.
 */
function sanitizeStreamTitle(titleData: stream_title_data | null): stream_title_data {
  if (titleData != null) {
    return titleData;
  }
  return {
    lines: [
      {
        text: 'hello world',
        color: 'yellow',
        style: '3d',
      }
    ]
  };
}

export default eventHandler<stream_title_get_data>(
  'stream_title_get',
  async function(eventData) {
    const titleData = sanitizeStreamTitle(server.data.getKeyValue<stream_title_data>('stream_title'));
    server.obs.sendRealmEvent<stream_title_data>('stream_title', titleData);
  }
);
