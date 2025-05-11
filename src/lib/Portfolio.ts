import Alpaca from '@alpacahq/alpaca-trade-api';
import type { Order } from './Order';
import type { Position } from './Position';
import { AlpacaExecutionProvider } from './providers/alpacaExecutionProvider';
import type { ExecutionProvider, RunnerMode } from './utils/types';

export class Portfolio {
  public buyingPower: number = 0;
  public cash: number = 0;
  public equity: number = 0;
  public orders: Order[] = [];
  public positions: Position[] = [];
  private executionProvider: ExecutionProvider;
  private mode: RunnerMode;

  constructor(mode: RunnerMode, investment: number, executionProvider: ExecutionProvider) {
    this.buyingPower = investment;
    this.cash = investment;
    this.executionProvider = executionProvider
    this.mode = mode
  }




}