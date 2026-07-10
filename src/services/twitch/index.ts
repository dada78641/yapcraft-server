// YapCraft <https://github.com/dada78641/yapcraft-server>
// © MIT license

import {RefreshingAuthProvider} from '@twurple/auth';
import {EventSubWsListener} from '@twurple/eventsub-ws';
import {ApiClient, type HelixStream} from '@twurple/api';
import {server} from '@yapcraft/server/index.ts';

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
    const data = this.wrapStreamStateData(stream);
    server.data.setKeyValue<StreamStateData>('twitch_stream_state_data', data);
    return data;
  }

  /**
   * Converts a HelixStream response object into a plain object.
   */
  private wrapStreamStateData(stream: HelixStream | null): StreamStateData {
    if (stream === null) {
      return {
        isLive: false,
        viewers: 0,
        streamTitle: '',
        streamTags: [],
        userName: '',
        gameName: '',
        gameId: '',
        startDate: '',
      };
    }
    return {
      isLive: true,
      viewers: stream.viewers,
      streamTitle: stream.title,
      streamTags: stream.tags,
      userName: stream.userDisplayName,
      gameName: stream.gameName,
      gameId: stream.gameId,
      startDate: new Date(stream.startDate).toISOString(),
    };
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
