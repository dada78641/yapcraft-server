// YapCraft <https://github.com/dada78641/yapcraft-server>
// © MIT license

import {RedemptionHandler, RedemptionEvent, RedemptionMessage} from '@yapcraft/lib/tasks/index.ts';
import {pickUserColor, createHTMLStubs, getCleanMessage} from '@yapcraft/services/tts/meta.ts';
import {createSourceEventData, createAudioEventData} from '@yapcraft/services/tts/events.ts';
import {type tts_audio_data} from '@yapcraft/tasks/events/tts_audio.ts';
import {type tts_killswitch_data} from '@yapcraft/tasks/events/tts_killswitch.ts';
import {server} from '@yapcraft/server/index.ts';
import {sleep} from '@yapcraft/util/data.ts';

// In the past, we would send TTS events from the chat widget.
// The chat widget would detect the redemption and send the event along with
// the user's chat message, as a tts_source event, which then gets upgraded
// to tts_audio by the backend.
// These days we don't do that anymore, since we directly handle the redemption
// event using the Twitch API. So we can send a tts_audio event right away.
const SEND_SOURCE_EVENT = false;

export default new class TTSRedemption implements RedemptionHandler {
  public readonly name = 'tts';
  public readonly rewardIDs = {
    // Speak My Message
    '4d8503fa-19be-434f-8198-dea2b30b9bff': 'speakMyMessage',
    // Apple Notification
    '2658cb97-11ed-47c9-b704-29c436716bcd': 'speakMyMessageLocal',
  };
  public readonly requiresTextInput = true;

  /**
   * Handles the redemption.
   * 
   * In this redemption handler, all we do is send on a tts_source event.
   * This event will then get handled further by the tts_source code.
   */
  public async runRedemption(ev: RedemptionEvent, msg: RedemptionMessage | null, rewardName: string) {
    const type = rewardName === 'speakMyMessageLocal' ? 'local' : 'remote';
    const cleanMessage = getCleanMessage(msg!.parts);
    const color = pickUserColor(ev.user.name, ev.broadcaster.name);
    const html = createHTMLStubs(ev.user.name, color, msg!.parts);

    if (SEND_SOURCE_EVENT) {
      // We don't do this anymore, but we can get the same result by going through tts_source.
      const data = createSourceEventData(ev.id, cleanMessage, ev.user.name, type, color[0], color[1], html.messageStub, html.usernameStub);
      return server.obs.sendRealmEvent('tts_source', data);
    }
    else {
      // Generate the utterance and send it as tts_audio right away.
      const utterance = await server.services.tts.getUtterance(cleanMessage, ev.user.name, type);
      const data = createAudioEventData(ev.id, cleanMessage, ev.user.name, type, color[0], color[1], html.messageStub, html.usernameStub, utterance);
      server.obs.sendRealmEvent<tts_audio_data>('tts_audio', data);
    }
  }
};
