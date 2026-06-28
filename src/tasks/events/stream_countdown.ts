// YapCraft <https://github.com/dada78641/yapcraft-server>
// © MIT license

/**
 * Stream countdown data.
 * 
 * Stored as a UTC date string, e.g. "2026-06-28T15:30:09.590Z".
 * Produce with new Date().toISOString().
 */
export interface stream_countdown_data {
  date: string
};

export interface stream_countdown {
  realm: 'stream_countdown'
  data: stream_countdown_data
};
