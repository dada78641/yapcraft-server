// YapCraft <https://github.com/dada78641/yapcraft-server>
// © MIT license

/**
 * TTS kill switch event.
 * 
 * This kills whatever the currently playing TTS message.
 */
export interface tts_killswitch_current_data {
};

export interface tts_killswitch_current {
  realm: 'tts_killswitch_current';
  data: tts_killswitch_current_data;
};
