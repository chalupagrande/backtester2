"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// import { app } from './server/index';
const ws_1 = __importDefault(require("ws"));
const EventBus_1 = require("./lib/EventBus");
const demoStrategy_1 = require("./lib/strategies/demoStrategy");
const Portfolio_1 = require("./lib/Portfolio");
const alpacaExecutionProvider_1 = require("./lib/providers/alpacaExecutionProvider");
const eventBus = new EventBus_1.EventBus();
const executionProvider = new alpacaExecutionProvider_1.AlpacaExecutionProvider();
const portfolio = new Portfolio_1.Portfolio(10000, executionProvider, eventBus);
eventBus.subscribe('tick', demoStrategy_1.DemoStrategy);
eventBus.publish('tick', { tick: 1 });
eventBus.subscribe('orderFilled', portfolio.handleOrderFilled);
if (!process.env.ALPACA_API_KEY_ID || !process.env.ALPACA_API_SECRET) {
    throw new Error('Missing Alpaca API credentials');
}
const ws = new ws_1.default("wss://paper-api.alpaca.markets/stream", [], {});
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
    })), 2000);
});
ws.on('message', (data) => {
    console.log("MESSAGE DATA", data);
    console.log("JSON", JSON.parse(data.toString()));
    // const message = JSON.parse(data.toString());
    // if (message.stream === 'trade_updates') {
    //   const order = message.data;
    //   console.log('Order update:', order);
    //   eventBus.publish('orderFilled', order);
    // } else if (message.stream === 'account_updates') {
    //   const account = message.data;
    //   console.log('Account update:', account);
    // }
});
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing...');
    ws.close();
});
