import { SDKVersionsResponse, IPCError } from '../types';
import { API_VERSION } from '../modules/constants';
import { buildUrl } from '../modules/url-utils';
import { validateSDKVersionsResponse } from '../modules/validators';
import { makeRequestWithFallback } from '../modules/http-client';

/**
 * Retrieves SDK versions from the API
 *
 * @param baseUrls - Array of base URLs for the API (will try in order)
 * @param apiKey - Optional API key for authentication
 * @param timeout - Request timeout in milliseconds
 * @returns SDK versions response
 * @throws {IPCError} If the request fails or response is invalid
 *
 * @example
 * ```typescript
 * const versions = await getSDKVersions(['https://api.example.com'], 'YOUR_API_KEY', 5000);
 * console.log('SDK Versions:', versions);
 * ```
 */
export async function getSDKVersions(
  baseUrls: string[],
  apiKey: string | undefined,
  timeout: number
): Promise<SDKVersionsResponse> {
  const urls = baseUrls.map(baseUrl => buildUrl(baseUrl, `/api/${API_VERSION}/sdk/version`));
  const data = await makeRequestWithFallback<unknown>(urls, apiKey, timeout);

  // Validate response structure
  if (!validateSDKVersionsResponse(data)) {
    throw new IPCError('Invalid response structure from API');
  }

  return data;
}
