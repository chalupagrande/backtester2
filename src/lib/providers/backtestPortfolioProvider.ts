import type { Order } from "../Order";
import { SortDirection, OrderSide, OrderStatus, PortfolioProvider } from "../utils/types";

type GetOrderOptions = {
  status?: OrderStatus;
  limit?: number;
  after?: Date;
  until?: Date;
  side?: OrderSide;
  sortDirection?: SortDirection
}

export class BacktestPortfolioProvider implements PortfolioProvider {

  constructor() {
    this.placeOrder = this.placeOrder.bind(this);
    this.getOrder = this.getOrder.bind(this);
    this.getOrders = this.getOrders.bind(this);
    this.getPositions = this.getPositions.bind(this);
  }

  async placeOrder(order: Order) {
    try {

    } catch (err) {
      console.log(err);
    }
  }

  async getOrder(orderId: string) {
    return null
  }


  async getOrders(options: GetOrderOptions) {
    return []
  }

  async getPositions() {
    return []
  }
}