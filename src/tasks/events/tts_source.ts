// YapCraft <https://github.com/dada78641/yapcraft-server>
// © MIT license

import {createAudioEventData} from '@yapcraft/services/tts/events.ts';
import {type tts_audio_data} from '@yapcraft/tasks/events/tts_audio.ts';
import {eventHandler} from '@yapcraft/lib/tasks/index.ts';
import {server} from '@yapcraft/server/index.ts';

/**
 * TTS source event, which is sent when a user redeems the TTS reward.
 * 
 * The purpose of this event is to prep all data needed to be able to send the tts_audio event.
 */
export interface tts_source_data {
  id: string
  meta: {
    colors: {a: string, b: string}
    html: {message: string, username: string}
  }
  queue: string
  seed: string
  text: string
  type: 'remote' | 'local'
};

export interface tts_source {
  realm: 'tts_source'
  data: tts_source_data
};

export default eventHandler<tts_source_data>(
  'tts_source',
  async function(eventData) {
    const utterance = await server.services.tts.getUtterance(eventData.text, eventData.seed, eventData.type);
    const data = createAudioEventData(eventData.id, eventData.text, eventData.seed, eventData.type, eventData.meta.colors.a, eventData.meta.colors.b, eventData.meta.html.message, eventData.meta.html.username, utterance);
    server.obs.sendRealmEvent<tts_audio_data>('tts_audio', data);
  }
);
