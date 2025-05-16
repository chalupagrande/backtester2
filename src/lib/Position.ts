import { ORDER_SIDE } from "@lib/utils/constants";

export class Position {
  public internalId: string;
  public symbol: string;
  public qty: number;
  public averageEntryPrice: number;
  public marketValue: number;
  public currentPrice: number;
  public costBasis: number;
  public createdAt: Date;
  public updatedAt: Date;

  private brokerData: any;
  public notes: string;

  constructor() {
    this.internalId = Math.random().toString(36).substring(2, 15);
    this.updatedAt = new Date()
    this.createdAt = new Date();

    // Initialize with default values
    this.symbol = '';
    this.qty = 0;
    this.averageEntryPrice = 0;
    this.marketValue = 0;
    this.currentPrice = 0;
    this.costBasis = 0;
    this.notes = ''

    this.updateWithOrder = this.updateWithOrder.bind(this);
  }

  public updateWithOrder(order: any): void {
    if (order.side === ORDER_SIDE.BUY) {
      this.qty += order.qty;
      this.costBasis += order.filledQty * order.filledAvgPrice;
      this.averageEntryPrice = (this.averageEntryPrice + order.filledAvgPrice) / this.qty
    } else if (order.side === ORDER_SIDE.SELL) {
      this.qty -= order.qty;
      if (this.qty <= 0) {
        this.qty = 0;
        this.costBasis = 0;
        this.averageEntryPrice = 0;
        return
      }

      this.costBasis -= order.filledQty * order.filledAvgPrice;
      this.averageEntryPrice = (this.averageEntryPrice - order.filledAvgPrice) / this.qty
    }
    this.currentPrice = order.filledAvgPrice;
    this.marketValue = this.qty * this.currentPrice;
    this.updatedAt = new Date();
  }

  public updateCurrentPrice(price: number): void {
    this.currentPrice = price;
    this.marketValue = this.qty * this.currentPrice;
    this.updatedAt = new Date();
  }

  public setBrokerData(brokerData: any): void {
    this.brokerData = brokerData;
    this.updatedAt = new Date();
  }

  public getBrokerData(): any {
    return this.brokerData;
  }
}