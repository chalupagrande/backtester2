import { Order } from "@lib/Order";
import { EventBus } from "@lib/EventBus";
import { EVENT_TYPES, ORDER_STATUS } from "@lib/utils/constants";
import { ExecutionProvider } from "@lib/utils/types";
import { Event } from "@lib/Event";

export class BacktestExecutionProvider implements ExecutionProvider {
  private orders: Map<string, Order> = new Map();
  private pendingOrders: Order[] = [];
  private eventBus: EventBus;

  constructor(eventBus: EventBus) {
    this.eventBus = eventBus;
    this.placeOrder = this.placeOrder.bind(this);
    this.cancelOrder = this.cancelOrder.bind(this);
    this.closeAPosition = this.closeAPosition.bind(this);
    this.processPendingOrders = this.processPendingOrders.bind(this);
  }

  async placeOrder(order: Order): Promise<any> {
    // Clone the order to avoid reference issues
    const placedOrder = new Order({
      symbol: order.symbol,
      qty: order.qty,
      side: order.side,
      type: order.type,
      timeInForce: order.timeInForce,
      limitPrice: order.limitPrice,
      stopPrice: order.stopPrice,
      trailPrice: order.trailPrice,
      trailPercent: order.trailPercent
    });

    // Set a unique ID for the order
    const orderId = `backtest-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    placedOrder.internalId = orderId;

    // Update order status
    placedOrder.setStatus(ORDER_STATUS.NEW);

    // Store the order
    this.orders.set(orderId, placedOrder);
    this.pendingOrders.push(placedOrder);

    // Emit order placed event
    this.eventBus.emit(EVENT_TYPES.ORDER_PLACED, placedOrder);

    console.log(`Backtest order placed: ${orderId} for ${placedOrder.symbol} ${placedOrder.side} ${placedOrder.qty}`);

    return {
      id: orderId,
      status: placedOrder.status,
      createdAt: placedOrder.createdAt
    };
  }

  async cancelOrder(orderId: string): Promise<void> {
    const order = this.orders.get(orderId);
    if (order) {
      order.setStatus(ORDER_STATUS.CANCELED);

      // Remove from pending orders
      this.pendingOrders = this.pendingOrders.filter(o => o.internalId !== orderId);

      // Emit order canceled event
      this.eventBus.emit(EVENT_TYPES.ORDER_CANCELED, order);

      console.log(`Backtest order canceled: ${orderId}`);
    } else {
      console.log(`Order ${orderId} not found for cancellation`);
    }
  }

  async closeAPosition(symbol: string): Promise<void> {
    console.log(`Closing position for ${symbol} in backtest`);
    // Implementation would depend on the backtestPortfolioProvider
  }

  // Process pending orders against the current market data
  processPendingOrders(tickData: any): void {
    if (!tickData || !tickData.symbol) return;

    const symbol = tickData.symbol;
    const price = tickData.c; // Using close price for simplicity

    // Filter orders for this symbol
    const symbolOrders = this.pendingOrders.filter(order => order.symbol === symbol);

    for (const order of symbolOrders) {
      // Simple simulation - in a real implementation you would check
      // if the order conditions are met based on the order type
      let shouldFill = false;

      switch (order.type) {
        case 'market':
          shouldFill = true;
          break;
        case 'limit':
          if (order.side === 'buy' && price <= (order.limitPrice || Infinity)) {
            shouldFill = true;
          } else if (order.side === 'sell' && price >= (order.limitPrice || 0)) {
            shouldFill = true;
          }
          break;
        case 'stop':
          if (order.side === 'buy' && price >= (order.stopPrice || 0)) {
            shouldFill = true;
          } else if (order.side === 'sell' && price <= (order.stopPrice || Infinity)) {
            shouldFill = true;
          }
          break;
        // Add other order types as needed
      }

      if (shouldFill) {
        this.fillOrder(order, price, tickData.t);
      }
    }
  }

  private fillOrder(order: Order, price: number, timestamp: string): void {
    // Update order status and fill details
    order.setStatus(ORDER_STATUS.FILLED);
    order.filledQty = order.qty;
    order.filledAvgPrice = price;
    order.filledAt = new Date(timestamp);

    // Remove from pending orders
    this.pendingOrders = this.pendingOrders.filter(o => o.internalId !== order.internalId);

    // Emit order filled event
    this.eventBus.emit(EVENT_TYPES.ORDER_FILLED, order);

    console.log(`Backtest order filled: ${order.internalId} at price ${price}`);
  }
}
