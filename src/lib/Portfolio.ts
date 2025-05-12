import { EventBus } from './EventBus';
import type { Order } from './Order';
import { Position } from './Position';
import type { Event } from './Event';
import { EVENT_TYPES } from './utils/constants';
import type { ExecutionProvider, GetOrderOptions } from './utils/types';

export class Portfolio {
  public buyingPower: number = 0;
  public cash: number = 0;
  public equity: number = 0;
  private orders: Order[] = [];
  private positions: Map<string, Position> = new Map();
  private executionProvider: ExecutionProvider;
  private eventBus: EventBus;

  constructor(investment: number, executionProvider: ExecutionProvider, eventBus: EventBus) {
    this.buyingPower = investment;
    this.cash = investment;
    this.executionProvider = executionProvider
    this.eventBus = eventBus;

    this.placeOrder = this.placeOrder.bind(this);
    this.cancelOrder = this.cancelOrder.bind(this);
    this.getOrder = this.getOrder.bind(this);
    this.getOrders = this.getOrders.bind(this);
    this.handleOrderFilled = this.handleOrderFilled.bind(this);
  }

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
    const positions = await this.executionProvider.getPositions()

    console.log("Positions:", positions);
  }

  public async closeAPosition(symbol: string): Promise<void> {
    this.executionProvider.closeAPosition(symbol)
  }

}