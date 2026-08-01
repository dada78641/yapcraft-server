// YapCraft <https://github.com/dada78641/yapcraft-server>
// © MIT license

export interface StreamStateData {
  isLive: boolean,
  viewers: number,
  streamTitle: string,
  streamTags: string[],
  userName: string,
  gameName: string,
  gameId: string,
  startDate: string,
};
