import { FetchClient } from "./fetchClient";

const dataClient = FetchClient('https://data.alpaca.markets/v2');

export async function getBarsLatest(symbols: string) {
  try {
    const response = await dataClient("/stocks/bars/latest", {
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

