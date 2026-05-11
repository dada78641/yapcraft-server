// YapCraft <https://github.com/dada78641/yapcraft-server>
// © MIT license

import path from 'node:path';
import {type ServicesConfig} from '@yapcraft/util/config.ts';
import express, {type Express} from 'express';
import {getPackageRoot} from '@yapcraft/util/pkg.ts';
import {getPort} from '@yapcraft/util/httpd.ts';
import {server} from '@yapcraft/server/index.ts';

/**
 * Static page hosting service.
 * 
 * This serves static HTML for the widgets and the admin panel.
 * 
 * We expect two symlinks under the /static directory:
 * 
 *   * widgets -> @dada78641/yapcraft-widgets/dist/
 *   * admin -> @dada78641/yapcraft-admin/dist/
 * 
 * We use a symlink so that updates can be easily pushed and tested.
 */
export class WebService {
  private config: ServicesConfig['web'];
  private static: string;
  private app: Express;

  constructor() {
    this.config = server.config.services.web;
    this.app = express();
    this.static = path.join(getPackageRoot(), 'static');
  }
  
  public async initialize() {
    this.app.use(express.static(this.static));
    this.app.listen(getPort(this.config.address), () => {
      console.log(`server running at %o`, this.config.address);
    });
  }
}
