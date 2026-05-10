// YapCraft <https://github.com/dada78641/yapcraft-server>
// © MIT license

import {type Voice} from '@dada78641/sayserver';
import {eventHandler} from '@yapcraft/lib/tasks/index.ts';

/**
 * TTS audio event, which can be picked up by the TTS widget to play back.
 * 
 * This event contains all of the data needed to actually play the message.
 * We don't do anything with it on the backend.
 */
export interface tts_audio_data {
  id: string
  audio: {
    buffer: string
    encoding: string
    meta: {
      duration: number
      size: number
      formatName: string
      codecName: string
      sampleRate: number
      channels: number
      channelLayout: string
    }
  }
  meta: {
    colors: {a: string, b: string}
    html: {message: string, username: string}
    voice: Voice
  }
  queue: string
  seed: string
  text: string
  type: 'remote' | 'local'
}

export interface tts_audio {
  realm: 'tts_audio'
  data: tts_audio_data
};

export {type Voice};
