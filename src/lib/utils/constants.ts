export const EVENT_TYPES = {
  tick: 'tick',
  signal: 'signal',
  orderRequested: 'order_requested',
  orderPlaced: 'order_placed',
  orderFilled: 'order_filled',
} as const

export const ORDER_SIDE = {
  buy: 'buy',
  sell: 'sell'
} as const

export const ORDER_TYPE = {
  market: 'market',
  limit: 'limit',
  stop: 'stop',
  stop_limit: 'stop_limit'
} as const

export const ORDER_STATUS = {
  new: 'new',
  filled: 'filled',
  partially_filled: 'partially_filled',
  canceled: 'canceled',
  rejected: 'rejected'
} as const

export const RUNNER_MODE = {
  backtest: 'backtest',
  paper: 'paper',
  live: 'live'
}