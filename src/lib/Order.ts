import type { OrderSide, OrderType, OrderStatus, TimeInForce } from './utils/types';
import { ORDER_STATUS, TIME_IN_FORCE } from './utils/constants';

export type OrderOptions = {
  symbol: string,
  qty: number,
  side: OrderSide,
  type: OrderType,
  limitPrice?: number,
  stopPrice?: number,
  trailPrice?: number,
  trailPercent?: number,
  timeInForce?: TimeInForce,
}
export class Order {
  public id: string;
  public symbol: string;
  public qty: number;
  public side: OrderSide;
  public type: OrderType;
  public status: OrderStatus;
  public timeInForce: string;
  public limitPrice?: number;
  public stopPrice?: number;
  public filledqty: number;
  public averageFilledPrice: number;
  public createdAt: Date;
  public updatedAt: Date;
  public trailPrice?: number;
  public trailPercent?: number;
  public notes: string;

  constructor(options: OrderOptions) {
    this.id = Math.random().toString(36).substring(7);
    this.symbol = options.symbol;
    this.qty = options.qty;
    this.side = options.side;
    this.type = options.type;
    this.status = ORDER_STATUS.new;
    this.timeInForce = TIME_IN_FORCE.day;
    this.limitPrice = options.limitPrice;
    this.stopPrice = options.stopPrice;
    this.filledqty = 0;
    this.averageFilledPrice = 0;
    this.trailPrice = options.trailPrice;
    this.trailPercent = options.trailPercent;

    this.notes = ""
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}