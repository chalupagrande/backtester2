import dotenv from 'dotenv';
dotenv.config();
// import { app } from './server/index';
import WebSocket from 'ws'
import { EventBus } from './lib/EventBus';
import { DemoStrategy } from './lib/strategies/demoStrategy';
import { Portfolio } from './lib/Portfolio';
import { AlpacaExecutionProvider } from './lib/providers/alpacaExecutionProvider';

const eventBus = new EventBus();
const executionProvider = new AlpacaExecutionProvider()
const portfolio = new Portfolio(10000, executionProvider, eventBus)

eventBus.subscribe('tick', DemoStrategy)
eventBus.publish('tick', { tick: 1 });
eventBus.subscribe('orderFilled', portfolio.handleOrderFilled)

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

  setTimeout(() => ws.send(JSON.stringify({
    action: 'listen',
    data: {
      streams: ['trade_updates']
    }
  })), 2000)
});

ws.on('message', (data: Buffer) => {
  console.log("MESSAGE DATA", data)
  console.log("JSON", JSON.parse(data.toString()))
  // const message = JSON.parse(data.toString());
  // if (message.stream === 'trade_updates') {
  //   const order = message.data;
  //   console.log('Order update:', order);
  //   eventBus.publish('orderFilled', order);
  // } else if (message.stream === 'account_updates') {
  //   const account = message.data;
  //   console.log('Account update:', account);
  // }
})

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing...');
  ws.close()
});