// YapCraft <https://github.com/dada78641/yapcraft-server>
// © MIT license

import {ObsTools} from '@dada78641/strim-obstools';
import {YapDatabase} from '@yapcraft/lib/db/index.ts';
import {YapData} from '@yapcraft/lib/data/index.ts';
import {YapTasks} from '@yapcraft/lib/tasks/index.ts';
import {getConfig, type YapConfig} from '@yapcraft/util/config.ts';
import {getPackageInfo} from '@yapcraft/util/pkg.ts';
import {TwitchService} from '@yapcraft/services/twitch/index.ts';
import {TTSService} from '@yapcraft/services/tts/index.ts';
import {BWService} from '@yapcraft/services/bw/index.ts';
import {WebService} from '@yapcraft/services/web/index.ts';
import {env} from '@yapcraft/util/env.ts';

interface Services {
  twitch: TwitchService,
  tts: TTSService,
  bw: BWService,
  web: WebService,
};

/**
 * YapCraft server interface.
 * 
 * This is the primary interface for everything that happens.
 * 
 * We work with this class as a singleton only. All code utilizes the one instance in ./index.ts.
 * Therefore, anything can just import the singleton to access all currently live server data.
 * 
 * Roughly speaking, we have three types of things in here:
 * 
 *   * core services: mainly OBS, the Twitch API connection, the database and the data interface.
 *   * services: all abstractions directly accessible from the YapServer instance.
 *   * tasks: basically "userland" code that implements features and responds to subscribed events.
 * 
 * This server undergoes a bunch of initialization before it can do anything, and tasks do not get
 * initialized until we make a successful connection to our OBS websocket instance.
 * 
 * So basically, all tasks can safely assume that all the server's services are always available.
 */
export class YapServer {
  public db!: YapDatabase;
  public data!: YapData;
  public tasks!: YapTasks;
  public config!: YapConfig;

  private servicesStarted = false;

  public obs!: ObsTools;
  public services = {} as Services;

  constructor() {
    const pkg = getPackageInfo();
    console.log(`${pkg.name} ${pkg.version}`);
  }

  /**
   * Main intialization routine that kickstarts everything.
   * 
   * This loads the config and starts the core services. Finally, it will attempt to connect
   * to the OBS websocket, and once that's complete it will start actually listening for
   * incoming events and doing useful work.
   * 
   * This server is designed to be constantly active, and do (mostly) nothing until OBS appears.
   * If OBS never starts, all the server does is maintain an idle connection to some API servers.
   * 
   * After the OBS connection is made, we attach all event listeners. Note that we DON'T listen
   * to even Twitch events (which we already have access to even without OBS) until then.
   */
  public async initialize() {
    this.db = new YapDatabase(env.cache);
    this.config = await getConfig();
    this.data = new YapData(this.db, this.config);
    await this.initializeServices();
    await this.initializeOBS();
  }

  /**
   * Starts the server's work services.
   * 
   * This is the final step in the initialization process, and occurs after we've connected to OBS.
   * Before we connect to OBS, the server doesn't really do anything except maintain an idle
   * connection to the Twitch API. After the OBS connection is started, we'll actually start
   * responding to things like EventSub calls, CustomEvent calls, and so on. This also starts
   * whatever periodically running scripts there are.
   */
  private async startServices() {
    if (this.servicesStarted) {
      return;
    }
    this.tasks = new YapTasks();
    this.servicesStarted = true;
  }

  /**
   * Initializes all services.
   * 
   * Services are globally available classes that have some stateful relation to the server.
   */
  private async initializeServices() {
    this.services.twitch = new TwitchService();
    this.services.tts = new TTSService();
    this.services.bw = new BWService();
    this.services.web = new WebService();
    await this.services.twitch.initialize();
    await this.services.tts.initialize();
    await this.services.bw.initialize();
    await this.services.web.initialize();
  }
  
  /**
   * Initializes the OBS instance.
   * 
   * This serves as the main communication hub between all different services and widgets.
   * The OBS websocket is used for connecting everything together through CustomEvent calls.
   * 
   * It will automatically connect to the websocket (and keep trying continuously if it can't),
   * and the server will start attempting to do stuff as soon as the connection is made.
   * If we can't connect to OBS, nothing much really happens.
   */
  private async initializeOBS() {
    const {address, password} = this.config.obs;
    this.obs = new ObsTools({address, password});
    this.obs.once('ready', async () => {
      console.log('connected to OBS!', new Date());
      this.startServices();
      // const scenes = await this.obs.obs.call('GetSceneList');
      // console.log('scenes', scenes);
    });
  }
}
