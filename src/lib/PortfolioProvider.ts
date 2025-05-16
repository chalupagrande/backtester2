import { Order } from "./Order";
import { Position } from "./Position";

export abstract class PortfolioProvider {
  abstract getOrder(orderId: string): Promise<Order | null>;
  abstract getOrders(options: any): Promise<Order[]>;
  abstract getPositions(): Promise<Position[]>;
}