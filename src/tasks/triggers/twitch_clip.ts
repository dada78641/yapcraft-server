// YapCraft <https://github.com/dada78641/yapcraft-server>
// © MIT license

import {server} from '@yapcraft/server/index.ts';

export default new class TwitchClipTrigger {
  public readonly name = 'twitch_clip';
  public readonly type = 'trigger';
  public readonly sceneItem = 'TwitchClip';

  public callbackHandler() {
    console.log('todo trigger clip');
  }
}
