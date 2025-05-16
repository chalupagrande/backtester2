import { AlgorithmRunner } from './AlgorithmRunner';
import { EVENT_TYPES } from '../utils/constants';
import WebSocket from 'ws';
import { Event } from '../Event';
import { Order } from '../Order';
import type { Order as TOrder } from '../Order';

export class LiveAlgorithmRunner extends AlgorithmRunner {
  private tradeUpdatesWs: WebSocket | null = null;
  private marketDataWs: WebSocket | null = null;
  
  async start(): Promise<void> {
    // Connect to Alpaca WebSockets
    this.connectTradeUpdates();
    this.connectMarketData();
  }
  
  async stop(): Promise<void> {
    // Close WebSockets
    if (this.tradeUpdatesWs) this.tradeUpdatesWs.close();
    if (this.marketDataWs) this.marketDataWs.close();
  }
  
  getResults(): any {
    // Return current portfolio stats
    return this.portfolioProvider.getPositions();
  }
  
  private connectTradeUpdates(): void {
    this.tradeUpdatesWs = new WebSocket("wss://paper-api.alpaca.markets/stream");
    
    this.tradeUpdatesWs.on('open', () => {
      console.log('Connected for Trade Updates');
      // Authenticate
      this.tradeUpdatesWs!.send(JSON.stringify({
        action: 'authenticate',
        key: process.env.ALPACA_API_KEY_ID,
        secret: process.env.ALPACA_API_SECRET
      }));
    });
    
    this.tradeUpdatesWs.on('message', (buffer: Buffer) => {
      const messageData = JSON.parse(buffer.toString());
      
      switch (messageData.stream) {
        // TRADE UPDATES
        case 'trade_updates': {
          console.log('Trade updates:', messageData.data);
          const data = messageData.data;
          const order = data.order;
          if (order && data.event === 'fill') {
            console.log("Calling Order Filled Event");
            const curOrder = new Order({
              symbol: order?.symbol,
              qty: data?.qty,
              side: order?.side,
              type: order?.type,
              timeInForce: order?.time_in_force,
              limitPrice: order?.limit_price,
              stopPrice: order?.stop_price,
              trailPrice: order?.trail_price,
              trailPercent: order?.trail_percent
            });
            const orderFilledEvent = new Event<TOrder>(EVENT_TYPES.ORDER_FILLED, curOrder);
            this.eventBus.emit(EVENT_TYPES.ORDER_FILLED, orderFilledEvent);
          }
          break;
        }

        //AUTHORIZATION
        case 'authorization': {
          if (messageData.data.status === 'authorized') {
            // once authorized, listen to the trade_updates stream
            console.log('WebSocket connection authorized');
            this.tradeUpdatesWs!.send(JSON.stringify({
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
          break;
        }

        default: {
          console.log('Unknown stream:', messageData.stream);
          break;
        }
      }
    });
  }
  
  private connectMarketData(): void {
    this.marketDataWs = new WebSocket("wss://stream.data.alpaca.markets/v2/test");
    
    this.marketDataWs.on('open', () => {
      console.log('Connected to Market Data');
      // authenticate
      this.marketDataWs!.send(JSON.stringify({
        action: 'auth',
        key: process.env.ALPACA_API_KEY_ID,
        secret: process.env.ALPACA_API_SECRET
      }));

      // wait for authentication
      setTimeout(() => {
        this.marketDataWs!.send(JSON.stringify({
          action: 'subscribe',
          bars: ["AAPL", "MSFT", "TSLA"],
        }));
      }, 3000);
    });

    this.marketDataWs.on('message', (buffer: Buffer) => {
      const messageData = JSON.parse(buffer.toString());
      
      // Process market data and emit tick events
      if (messageData[0] && messageData[0].T === 'b') {
        // Bar data
        for (const bar of messageData) {
          const tickEvent = new Event(EVENT_TYPES.TICK, bar);
          this.eventBus.emit(EVENT_TYPES.TICK, tickEvent);
        }
      }
    });
  }
}
