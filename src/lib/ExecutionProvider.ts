import { Order } from "./Order";
import { Position } from "./Position";

export abstract class ExecutionProvider {
  // Order execution methods
  abstract placeOrder(order: Order): Promise<void>;
  abstract cancelOrder(orderId: string): Promise<void>;
  abstract closeAPosition(symbol: string): Promise<void>;
  
  // Portfolio management methods
  abstract getOrder(orderId: string): Promise<Order | null>;
  abstract getOrders(options: any): Promise<Order[]>;
  abstract getPositions(): Promise<Position[]>;
}
