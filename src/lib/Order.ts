import type { OrderSide, OrderType, OrderStatus } from './utils/types';
import { ORDER_STATUS } from './utils/constants';

export class Order {
  public id: string;
  public symbol: string;
  public quantity: number;
  public side: OrderSide;
  public type: OrderType;
  public status: OrderStatus;
  public limitPrice?: number;
  public stopPrice?: number;
  public filledQuantity: number;
  public averageFilledPrice: number;
  public createdAt: Date;
  public updatedAt: Date;

  constructor(
    symbol: string,
    quantity: number,
    side: OrderSide,
    type: OrderType,
    limitPrice?: number,
    stopPrice?: number
  ) {
    this.id = Math.random().toString(36).substring(7);
    this.symbol = symbol;
    this.quantity = quantity;
    this.side = side;
    this.type = type;
    this.status = ORDER_STATUS.new;
    this.limitPrice = limitPrice;
    this.stopPrice = stopPrice;
    this.filledQuantity = 0;
    this.averageFilledPrice = 0;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}