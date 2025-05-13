import dotenv from 'dotenv';
dotenv.config();
// import { app } from './server/index';
import WebSocket from 'ws'
import { EventBus } from './lib/EventBus';
import { DemoStrategy } from './lib/strategies/demoStrategy';
import { AlpacaExecutionProvider } from './lib/providers/alpacaExecutionProvider';
import { AlpacaPortfolioProvider } from './lib/providers/alpacaPortfolioProvider';
import { EVENT_TYPES } from './lib/utils/constants';
import type { Bar } from './lib/utils/types';
import { Order } from './lib/Order';

if (!process.env.ALPACA_API_KEY_ID || !process.env.ALPACA_API_SECRET) {
  throw new Error('Missing Alpaca API credentials');
}

type InitialContextType = {
  last14Bars: Bar[];
}
const initialContext: InitialContextType = { last14Bars: [] }
const eventBus = new EventBus();
const executionProvider = new AlpacaExecutionProvider()
const portfolio = new AlpacaPortfolioProvider()
const strategy = new DemoStrategy<InitialContextType>({ initialContext, executionProvider, portfolio, eventBus });

eventBus.subscribe(EVENT_TYPES.TICK, strategy.handleTick)
eventBus.subscribe(EVENT_TYPES.ORDER_FILLED, strategy.handleOrderFilled)


//   ___   _ _____ _    __      _____ ___ ___  ___   ___ _  _____ _____ 
//  |   \ /_\_   _/_\   \ \    / / __| _ ) __|/ _ \ / __| |/ / __|_   _|
//  | |) / _ \| |/ _ \   \ \/\/ /| _|| _ \__ \ (_) | (__| ' <| _|  | |  
//  |___/_/ \_\_/_/ \_\   \_/\_/ |___|___/___/\___/ \___|_|\_\___| |_|  

const ws1 = new WebSocket("wss://paper-api.alpaca.markets/stream");
ws1.on('open', () => {
  console.log('Connected to Alpaca WebSocket');
  // authenticate
  ws1.send(JSON.stringify({
    action: 'authenticate',
    key: process.env.ALPACA_API_KEY_ID,
    secret: process.env.ALPACA_API_SECRET
  }));
});

ws1.on('message', (buffer: Buffer) => {
  const messageData = JSON.parse(buffer.toString());
  switch (messageData.stream) {
    // TRADE UPDATES
    case 'trade_updates': {
      console.log('Trade updates:', messageData.data)
      // const data = messageData.data;
      // const order = data.order;
      // if (order && data.event === 'fill') {
      //   const curOrder = new Order({
      //     symbol: order?.symbol,
      //     qty: data?.qty,
      //     side: order?.side,
      //     type: order?.type,
      //     timeInForce: order?.time_in_force,
      //     limitPrice: order?.limit_price,
      //     stopPrice: order?.stop_price,
      //     trailPrice: order?.trail_price,
      //     trailPercent: order?.trail_percent
      //   })
      //   eventBus.emit(EVENT_TYPES.ORDER_FILLED, curOrder);
      // }
      break;
    }

    //AUTHORIZATION
    case 'authorization': {
      if (messageData.data.status === 'authorized') {
        // once authorized, listen to the trade_updates stream
        console.log('WebSocket connection authorized');
        ws1.send(JSON.stringify({
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

    //LISTENING
    case 'listening': {
      console.log('Listening to streams:', messageData.data.streams);
      if (messageData.data.streams.includes('trade_updates')) {
        // eventBus.emit(EVENT_TYPES.tick, e);
      }
      break;
    }

    default: {
      console.log('Unknown stream:', messageData.stream);
      break;
    }
  }
})


const ws2 = new WebSocket("wss://stream.data.alpaca.markets/v2/test");
ws2.on('open', () => {
  console.log('Connected to Alpaca WebSocket');
  // authenticate
  ws2.send(JSON.stringify({
    action: 'auth',
    key: process.env.ALPACA_API_KEY_ID,
    secret: process.env.ALPACA_API_SECRET
  }));

  // wait for authentication
  setTimeout(() => {
    ws2.send(JSON.stringify({
      action: 'subscribe',
      bars: ["FAKEPACA"],
    }));
  }, 3000)
});

ws2.on('message', (buffer: Buffer) => {
  const messageData = JSON.parse(buffer.toString());
  console.log('TEST DATA STREAM:', messageData);
})


process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing...');
  ws1.close()
  ws2.close()
});