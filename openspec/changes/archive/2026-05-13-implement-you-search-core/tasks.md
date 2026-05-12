## 1. Types & Client Setup

- [x] 1.1 Create `shared/src/types.ts` with `YouClientConfig`, `YouSearchOptions`, `YouFetchOptions`, `SearchResult`, `FetchResult`, `YouSearchResponse`, `YouFetchResponse` types
- [x] 1.2 Create `shared/src/errors.ts` with `formatApiError()` helper that maps HTTP status codes to human-readable messages
- [x] 1.3 Create `shared/src/client.ts` with `YouClient` class — constructor validates API key, initializes SDK, exposes `search()` and `fetchContent()` methods
- [x] 1.4 Add `getApiKeyFromEnv()` helper in `client.ts` that reads `YOU_API_KEY` from `process.env`

## 2. Search Implementation

- [x] 2.1 Create `shared/src/search.ts` with `webYouSearch(options)` function
- [x] 2.2 Implement Search API call via `YouClient.search()` with `query` and `count` parameters
- [x] 2.3 Implement response normalization — map API results to `{ title, url, snippet }` format
- [x] 2.4 Handle error cases: empty query, API errors (401, 429, network) — return `{ error: string }` instead of throwing

## 3. Fetch Implementation

- [x] 3.1 Create `shared/src/fetch.ts` with `webYouFetch(options)` function
- [x] 3.2 Implement Contents API call via `YouClient.fetchContent()` with URL list
- [x] 3.3 Implement response normalization — map API results to `{ url, title, content }` format
- [x] 3.4 Handle error cases: empty URL list, invalid URLs, per-URL failures — return `{ error: string }` or graceful degradation

## 4. Integration & Exports

- [x] 4.1 Update `shared/src/index.ts` to re-export all types, `YouClient`, `webYouSearch`, `webYouFetch`, `getApiKeyFromEnv`
- [x] 4.2 Update `pi-extension/src/index.ts` — use new types, handle error responses from shared functions
- [x] 4.3 Update `opencode-plugin/src/web-you-fetch.ts` and `web-you-search.ts` — use new types, handle error responses
- [x] 4.4 Run `pnpm -r run build` — verify all 3 workspaces compile without errors

## 5. Verification

- [x] 5.1 Test `webYouSearch` with a real query ✅
- [x] 5.2 Test `webYouFetch` with a real URL ✅
- [x] 5.3 Test error handling: invalid API key returns descriptive error message
- [x] 5.4 Test Pi extension loads without errors
