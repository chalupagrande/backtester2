import { Order } from "./Order";

export abstract class ExecutionProvider {
  abstract placeOrder(order: Order): Promise<void>;
  abstract cancelOrder(orderId: string): Promise<void>;
  abstract closeAPosition(symbol: string): Promise<void>;
}