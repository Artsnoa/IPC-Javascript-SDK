import { IPResponse, IPCError } from '../types';
import { API_VERSION } from '../modules/constants';
import { buildUrl } from '../modules/url-utils';
import { validateIPResponse } from '../modules/validators';
import { makeRequest } from '../modules/http-client';

/**
 * Retrieves basic IP information from the API
 *
 * @param baseUrl - The base URL for the API
 * @param apiKey - Optional API key for authentication
 * @param timeout - Request timeout in milliseconds
 * @returns IP information with country code
 * @throws {IPCError} If the request fails or response is invalid
 *
 * @example
 * ```typescript
 * const data = await getIP('https://api.example.com', 'YOUR_API_KEY', 5000);
 * console.log(`Your IP: ${data.ip}, Country: ${data.country}`);
 * ```
 */
export async function getIP(
  baseUrl: string,
  apiKey: string | undefined,
  timeout: number
): Promise<IPResponse> {
  const url = buildUrl(baseUrl, `/api/${API_VERSION}/ip`);
  const data = await makeRequest<unknown>(url, apiKey, timeout);

  // Validate response structure
  if (!validateIPResponse(data)) {
    throw new IPCError('Invalid response structure from API');
  }

  return data;
}
