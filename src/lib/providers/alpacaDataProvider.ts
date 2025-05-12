import { FetchClient } from "../utils/fetchClient";

const dataClient = new FetchClient('https://data.alpaca.markets/v2');

export class AlpacaDataProvider {
  private client: FetchClient;

  constructor() {
    this.client = dataClient;
    this.getBars = this.getBars.bind(this);
    this.getBarsLatest = this.getBarsLatest.bind(this);
  }

  async getBars(symbols: string, timeframe: string, start?: string, end?: string) {
    try {
      const response = await this.client.request("/stocks/bars", {
        method: 'GET',
        params: {
          symbols,
          timeframe,
        },
      });
      return await response.json();
    } catch (err) {
      console.log(err);
    }
  }

  async getBarsLatest(symbols: string) {
    try {
      const response = await this.client.request("/stocks/bars/latest", {
        method: 'GET',
        params: {
          symbols
        },
      });
      return await response.json();
    } catch (err) {
      console.log(err);
    }
  }

}


