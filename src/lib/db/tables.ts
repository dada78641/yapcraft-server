// YapCraft <https://github.com/dada78641/yapcraft-server>
// © MIT license

export interface AuthTokenRow {
  user_id: string;
  access_token: string;
  refresh_token: string;
  expires_in: number;
  obtainment_timestamp: number;
  scope: string;
};

export interface KeyValueRow {
  key: string;
  value: string;
  timestamp: number;
};
