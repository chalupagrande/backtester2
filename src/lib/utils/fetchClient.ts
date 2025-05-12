export class FetchClient {
  private apiKeyId: string;
  private apiSecret: string;
  private baseUrl: URL;
  private basePath: string;

  constructor(baseEndpoint: string) {
    const apiKeyId = process.env.ALPACA_API_KEY_ID;
    const apiSecret = process.env.ALPACA_API_SECRET;

    if (!apiKeyId || !apiSecret || typeof apiKeyId !== 'string' || typeof apiSecret !== 'string') {
      throw new Error('Missing Alpaca API credentials');
    }

    this.apiKeyId = apiKeyId;
    this.apiSecret = apiSecret;
    this.baseUrl = new URL(baseEndpoint);
    this.basePath = this.baseUrl.pathname;
  }

  async request(path: string, options: RequestInit & { params?: Record<string, string> }) {
    const url = new URL(`${this.basePath}${path}`, this.baseUrl);

    // Add query parameters to URL if they exist
    if (options.params) {
      Object.entries(options.params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    const defaultHeaders = {
      accept: 'application/json',
      'APCA-API-KEY-ID': this.apiKeyId,
      'APCA-API-SECRET-KEY': this.apiSecret
    };

    // Remove params from options to avoid sending them in the body
    const { params, ...fetchOptions } = options;
    return fetch(url.href, {
      ...fetchOptions,
      headers: { ...defaultHeaders, ...options.headers }
    });
  }
}