// YapCraft <https://github.com/dada78641/yapcraft-server>
// © MIT license

import {type stream_state_data} from './stream_state.ts';
import {type StreamStateData} from '@yapcraft/services/twitch/index.ts'
import {eventHandler} from '@yapcraft/lib/tasks/index.ts';
import {server} from '@yapcraft/server/index.ts';

/**
 * Stream state request event.
 */
export interface stream_state_get_data {};

export interface stream_state_get {
  realm: 'stream_state_get',
  data: stream_state_get_data,
};

/**
 * Wraps the stream state data into the format required for the event.
 */
function wrapStreamState(streamStateData: StreamStateData): stream_state_data {
  const liveDate = streamStateData.isLive ? new Date(streamStateData.startDate).toISOString() : null;
  return {
    stream: {
      live: streamStateData.isLive,
      viewers: streamStateData.viewers,
      title: streamStateData.streamTitle,
      tags: streamStateData.streamTags,
      liveSince: liveDate,
    },
    user: {
      name: streamStateData.userName,
    },
    game: {
      id: streamStateData.gameId,
      name: streamStateData.gameName,
    },
  };
}

export default eventHandler<stream_state_get_data>(
  'stream_state_get',
  async function(eventData) {
    const stateData = await server.services.twitch.getStreamState();
    server.obs.sendRealmEvent<stream_state_data>('stream_state', wrapStreamState(stateData));
  },
  {
    silent: true
  },
);
