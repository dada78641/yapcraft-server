// YapCraft <https://github.com/dada78641/yapcraft-server>
// © MIT license

import {type stream_countdown_data} from './stream_countdown.ts';
import {eventHandler} from '@yapcraft/lib/tasks/index.ts';
import {server} from '@yapcraft/server/index.ts';

/**
 * Stream countdown request event.
 */
export interface stream_countdown_get_data {};

export interface stream_countdown_get {
  realm: 'stream_countdown_get'
  data: stream_countdown_get_data
};

/**
 * Ensures we always return a valid date.
 */
function sanitizeStreamCountdown(countdownData: stream_countdown_data | null): stream_countdown_data {
  if (countdownData != null) {
    return countdownData;
  }
  const date = new Date();
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  date.setMilliseconds(0);
  return {date: date.toISOString()};
}

export default eventHandler<stream_countdown_get_data>(
  'stream_countdown_get',
  async function(eventData) {
    const countdownData = sanitizeStreamCountdown(server.data.getKeyValue<stream_countdown_data>('stream_countdown'));
    server.obs.sendRealmEvent<stream_countdown_data>('stream_countdown', countdownData);
  }
);
