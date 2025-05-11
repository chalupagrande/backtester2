export const EventTypes = {
  tick: 'tick',
  signal: 'signal',
} as const

export type EventType = keyof typeof EventTypes;
