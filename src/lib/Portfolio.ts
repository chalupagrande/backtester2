import { EventBus } from './EventBus';
import type { Order } from './Order';
import { Position } from './Position';
import type { ExecutionProvider } from './utils/types';

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
  }
}