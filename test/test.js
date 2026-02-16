/**
 * IPC SDK Test File
 * Run with: node test/test.js
 */

const { IPCClient } = require('../dist/index.js');

const API_KEY = ''; // Add your API key here if needed

async function testIPCAPI() {
  console.log('=== IPC SDK Test ===\n');

  // Create client instance
  const client = new IPCClient({ apiKey: API_KEY });

  // Test getIP()
  console.log('Testing getIP()...');
  const ip = await client.getIP();
  console.log(ip);

  console.log('\n');

  // Test getIPDetails()
  console.log('Testing getIPDetails()...');
  const ipDetails = await client.getIPDetails();
  console.log(ipDetails);

  console.log('\n');

  // Test getSDKVersions()
  console.log('Testing getSDKVersions()...');
  const sdkVersions = await client.getSDKVersions();
  console.log(sdkVersions);
}

testIPCAPI();
