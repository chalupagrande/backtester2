export class Position {
  public symbol: string;
  public quantity: number;
  public averageEntryPrice: number;
  public currentPrice: number;
  public lastUpdated: Date;

  constructor(
    symbol: string,
    quantity: number,
    averageEntryPrice: number,
    currentPrice: number
  ) {
    this.symbol = symbol;
    this.quantity = quantity;
    this.averageEntryPrice = averageEntryPrice;
    this.currentPrice = currentPrice;
    this.lastUpdated = new Date();
  }

  public getMarketValue(): number {
    return this.quantity * this.currentPrice;
  }

  public getUnrealizedPnL(): number {
    return (this.currentPrice - this.averageEntryPrice) * this.quantity;
  }

  public getUnrealizedPnLPercentage(): number {
    return ((this.currentPrice - this.averageEntryPrice) / this.averageEntryPrice) * 100;
  }

  public updateCurrentPrice(price: number): void {
    this.currentPrice = price;
    this.lastUpdated = new Date();
  }
}