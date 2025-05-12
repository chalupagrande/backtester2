import dotenv from 'dotenv';
dotenv.config();
// import { app } from './server/index';
import WebSocket from 'ws'
import { EventBus } from './lib/EventBus';
import { Event } from './lib/Event';
import { DemoStrategy } from './lib/strategies/demoStrategy';
import { Portfolio } from './lib/Portfolio';
import { AlpacaExecutionProvider } from './lib/providers/alpacaExecutionProvider';
import { EVENT_TYPES, ORDER_SIDE, ORDER_TYPE, TIME_IN_FORCE } from './lib/utils/constants';
import { Order } from './lib/Order';
import type { Order as OrderType } from './lib/Order';
if (!process.env.ALPACA_API_KEY_ID || !process.env.ALPACA_API_SECRET) {
  throw new Error('Missing Alpaca API credentials');
}


const defaultContext = { last14Bars: [] }
const eventBus = new EventBus();
const executionProvider = new AlpacaExecutionProvider()
const portfolio = new Portfolio(10000, executionProvider, eventBus)
const strategy = new DemoStrategy<typeof defaultContext>({ defaultContext, executionProvider, portfolio, eventBus });

eventBus.subscribe(EVENT_TYPES.tick, strategy.handleTick)
eventBus.subscribe(EVENT_TYPES.order_filled, strategy.handleOrderFilled)

const curOrder = new Order({
  symbol: "AAPL",
  quantity: 1,
  side: ORDER_SIDE.buy,
  type: ORDER_TYPE.market,
  timeInForce: TIME_IN_FORCE.gtc,
})
const e = new Event<OrderType>(EVENT_TYPES.tick, curOrder)




const ws = new WebSocket("wss://paper-api.alpaca.markets/stream");

ws.on('open', () => {
  console.log('Connected to Alpaca WebSocket');
  ws.send(JSON.stringify({
    action: 'authenticate',
    key: process.env.ALPACA_API_KEY_ID,
    secret: process.env.ALPACA_API_SECRET
  }));
});

ws.on('message', (buffer: Buffer) => {
  const messageData = JSON.parse(buffer.toString());
  switch (messageData.stream) {
    case 'authorization': {
      if (messageData.data.status === 'authorized') {
        console.log('WebSocket connection authorized');
        ws.send(JSON.stringify({
          action: 'listen',
          data: {
            streams: ['trade_updates']
          }
        }));
      } else {
        console.error('WebSocket connection not authorized');
      }
      break;
    }
    case 'listening': {
      console.log('Listening to streams:', messageData.data.streams);
      if (messageData.data.streams.includes('trade_updates')) {
        eventBus.publish(EVENT_TYPES.tick, e);
      }
      break;
    }

    case 'trade_updates': {
      console.log('Trade updates:', messageData.data)
      const data = messageData.data;
      const order = data.order;
      if (order && data.event === 'fill') {
        const curOrder = new Order({
          symbol: order?.symbol,
          quantity: data?.qty,
          side: order?.side,
          type: order?.type,
          timeInForce: order?.time_in_force,
          limitPrice: order?.limit_price,
          stopPrice: order?.stop_price,
          trailPrice: order?.trail_price,
          trailPercent: order?.trail_percent
        })
        eventBus.publish(EVENT_TYPES.order_filled, curOrder);
      }
      break;
    }

    default: {
      console.log('Unknown stream:', messageData.stream);
      break;
    }
  }
})

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing...');
  ws.close()
});