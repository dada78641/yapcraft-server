// YapCraft <https://github.com/dada78641/yapcraft-server>
// © MIT license

import express, {Request, Response} from 'express';
import {exchangeCode, AccessToken} from '@twurple/auth';
import {YapDatabase, type AuthTokenRow} from '@yapcraft/lib/db/index.ts';
import {scopes} from '@yapcraft/lib/twitch/scopes.ts';
import type {TwitchConfig} from '@yapcraft/util/config.ts';
import {env} from '@yapcraft/util/env.ts';
import {sleep} from '@yapcraft/util/promise.ts';

// Port we'll operate on for the login.
const port = 3001;

// Request for the /callback URL.
type CallbackRequest = Request<any, any, any, {
  code?: string;
  scope?: string;
  error?: string;
  error_description?: string;
}>;

// Result for the identity validation request.
interface IdentityDataResult {
  client_id: string;
  login: string;
  scopes: string[];
  user_id: string;
  expires_in: number;
}

// Login app interface, including Twitch auth URL we need to redirect to.
interface LoginApp {
  loginURL: string;
};

/**
 * Returns the URL in which the user can authenticate.
 */
function getRedirectURL(appConfig: TwitchConfig): string {
  const url = new URL('https://id.twitch.tv/oauth2/authorize');
  url.searchParams.set('client_id', appConfig.clientID);
  url.searchParams.set('redirect_uri', appConfig.redirectURI);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('scope', scopes.join(' '));
  url.searchParams.set('force_verify', 'true');
  return url.toString();
}

/**
 * Validates the user's access token and returns their user data.
 */
async function getIdentityValidation(tokenData: AccessToken): Promise<IdentityDataResult> {
  const res = await fetch('https://id.twitch.tv/oauth2/validate', {
    headers: {
      Authorization: `OAuth ${tokenData.accessToken}`
    }
  });
  const data = await res.json();
  return data as IdentityDataResult;
}

/**
 * Returns data to insert into the auth_token database table.
 */
function toAuthTokenRow(tokenData: AccessToken, identityData: IdentityDataResult): AuthTokenRow {
  if (tokenData.expiresIn == null || tokenData.refreshToken == null) {
    throw new Error(`Token is not valid.`);
  }
  return {
    user_id: identityData.user_id,
    access_token: tokenData.accessToken,
    refresh_token: tokenData.refreshToken,
    expires_in: tokenData.expiresIn,
    obtainment_timestamp: tokenData.obtainmentTimestamp,
    scope: tokenData.scope.join(' '),
  };
}

/**
 * Initializes an Express app for obtaining the auth code.
 */
export function createLoginApp(appConfig: TwitchConfig) {
  return new Promise<LoginApp>((resolve, reject) => {
    try {
      const app = express();
      app.get('/login', (req: Request, res: Response) => {
        const redirectURL = getRedirectURL(appConfig);
        res.redirect(redirectURL);
      });
      app.get('/callback', async (req: CallbackRequest, res: Response) => {
        const {code} = req.query;
        if (code == null) {
          return res.status(500).send('Did not receive auth code.');
        }
        const tokenData = await exchangeCode(appConfig.clientID, appConfig.clientSecret, code, appConfig.redirectURI);
        const identityData = await getIdentityValidation(tokenData);
        const db = new YapDatabase(env.cache);
        db.saveAuthToken(toAuthTokenRow(tokenData, identityData));
        res.status(200).send('Auth code received and saved in database. You can close this window now.');
        console.log(`Done! Your user ID is: "${identityData.user_id}". Please save this to the config file.`);
        await sleep(500);
        process.exit(0);
        return;
      });
      app.listen(port, () => {
        return resolve({
          loginURL: `http://localhost:${port}/login`,
        });
      });
    }
    catch (err) {
      reject(err);
    }
  });
}
