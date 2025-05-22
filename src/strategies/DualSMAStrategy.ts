import { Event } from '../lib/Event';
import { Order } from '../lib/Order';
import { Strategy } from '../lib/Strategy';
import { EventBus } from '../lib/EventBus';
import type { ExecutionProvider } from '../lib/ExecutionProvider';
import Dinero from 'dinero.js'
// import { sma } from 'indicatorts';


const initialContext = {
  last20Bars: [],
  isTrendingUp: false
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
    const barsDesiredLength = 20;
    try {
      if (this.ctx.get("last20Bars").length === barsDesiredLength) {
        this.ctx.set("last20Bars", this.ctx.get("last20Bars").slice(1))
      }
      this.ctx.set("last20Bars", [...this.ctx.get("last20Bars"), event.data])

      if (this.ctx.get("last20Bars").length === barsDesiredLength) {
        const last20Bars = this.ctx.get("last20Bars");
        const closePricesInCents = last20Bars.map((bar: any) => Math.round(bar.c * 100));
        const sma20 = averageMoneyInCents(closePricesInCents);
        const sma10 = averageMoneyInCents(closePricesInCents.slice(-10));
        console.log('SMA20:', sma20, 'SMA10:', sma10, 'Last Price:', event.data.c, 'date', event.data.t);

        const isTrendingUp = sma20 > sma10;
        this.ctx.set("isTrendingUp", isTrendingUp);
      }


    } catch (error) {
      throw new Error(`Error in handleTick: ${error}`);
    }
  }

  public async handleOrderFilled(event: Event<any>): Promise<void> {
    console.log('Handling order:', event);
  }
}


function averageMoneyInCents(array: number[]): number {
  try {
    if (array.length === 0) {
      throw new Error('Cannot calculate average of an empty array');
    }
    const dSum = array.reduce((dAcc, val) => {
      const dVal = Dinero({ amount: val, currency: 'USD' });
      const dSum = dAcc.add(dVal);
      return dSum
    }, Dinero({ amount: 0, currency: 'USD' }));

    const average = dSum.divide(array.length).getAmount();
    return average;
  } catch (error) {
    throw new Error(`Error in average calculation: ${error}`);
  }
}