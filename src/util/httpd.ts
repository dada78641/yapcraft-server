// YapCraft <https://github.com/dada78641/yapcraft-server>
// © MIT license

/**
 * Returns the port for a given address URL.
 */
export function getPort(address: string): number {
  const url = new URL(address);
  return Number(url.port);
}
