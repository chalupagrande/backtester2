import { EventBus } from './EventBus';
import { Order } from './Order';
import { EVENT_TYPES } from './utils/constants';

export class Strategy {
  public name: string;
  public description: string;
  protected eventBus?: EventBus;

  constructor(name: string, description: string, eventBus?: EventBus) {
    this.name = name;
    this.description = description;
    this.eventBus = eventBus;
  }

  public async execute(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  // Helper methods for event-based communication
  protected requestOrder(order: Order): void {
    if (!this.eventBus) {
      throw new Error('EventBus not initialized in strategy');
    }
    this.eventBus.emit(EVENT_TYPES.ORDER_REQUESTED, order);
  }

  protected requestOrderCancellation(orderId: string): void {
    if (!this.eventBus) {
      throw new Error('EventBus not initialized in strategy');
    }
    this.eventBus.emit(EVENT_TYPES.ORDER_CANCEL_REQUESTED, { orderId });
  }

  protected requestPositionClose(symbol: string): void {
    if (!this.eventBus) {
      throw new Error('EventBus not initialized in strategy');
    }
    this.eventBus.emit(EVENT_TYPES.POSITION_CLOSE_REQUESTED, { symbol });
  }
}
