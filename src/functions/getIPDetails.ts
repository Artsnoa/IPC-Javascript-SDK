import { IPDetailsResponse, IPCError } from '../types';
import { API_VERSION } from '../modules/constants';
import { buildUrl } from '../modules/url-utils';
import { validateIPDetailsResponse } from '../modules/validators';
import { makeRequestWithFallback } from '../modules/http-client';

/**
 * Retrieves IP details from the API
 *
 * @param baseUrls - Array of base URLs for the API (will try in order)
 * @param apiKey - Optional API key for authentication
 * @param timeout - Request timeout in milliseconds
 * @returns IP details response
 * @throws {IPCError} If the request fails or response is invalid
 *
 * @example
 * ```typescript
 * const details = await getIPDetails(['https://api.example.com'], 'YOUR_API_KEY', 5000);
 * console.log(`IP: ${details.ip}, Country: ${details.country}`);
 * ```
 */
export async function getIPDetails(
  baseUrls: string[],
  apiKey: string | undefined,
  timeout: number
): Promise<IPDetailsResponse> {
  const urls = baseUrls.map(baseUrl => buildUrl(baseUrl, `/api/${API_VERSION}/ip/details`));
  const data = await makeRequestWithFallback<unknown>(urls, apiKey, timeout);

  // Validate response structure
  if (!validateIPDetailsResponse(data)) {
    throw new IPCError('Invalid response structure from API');
  }

  return data;
}
