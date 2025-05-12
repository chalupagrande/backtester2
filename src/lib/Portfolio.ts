import { EventBus } from './EventBus';
import type { Order } from './Order';
import { Position } from './Position';
import type { Event } from './Event';
import { EVENT_TYPES, ORDER_SIDE, ORDER_TYPE } from './utils/constants';
import type { ExecutionProvider, GetOrderOptions } from './utils/types';

export class Portfolio {
  public buyingPower: number = 0;
  public cash: number = 0;
  public equity: number = 0;
  public orders: Order[] = [];
  public positions: Map<string, Position> = new Map();
  private executionProvider: ExecutionProvider;
  private eventBus: EventBus;

  constructor(investment: number, executionProvider: ExecutionProvider, eventBus: EventBus) {
    this.buyingPower = investment;
    this.cash = investment;
    this.executionProvider = executionProvider
    this.eventBus = eventBus;
  }

  // private updatePortfolio(order: Order): void {
  //   const position = this.positions.get(order.symbol);
  //   const isBuyOrder = order.side === ORDER_SIDE.buy;
  //   const orderQuantity = isBuyOrder ? order.quantity : -order.quantity;

  //   if (position) {
  //     const newQuantity = position.quantity + orderQuantity;

  //     if (newQuantity === 0) {
  //       // Position is closed, remove it from positions
  //       this.positions.delete(order.symbol);
  //     } else {
  //       // Update existing position
  //       if (isBuyOrder) {
  //         // For buy orders, update average entry price
  //         position.averageEntryPrice = (
  //           (position.averageEntryPrice * position.quantity) +
  //           (order.filledPrice * order.quantity)
  //         ) / (position.quantity + order.quantity);
  //       }
  //       position.quantity = newQuantity;
  //       position.currentPrice = order.filledPrice;
  //       position.lastUpdated = new Date();
  //     }
  //   } else {
  //     // Only create new position for buy orders
  //     if (isBuyOrder) {
  //       this.positions.set(
  //         order.symbol,
  //         new Position(
  //           order.symbol,
  //           order.quantity,
  //           order.filledPrice,
  //           order.filledPrice
  //         )
  //       );
  //     }
  //   }

  //   this.orders.push(order);
  // }

  public async placeOrder(order: Order): Promise<void> {
    this.executionProvider.placeOrder(order)
    this.eventBus.publish(EVENT_TYPES.order_placed, order)
  }

  public async cancelOrder(orderId: string): Promise<void> {
    this.executionProvider.cancelOrder(orderId)
    this.eventBus.publish(EVENT_TYPES.order_canceled, orderId)
  }

  public async getOrder(orderId: string): Promise<Order | null> {
    return this.executionProvider.getOrder(orderId)
  }

  public async getOrders(options: GetOrderOptions): Promise<Order[]> {
    return this.executionProvider.getOrders(options)
  }

  public async handleOrderFilled(event: Event<Order>): Promise<void> {
    console.log("Order filled:", event.data);
    const order = event.data;
  }

}