import type { Order } from "../Order";
import { FetchClient } from "../utils/fetchClient";

const executionClient = new FetchClient('https://paper-api.alpaca.markets/v2');

export class AlpacaExecutionProvider {
  private client: FetchClient;

  constructor() {
    this.client = executionClient;
  }

  async placeOrder(order: Order) {

  }

}