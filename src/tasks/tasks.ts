// YapCraft <https://github.com/dada78641/yapcraft-server>
// © MIT license

import {type TaskHandlers} from '@yapcraft/lib/tasks/tasks.ts';
import tts_source from '@yapcraft/tasks/events/tts_source.ts';
import bw_rank_get from '@yapcraft/tasks/events/bw_rank_get.ts';
import stream_countdown_get from '@yapcraft/tasks/events/stream_countdown_get.ts';
import stream_countdown_set from '@yapcraft/tasks/events/stream_countdown_set.ts';
import stream_state_get from '@yapcraft/tasks/events/stream_state_get.ts';
import stream_title_get from '@yapcraft/tasks/events/stream_title_get.ts';
import stream_title_set from '@yapcraft/tasks/events/stream_title_set.ts';
import yapcraft_ping from '@yapcraft/tasks/events/yapcraft_ping.ts';
import TTSRedemption from '@yapcraft/tasks/redemptions/tts.ts';
import DisplayLutTrigger from '@yapcraft/tasks/triggers/display_lut.ts';
import EsportsLogoTrigger from '@yapcraft/tasks/triggers/esports_logo.ts';
import KillLastTTSTrigger from '@yapcraft/tasks/triggers/kill_last_tts.ts';
import StreamerCamTrigger from '@yapcraft/tasks/triggers/streamer_cam.ts';
import TwitchAdTrigger from '@yapcraft/tasks/triggers/twitch_ad.ts';
import TwitchClipTrigger from '@yapcraft/tasks/triggers/twitch_clip.ts';
import WinampNextTrigger from '@yapcraft/tasks/triggers/winamp_next.ts';
import WinampPlayTrigger from '@yapcraft/tasks/triggers/winamp_play.ts';
import WinampPreviousTrigger from '@yapcraft/tasks/triggers/winamp_previous.ts';

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
      stream_state_get,
      stream_title_get,
      stream_title_set,
      yapcraft_ping,
    ],
    triggerHandlers: [
      DisplayLutTrigger,
      EsportsLogoTrigger,
      KillLastTTSTrigger,
      StreamerCamTrigger,
      TwitchAdTrigger,
      TwitchClipTrigger,
      WinampNextTrigger,
      WinampPlayTrigger,
      WinampPreviousTrigger,
    ],
  };
}
