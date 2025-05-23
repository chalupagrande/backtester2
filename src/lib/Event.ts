import type { EventType } from './utils/types';

export class Event<T> {
  type: EventType;
  timestamp: Date;
  data: T;

  constructor(type: EventType, data: T, timestamp?: Date) {
    this.type = type;
    this.data = data;
    this.timestamp = timestamp || new Date();
  }
}