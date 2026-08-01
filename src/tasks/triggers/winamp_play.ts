// YapCraft <https://github.com/dada78641/yapcraft-server>
// © MIT license

import {type webamp_action_data} from '@yapcraft/tasks/events/webamp_action.ts'
import {server} from '@yapcraft/server/index.ts';

export default new class WinampPlayTrigger {
  public readonly name = 'winamp_play';
  public readonly type = 'toggle';
  public readonly sceneItem = 'WinampPlay';

  public callbackHandler(value: boolean) {
    this.togglePlayPause(value);
  }

  public async togglePlayPause(value: boolean) {
    const action = value ? 'play' : 'pause';
    server.obs.sendRealmEvent<webamp_action_data>('webamp_action', {action});
  }
}
