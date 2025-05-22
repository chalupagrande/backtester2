import { Event } from './Event';
import { EventBus } from './EventBus';
import { EventType } from './utils/types';

export class EventLogger {
  private eventBus: EventBus;
  private logs: Event<any>[] = [];
  private logToConsole: boolean;
  private unsubscribeFunctions: (() => void)[] = [];

  constructor(eventBus: EventBus, options: { logToConsole?: boolean } = {}) {
    this.eventBus = eventBus;
    this.logToConsole = options.logToConsole || false;
    this.subscribeToAllEvents();
  }

  private subscribeToAllEvents(): void {
    // Get all event types from the event bus
    const eventTypes = this.eventBus.getEventTypes();

    // Subscribe to each event type
    for (const eventType of eventTypes) {
      const unsubscribe = this.eventBus.subscribe(
        eventType,
        this.logEvent.bind(this)
      );
      this.unsubscribeFunctions.push(unsubscribe);
    }
  }

  private logEvent<T>(data: T, event: Event<T>): void {
    // Store the event in memory
    this.logs.push(event);

    // Optionally log to console
    if (this.logToConsole) {
      console.log(`[EVENT] ${event.type} at ${event.timestamp.toISOString()}:`, data);
    }
  }

  public getLogs(): Event<any>[] {
    return [...this.logs];
  }

  public getLogsByType(eventType: EventType): Event<any>[] {
    return this.logs.filter(event => event.type === eventType);
  }

  public clearLogs(): void {
    this.logs = [];
  }

  public exportLogs(format: 'json' | 'csv' = 'json'): string {
    if (format === 'json') {
      return JSON.stringify(this.logs, null, 2);
    } else {
      // Basic CSV implementation
      const headers = 'timestamp,type,data\n';
      const rows = this.logs.map(event =>
        `${event.timestamp.toISOString()},${event.type},${JSON.stringify(event.data)}`
      ).join('\n');
      return headers + rows;
    }
  }

  public dispose(): void {
    // Unsubscribe from all events
    this.unsubscribeFunctions.forEach(unsubscribe => unsubscribe());
    this.unsubscribeFunctions = [];
  }
}
