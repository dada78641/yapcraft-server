[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff)](https://www.typescriptlang.org/) [![npm version](https://badge.fury.io/js/@dada78641%2Fyapcraft-server.svg)](https://badge.fury.io/js/@dada78641%2Fyapcraft-server)

# YapCraft Server

Backend server for the YapCraft stream. This handles all the communication with Twitch and mediates between different components through the [OBS websocket](https://github.com/obsproject/obs-websocket) connection.

This also serves the admin panel pages and all widgets used in scenes via a built in http server.

## Usage

The stream's basic setup is as follows:

* There's a gaming PC (which sends its screen via [NDI](https://ndi.video/)), and a streaming PC which runs the main OBS instance.
* The streaming PC runs one instance of this server using [PM2](https://pm2.keymetrics.io/).
* TODO mic stuff.

To start using this backend server: clone it, set up a config file (see below), and then run the following commands to bootstrap it:
```sh
npm i                              # install dependencies
npm run login                      # generates the appropriate api tokens
pm2 start ./ecosystem.config.json  # runs the code as a background service
```
The server will now always be available on system boot (if OBS is not running, it will just idle quietly).

From this moment on the server will be known as YapCraft to PM2, so you can run e.g. `pm2 restart YapCraft`.

## Scripts

The following scripts are available for maintenance purposes:

| Script name | Description |
|:------------|:------------|
| login | Ensures the auth tokens are available. |

## Configuration

To be able to communicate with the Twitch API, you must register an application and obtain its credentials.

Sign in to the [Twitch developer console](https://dev.twitch.tv/console) with your account, register a new application, and then copy its id and secret.

Set up a config file at `~/.config/yapcraft/config.json` with the following content:
```json
{
  "twitch": {
    "userID": "{USER ID}",
    "clientID": "{CLIENT ID}",
    "clientSecret": "{CLIENT SECRET}",
    "redirectURI": "http://localhost:3001/callback",
  }
}
```
Then run the login script to get the first auth code, which can then be refreshed. This can be run again if the auth code isn't renewed in time.
```sh
npm run login
```
The user ID will be fetched during login for you to add to the config file, if you don't have it already.

## License

MIT License.
