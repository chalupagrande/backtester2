export const EVENT_TYPES = {
  tick: 'tick',
  signal: 'signal',
  order_placed: 'order_placed',
  order_filled: 'order_filled',
  order_canceled: 'order_canceled',
} as const

export const ORDER_SIDE = {
  buy: 'buy',
  sell: 'sell'
} as const

export const ORDER_TYPE = {
  market: 'market',
  limit: 'limit',
  stop: 'stop',
  stop_limit: 'stop_limit',
  trailing_stop: 'trailing_stop',
} as const

export const ORDER_STATUS = {
  new: 'new',
  filled: 'filled',
  partially_filled: 'partially_filled',
  canceled: 'canceled',
  rejected: 'rejected'
} as const

export const TIME_IN_FORCE = {
  day: 'day',
  gtc: 'gtc',
  opg: 'opg',
  cls: 'cls',
  ioc: 'ioc',
  fok: 'fok',
}

export const DIRECTION = {
  asc: 'asc',
  desc: 'desc',
}