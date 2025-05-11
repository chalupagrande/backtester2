import Alpaca from '@alpacahq/alpaca-trade-api';
import type { Order } from './Order';
import type { Position } from './Position';
import { AlpacaExecutionProvider } from './providers/alpacaExecutionProvider';
import { ExecutionProvider } from './utils/types';

export class Portfolio implements ExecutionProvider {
  public buyingPower: number = 0;
  public cash: number = 0;
  public equity: number = 0;
  public orders: Order[] = [];
  public positions: Position[] = [];
  private executionProvider: ExecutionProvider;

  constructor(investment: number, executionProvider: ExecutionProvider) {
    this.buyingPower = investment;
    this.cash = investment;
    this.executionProvider = executionProvider
  }

  async placeOrder(order: Order) {
    console.log('place order')
  }

  async cancelOrder(orderId: string) {
    console.log("canceling order")
  }

  async getOrder(orderId: string) {
    console.log('get order')

    return null
  }

  async getOrders() {
    console.log('getting orders')
    return []
  }

  async getPositions() {
    console.log("getting positions")
    return []
  }
}