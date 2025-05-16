import { Event } from '@lib/Event';
import { Order } from '@lib/Order';
import { Strategy } from '@lib/Strategy';
import { Context } from '@lib/Context';
import { EventBus } from '@lib/EventBus';
import type { ExecutionProvider, PortfolioProvider } from '@lib/utils/types';

export class DemoStrategy<T> extends Strategy {
  private executionProvider: ExecutionProvider;
  private portfolio: PortfolioProvider;
  private eventBus: EventBus;
  private ctx: Context<T>;

  constructor({ initialContext, executionProvider, portfolio, eventBus }: {
    initialContext: T;
    eventBus: EventBus;
    executionProvider: ExecutionProvider;
    portfolio: PortfolioProvider;
  }) {
    super('Demo Strategy', 'A demo strategy that fetches the latest bars from Alpaca.');

    this.ctx = new Context<T>(initialContext, eventBus);
    this.eventBus = eventBus;
    this.executionProvider = executionProvider;
    this.portfolio = portfolio;

    this.handleOrderFilled = this.handleOrderFilled.bind(this);
    this.handleTick = this.handleTick.bind(this);
  }

  public async handleTick(event: Event<any>): Promise<void> {
    console.log('Executing Demo Strategy...', event);
    const order = event.data as Order;
    const response = await this.executionProvider.placeOrder(order)
    console.log('Order response:', response);
  }

  public async handleOrderFilled(event: Event<any>): Promise<void> {
    console.log('Handling order:', event);
  }

  async updateCtx(ctx: Partial<T>) {
    this.ctx.update(ctx);
  }

  async getCtx() {
    return await this.ctx.get()
  }
}