import { IPCClientOptions, IPDetailsResponse, IPCError } from './types';

/**
 * Default configuration values
 */
const DEFAULT_BASE_URL = 'https://ipc.artsnoa.com';
const DEFAULT_TIMEOUT = 10000; // 10 seconds
const API_VERSION = 'v1';

/**
 * IPCClient - Client for interacting with the IPC API
 *
 * @example
 * ```typescript
 * const client = new IPCClient({ apiKey: 'YOUR_API_KEY' });
 * const data = await client.getIPDetails();
 * console.log(data);
 * ```
 */
export class IPCClient {
  private readonly baseUrl: string;
  private readonly apiKey?: string;
  private readonly timeout: number;

  /**
   * Creates a new IPCClient instance
   *
   * @param options - Configuration options
   */
  constructor(options: IPCClientOptions = {}) {
    // Validate and sanitize baseUrl
    this.baseUrl = this.sanitizeBaseUrl(options.baseUrl || DEFAULT_BASE_URL);
    this.apiKey = options.apiKey;
    this.timeout = options.timeout || DEFAULT_TIMEOUT;

    // Validate timeout
    if (this.timeout <= 0 || this.timeout > 60000) {
      throw new IPCError('Timeout must be between 1 and 60000 milliseconds');
    }
  }

  /**
   * Sanitizes and validates the base URL to prevent injection attacks
   *
   * @param url - The URL to sanitize
   * @returns Sanitized URL without trailing slash
   */
  private sanitizeBaseUrl(url: string): string {
    try {
      // @ts-ignore - URL is available in supported environments
      const parsedUrl = new URL(url);

      // Only allow https and http protocols
      if (parsedUrl.protocol !== 'https:' && parsedUrl.protocol !== 'http:') {
        throw new IPCError('Base URL must use http or https protocol');
      }

      // Remove trailing slash
      return parsedUrl.origin + parsedUrl.pathname.replace(/\/$/, '');
    } catch (error) {
      if (error instanceof IPCError) {
        throw error;
      }
      throw new IPCError(`Invalid base URL: ${url}`);
    }
  }

  /**
   * Builds the full API endpoint URL
   *
   * @param path - API path
   * @returns Full URL
   */
  private buildUrl(path: string): string {
    const sanitizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${this.baseUrl}${sanitizedPath}`;
  }

  /**
   * Makes an HTTP request with timeout and error handling
   *
   * @param url - Request URL
   * @returns Response data
   */
  private async makeRequest<T>(url: string): Promise<T> {
    // @ts-ignore - AbortController is available in supported environments
    const controller = new AbortController();
    // @ts-ignore - setTimeout is available in all supported environments
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      };

      // Add Bearer token to headers if provided
      if (this.apiKey) {
        headers['Authorization'] = `Bearer ${this.apiKey}`;
      }

      // @ts-ignore - fetch is available in supported environments
      const response = await fetch(url, {
        method: 'GET',
        headers,
        signal: controller.signal,
      });

      // @ts-ignore - clearTimeout is available in all supported environments
      clearTimeout(timeoutId);

      // Handle non-2xx responses
      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        let errorCode: string | undefined;

        try {
          const errorData = await response.json();
          if (errorData.message) {
            errorMessage = errorData.message;
          }
          if (errorData.code) {
            errorCode = errorData.code;
          }
        } catch {
          // If error response is not JSON, use default error message
        }

        throw new IPCError(errorMessage, response.status, errorCode);
      }

      // Parse and validate response
      const contentType = response.headers.get('Content-Type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new IPCError('Invalid response content type. Expected application/json');
      }

      const data = await response.json();
      return data as T;

    } catch (error) {
      // @ts-ignore - clearTimeout is available in all supported environments
      clearTimeout(timeoutId);

      // Handle abort (timeout)
      if (error instanceof Error && error.name === 'AbortError') {
        throw new IPCError(`Request timeout after ${this.timeout}ms`);
      }

      // Re-throw IPCError instances
      if (error instanceof IPCError) {
        throw error;
      }

      // Handle network errors
      if (error instanceof TypeError) {
        throw new IPCError(`Network error: ${error.message}`);
      }

      // Handle unknown errors
      throw new IPCError(
        error instanceof Error ? error.message : 'An unknown error occurred'
      );
    }
  }

  /**
   * Validates the IP details response structure
   *
   * @param data - Response data to validate
   * @returns true if valid
   */
  private validateIPDetailsResponse(data: unknown): data is IPDetailsResponse {
    if (!data || typeof data !== 'object') {
      return false;
    }

    const response = data as Record<string, unknown>;

    return (
      typeof response.ip === 'string' &&
      typeof response.userAgent === 'string' &&
      typeof response.asn === 'string' &&
      typeof response.country === 'string' &&
      typeof response.currency === 'string' &&
      Array.isArray(response.languages) &&
      response.languages.every((lang) => typeof lang === 'string') &&
      typeof response.timestamp === 'string' &&
      typeof response.version === 'string'
    );
  }

  /**
   * Retrieves IP details from the API
   *
   * @returns IP details response
   * @throws {IPCError} If the request fails or response is invalid
   *
   * @example
   * ```typescript
   * const client = new IPCClient();
   * try {
   *   const details = await client.getIPDetails();
   *   console.log(`IP: ${details.ip}, Country: ${details.country}`);
   * } catch (error) {
   *   if (error instanceof IPCError) {
   *     console.error(`Error: ${error.message}`);
   *   }
   * }
   * ```
   */
  public async getIPDetails(): Promise<IPDetailsResponse> {
    const url = this.buildUrl(`/api/${API_VERSION}/ip/details`);
    const data = await this.makeRequest<unknown>(url);

    // Validate response structure
    if (!this.validateIPDetailsResponse(data)) {
      throw new IPCError('Invalid response structure from API');
    }

    return data;
  }
}
