/**
 * Configuration options for IPCClient
 */
export interface IPCClientOptions {
  /**
   * API key for authentication (optional)
   */
  apiKey?: string;

  /**
   * Base URL for the IPC API
   * @default 'https://ipc.artsnoa.com'
   */
  baseUrl?: string;

  /**
   * Request timeout in milliseconds
   * @default 10000
   */
  timeout?: number;
}

/**
 * Response from the IP details API
 */
export interface IPDetailsResponse {
  /**
   * IP address
   */
  ip: string;

  /**
   * User agent string
   */
  userAgent: string;

  /**
   * Autonomous System Number
   */
  asn: string;

  /**
   * Country code (ISO 3166-1 alpha-2)
   */
  country: string;

  /**
   * Currency code (ISO 4217)
   */
  currency: string;

  /**
   * Array of language codes
   */
  languages: string[];

  /**
   * Timestamp of the request (ISO 8601 format)
   */
  timestamp: string;

  /**
   * API version
   */
  version: string;
}

/**
 * Response from the SDK versions API
 */
export interface SDKVersionsResponse {
  /**
   * JavaScript SDK version
   */
  javascript: string;

  /**
   * Python SDK version
   */
  python: string;
}

/**
 * Custom error class for IPC SDK errors
 */
export class IPCError extends Error {
  public readonly statusCode?: number;
  public readonly code?: string;

  constructor(message: string, statusCode?: number, code?: string) {
    super(message);
    this.name = 'IPCError';
    this.statusCode = statusCode;
    this.code = code;

    // Maintains proper stack trace for where error was thrown
    if (typeof (Error as any).captureStackTrace === 'function') {
      (Error as any).captureStackTrace(this, IPCError);
    }
  }
}
