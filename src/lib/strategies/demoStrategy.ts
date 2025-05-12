import { Event } from '../Event';
import { Order } from '../Order';
import { Portfolio } from '../Portfolio';
import { getBarsLatest } from '../providers/alpacaDataProvider';
import { Strategy } from '../Strategy';


export class DemoStrategy extends Strategy {
  private portfolio: Portfolio;

  constructor(portfolio: Portfolio) {
    super('Demo Strategy', 'A demo strategy that fetches the latest bars from Alpaca.');
    this.portfolio = portfolio

    this.handleOrderFilled = this.handleOrderFilled.bind(this);
    this.handleTick = this.handleTick.bind(this);
  }

  public async handleTick(event: Event<any>): Promise<void> {
    console.log('Executing Demo Strategy...', event);
    const symbols = 'AAPL,MSFT,GOOGL';
    const data = await getBarsLatest(symbols);
    console.log('Latest bars data:', data);
    const order = new Order({
      symbol: 'AAPL',
      quantity: 1,
      side: 'buy',
      type: 'market',
      timeInForce: 'gtc',
    })
    await this.portfolio.placeOrder(order);
  }

  public async handleOrderFilled(order: Order): Promise<void> {
    console.log('Handling order:', order);
    this.portfolio.closeAPosition("AAPL")
  }
}