import type { Order } from "../Order";
import { ExecutionProvider } from "../utils/types";

export class BacktestExecutionProvider implements ExecutionProvider {
  constructor() {
  }

  async placeOrder(order: Order) {

  }

  async cancelOrder(orderId: string) {
    console.log("canceling order")
  }

  async getOrder(orderId: string) {
    console.log('get order')

    return null
  }

  async getOrders() {
    console.log('getting orders')
    return []
  }

  async getPositions() {
    console.log("getting positions")
    return []
  }

  async closeAPosition(symbol: string) {
    console.log("closing position")
  }

}