// YapCraft <https://github.com/dada78641/yapcraft-server>
// © MIT license

import {server} from '@yapcraft/server/index.ts';

export default new class TwitchAdTrigger {
  public readonly name = 'twitch_ad';
  public readonly type = 'trigger';
  public readonly sceneItem = 'TwitchAd';

  public callbackHandler() {
    server.services.twitch.runChannelAd();
  }
}
