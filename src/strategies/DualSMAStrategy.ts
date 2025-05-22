import { Event } from '../lib/Event';
import { Order } from '../lib/Order';
import { Strategy } from '../lib/Strategy';
import { EventBus } from '../lib/EventBus';
import type { ExecutionProvider } from '../lib/ExecutionProvider';
import { sma } from 'indicatorts';

const initialContext = {
  last20Bars: [],
}

export class DualSMAStrategy extends Strategy {
  private executionProvider: ExecutionProvider;
  protected eventBus: EventBus;
  private ctx: Map<string, any>;
  constructor({ executionProvider, eventBus }: {
    eventBus: EventBus;
    executionProvider: ExecutionProvider;
  }) {
    super('Dual SMA Strategy', 'A strategy that uses dual SMAs for trading.', eventBus);

    this.ctx = new Map<string, any>(Object.entries(initialContext));
    this.eventBus = eventBus;
    this.executionProvider = executionProvider;

    this.handleOrderFilled = this.handleOrderFilled.bind(this);
    this.handleTick = this.handleTick.bind(this);

  }

  public async handleTick(event: Event<any>): Promise<void> {
    const last20Bars = this.ctx.get("last20Bars") || [];
    if (last20Bars.length < 20) {
      this.ctx.set("last20Bars", [...last20Bars, event.data])
      return
    } else {
      this.ctx.set("last20Bars", [...last20Bars.slice(1), event.data])

      const sma20 = sma(last20Bars.map((bar: any) => bar.c), { period: 20 });
      const sma10 = sma(last20Bars.map((bar: any) => bar.c), { period: 10 });

      console.log('SMA 20:', sma20, 'SMA 10:', sma10);
    }
  }

  public async handleOrderFilled(event: Event<any>): Promise<void> {
    console.log('Handling order:', event);
  }
}
