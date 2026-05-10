// YapCraft <https://github.com/dada78641/yapcraft-server>
// © MIT license

export interface stream_title_data_line {
  text: string
  color: 'yellow' | 'orange' | 'lime' | 'magenta'
  style?: '3d' | ''
  special?: 'dada' | ''
};

/**
 * Stream title data.
 * 
 * Used to display a title in the top right corner.
 */
export interface stream_title_data {
  lines: stream_title_data_line[]
};

export interface stream_title {
  realm: 'stream_title'
  data: stream_title_data
};
