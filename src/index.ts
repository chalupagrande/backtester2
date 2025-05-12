import dotenv from 'dotenv';
dotenv.config();
// import { app } from './server/index';
import WebSocket from 'ws'
import { EventBus } from './lib/EventBus';
import { DemoStrategy } from './lib/strategies/demoStrategy';
import { Portfolio } from './lib/Portfolio';
import { AlpacaExecutionProvider } from './lib/providers/alpacaExecutionProvider';
import { EVENT_TYPES } from './lib/utils/constants';
import { Order } from './lib/Order';

const eventBus = new EventBus();
const executionProvider = new AlpacaExecutionProvider()
const portfolio = new Portfolio(10000, executionProvider, eventBus)
const strategy = new DemoStrategy(portfolio);

eventBus.subscribe('tick', strategy.handleTick)
eventBus.subscribe('orderFilled', portfolio.handleOrderFilled)
eventBus.subscribe('orderFilled', strategy.handleOrder)

if (!process.env.ALPACA_API_KEY_ID || !process.env.ALPACA_API_SECRET) {
  throw new Error('Missing Alpaca API credentials');
}

const ws = new WebSocket("wss://paper-api.alpaca.markets/stream", [], {

});
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
        eventBus.publish(EVENT_TYPES.tick, {});
      }
      break;
    }

    case 'trade_updates': {
      console.log('Trade updates:', messageData.data)
      const data = messageData.data;
      const order = data.order;
      if (order) {
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