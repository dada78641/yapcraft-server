// YapCraft <https://github.com/dada78641/yapcraft-server>
// © MIT license

import {type SceneItem} from '@dada78641/strim-obstools';
import {server} from '@yapcraft/server/index.ts';

export default new class EsportsLogoTrigger {
  public readonly name = 'esports_logo';
  public readonly type = 'toggle';
  public readonly sceneItem = 'EsportsLogo';

  public callbackHandler(value: boolean) {
    this.toggleEsportsLogo(value);
  }

  public async toggleEsportsLogo(value: boolean) {
    const scenes = await server.obs.findScenes({tag: {key: 'EsportsLogo'}});
    const items = await server.obs.obs.call('GetSceneItemList', {sceneUuid: scenes[0].sceneUuid}) as unknown as {sceneItems: SceneItem[]};
    await server.obs.obs.callBatch(items.sceneItems.map(
      item => ({
        requestType: 'SetSceneItemEnabled',
        requestData: {
          sceneUuid: scenes[0].sceneUuid,
          sceneItemId: item.sceneItemId,
          sceneItemEnabled: value,
        }
      })
    ));
  }
}
