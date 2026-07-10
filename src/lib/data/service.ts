// YapCraft <https://github.com/dada78641/yapcraft-server>
// © MIT license

import {type AccessToken} from '@twurple/auth';
import {YapDatabase} from '@yapcraft/lib/db/index.ts';
import {type YapConfig} from '@yapcraft/util/config.ts';
import {type JsonValue} from '@yapcraft/util/json.ts';
import {fromAuthToken, fromAuthTokenRow, type AuthToken} from './token.ts';

/**
 * This class handles everything related to persistent data.
 * 
 * Internally it uses the YapDatabase class to store data in our SQLite database.
 * It also reads from various other files where needed.
 */
export class YapData {
  private db: YapDatabase;
  private config: YapConfig;

  constructor(db: YapDatabase, config: YapConfig) {
    this.db = db;
    this.config = config;
  }

  /**
   * Returns the value for a key-value pair.
   * 
   * This always returns a value; either the decoded JSON for the key;
   * or null if the key row does not exist or the value is not valid JSON.
   * 
   * Each value has a timestamp of when it was stored in milliseconds;
   * if it's older than our maxAge value, null is returned instead.
   */
  public getKeyValue<T = JsonValue>(key: string, maxAge?: number): T | null {
    try {
      const row = this.db.getKeyValue(key);
      const json = JSON.parse(row.value);
      if (maxAge != null && row.timestamp < Date.now() - maxAge) {
        return null;
      }
      return json;
    }
    catch {
      // Value is not found, or the value was invalid JSON.
      // In both cases we'll just return null.
      return null;
    }
  }

  /**
   * Stores a new value for a key-value pair.
   * 
   * The value must be a serializable object.
   */
  public setKeyValue<T = any>(key: string, value: T) {
    this.db.setKeyValue({
      key,
      value: JSON.stringify(value),
      timestamp: Date.now(),
    });
  }

  public getAuthToken(): AuthToken {
    const {userID} = this.config.twitch;
    const existingToken = fromAuthTokenRow(this.db.getAuthToken(userID));
    return existingToken;
  }

  public saveAuthToken(userID: string, newTokenData: AccessToken) {
    this.db.saveAuthToken(fromAuthToken(userID, newTokenData));
  }
}
