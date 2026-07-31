// YapCraft <https://github.com/dada78641/yapcraft-server>
// © MIT license

import {server} from '@yapcraft/server/index.ts';

export default new class WebcamActiveTrigger {
  public readonly name = 'webcam_active';
  public readonly type = 'toggle';
  public readonly sceneItem = 'WebcamActive';

  public callbackHandler(value: boolean) {
    this.toggleWebcam(value);
  }

  public async toggleWebcam(value: boolean) {
    const webcamEmbeds = await server.obs.findSceneItems({tag: {key: 'WebcamEmbed'}});
    await server.obs.obs.callBatch(webcamEmbeds.map(
      webcamEmbed => ({
        requestType: 'SetSceneItemEnabled',
        requestData: {
          sceneUuid: webcamEmbed._scene?.sceneUuid,
          sceneItemId: webcamEmbed.sceneItemId,
          sceneItemEnabled: value,
        }
      })
    ));
  }
}
