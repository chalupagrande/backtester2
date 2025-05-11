import { EventType } from './types';


type EventHandler<T = any> = (payload: T, event: Event<T>) => void | Promise<void>;
type EventFilter<T = any> = (payload: T, event: Event<T>) => boolean;

interface Subscription<T = any> {
  handler: EventHandler<T>;
  filter?: EventFilter<T>;
}

export class Event<T> {
  type: EventType;
  timestamp: Date;
  data: T;

  constructor(type: EventType, data: T, timestamp?: Date) {
    this.type = type;
    this.timestamp = timestamp || new Date();
    this.data = data;
  }
}

export class EventBus {
  private subscribers: Map<string, Subscription<any>[]>;


  constructor() {
    this.subscribers = new Map();
  }

  /**
   * Publishes an event to all subscribed and filtered listeners.
   * @param event The event object to publish.
   */
  public publish<T>(eventType: EventType, data: T): void {
    const event = new Event(eventType, data);
    const eventTypeSubscribers = this.subscribers.get(eventType);
    if (eventTypeSubscribers) {
      eventTypeSubscribers.forEach(async (subscription) => { // Mark as async if handlers can be async
        try {
          if (!subscription.filter || subscription.filter(data, event)) {
            await Promise.resolve(subscription.handler(data, event)); // Await if handler is async
          }
        } catch (error) {
          console.error(`Error in event handler for event type ${eventType}:`, error);
          // Optionally, publish a specific error event to the bus itself
          // this.publish({ type: EventType.StrategyError, timestamp: new Date(), data: { sourceEvent: event, error }});
        }
      });
    } else {
      console.log(`No subscribers for event type: ${eventType}`);
    }
  }

  /**
   * Subscribes a handler to a specific event type, with an optional filter.
   * @param eventType The type of event to subscribe to.
   * @param handler The function to call when the event is published.
   * @param filter An optional function to filter events before calling the handler.
   * @returns A function to unsubscribe the handler.
   */
  public subscribe<T>(
    eventType: EventType | string, // Allow string for custom events
    handler: EventHandler<T>,
    filter?: EventFilter<T>
  ): () => void {
    if (!this.subscribers.has(eventType)) {
      this.subscribers.set(eventType, []);
    }
    const subscription: Subscription<T> = { handler, filter };
    this.subscribers.get(eventType)!.push(subscription);

    return () => {
      const subs = this.subscribers.get(eventType);
      if (subs) {
        const index = subs.indexOf(subscription);
        if (index > -1) {
          subs.splice(index, 1);
          if (subs.length === 0) {
            this.subscribers.delete(eventType);
          }
        }
      }
    };
  }

  public getEventTypes(): EventType[] {
    return Array.from(this.subscribers.keys()) as EventType[];
  }

  public removeAllSubscribers(): void {
    this.subscribers.clear();
  }
}
