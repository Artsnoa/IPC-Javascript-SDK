/**
 * @artsnoa/ipc-sdk
 *
 * JavaScript SDK for interacting with the IPC API
 *
 * @example
 * ```typescript
 * import { IPCClient } from '@artsnoa/ipc-sdk';
 *
 * const client = new IPCClient({ apiKey: 'YOUR_API_KEY' });
 * const data = await client.getIPDetails();
 * console.log(data);
 * ```
 *
 * @example Custom base URL
 * ```typescript
 * import { IPCClient } from '@artsnoa/ipc-sdk';
 *
 * const client = new IPCClient({
 *   baseUrl: 'https://custom-domain.com',
 *   apiKey: 'YOUR_API_KEY'
 * });
 * const data = await client.getIPDetails();
 * ```
 */

export { IPCClient } from './client';
export {
  IPCError
} from './types';export type {
  IPCClientOptions,
  IPDetailsResponse,
  SDKVersionsResponse
} from './types';

