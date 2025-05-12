export class Position {
  public symbol: string;
  public qty: number;
  public averageEntryPrice: number;
  public currentPrice: number;
  public lastUpdated: Date;

  constructor(
    symbol: string,
    qty: number,
    averageEntryPrice: number,
    currentPrice: number
  ) {
    this.symbol = symbol;
    this.qty = qty;
    this.averageEntryPrice = averageEntryPrice;
    this.currentPrice = currentPrice;
    this.lastUpdated = new Date();
  }

  public getMarketValue(): number {
    return this.qty * this.currentPrice;
  }

  public getUnrealizedPnL(): number {
    return (this.currentPrice - this.averageEntryPrice) * this.qty;
  }

  public getUnrealizedPnLPercentage(): number {
    return ((this.currentPrice - this.averageEntryPrice) / this.averageEntryPrice) * 100;
  }

  public updateCurrentPrice(price: number): void {
    this.currentPrice = price;
    this.lastUpdated = new Date();
  }
}