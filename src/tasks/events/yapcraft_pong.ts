// YapCraft <https://github.com/dada78641/yapcraft-server>
// © MIT license

import {eventHandler} from '@yapcraft/lib/tasks/index.ts';

/**
 * Pong response event.
 */
export interface yapcraft_pong_data {
  id: string
  timestamp: string
};

export interface yapcraft_pong {
  realm: 'yapcraft_pong'
  data: yapcraft_pong_data
};

export function getPongResponse(): yapcraft_pong_data {
  return {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
  }
}

export default eventHandler<yapcraft_pong_data>(
  'yapcraft_pong',
  async function(eventData) {
    // Nothing!
  },
  {
    silent: true
  },
);
