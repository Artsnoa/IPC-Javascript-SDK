# IPC Artsnoa JavaScript SDK

Official JavaScript/TypeScript SDK for [ipc.artsnoa.com](https://ipc.artsnoa.com) API - Get your IP address and location information.

## Features

- Full TypeScript support with type definitions
- Simple and intuitive API
- Comprehensive error handling
- Works in Node.js environments
- Minimal dependencies
- ESM and CommonJS support

## Installation

```bash
npm install @artsnoa/ipc-sdk
```

Or with pnpm:

```bash
pnpm add @artsnoa/ipc-sdk
```

Or with yarn:

```bash
yarn add @artsnoa/ipc-sdk
```

## Quick Start

```javascript
import { IPCClient } from '@artsnoa/ipc-sdk';

// Initialize client (API key is optional)
const client = new IPCClient({ apiKey: 'YOUR_API_KEY' });

// Get detailed IP information
const details = await client.getIPDetails();
console.log(`Your IP: ${details.ip}, Country: ${details.country}`);
```

## Usage Examples

### Basic Usage

```javascript
import { IPCClient } from '@artsnoa/ipc-sdk';

// Create client with API key
const client = new IPCClient({ apiKey: 'YOUR_API_KEY' });

// Get IP details
const data = await client.getIPDetails();
console.log(`IP: ${data.ip}`);
console.log(`Country: ${data.country}`);

// Without API key
const publicClient = new IPCClient();
const publicData = await publicClient.getIPDetails();
console.log(`Your IP: ${publicData.ip}`);
```

### TypeScript Usage

```typescript
import { IPCClient, IPDetailsResponse } from '@artsnoa/ipc-sdk';

const client = new IPCClient({ apiKey: 'YOUR_API_KEY' });

// Type-safe IP details
const details: IPDetailsResponse = await client.getIPDetails();
console.log(`IP: ${details.ip}`);
console.log(`User Agent: ${details.userAgent}`);
console.log(`ASN: ${details.asn}`);
console.log(`Country: ${details.country}`);
console.log(`Currency: ${details.currency}`);
console.log(`Languages: ${details.languages.join(', ')}`);
console.log(`Timestamp: ${details.timestamp}`);
```

### SDK Version Information

```javascript
import { IPCClient } from '@artsnoa/ipc-sdk';

const client = new IPCClient();

// Get available SDK versions
const versions = await client.getSDKVersions();
console.log(`JavaScript SDK: ${versions.javascript}`);
console.log(`Python SDK: ${versions.python}`);
```

### Custom Configuration

```javascript
import { IPCClient } from '@artsnoa/ipc-sdk';

// Custom timeout and base URL
const client = new IPCClient({
  apiKey: 'YOUR_API_KEY',
  timeout: 15000, // 15 seconds in milliseconds
  baseUrl: 'https://custom-domain.com'
});

const data = await client.getIPDetails();
```

### CommonJS Usage

```javascript
const { IPCClient } = require('@artsnoa/ipc-sdk');

const client = new IPCClient({ apiKey: 'YOUR_API_KEY' });

client.getIPDetails().then(data => {
  console.log(`IP: ${data.ip}, Country: ${data.country}`);
});
```

## Error Handling

The SDK provides a custom error class for handling API errors:

```javascript
import { IPCClient, IPCError } from '@artsnoa/ipc-sdk';

const client = new IPCClient({ apiKey: 'YOUR_API_KEY' });

try {
  const data = await client.getIPDetails();
  console.log(`Your IP: ${data.ip}`);
} catch (error) {
  if (error instanceof IPCError) {
    console.error(`IPC Error: ${error.message}`);
    if (error.statusCode) {
      console.error(`Status code: ${error.statusCode}`);
    }
    if (error.code) {
      console.error(`Error code: ${error.code}`);
    }
  } else {
    console.error(`Unexpected error: ${error}`);
  }
}
```

### TypeScript Error Handling

```typescript
import { IPCClient, IPCError } from '@artsnoa/ipc-sdk';

const client = new IPCClient({ apiKey: 'YOUR_API_KEY' });

async function getIPSafely() {
  try {
    const data = await client.getIPDetails();
    return data;
  } catch (error) {
    if (error instanceof IPCError) {
      console.error(`API error: ${error.message}`);
      console.error(`Status: ${error.statusCode ?? 'unknown'}`);
    } else if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
    }
    throw error;
  }
}
```

## API Reference

### IPCClient

#### Constructor

```typescript
new IPCClient(options?: IPCClientOptions)
```

**Parameters:**
- `options` (IPCClientOptions): Configuration options
  - `apiKey` (string, optional): API key for authentication
  - `baseUrl` (string, optional): Base URL for the API. Defaults to `https://ipc.artsnoa.com`
  - `timeout` (number, optional): Request timeout in milliseconds. Defaults to 10000 (10 seconds)

**Example:**
```javascript
const client = new IPCClient({
  apiKey: 'YOUR_API_KEY',
  timeout: 15000,
  baseUrl: 'https://ipc.artsnoa.com'
});
```

#### Methods

##### `getIPDetails(): Promise<IPDetailsResponse>`

Get detailed IP address and location information.

**Returns:**
- Promise that resolves to an object containing:
  - `ip` (string): Your IP address
  - `userAgent` (string): Browser user agent string
  - `asn` (string): Autonomous System Number
  - `country` (string): Country code (ISO 3166-1 alpha-2)
  - `currency` (string): Country currency code (ISO 4217)
  - `languages` (string[]): Array of supported language codes
  - `timestamp` (string): Request timestamp (ISO 8601 format)
  - `version` (string): API version

**Throws:**
- `IPCError`: When the API request fails or returns an invalid response

**Example:**
```javascript
const details = await client.getIPDetails();
console.log(`IP: ${details.ip}, Country: ${details.country}`);
console.log(`ASN: ${details.asn}, Currency: ${details.currency}`);
```

##### `getSDKVersions(): Promise<SDKVersionsResponse>`

Get available SDK versions for different platforms.

**Returns:**
- Promise that resolves to an object containing:
  - `javascript` (string): JavaScript/TypeScript SDK version
  - `python` (string): Python SDK version

**Throws:**
- `IPCError`: When the API request fails or returns an invalid response

**Example:**
```javascript
const versions = await client.getSDKVersions();
console.log(`JavaScript SDK: ${versions.javascript}`);
console.log(`Python SDK: ${versions.python}`);
```

### Types

#### IPCClientOptions

Configuration options for the IPCClient constructor.

```typescript
interface IPCClientOptions {
  apiKey?: string;
  baseUrl?: string;
  timeout?: number;
}
```

#### IPDetailsResponse

Response structure from the `getIPDetails()` method.

```typescript
interface IPDetailsResponse {
  ip: string;
  userAgent: string;
  asn: string;
  country: string;
  currency: string;
  languages: string[];
  timestamp: string;
  version: string;
}
```

#### SDKVersionsResponse

Response structure from the `getSDKVersions()` method.

```typescript
interface SDKVersionsResponse {
  javascript: string;
  python: string;
}
```

#### IPCError

Custom error class for IPC SDK errors.

```typescript
class IPCError extends Error {
  statusCode?: number;
  code?: string;
}
```

## Development

```bash
# Clone repository
git clone https://github.com/artsnoa/ipc-javascript-sdk.git
cd ipc-javascript-sdk

# Install dependencies
pnpm install

# Build package
pnpm run build
```

## Requirements

- Node.js 18.0.0 or higher
- No external runtime dependencies

## License

MIT License

## Support

- Documentation: [https://github.com/artsnoa/ipc-javascript-sdk](https://github.com/artsnoa/ipc-javascript-sdk)
- Issues: [https://github.com/artsnoa/ipc-javascript-sdk/issues](https://github.com/artsnoa/ipc-javascript-sdk/issues)
- Email: aurora@artsnoa.com
