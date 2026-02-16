import { IPCClientOptions, IPDetailsResponse, SDKVersionsResponse, IPCError } from './types';
import { DEFAULT_BASE_URL, DEFAULT_TIMEOUT, API_VERSION } from './modules/constants';
import { sanitizeBaseUrl, buildUrl } from './modules/url-utils';
import { validateIPDetailsResponse, validateSDKVersionsResponse } from './modules/validators';
import { makeRequest } from './modules/http-client';

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
    this.baseUrl = sanitizeBaseUrl(options.baseUrl || DEFAULT_BASE_URL);
    this.apiKey = options.apiKey;
    this.timeout = options.timeout || DEFAULT_TIMEOUT;

    // Validate timeout
    if (this.timeout <= 0 || this.timeout > 60000) {
      throw new IPCError('Timeout must be between 1 and 60000 milliseconds');
    }
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
    const url = buildUrl(this.baseUrl, `/api/${API_VERSION}/ip/details`);
    const data = await makeRequest<unknown>(url, this.apiKey, this.timeout);

    // Validate response structure
    if (!validateIPDetailsResponse(data)) {
      throw new IPCError('Invalid response structure from API');
    }

    return data;
  }

  /**
   * Retrieves SDK versions from the API
   *
   * @returns SDK versions response
   * @throws {IPCError} If the request fails or response is invalid
   *
   * @example
   * ```typescript
   * const client = new IPCClient({ apiKey: 'YOUR_API_KEY' });
   * try {
   *   const versions = await client.getSDKVersions();
   *   console.log('SDK Versions:', versions);
   * } catch (error) {
   *   if (error instanceof IPCError) {
   *     console.error(`Error: ${error.message}`);
   *   }
   * }
   * ```
   */
  public async getSDKVersions(): Promise<SDKVersionsResponse> {
    const url = buildUrl(this.baseUrl, `/api/${API_VERSION}/sdk/version`);
    const data = await makeRequest<unknown>(url, this.apiKey, this.timeout);

    // Validate response structure
    if (!validateSDKVersionsResponse(data)) {
      throw new IPCError('Invalid response structure from API');
    }

    return data;
  }
}
