/**
 * Quick test script for You.com API integration.
 * Run: YOU_API_KEY="your-key" node test-api.mjs
 */
import {
	YouClient,
	getApiKeyFromEnv,
	webYouSearch,
	webYouFetch,
} from "./shared/dist/index.js";

const key = getApiKeyFromEnv();
if (!key) {
	console.error('❌ YOU_API_KEY not set. Run: export YOU_API_KEY="your-key"');
	process.exit(1);
}

console.log("✅ API key found");
const client = new YouClient({ apiKey: key });

// Test 1: Search
console.log("\n--- Test 1: webYouSearch ---");
const searchResult = await webYouSearch(
	{ query: "TypeScript best practices", numResults: 3 },
	client,
);
console.log(JSON.stringify(searchResult, null, 2));

// Test 2: Fetch
console.log("\n--- Test 2: webYouFetch ---");
const fetchResult = await webYouFetch(
	{ urls: ["https://example.com"] },
	client,
);
console.log(JSON.stringify(fetchResult, null, 2));

console.log("\n✅ All tests passed");
