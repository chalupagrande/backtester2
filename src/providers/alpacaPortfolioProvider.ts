import { alpacaTradingClient } from "../clients/alpacaClient";
import { FetchClient } from "../lib/utils/fetchClient";
import { SortDirection, OrderSide, OrderStatus, PortfolioProvider } from "../lib/utils/types";

type GetOrderOptions = {
  status?: OrderStatus;
  limit?: number;
  after?: Date;
  until?: Date;
  side?: OrderSide;
  sortDirection?: SortDirection
}

export class AlpacaPortfolioProvider implements PortfolioProvider {
  private client: FetchClient;

  constructor() {
    this.client = alpacaTradingClient;
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
}