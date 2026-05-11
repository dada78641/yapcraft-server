// YapCraft <https://github.com/dada78641/yapcraft-server>
// © MIT license

import * as path from 'node:path';
import pkg from '../../package.json' with {type: 'json'};

export interface PackageData {
  name: string;
  version: string;
}

/**
 * Returns the package root directory.
 */
export function getPackageRoot() {
  return path.join(import.meta.dirname, '..', '..');
}

/**
 * Returns the package content.
 */
export function getPackageInfo(): PackageData {
  const pkgData = pkg as PackageData;
  return {
    name: pkgData.name,
    version: pkgData.version,
  };
}
