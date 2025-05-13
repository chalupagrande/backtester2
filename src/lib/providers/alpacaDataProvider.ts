import { FetchClient } from "../utils/fetchClient";
import { alpacaMarketDataClient } from "../clients/alpacaClient";

type GetBarOptions = {
  symbols: string,
  timeframe: string,
  start?: string,
  end?: string
}
export class AlpacaDataProvider {
  private client: FetchClient;

  constructor() {
    this.client = alpacaMarketDataClient;
    this.getBars = this.getBars.bind(this);
    this.getBarsLatest = this.getBarsLatest.bind(this);
  }

  async getBars(options: GetBarOptions) {
    let params: Record<string, any> = {}
    for (const key in options) {
      if (options[key as keyof GetBarOptions] !== undefined) {
        params[key] = options[key as keyof GetBarOptions];
      }
    }
    try {
      const response = await this.client.request("/stocks/bars", {
        method: 'GET',
        params: params,
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


