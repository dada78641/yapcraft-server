// YapCraft <https://github.com/dada78641/yapcraft-server>
// © MIT license

import {type SourceFilterResult} from '@dada78641/strim-obstools';
import {server} from '@yapcraft/server/index.ts';

export default new class DisplayLutTrigger {
  public readonly name = 'display_lut';
  public readonly type = 'toggle';
  public readonly sceneItem = 'DisplayLut';

  public callbackHandler(value: boolean) {
    this.toggleLUT(value);
  }

  public async toggleLUT(value: boolean) {
    const sources = await server.obs.findSceneItems({tag: {key: 'DisplaySource'}});
    const filters = await server.obs.obs.call('GetSourceFilterList', {sourceUuid: sources[0].sourceUuid}) as unknown as SourceFilterResult;
    const lutFilter = filters.filters.find(filter => filter.filterName.includes('[[DisplayLut]]'));
    if (lutFilter == null) {
      console.error('No LUT filter found.');
      return;
    }
    await server.obs.obs.call(
      'SetSourceFilterEnabled',
      {
        sourceUuid: sources[0].sourceUuid,
        filterName: lutFilter.filterName,
        filterEnabled: value,
      },
    );
  }
}
