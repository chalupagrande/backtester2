import type { Order } from "@lib/Order";
import { FetchClient } from "@lib/utils/fetchClient";
import { ExecutionProvider } from "@lib/utils/types";
import { alpacaTradingClient } from "@/clients/alpacaClient";

export class AlpacaExecutionProvider implements ExecutionProvider {
  private client: FetchClient;

  constructor() {
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
}