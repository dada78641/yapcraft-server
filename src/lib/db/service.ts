// YapCraft <https://github.com/dada78641/yapcraft-server>
// © MIT license

import * as path from 'node:path';
import Database from 'better-sqlite3';
import type {AuthTokenRow, KeyValueRow} from './tables.ts';

/**
 * This class is the interface to everything database related.
 */
export class YapDatabase {
  private db: Database.Database;

  constructor(directory: string) {
    const dbPath = path.join(directory, 'db.sqlite3');

    this.db = new Database(dbPath);
    this.db.pragma('foreign_keys = ON');
    this.db.pragma('journal_mode = WAL');
    this.db.pragma('synchronous = FULL');

    this.initialize();
  }

  /**
   * Ensures that the database tables exist.
   */
  private initialize() {
    this.db.exec(`
      create table if not exists auth_token (
        user_id text primary key,
        access_token text not null,
        refresh_token text not null,
        expires_in integer not null,
        obtainment_timestamp integer not null,
        scope text not null
      );
      create table if not exists key_value (
        key text primary key,
        value text,
        timestamp integer not null
      );
    `);
  }

  /**
   * Returns the value for a key-value pair.
   */
  public getKeyValue(key: string): KeyValueRow {
    const stmt = this.db.prepare(`
      select
        *
      from
        key_value
      where
        key = ?
    `);

    const row = stmt.get(key) as (KeyValueRow | null);
    if (row == null) {
      throw new Error(`No value found: ${key}`);
    }
    return row;
  }

  /**
   * Stores a new value for a key-value pair.
   */
  public setKeyValue(row: KeyValueRow) {
    const stmt = this.db.prepare(`
      insert into
        key_value (
          key,
          value,
          timestamp
        )
      values
        (?, ?, ?)
      on conflict (key) do update
      set
        key = excluded.key,
        value = excluded.value,
        timestamp = excluded.timestamp
    `);

    stmt.run(
      row.key,
      row.value,
      row.timestamp
    );
  }

  /**
   * Returns the auth token for a given user.
   * 
   * Throws an error if none found.
   */
  public getAuthToken(userID: string): AuthTokenRow {
    const stmt = this.db.prepare(`
      select
        *
      from
        auth_token
      where
        user_id = ?
    `);

    const token = stmt.get(userID) as (AuthTokenRow | null);
    if (token == null) {
      throw new Error(`No token for user: ${userID}`);
    }
    return token;
  }

  /**
   * Stores a new auth token.
   */
  public saveAuthToken(token: AuthTokenRow) {
    const stmt = this.db.prepare(`
      insert into
        auth_token (
          user_id,
          access_token,
          refresh_token,
          expires_in,
          obtainment_timestamp,
          scope
        )
      values
        (?, ?, ?, ?, ?, ?)
      on conflict (user_id) do update
      set
        access_token = excluded.access_token,
        refresh_token = excluded.refresh_token,
        expires_in = excluded.expires_in,
        obtainment_timestamp = excluded.obtainment_timestamp,
        scope = excluded.scope
    `);

    stmt.run(
      token.user_id,
      token.access_token,
      token.refresh_token,
      token.expires_in,
      token.obtainment_timestamp,
      token.scope
    );
  }

  /**
   * Deletes a user's auth token.
   */
  public deleteAuthToken(userID: string) {
    const stmt = this.db.prepare(`
      delete from auth_token
      where
        user_id = ?
    `);

    stmt.run(userID);
  }
}
