import { IPCError } from '../types';

/**
 * Sanitizes and validates the base URL to prevent injection attacks
 *
 * @param url - The URL to sanitize
 * @returns Sanitized URL without trailing slash
 */
export function sanitizeBaseUrl(url: string): string {
  try {
    // @ts-ignore - URL is available in supported environments
    const parsedUrl = new URL(url);

    // Only allow https protocol for security
    if (parsedUrl.protocol !== 'https:') {
      throw new IPCError('Base URL must use https protocol. HTTP is not allowed for security reasons');
    }

    // Remove trailing slash
    return parsedUrl.origin + parsedUrl.pathname.replace(/\/$/, '');
  } catch (error) {
    if (error instanceof IPCError) {
      throw error;
    }
    throw new IPCError('Invalid base URL format. Please provide a valid HTTPS URL');
  }
}

/**
 * Builds the full API endpoint URL
 *
 * @param baseUrl - Base URL
 * @param path - API path
 * @returns Full URL
 */
export function buildUrl(baseUrl: string, path: string): string {
  const sanitizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${sanitizedPath}`;
}
