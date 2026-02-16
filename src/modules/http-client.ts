import { IPCError } from '../types';

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
      throw new IPCError(`Request timeout after ${timeout}ms`);
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
