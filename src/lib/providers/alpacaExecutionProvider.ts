import type { Order } from "../Order";
import { FetchClient } from "../utils/fetchClient";
import { Direction, OrderSide, OrderStatus } from "../utils/types";

const executionClient = new FetchClient('https://paper-api.alpaca.markets/v2');


type GetOrderOptions = {
  status?: OrderStatus;
  limit?: number;
  after?: Date;
  until?: Date;
  side?: OrderSide;
  direction?: Direction
}

export class AlpacaExecutionProvider {
  private client: FetchClient;

  constructor() {
    this.client = executionClient;
  }

  async placeOrder(order: Order) {
    try {
      const response = await this.client.request("/orders", {
        method: 'POST',
        body: JSON.stringify({
          symbol: order.symbol,
          side: order.side,
          qty: order.quantity,
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

  async getOrder(orderId: string) {
    try {
      const response = await this.client.request(`/orders/${orderId}`, {
        method: 'GET',
      });
      return await response.json();
    } catch (err) {
      console.log(err);
    }
  }


  async getOrders(options: GetOrderOptions) {
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
    }
  }

  async closeAPosition(symbol: string, quantity?: number) {
    try {
      const response = await this.client.request(`/positions/${symbol}`, {
        method: 'DELETE',
      });
      return await response.json();
    } catch (err) {
      console.log(err);
    }
  }
}