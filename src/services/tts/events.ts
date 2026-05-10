// YapCraft <https://github.com/dada78641/yapcraft-server>
// © MIT license

import {type ResponseUtteranceData} from '@dada78641/sayserver';
import type {tts_source_data} from '@yapcraft/tasks/events/tts_source.ts';
import type {tts_audio_data} from '@yapcraft/tasks/events/tts_audio.ts';

/**
 * Returns the data for a tts_source event.
 */
export function createSourceEventData(
  uuid: string,
  text: string,
  username: string,
  type: tts_source_data['type'],
  colorA: string,
  colorB: string,
  messageStub: string,
  usernameStub: string,
): tts_source_data {
  return {
    id: uuid,
    text,
    seed: username,
    meta: {
      colors: {a: colorA, b: colorB},
      html: {message: messageStub, username: usernameStub},
    },
    queue: 'chat:unqueued',
    type,
  }
}

/**
 * Returns the data for a tts_audio event.
 */
export function createAudioEventData(
  uuid: string,
  text: string,
  username: string,
  type: tts_source_data['type'],
  colorA: string,
  colorB: string,
  messageStub: string,
  usernameStub: string,
  utterance: ResponseUtteranceData,
): tts_audio_data {
  return {
    id: uuid,
    text,
    seed: username,
    meta: {
      colors: {a: colorA, b: colorB},
      html: {message: messageStub, username: usernameStub},
      voice: utterance.utterance.resolvedVoice,
    },
    audio: {
      buffer: utterance.audio,
      encoding: 'base64',
      meta: utterance.metadata,
    },
    queue: 'chat:unqueued',
    type,
  }
}
