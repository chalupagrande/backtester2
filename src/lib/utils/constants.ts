export const EVENT_TYPES = {
  TICK: 'tick',
  SIGNAL: 'signal',
  ORDER_PLACED: 'order_placed',
  ORDER_FILLED: 'order_filled',
  ORDER_CANCELED: 'order_canceled',
  CONTEXT_UPDATED: 'context_updated',
  
  // Add these new event types
  ORDER_REQUESTED: 'order_requested',
  ORDER_CANCEL_REQUESTED: 'order_cancel_requested',
  POSITION_CLOSE_REQUESTED: 'position_close_requested',
  POSITION_UPDATED: 'position_updated',
  PORTFOLIO_UPDATED: 'portfolio_updated',
  BACKTEST_STARTED: 'backtest_started',
  BACKTEST_COMPLETED: 'backtest_completed',
  TICK_RECEIVED: 'tick_received',
  BAR_RECEIVED: 'bar_received',
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
