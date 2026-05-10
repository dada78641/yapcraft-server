// YapCraft <https://github.com/dada78641/yapcraft-server>
// © MIT license

import {buildEmoteImageUrl, EmoteSize} from '@twurple/chat';
import {pickArrayIdx} from '@dada78641/strim-prng';
import {RedemptionMessage} from '@yapcraft/lib/tasks/index.ts';

export type UserColor = [string, string];

/**
 * List of user colors shown in the chat.
 * 
 * These are referred to as colors A and B (dark and light).
 */
export const userColors: UserColor[] = [
  ['#ff05ce', '#ff1cf6'],
  ['#e100e3', '#ff4af9'],
  ['#a800e4', '#e600ff'],
  ['#7800db', '#a500ff'],
  ['#022fff', '#035cff'],
  ['#075eff', '#0a81ff'],
  ['#177cff', '#20aaff'],
  ['#1f8cff', '#2bc0ff'],
  ['#269eff', '#34d9ff'],
  ['#21adff', '#2dedff'],
  ['#009acb', '#09c3ff'],
  ['#53cbff', '#72ffff'],
  ['#0cc6ff', '#10ffff'],
  ['#00beb4', '#00fff7'],
  ['#11ff5a', '#2dff95'],
  ['#6dff46', '#a3ff60'],
  ['#b8f416', '#daff0f'],
  ['#ffd800', '#ffff00'],
  ['#f68b00', '#ffbf00'],
  // ['#ef6f00', '#f88c14'], hidden since it's too close to my streamer color
  ['#ff4831', '#ff6343'],
  ['#ff0332', '#ff0445'],
  ['#ff205e', '#ff2c81'],
  ['#fa0084', '#ff15c0'],
];

// Special user color for the broadcaster.
export const broadcasterUserColor: UserColor = ['#e85115', '#ff7f00'];

/**
 * Converts hex color value to rgb() string.
 */
export function hexToRgb(hex: string) {
  const r = parseInt(hex.substring(1, 3), 16);
  const g = parseInt(hex.substring(3, 5), 16);
  const b = parseInt(hex.substring(5, 7), 16);
  return `rgb(${r}, ${g}, ${b})`;
}

/**
 * Returns the appropriate user color for a given username seed.
 */
export function pickUserColor(username: string, broadcaster: string) {
  if (username === broadcaster) {
    return broadcasterUserColor;
  }
  const idx = pickArrayIdx(username, userColors);
  return userColors[idx];
}

/**
 * Returns all message parts with emotes, cheermotes and mentions filtered out.
 * 
 * Mentions have the @ removed, and emotes are turned into a period.
 * 
 * This helps make the TTS sound more natural.
 */
export function getCleanMessage(parts: RedemptionMessage['parts']) {
  const cleanParts = [];
  for (const part of parts) {
    if (part.type === 'cheermote') {
      cleanParts.push('. ');
      continue;
    }
    if (part.type === 'emote') {
      cleanParts.push('. ');
      continue;
    }
    if (part.type === 'mention') {
      cleanParts.push(part.text.slice(1));
      continue;
    }
    if (part.type === 'text') {
      cleanParts.push(part.text);
      continue;
    }
  }
  return cleanParts.join('');
}

/**
 * Returns HTML representing the user's message.
 */
export function createMessageHTML(messageParts: RedemptionMessage['parts']) {
  const message = [];
  for (const part of messageParts) {
    if (part.type === 'cheermote') {
      //
      continue;
    }
    if (part.type === 'emote') {
      const emote = buildEmoteImageUrl(part.emote.id, {size: '2.0'});
      message.push(`<span class="emote" style="background-image: url(${emote});"><img src="${emote}" /></span>`);
      continue;
    }
    if (part.type === 'mention') {
      message.push(`<span class="mention">${part.text}</span>`);
      continue;
    }
    if (part.type === 'text') {
      message.push(part.text);
      continue;
    }
  }
  return message.join('');
}

/**
 * Returns HTML stubs for the TTS message.
 */
export function createHTMLStubs(username: string, color: UserColor, messageParts: RedemptionMessage['parts']) {
  const message = createMessageHTML(messageParts);

  const colorA = hexToRgb(color[0]);
  const colorB = hexToRgb(color[1]);

  const usernameStub = `
    <span class="meta">
      <span class="badges"></span>
      <span class="name" style="background: linear-gradient(0deg, ${colorA}, ${colorB}); -webkit-text-fill-color: transparent;">${username}</span>
    </span>
  `;
  const messageStub = `
    <span class="message">
      <span class="foreground">${message}</span>
    </span>
  `;

  return {usernameStub, messageStub};
}
