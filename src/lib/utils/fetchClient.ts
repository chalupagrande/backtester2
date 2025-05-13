export class FetchClient {
  private defaultHeaders: Record<string, string>;
  private baseUrl: URL;
  private basePath: string;

  constructor(baseEndpoint: string, defaultHeaders: Record<string, string> = {}) {
    this.defaultHeaders = defaultHeaders;
    this.baseUrl = new URL(baseEndpoint);
    this.basePath = this.baseUrl.pathname;

    this.request = this.request.bind(this);
  }

  async request(path: string, options: RequestInit & { params?: Record<string, string | number | boolean> }) {
    const url = new URL(`${this.basePath}${path}`, this.baseUrl);

    // Add query parameters to URL if they exist
    if (options.params) {
      Object.entries(options.params).forEach(([key, value]) => {
        url.searchParams.append(key, value.toString());
      });
    }

    // Remove params from options to avoid sending them in the body
    const { params, ...fetchOptions } = options;
    return fetch(url.href, {
      ...fetchOptions,
      headers: { ...this.defaultHeaders, ...options.headers }
    });
  }
}