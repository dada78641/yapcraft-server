// YapCraft <https://github.com/dada78641/yapcraft-server>
// © MIT license

import {type TaskHandlers} from '@yapcraft/lib/tasks/tasks.ts';
import tts_source from '@yapcraft/tasks/events/tts_source.ts';
import bw_rank_get from '@yapcraft/tasks/events/bw_rank_get.ts';
import stream_countdown_get from '@yapcraft/tasks/events/stream_countdown_get.ts';
import stream_countdown_set from '@yapcraft/tasks/events/stream_countdown_set.ts';
import stream_title_get from '@yapcraft/tasks/events/stream_title_get.ts';
import stream_title_set from '@yapcraft/tasks/events/stream_title_set.ts';
import yapcraft_ping from '@yapcraft/tasks/events/yapcraft_ping.ts';
import TTSRedemption from '@yapcraft/tasks/redemptions/tts.ts';

/**
 * Returns all tasks.
 */
export function getTaskHandlers(): TaskHandlers {
  return {
    redemptionTasks: [
      TTSRedemption,
    ],
    eventHandlers: [
      tts_source,
      bw_rank_get,
      stream_countdown_get,
      stream_countdown_set,
      stream_title_get,
      stream_title_set,
      yapcraft_ping,
    ],
  };
}
