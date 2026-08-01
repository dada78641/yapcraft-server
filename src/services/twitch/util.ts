// YapCraft <https://github.com/dada78641/yapcraft-server>
// © MIT license

import {type HelixStream} from '@twurple/api';
import {type StreamStateData} from './types.ts';

/**
 * Converts a HelixStream response object into a plain object.
 */
export function wrapStreamStateData(stream: HelixStream | null): StreamStateData {
  if (stream === null) {
    return {
      isLive: false,
      viewers: 0,
      streamTitle: '',
      streamTags: [],
      userName: '',
      gameName: '',
      gameId: '',
      startDate: '',
    };
  }
  return {
    isLive: true,
    viewers: stream.viewers,
    streamTitle: stream.title,
    streamTags: stream.tags,
    userName: stream.userDisplayName,
    gameName: stream.gameName,
    gameId: stream.gameId,
    startDate: new Date(stream.startDate).toISOString(),
  };
}
