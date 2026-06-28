// YapCraft <https://github.com/dada78641/yapcraft-server>
// © MIT license

import {
  type EventSubChannelRedemptionAddEvent,
  type EventSubChannelChatMessageEvent,
} from '@twurple/eventsub-base';

// All actionable task handlers.
export interface TaskHandlers {
  redemptionTasks: RedemptionHandler[]
  eventHandlers: EventHandler[]
};

// For redemptions that take text input, we'll fetch the message parts.
export interface RedemptionMessage {
  text: string,
  parts: EventSubChannelChatMessageEvent['messageParts'],
};

export interface RedemptionEvent {
  id: string;
  status: string;
  timestamp: Date;
  user: {
    id: string;
    name: string;
    displayName: string;
  };
  broadcaster: {
    id: string;
    name: string;
    displayName: string;
  };
  reward: {
    id: string;
    title: string;
    prompt: string;
    cost: number;
  };
  input: {
    value: string;
  };
};

export interface RedemptionHandler {
  name: string;
  rewardIDs: {[key: string]: string};
  requiresTextInput: boolean;
  runRedemption(ev: RedemptionEvent, msg: RedemptionMessage | null, rewardName: string): void;
};

export interface EventHandler<T = any> {
  realm: string;
  runHandler(eventData: T): Promise<void>;
}

/**
 * Returns a handler for OBS CustomEvent events.
 */
export function eventHandler<T = any>(realm: string, fn: (this: {realm: string}, eventData: T) => void) {
  const handler = {
    realm,
  };
  return {
    ...handler,
    runHandler: fn.bind(handler),
  };
}

/**
 * Returns a RedemptionMessage object from the Twitch API event format.
 */
export function getRedemptionMessage(msg: EventSubChannelChatMessageEvent) {
  return {
    text: msg.messageText,
    parts: msg.messageParts,
  };
}

/**
 * Returns a RedemptionEvent object from the Twitch API event format.
 */
export function getRedemptionEvent(ev: EventSubChannelRedemptionAddEvent): RedemptionEvent {
  const redemptionEvent = {
    id: ev.id,
    status: ev.status,
    timestamp: ev.redemptionDate,
    user: {
      id: ev.userId,
      name: ev.userName,
      displayName: ev.userDisplayName,
    },
    broadcaster: {
      id: ev.broadcasterId,
      name: ev.broadcasterName,
      displayName: ev.broadcasterDisplayName,
    },
    reward: {
      id: ev.rewardId,
      title: ev.rewardTitle,
      prompt: ev.rewardPrompt,
      cost: ev.rewardCost,
    },
    input: {    
      value: ev.input,
    },
  };
  return redemptionEvent;
}
