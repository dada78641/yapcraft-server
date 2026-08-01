// YapCraft <https://github.com/dada78641/yapcraft-server>
// © MIT license

import {type webamp_action_data} from '@yapcraft/tasks/events/webamp_action.ts'
import {server} from '@yapcraft/server/index.ts';

export default new class WinampNextTrigger {
  public readonly name = 'winamp_next';
  public readonly type = 'trigger';
  public readonly sceneItem = 'WinampNext';

  public callbackHandler() {
    server.obs.sendRealmEvent<webamp_action_data>('webamp_action', {action: 'next'});
  }
}
