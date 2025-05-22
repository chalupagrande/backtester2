import { Order } from "./Order";
import { Position } from "./Position";
import { EventBus } from "./EventBus";

export abstract class ExecutionProvider {
  // Order execution methods
  abstract placeOrder(order: Order): Promise<void>;
  abstract cancelOrder(orderId: string): Promise<void>;
  abstract closeAPosition(symbol: string): Promise<void>;
  
  // Portfolio management methods
  abstract getOrder(orderId: string): Promise<Order | null>;
  abstract getOrders(options: any): Promise<Order[]>;
  abstract getPositions(): Promise<Position[]>;
  
  // Portfolio value methods
  abstract getPortfolioValue(): number;
  abstract getPortfolioHistory(): Array<{ timestamp: Date, equity: number, cash: number }>;
  abstract getPerformanceMetrics(): any;
  
  // Cash management
  abstract getCash(): number;
  abstract setCash(amount: number): void;
  
  // Order tracking
  abstract getPendingOrders(): Order[];
  abstract getAllOrders(): Map<string, Order>;
  
  // Process orders against market data
  abstract processPendingOrders(tickData: any): void;
}
