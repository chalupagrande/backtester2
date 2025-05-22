import type { Order } from "../lib/Order";
import { FetchClient } from "../lib/utils/fetchClient";
import { ExecutionProvider } from "../lib/ExecutionProvider";
import { alpacaTradingClient } from "../clients/alpacaClient";
import { SortDirection, OrderSide, OrderStatus } from "../lib/utils/types";

type GetOrderOptions = {
  status?: OrderStatus;
  limit?: number;
  after?: Date;
  until?: Date;
  side?: OrderSide;
  sortDirection?: SortDirection
}

export class AlpacaExecutionProvider extends ExecutionProvider {
  private client: FetchClient;

  constructor() {
    super();
    this.client = alpacaTradingClient;
  }

  async placeOrder(order: Order) {
    try {
      const response = await this.client.request("/orders", {
        method: 'POST',
        body: JSON.stringify({
          symbol: order.symbol,
          side: order.side,
          qty: order.qty,
          type: order.type,
          time_in_force: order.timeInForce,
          limit_price: order.limitPrice,
          stop_price: order.stopPrice,
          trail_price: order.trailPrice,
          trail_percent: order.trailPercent,
        }),
      });
      return await response.json();
    } catch (err) {
      console.log(err);
    }
  }

  async cancelOrder(orderId: string) {
    try {
      const response = await this.client.request(`/orders/${orderId}`, {
        method: 'DELETE',
      });
      return await response.json();
    } catch (err) {
      console.log(err);
    }
  }

  async closeAPosition(symbol: string, qty?: number) {
    try {
      const response = await this.client.request(`/positions/${symbol}`, {
        method: 'DELETE',
      });
      return await response.json();
    } catch (err) {
      console.log(err);
    }
  }

  async getOrder(orderId: string) {
    try {
      const response = await this.client.request(`/orders/${orderId}`, {
        method: 'GET',
      });
      return await response.json();
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  async getOrders(options: GetOrderOptions = {}) {
    try {
      let params: Record<string, any> = {}
      for (const key in options) {
        if (options[key as keyof GetOrderOptions] !== undefined) {
          params[key] = options[key as keyof GetOrderOptions];
        }
      }
      const response = await this.client.request("/orders", {
        method: 'GET',
        params: params
      });

      return await response.json();
    } catch (err) {
      console.log(err);
      return [];
    }
  }

  async getPositions() {
    try {
      const response = await this.client.request("/positions", {
        method: 'GET',
      });

      return await response.json();
    } catch (err) {
      console.log(err);
      return [];
    }
  }
  
  // Portfolio value methods
  getPortfolioValue(): number {
    // This would need to be implemented with a real API call to get account info
    // For now, return a placeholder
    return 0;
  }
  
  getPortfolioHistory(): Array<{ timestamp: Date, equity: number, cash: number }> {
    // This would need to be implemented with a real API call to get historical account values
    // For now, return an empty array
    return [];
  }
  
  getPerformanceMetrics(): any {
    // This would need to be implemented with calculations based on account history
    // For now, return a placeholder object
    return {
      totalReturn: 0,
      totalReturnPct: 0,
      maxDrawdown: 0,
      maxDrawdownPct: 0
    };
  }
  
  // Cash management
  getCash(): number {
    // This would need to be implemented with a real API call to get account cash
    // For now, return a placeholder
    return 0;
  }
  
  setCash(amount: number): void {
    // This would be a no-op in a real broker as you can't directly set cash
    console.log(`Cannot directly set cash in a real broker. Attempted amount: ${amount}`);
  }
  
  // Order tracking
  getPendingOrders(): Order[] {
    // This would need to be implemented to filter orders by status
    // For now, return an empty array
    return [];
  }
  
  getAllOrders(): Map<string, Order> {
    // This would need to be implemented to get all orders and convert to a Map
    // For now, return an empty Map
    return new Map();
  }
  
  // Process orders against market data
  processPendingOrders(tickData: any): void {
    // This would be a no-op in a real broker as orders are processed by the exchange
    console.log(`Orders are processed by the exchange in a real broker. Tick data: ${JSON.stringify(tickData)}`);
  }
}
