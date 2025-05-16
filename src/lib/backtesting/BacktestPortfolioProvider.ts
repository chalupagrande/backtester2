import { Order } from "../Order";
import { Position } from "../Position";
import { EventBus } from "../EventBus";
import { EVENT_TYPES, ORDER_STATUS } from "../utils/constants";
import { SortDirection, OrderSide, OrderStatus } from "../utils/types";
import { PortfolioProvider } from "../PortfolioProvider";

type GetOrderOptions = {
  status?: OrderStatus;
  limit?: number;
  after?: Date;
  until?: Date;
  side?: OrderSide;
  sortDirection?: SortDirection
}

export class BacktestPortfolioProvider extends PortfolioProvider {
  private orders: Map<string, Order> = new Map();
  private positions: Map<string, Position> = new Map();
  private cash: number;
  private initialCash: number;
  private eventBus: EventBus;
  private portfolioHistory: Array<{
    timestamp: Date;
    equity: number;
    cash: number;
  }> = [];

  constructor(eventBus: EventBus, initialCash: number = 100000) {
    super()
    this.eventBus = eventBus;
    this.cash = initialCash;
    this.initialCash = initialCash;

    // Bind methods
    this.getOrder = this.getOrder.bind(this);
    this.getOrders = this.getOrders.bind(this);
    this.getPositions = this.getPositions.bind(this);
    this.handleOrderFilled = this.handleOrderFilled.bind(this);
    this.handleTick = this.handleTick.bind(this);
    this.getPortfolioValue = this.getPortfolioValue.bind(this);
    this.getPortfolioHistory = this.getPortfolioHistory.bind(this);

    // Subscribe to events
    this.eventBus.subscribe(EVENT_TYPES.ORDER_FILLED, this.handleOrderFilled);
    this.eventBus.subscribe(EVENT_TYPES.TICK, this.handleTick);
  }

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
}
