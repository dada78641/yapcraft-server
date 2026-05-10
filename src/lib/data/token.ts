// YapCraft <https://github.com/dada78641/yapcraft-server>
// © MIT license

import type {AccessToken} from '@twurple/auth';
import type {AuthTokenRow} from '@yapcraft/lib/db/tables.ts';

export interface AuthToken {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  obtainmentTimestamp: number;
  scope: string[];
}

export function fromAuthToken(userID: string, token: AccessToken): AuthTokenRow {
  return {
    user_id: userID,
    access_token: token.accessToken,
    refresh_token: token.refreshToken!,
    expires_in: token.expiresIn!,
    obtainment_timestamp: token.obtainmentTimestamp,
    scope: token.scope.join(' '),
  };
}

export function fromAuthTokenRow(authTokenRow: AuthTokenRow): AuthToken {
  return {
    accessToken: authTokenRow.access_token,
    refreshToken: authTokenRow.refresh_token,
    expiresIn: authTokenRow.expires_in,
    obtainmentTimestamp: authTokenRow.obtainment_timestamp,
    scope: authTokenRow.scope.split(' ').filter(Boolean),
  };
}
