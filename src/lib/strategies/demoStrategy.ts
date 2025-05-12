import { Event } from '../Event';
import { Order } from '../Order';
import type { Portfolio } from '../Portfolio';
import { Strategy } from '../Strategy';
import type { ExecutionProvider } from '../utils/types';
import { Context } from '../Context';
import { EventBus } from '../EventBus';

export class DemoStrategy<T> extends Strategy {
  private executionProvider: ExecutionProvider;
  private portfolio: Portfolio;
  private eventBus: EventBus;
  private ctx: Context<T>;

  constructor({ defaultContext, executionProvider, portfolio, eventBus }: {
    defaultContext: T;
    eventBus: EventBus;
    executionProvider: ExecutionProvider;
    portfolio: Portfolio;
  }) {
    super('Demo Strategy', 'A demo strategy that fetches the latest bars from Alpaca.');

    this.ctx = new Context<T>(defaultContext, eventBus);
    this.eventBus = eventBus;
    this.executionProvider = executionProvider;
    this.portfolio = portfolio;

    this.handleOrderFilled = this.handleOrderFilled.bind(this);
    this.handleTick = this.handleTick.bind(this);
  }

  public async handleTick(event: Event<any>): Promise<void> {
    console.log('Executing Demo Strategy...', event);
  }

  public async handleOrderFilled(order: Order): Promise<void> {
    console.log('Handling order:', order);
  }

  async updateCtx(ctx: Partial<T>) {
    this.ctx.update(ctx);
  }

  async getCtx() {
    return await this.ctx.get()
  }
}