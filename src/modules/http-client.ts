import { IPCError } from '../types';

/**
 * Makes an HTTP request with timeout, error handling and fallback support
 *
 * @param urls - Array of request URLs to try in order
 * @param apiKey - Optional API key for authentication
 * @param timeout - Request timeout in milliseconds
 * @returns Response data
 */
export async function makeRequestWithFallback<T>(
  urls: string[],
  apiKey: string | undefined,
  timeout: number
): Promise<T> {
  let lastError: Error | null = null;

  for (let i = 0; i < urls.length; i++) {
    try {
      return await makeRequest<T>(urls[i] as string, apiKey, timeout);
    } catch (error) {
      lastError = error as Error;
      // If this is not the last URL, continue to the next one
      if (i < urls.length - 1) {
        continue;
      }
    }
  }

  // If all requests failed, throw the last error
  throw lastError || new IPCError('All requests failed');
}

/**
 * Makes an HTTP request with timeout and error handling
 *
 * @param url - Request URL
 * @param apiKey - Optional API key for authentication
 * @param timeout - Request timeout in milliseconds
 * @returns Response data
 */
export async function makeRequest<T>(
  url: string,
  apiKey: string | undefined,
  timeout: number
): Promise<T> {
  // @ts-ignore - AbortController is available in supported environments
  const controller = new AbortController();
  // @ts-ignore - setTimeout is available in all supported environments
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    // Add Bearer token to headers if provided
    if (apiKey) {
      headers['Authorization'] = `Bearer ${apiKey}`;
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
        const errorData = await response.json() as any;
        if (errorData && errorData.message) {
          errorMessage = errorData.message;
        }
        if (errorData && errorData.code) {
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
      throw new IPCError(`Request timeout after ${timeout}ms`);
    }

    // Re-throw IPCError instances
    if (error instanceof IPCError) {
      throw error;
    }

    // Handle network errors
    if (error instanceof TypeError) {
      throw new IPCError('Network error occurred. Please check your connection and try again');
    }

    // Handle unknown errors - do not expose internal error messages
    throw new IPCError('An unexpected error occurred. Please try again later');
  }
}
