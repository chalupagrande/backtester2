import type { Order } from "../Order";
import { FetchClient } from "../utils/fetchClient";

const executionClient = new FetchClient('https://paper-api.alpaca.markets/v2');

export class AlpacaExecutionProvider {
  private client: FetchClient;

  constructor() {
    this.client = executionClient;
  }

  async placeOrder(order: Order) {
    console.log('place order')
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

}