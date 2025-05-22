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
}
