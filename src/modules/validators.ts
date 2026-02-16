import { IPResponse, IPDetailsResponse, SDKVersionsResponse } from '../types';

/**
 * Validates the IP response structure
 *
 * @param data - Response data to validate
 * @returns true if valid
 */
export function validateIPResponse(data: unknown): data is IPResponse {
  if (!data || typeof data !== 'object') {
    return false;
  }

  const response = data as Record<string, unknown>;

  return (
    typeof response.ip === 'string' &&
    typeof response.country === 'string'
  );
}

/**
 * Validates the IP details response structure
 *
 * @param data - Response data to validate
 * @returns true if valid
 */
export function validateIPDetailsResponse(data: unknown): data is IPDetailsResponse {
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
 * Validates the SDK versions response structure
 *
 * @param data - Response data to validate
 * @returns true if valid
 */
export function validateSDKVersionsResponse(data: unknown): data is SDKVersionsResponse {
  if (!data || typeof data !== 'object') {
    return false;
  }

  const response = data as Record<string, unknown>;

  return (
    typeof response.javascript === 'string' &&
    typeof response.python === 'string'
  );
}
