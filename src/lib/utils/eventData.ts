import { Event } from '@lib/Event';

/**
 * Interface for event data that can be loaded from JSON
 */
export interface EventData {
  events: {
    type: string;
    timestamp: string;
    data: any;
  }[];
}

/**
 * Convert raw event data to Event objects
 */
export function parseEventData(eventData: EventData): Event<any>[] {
  return eventData.events.map(event =>
    new Event(
      event.type as any,
      event.data,
      new Date(event.timestamp)
    )
  );
}

/**
 * Sort events by timestamp
 */
export function sortEventsByTimestamp(events: Event<any>[]): Event<any>[] {
  return [...events].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
}

/**
 * Load event data from a JSON file
 */
export async function loadEventDataFromFile(filePath: string): Promise<Event<any>[]> {
  try {
    // In Node.js environment
    const fs = require('fs');
    const path = require('path');
    const data = fs.readFileSync(path.resolve(filePath), 'utf8');
    const eventData = JSON.parse(data) as EventData;
    return parseEventData(eventData);
  } catch (error) {
    console.error('Error loading event data:', error);
    return [];
  }
}
