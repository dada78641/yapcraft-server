// YapCraft <https://github.com/dada78641/yapcraft-server>
// © MIT license

import {RefreshingAuthProvider} from '@twurple/auth';
import {EventSubWsListener} from '@twurple/eventsub-ws';
import {ApiClient, type HelixStream} from '@twurple/api';
import {server} from '@yapcraft/server/index.ts';
import {type StreamStateData} from './types.ts';
import {wrapStreamStateData} from './util.ts';

export class TwitchService {
  public apiClient!: ApiClient;
  public eventSubListener!: EventSubWsListener;

  constructor() {
  }

  /**
   * Returns basic information about the current stream.
   * 
   * This includes e.g. viewer count, current game.
   */
  public async getStreamState(): Promise<StreamStateData> {
    const cached = server.data.getKeyValue<StreamStateData>('twitch_stream_state_data', 5_000);
    if (cached !== null) {
      return cached
    }
    const stream = await this.apiClient.streams.getStreamByUserId(server.config.twitch.userID);
    const data = wrapStreamStateData(stream);
    server.data.setKeyValue<StreamStateData>('twitch_stream_state_data', data);
    return data;
  }

  /**
   * Creates a clip.
   */
  public async createClip(hasDelay: boolean = true, durationSeconds: number = 30) {
    const {userID} = server.config.twitch;
    try {
      const clipID = await this.apiClient.clips.createClip({
        channel: userID,
        createAfterDelay: hasDelay,
        duration: durationSeconds,
      });
      console.log(`created clip of ${durationSeconds}s, id: ${clipID}`);
    }
    catch (err) {
      console.error('could not create clip:', err);
      throw err;
    }
  }

  /**
   * Runs an ad on the channel.
   */
  public async runChannelAd(durationSeconds: 30 | 60 | 90 | 120 | 150 | 180 = 30) {
    const {userID} = server.config.twitch;
    try {
      await this.apiClient.channels.startChannelCommercial(userID, durationSeconds);
      console.log(`ad running for ${durationSeconds}s`);
    }
    catch (err) {
      console.error('could not run ad break:', err);
      throw err;
    }
  }
  
  public async initialize() {
    const {userID, clientID, clientSecret} = server.config.twitch;
    const existingToken = server.data.getAuthToken();
    console.log('existing token expires on: %o', new Date(existingToken.obtainmentTimestamp + (existingToken.expiresIn * 1000)));
    const authProvider = new RefreshingAuthProvider({clientId: clientID, clientSecret});
    authProvider.onRefresh(async (userID, newTokenData) => {
      console.log('saving new token for user %o, set to expire: %o', userID, new Date(newTokenData.obtainmentTimestamp + ((newTokenData.expiresIn ?? 0) * 1000)));
      server.data.saveAuthToken(userID, newTokenData);
    });
    authProvider.addUser(userID, existingToken, ['chat']);
    const apiClient = new ApiClient({authProvider});
    const listener = new EventSubWsListener({apiClient});
    listener.start();
    this.apiClient = apiClient;
    this.eventSubListener = listener;
  }
}
