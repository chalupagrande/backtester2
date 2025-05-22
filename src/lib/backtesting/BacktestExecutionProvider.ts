import { Order } from "../Order";
import { Position } from "../Position";
import { EventBus } from "../EventBus";
import { EVENT_TYPES, ORDER_STATUS, ORDER_SIDE } from "../utils/constants";
import { ExecutionProvider } from "../ExecutionProvider";
import { SortDirection, OrderSide, OrderStatus } from "../utils/types";

type GetOrderOptions = {
  status?: OrderStatus;
  limit?: number;
  after?: Date;
  until?: Date;
  side?: OrderSide;
  sortDirection?: SortDirection
}

export class BacktestExecutionProvider extends ExecutionProvider {
  private orders: Map<string, Order> = new Map();
  private pendingOrders: Order[] = [];
  private positions: Map<string, Position> = new Map();
  private eventBus: EventBus;
  private cash: number;
  private initialCash: number;
  private latestTickData: Map<string, any> = new Map(); // Store latest tick data by symbol
  private portfolioHistory: Array<{
    timestamp: Date;
    equity: number;
    cash: number;
  }> = [];

  constructor({ eventBus, initialCash }: { eventBus: EventBus, initialCash: number }) {
    super();
    this.eventBus = eventBus;
    this.cash = initialCash;
    this.initialCash = initialCash;

    // Bind methods
    this.placeOrder = this.placeOrder.bind(this);
    this.cancelOrder = this.cancelOrder.bind(this);
    this.closeAPosition = this.closeAPosition.bind(this);
    this.processPendingOrders = this.processPendingOrders.bind(this);
    this.handleOrderRequested = this.handleOrderRequested.bind(this);
    this.handleOrderCancelRequested = this.handleOrderCancelRequested.bind(this);
    this.handlePositionCloseRequested = this.handlePositionCloseRequested.bind(this);
    this.getOrder = this.getOrder.bind(this);
    this.getOrders = this.getOrders.bind(this);
    this.getPositions = this.getPositions.bind(this);
    this.handleOrderFilled = this.handleOrderFilled.bind(this);
    this.handleTick = this.handleTick.bind(this);

    // Subscribe to order-related events
    this.eventBus.subscribe(EVENT_TYPES.ORDER_REQUESTED, this.handleOrderRequested);
    this.eventBus.subscribe(EVENT_TYPES.ORDER_CANCEL_REQUESTED, this.handleOrderCancelRequested);
    this.eventBus.subscribe(EVENT_TYPES.POSITION_CLOSE_REQUESTED, this.handlePositionCloseRequested);
    this.eventBus.subscribe(EVENT_TYPES.ORDER_FILLED, this.handleOrderFilled);
    this.eventBus.subscribe(EVENT_TYPES.TICK, this.handleTick);
    this.eventBus.subscribe(EVENT_TYPES.ORDER_PLACED, this.handleOrderPlaced);
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
    const position = this.positions.get(symbol);

    if (position && position.qty > 0) {
      // Create a sell order to close the position
      const closeOrder = new Order({
        symbol: symbol,
        qty: position.qty,
        side: 'sell',
        type: 'market',
        timeInForce: 'day'
      });

      await this.placeOrder(closeOrder);
    }
  }

  // Portfolio management methods
  async getOrder(orderId: string): Promise<Order | null> {
    return this.orders.get(orderId) || null;
  }

  async getOrders(options: GetOrderOptions = {}): Promise<Order[]> {
    let filteredOrders = Array.from(this.orders.values());

    // Apply filters
    if (options.status) {
      filteredOrders = filteredOrders.filter(order => order.status === options.status);
    }

    if (options.side) {
      filteredOrders = filteredOrders.filter(order => order.side === options.side);
    }

    const afterDate = options?.after;
    const untilDate = options?.until;
    if (afterDate) {
      filteredOrders = filteredOrders.filter(order => order.createdAt >= afterDate);
    }

    if (untilDate) {
      filteredOrders = filteredOrders.filter(order => order.createdAt <= untilDate);
    }

    // Sort orders
    filteredOrders.sort((a, b) => {
      const direction = options.sortDirection === 'desc' ? -1 : 1;
      return direction * (a.createdAt.getTime() - b.createdAt.getTime());
    });

    // Apply limit
    if (options.limit && options.limit > 0) {
      filteredOrders = filteredOrders.slice(0, options.limit);
    }

    return filteredOrders;
  }

  async getPositions(): Promise<Position[]> {
    return Array.from(this.positions.values());
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

  // Handle order filled events
  private handleOrderFilled(order: Order): void {
    if (order.status !== ORDER_STATUS.FILLED) return;

    // Store the order
    this.orders.set(order.internalId, order);

    // Update position
    this.updatePosition(order);

    // Update cash
    this.updateCash(order);

    // Record portfolio state
    this.recordPortfolioState();

    console.log(`Portfolio updated after order fill: ${order.symbol} ${order.side} ${order.qty} @ ${order.filledAvgPrice}`);
  }

  // Handle tick events to update position values
  private handleTick(tickData: any): void {
    if (!tickData || !tickData.symbol) return;

    const symbol = tickData.symbol;
    const price = tickData.c; // Using close price

    // Store the latest tick data for this symbol
    this.latestTickData.set(symbol, tickData);

    // Update position market value if we have this symbol
    const position = this.positions.get(symbol);
    if (position) {
      position.updateCurrentPrice(price);

      // Record portfolio state on each tick
      this.recordPortfolioState();
    }
  }

  // Update position based on filled order
  private updatePosition(order: Order): void {
    const symbol = order.symbol;

    // Get existing position or create new one
    let position = this.positions.get(symbol);
    if (!position) {
      position = new Position();
      position.symbol = symbol;
      this.positions.set(symbol, position);
    }

    // Update position with order
    position.updateWithOrder(order);

    // Remove position if quantity is zero
    if (position.qty === 0) {
      this.positions.delete(symbol);
    }
  }

  // Update cash based on filled order
  private updateCash(order: Order): void {
    if (!order.filledAvgPrice) return;

    const orderValue = order.qty * order.filledAvgPrice;

    if (order.side === 'buy') {
      this.cash -= orderValue;
    } else if (order.side === 'sell') {
      this.cash += orderValue;
    }

    // Ensure cash doesn't go negative (simple check)
    if (this.cash < 0) {
      console.warn('Warning: Cash balance went negative in backtest');
    }
  }

  // Record current portfolio state for historical tracking
  private recordPortfolioState(): void {
    const equity = this.getPortfolioValue();

    this.portfolioHistory.push({
      timestamp: new Date(),
      equity,
      cash: this.cash
    });
  }

  // Calculate total portfolio value (cash + positions)
  public getPortfolioValue(): number {
    let positionsValue = 0;

    for (const position of this.positions.values()) {
      positionsValue += position.marketValue;
    }

    return this.cash + positionsValue;
  }

  // Implement abstract methods for cash management
  public getCash(): number {
    return this.cash;
  }

  public setCash(amount: number): void {
    this.cash = amount;
    this.recordPortfolioState();
  }

  // Implement abstract methods for order tracking
  public getPendingOrders(): Order[] {
    return [...this.pendingOrders];
  }

  public getAllOrders(): Map<string, Order> {
    return new Map(this.orders);
  }

  // Get portfolio history for analysis
  public getPortfolioHistory(): Array<{ timestamp: Date, equity: number, cash: number }> {
    return this.portfolioHistory;
  }

  // Get performance metrics
  public getPerformanceMetrics(): any {
    const currentValue = this.getPortfolioValue();
    const totalReturn = (currentValue - this.initialCash) / this.initialCash;

    // Calculate max drawdown
    let maxDrawdown = 0;
    let peak = this.initialCash;

    for (const point of this.portfolioHistory) {
      if (point.equity > peak) {
        peak = point.equity;
      }

      const drawdown = (peak - point.equity) / peak;
      if (drawdown > maxDrawdown) {
        maxDrawdown = drawdown;
      }
    }

    return {
      initialCash: this.initialCash,
      currentValue,
      totalReturn,
      totalReturnPct: totalReturn * 100,
      maxDrawdown,
      maxDrawdownPct: maxDrawdown * 100,
      numTrades: this.orders.size,
      positions: Array.from(this.positions.values()).length
    };
  }

  // Get the latest tick data for a symbol
  private getLatestTickData(symbol: string): any {
    return this.latestTickData.get(symbol);
  }

  // Event handlers for order-related events
  private async handleOrderRequested(orderData: Order): Promise<void> {
    await this.placeOrder(orderData);
  }

  private async handleOrderCancelRequested(data: { orderId: string }): Promise<void> {
    await this.cancelOrder(data.orderId);
  }

  private async handlePositionCloseRequested(data: { symbol: string }): Promise<void> {
    await this.closeAPosition(data.symbol);
  }

  private async handleOrderPlaced(order: Order): Promise<void> {
    // When an order is placed, try to process it immediately with the latest market data
    // This helps ensure orders are processed even between tick events
    const latestTickData = this.getLatestTickData(order.symbol);
    if (latestTickData) {
      this.processPendingOrders(latestTickData);
    }
  }
}
