import { FetchClient } from "../lib/utils/fetchClient";

const quiverApiToken = process.env.QUIVER_API_TOKEN;
if (!quiverApiToken || typeof quiverApiToken !== 'string') {
  throw new Error('Missing Quiver API token');
}

const defaultHeaders = {
  accept: 'application/json',
  Authorization: `Bearer ${quiverApiToken}`
};

export const quiverClient = new FetchClient('https://api.quiverquant.com/beta', defaultHeaders);