// YapCraft <https://github.com/dada78641/yapcraft-server>
// © MIT license

/**
 * TTS kill switch event.
 * 
 * This kills whatever TTS message is playing by this ID.
 */
export interface tts_killswitch_data {
  id: string;
  queue: string;
};

export interface tts_killswitch {
  realm: 'tts_killswitch';
  data: tts_killswitch_data;
};
