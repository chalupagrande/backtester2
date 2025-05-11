export const EVENT_TYPES = {
  tick: 'tick',
  signal: 'signal',
} as const

export const ORDER_SIDE = {
  BUY: 'buy',
  SELL: 'sell'
} as const

export const ORDER_TYPE = {
  MARKET: 'market',
  LIMIT: 'limit',
  STOP: 'stop',
  STOP_LIMIT: 'stop_limit'
} as const

export const ORDER_STATUS = {
  NEW: 'new',
  FILLED: 'filled',
  PARTIALLY_FILLED: 'partially_filled',
  CANCELED: 'canceled',
  REJECTED: 'rejected'
} as const