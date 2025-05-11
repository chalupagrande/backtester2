"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventBus = exports.Event = void 0;
class Event {
    type;
    timestamp;
    data;
    constructor(type, data, timestamp) {
        this.type = type;
        this.timestamp = timestamp || new Date();
        this.data = data;
    }
}
exports.Event = Event;
class EventBus {
    subscribers;
    constructor() {
        this.subscribers = new Map();
    }
    /**
     * Publishes an event to all subscribed and filtered listeners.
     * @param event The event object to publish.
     */
    publish(eventType, data) {
        const event = new Event(eventType, data);
        const eventTypeSubscribers = this.subscribers.get(eventType);
        if (eventTypeSubscribers) {
            eventTypeSubscribers.forEach(async (subscription) => {
                try {
                    if (!subscription.filter || subscription.filter(data, event)) {
                        await Promise.resolve(subscription.handler(data, event)); // Await if handler is async
                    }
                }
                catch (error) {
                    console.error(`Error in event handler for event type ${eventType}:`, error);
                    // Optionally, publish a specific error event to the bus itself
                    // this.publish({ type: EventType.StrategyError, timestamp: new Date(), data: { sourceEvent: event, error }});
                }
            });
        }
        else {
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
    subscribe(eventType, // Allow string for custom events
    handler, filter) {
        if (!this.subscribers.has(eventType)) {
            this.subscribers.set(eventType, []);
        }
        const subscription = { handler, filter };
        this.subscribers.get(eventType).push(subscription);
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
    getEventTypes() {
        return Array.from(this.subscribers.keys());
    }
    removeAllSubscribers() {
        this.subscribers.clear();
    }
}
exports.EventBus = EventBus;
