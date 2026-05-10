// YapCraft <https://github.com/dada78641/yapcraft-server>
// © MIT license

import {TwitchService} from '@yapcraft/services/twitch/index.ts';
import {server} from '@yapcraft/server/index.ts';
import {getTaskHandlers} from '@yapcraft/tasks/tasks.ts';
import {
  getRedemptionEvent,
  getRedemptionMessage,
  type RedemptionEvent,
  type RedemptionMessage,
  type RedemptionHandler,
  type EventHandler,
} from './tasks.ts';

type QueueKey = string;

export interface EventQueueItem {
  msg: RedemptionMessage | null;
  ev: RedemptionEvent | null;
  handler: RedemptionHandler | null;
  uuid: string;
};

export class YapTasks {
  private userID: string;
  private twitch: TwitchService;
  private eventQueue: Map<QueueKey, EventQueueItem>;

  constructor() {
    this.userID = server.config.twitch.userID;
    this.twitch = server.services.twitch;
    this.eventQueue = new Map();
    this.bindEventHandlers();
  }

  /**
   * Handler for a redemption event's chat message.
   */
  private onRedemptionChatMessage(uuid: string, message: RedemptionMessage) {
    const key = this.getRedemptionKey(uuid, message.text);
    const value = this.mergeRedemptionQueueItem(key, null, message, null, uuid);
    this.updateEventQueue(key, value);
  }

  /**
   * Handler for when a matched redemption event is received.
   */
  private onRedemptionEvent(uuid: string, event: RedemptionEvent, handler: RedemptionHandler) {
    if (!handler.requiresTextInput) {
      // No need to put this event in the queue, since we don't have to wait for a chat message.
      return this.runRedemptionHandler({ev: event, msg: null, handler, uuid});
    }

    // Our handler needs a chat message to complete the handling of the event.
    const key = this.getRedemptionKey(uuid, event.input.value);
    const value = this.mergeRedemptionQueueItem(key, event, null, handler, uuid);
    this.updateEventQueue(key, value);
  }

  /**
   * Runs a CustomEvent handler.
   * 
   * The handler has previously been determined.
   */
  private runEventHandler(realm: string, data: unknown, handler: EventHandler) {
    console.log(`running event handler %o`, realm);
    handler.runHandler(data);
  }

  /**
   * Runs a redemption event handler with a complete set of arguments.
   * 
   * This either includes only a redemption event, or that plus an array of message parts.
   */
  private runRedemptionHandler(item: EventQueueItem) {
    try {
      const handler = item.handler!;
      const rewardName = this.getRewardName(item.uuid, handler);
      console.log(`running redemption handler %o.%o for user %o`, item.handler!.name, rewardName, item.ev?.user.name)
      handler.runRedemption(item.ev!, item.msg, rewardName);
    }
    catch (err) {
      // do something with the error?
      console.error(`a redemption handler threw an error. uuid: %o`, item.ev!.reward.id);
      console.error(item.ev);
      console.error(err);
    }
  }

  /**
   * Returns a key for matching redemption events and associated chat messages.
   */
  private getRedemptionKey(uuid: string, inputValue: string): string {
    return `${uuid}$$${inputValue}`;
  }

  /**
   * Stores an event item into the queue.
   * 
   * If the item is complete, we'll run the redemption code and remove it from the queue.
   */
  private updateEventQueue(key: QueueKey, value: EventQueueItem) {
    this.eventQueue.set(key, value);
    if (!this.isComplete(value)) {
      return;
    }
    // Now that the event is complete, we'll run the redemption handler.
    this.runRedemptionHandler(value);
    this.eventQueue.delete(key);
  }

  /**
   * Returns whether an item in the queue is complete.
   * 
   * If the item has a message and a reward event, it's complete and we can run the redemption.
   */
  private isComplete(item: EventQueueItem): boolean {
    return item.msg !== null && item.ev !== null && item.handler !== null;
  }

  /**
   * Merges a new redemption event or chat event into an existing (or new) event queue item.
   */
  private mergeRedemptionQueueItem(
    key: QueueKey,
    redemptionEvent: RedemptionEvent | null,
    redemptionMessage: RedemptionMessage | null,
    redemptionHandler: RedemptionHandler | null,
    uuid: string
  ): EventQueueItem {
    const emptyItem = {msg: null, ev: null, handler: null, uuid};
    let item = this.eventQueue.get(key);
    if (item == null) {
      item = emptyItem;
    }
    if (redemptionEvent) {
      item = {...item, ev: redemptionEvent};
    }
    if (redemptionMessage) {
      item = {...item, msg: redemptionMessage};
    }
    if (redemptionHandler) {
      item = {...item, handler: redemptionHandler};
    }
    return item;
  }

  /**
   * Returns the name that the redemption handler has assigned to a given reward UUID.
   */
  private getRewardName(uuid: string, handler: RedemptionHandler): string {
    const entries = Object.entries(handler.rewardIDs);
    const item = entries.find(entry => entry[0] === uuid);
    if (item == null) {
      throw new Error(`Redemption handler cannot handle this reward uuid: ${uuid}`);
    }
    return item[1];
  }

  /**
   * Binds the Twitch event handlers to our redemption code.
   * 
   * There are two types of redemptions: ones that require text input from the user,
   * and ones that don't. When text input is required, we really want to have
   * the user's message broken up into parts, so that we can e.g. filter out emotes.
   * 
   * However, redemption events that require text actually only contain the plain text
   * of the message, without its parts. So to handle that, we actually wait for two
   * things to happen: we wait for the event to come in, and we wait for the associated
   * chat message to come in as well.
   * 
   * Each time something comes in, it goes through this.onActionEvent(), which checks
   * if the event is "complete" (has both a chat message and an event; or, if it does not
   * require text, if it has just the event). Once it is complete, the handler is called.
   * 
   * We bind together the chat message and the event by looking for a chat message by
   * the same user with the same reward ID and same message plain text. Hacky but it works.
   */
  public bindEventHandlers() {
    const {redemptionTasks, eventHandlers} = getTaskHandlers();
    console.log(`%o redemptions initialized`, redemptionTasks.length);

    // For OBS custom events, ensure that it's tagged with our realm/data structure.
    // If it's not that, it's not one of our internal events, so skip it.
    // Once we find the realm, we know the data is of that type and call the handler.
    server.obs.obs.addListener('CustomEvent', eventData => {
      // Note: obs-websocket-js has a faulty type that we're sorta working around here.
      // It believes eventData should be {eventData}, but it is the former.
      if (!('realm' in eventData) || !('data' in eventData)) {
        return;
      }
      const handler = eventHandlers.find(handler => handler.realm === eventData.realm);
      if (handler == null) {
        return;
      }
      this.runEventHandler(eventData.realm as string, eventData.data, handler);
    })

    // For chat messages, ensure that this message is for a reward redemption.
    // Then pass on the message parts with the reward uuid.
    this.twitch.eventSubListener.onChannelChatMessage(this.userID, this.userID, ev => {
      if (ev.rewardId == null) {
        return;
      }
      this.onRedemptionChatMessage(ev.rewardId, getRedemptionMessage(ev));
    });

    // For all known redemption actions, start listening for redemption actions.
    for (const redemptionTaskAction of redemptionTasks) {
      for (const [uuid, name] of Object.entries(redemptionTaskAction.rewardIDs)) {
        this.twitch.eventSubListener.onChannelRedemptionAddForReward(this.userID, uuid, ev => {
          this.onRedemptionEvent(uuid, getRedemptionEvent(ev), redemptionTaskAction);
        });
      }
    }
  }
}
