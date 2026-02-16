/**
 * IPC SDK Test File
 * Run with: node test/test.js
 */

// Constants
const BASE_URL = 'https://ipc.artsnoa.com';
const API_VERSION = 'v1';
const TIMEOUT = 10000;
const API_KEY = ''; // Add your API key here if needed

/**
 * Makes a test request to the IPC API
 */
async function testIPCAPI() {
  const url = `${BASE_URL}/api/${API_VERSION}/ip/details`;

  console.log('=== IPC SDK Test ===');
  console.log(`Testing URL: ${url}\n`);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

  try {
    const startTime = Date.now();

    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    // Add Bearer token if API key is provided
    if (API_KEY) {
      headers['Authorization'] = `Bearer ${API_KEY}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const endTime = Date.now();
    const duration = endTime - startTime;

    console.log(`Status: ${response.status} ${response.statusText}`);
    console.log(`Response time: ${duration}ms`);
    console.log(`Content-Type: ${response.headers.get('Content-Type')}\n`);

    if (!response.ok) {
      console.error('❌ Request failed');
      const errorText = await response.text();
      console.error('Error response:', errorText);
      return;
    }

    const data = await response.json();

    console.log('✅ Request successful!\n');
    console.log('Response data:');
    console.log('─'.repeat(50));
    console.log(`IP:        ${data.ip}`);
    console.log(`Country:   ${data.country}`);
    console.log(`Currency:  ${data.currency}`);
    console.log(`ASN:       ${data.asn}`);
    console.log(`Languages: ${data.languages?.join(', ')}`);
    console.log(`Timestamp: ${data.timestamp}`);
    console.log(`Version:   ${data.version}`);
    console.log(`User-Agent: ${data.userAgent}`);
    console.log('─'.repeat(50));

    // Validate response structure
    console.log('\nValidation:');
    const requiredFields = ['ip', 'userAgent', 'asn', 'country', 'currency', 'languages', 'timestamp', 'version'];
    let isValid = true;

    for (const field of requiredFields) {
      const exists = field in data;
      const status = exists ? '✓' : '✗';
      console.log(`  ${status} ${field}: ${exists ? typeof data[field] : 'missing'}`);
      if (!exists) isValid = false;
    }

    if (isValid) {
      console.log('\n✅ All required fields present');
    } else {
      console.log('\n❌ Some required fields are missing');
    }

  } catch (error) {
    clearTimeout(timeoutId);

    if (error.name === 'AbortError') {
      console.error(`❌ Request timeout after ${TIMEOUT}ms`);
    } else if (error instanceof TypeError) {
      console.error(`❌ Network error: ${error.message}`);
    } else {
      console.error(`❌ Error: ${error.message}`);
    }
    console.error('\nStack trace:');
    console.error(error.stack);
  }
}

// Run the test
testIPCAPI().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
