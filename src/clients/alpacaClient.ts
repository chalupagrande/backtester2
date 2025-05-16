import { FetchClient } from "@/lib/utils/fetchClient";
const apiKeyId = process.env.ALPACA_API_KEY_ID;
const apiSecret = process.env.ALPACA_API_SECRET;

if (!apiKeyId || !apiSecret || typeof apiKeyId !== 'string' || typeof apiSecret !== 'string') {
  throw new Error('Missing Alpaca API credentials');
}

const defaultHeaders = {
  accept: 'application/json',
  'APCA-API-KEY-ID': apiKeyId,
  'APCA-API-SECRET-KEY': apiSecret
};

export const alpacaTradingClient = new FetchClient('https://paper-api.alpaca.markets/v2', defaultHeaders);
export const alpacaMarketDataClient = new FetchClient('https://data.alpaca.markets/v2', defaultHeaders);