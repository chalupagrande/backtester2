export function FetchClient(baseEndpoint: string) {
  const apiKeyId = process.env.ALPACA_API_KEY_ID;
  const apiSecret = process.env.ALPACA_API_SECRET;

  if (!apiKeyId || !apiSecret || typeof apiKeyId !== 'string' || typeof apiSecret !== 'string') {
    throw new Error('Missing Alpaca API credentials');
  }

  const baseUrl = new URL(baseEndpoint);
  const basePath = baseUrl.pathname

  return function request(path: string, options: RequestInit & { params?: Record<string, string> }) {
    const url = new URL(`${basePath}${path}`, baseUrl);

    // Add query parameters to URL if they exist
    if (options.params) {
      Object.entries(options.params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    const defaultHeaders = {
      accept: 'application/json',
      'APCA-API-KEY-ID': apiKeyId,
      'APCA-API-SECRET-KEY': apiSecret
    };

    // Remove params from options to avoid sending them in the body
    const { params, ...fetchOptions } = options;
    console.log(url)
    return fetch(url.href, {
      ...fetchOptions,
      headers: { ...defaultHeaders, ...options.headers }
    });
  }
}
