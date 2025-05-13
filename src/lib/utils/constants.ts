export const EVENT_TYPES = {
  TICK: 'tick',
  SIGNAL: 'signal',
  ORDER_PLACED: 'order_placed',
  ORDER_FILLED: 'order_filled',
  ORDER_CANCELED: 'order_canceled',
  CONTEXT_UPDATED: 'context_updated',
} as const

export const ORDER_SIDE = {
  BUY: 'buy',
  SELL: 'sell'
} as const

export const ORDER_TYPE = {
  MARKET: 'market',
  LIMIT: 'limit',
  STOP: 'stop',
  STOP_LIMIT: 'stop_limit',
  TRAILING_STOP: 'trailing_stop',
} as const

export const ORDER_STATUS = {
  PENDING: 'pending', // Before it is placed to broker
  PENDING_NEW: 'pending_new', // received by broker but not yet accepted
  NEW: 'new', // accepted by broker
  FILLED: 'filled', // fully filled
  PARTIALLY_FILLED: 'partially_filled', // partially filled
  CANCELED: 'canceled',
  REJECTED: 'rejected'
} as const

export const TIME_IN_FORCE = {
  DAY: 'day',
  GTC: 'gtc',
  OPG: 'opg',
  CLS: 'cls',
  IOC: 'ioc',
  FOK: 'fok',
} as const

export const SORT_DIRECTION = {
  ASC: 'asc',
  DESC: 'desc',
}