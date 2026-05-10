// YapCraft <https://github.com/dada78641/yapcraft-server>
// © MIT license

import {RefreshingAuthProvider} from '@twurple/auth';
import {EventSubWsListener} from '@twurple/eventsub-ws';
import {ApiClient} from '@twurple/api';
import {server} from '@yapcraft/server/index.ts';

export class TwitchService {
  public apiClient!: ApiClient;
  public eventSubListener!: EventSubWsListener;

  constructor() {
    
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
