// YapCraft <https://github.com/dada78641/yapcraft-server>
// © MIT license

import {type tts_killswitch_current_data} from '@yapcraft/tasks/events/tts_killswitch_current.ts'
import {server} from '@yapcraft/server/index.ts';

export default new class KillLastTTSTrigger {
  public readonly name = 'kill_last_tts';
  public readonly type = 'trigger';
  public readonly sceneItem = 'KillLastTTS';

  public callbackHandler() {
    server.obs.sendRealmEvent<tts_killswitch_current_data>('tts_killswitch_current', {});
  }
}
