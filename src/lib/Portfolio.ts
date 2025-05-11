import type { Order } from './Order';
import type { Position } from './Position';

export class Portfolio {
  public buyingPower: number = 0;
  public cash: number = 0;
  public equity: number = 0;
  public orders: Order[] = [];
  public positions: Position[] = [];

  constructor(investment: number) {
    this.buyingPower = investment;
    this.cash = investment;
  }
}