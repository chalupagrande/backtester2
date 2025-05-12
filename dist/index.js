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
const constants_1 = require("./lib/utils/constants");
const Order_1 = require("./lib/Order");
const eventBus = new EventBus_1.EventBus();
const executionProvider = new alpacaExecutionProvider_1.AlpacaExecutionProvider();
const portfolio = new Portfolio_1.Portfolio(10000, executionProvider, eventBus);
const strategy = new demoStrategy_1.DemoStrategy(portfolio);
eventBus.subscribe('tick', strategy.handleTick);
eventBus.subscribe('orderFilled', portfolio.handleOrderFilled);
eventBus.subscribe('orderFilled', strategy.handleOrder);
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
});
ws.on('message', (buffer) => {
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
            }
            else {
                console.error('WebSocket connection not authorized');
            }
            break;
        }
        case 'listening': {
            console.log('Listening to streams:', messageData.data.streams);
            if (messageData.data.streams.includes('trade_updates')) {
                eventBus.publish(constants_1.EVENT_TYPES.tick, {});
            }
            break;
        }
        case 'trade_updates': {
            console.log('Trade updates:', messageData.data);
            const data = messageData.data;
            const order = data.order;
            if (order) {
                const curOrder = new Order_1.Order({
                    symbol: order?.symbol,
                    quantity: data?.qty,
                    side: order?.side,
                    type: order?.type,
                    timeInForce: order?.time_in_force,
                    limitPrice: order?.limit_price,
                    stopPrice: order?.stop_price,
                    trailPrice: order?.trail_price,
                    trailPercent: order?.trail_percent
                });
                eventBus.publish(constants_1.EVENT_TYPES.order_filled, curOrder);
            }
            break;
        }
        default: {
            console.log('Unknown stream:', messageData.stream);
            break;
        }
    }
});
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing...');
    ws.close();
});
