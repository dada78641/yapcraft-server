// YapCraft <https://github.com/dada78641/yapcraft-server>
// © MIT license

/**
 * Basic stream data.
 * 
 * This is displayed in the stream sidebar.
 */
export interface stream_state_data {
  stream: {
    title: string,
    tags: string[],
    live: boolean,
    viewers: number,
    liveSince: string | null,
  },
  user: {
    name: string,
  },
  game: {
    id: string,
    name: string,
  } | null,
};

export interface stream_state {
  realm: 'stream_state',
  data: stream_state_data,
};
