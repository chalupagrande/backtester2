import { FetchClient } from "./utils/fetchClient";

const dataClient = new FetchClient('https://data.alpaca.markets/v2');

export async function getBarsLatest(symbols: string) {
  try {
    const response = await dataClient.request("/stocks/bars/latest", {
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

