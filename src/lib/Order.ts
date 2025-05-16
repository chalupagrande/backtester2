import type { OrderSide, OrderType, OrderStatus, TimeInForce } from './utils/types';
import { ORDER_STATUS, TIME_IN_FORCE } from './utils/constants';

export type OrderOptions = {
  symbol: string,
  qty: number,
  side: OrderSide,
  type: OrderType,
  timeInForce: TimeInForce,
  limitPrice?: number,
  stopPrice?: number,
  trailPrice?: number,
  trailPercent?: number,
  brokerData?: any
}
export class Order {
  public internalId: string;
  public symbol: string;
  public qty: number;
  public side: OrderSide;
  public type: OrderType;
  public status: OrderStatus;
  public timeInForce: TimeInForce;
  public limitPrice?: number;
  public stopPrice?: number;
  public trailPrice?: number;
  public trailPercent?: number;
  //filled
  public filledAt: Date | null;
  public filledQty: number;
  public filledAvgPrice: number | null;
  // meta
  public notes: string;
  private brokerData: any;
  public createdAt: Date;
  public updatedAt: Date;

  constructor(opts: OrderOptions) {
    this.internalId = Math.random().toString(36).substring(2, 15);
    this.symbol = opts.symbol;
    this.qty = opts.qty;
    this.side = opts.side;
    this.type = opts.type;
    this.status = ORDER_STATUS.PENDING
    this.timeInForce = opts.timeInForce

    //order type specific
    this.limitPrice = opts.limitPrice;
    this.stopPrice = opts.stopPrice;
    this.trailPrice = opts.trailPrice;
    this.trailPercent = opts.trailPercent;

    // filled
    this.filledAt = null
    this.filledQty = 0;
    this.filledAvgPrice = null;

    this.brokerData = opts.brokerData || null;
    this.notes = ""
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  public setStatus(status: OrderStatus) {
    this.status = status;
    this.updatedAt = new Date();
  }

  public setBrokerData(data: any) {
    this.brokerData = data;
    this.updatedAt = new Date();
  }

  public getBrokerData() {
    return this.brokerData;
  }

  public updateBrokerData(data: any) {
    this.brokerData = { ...this.brokerData, ...data };
    this.updatedAt = new Date();
  }
}