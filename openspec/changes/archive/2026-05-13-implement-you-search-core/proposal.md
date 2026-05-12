## Why

The `you-search-plugin` project provides `web_you_fetch` and `web_you_search` tools for coding agents (OpenCode and Pi). Currently `shared/src/index.ts` contains only stub functions that throw "Not implemented yet". The core You.com API integration — the foundation both agents depend on — needs to be built so these tools actually work.

## What Changes

- Implement `YouClient` class that wraps the official You.com TypeScript SDK (`@youdotcom-oss/sdk`)
- API key loaded from `YOU_API_KEY` environment variable
- Implement `webYouSearch()` — calls You.com Search API, returns normalized results (title, url, snippet)
- Implement `webYouFetch()` — calls You.com Contents API, returns clean Markdown content from given URLs
- Shared error handling that returns descriptive error messages (not exceptions) so agents can handle gracefully
- Response normalization: raw API responses → compact `{ title, url, snippet, content? }` format

## Capabilities

### New Capabilities

- `you-client`: YouClient initialization, SDK wrapper, API key management, error handling
- `you-search`: webYouSearch() implementation — Search API integration with response normalization
- `you-fetch`: webYouFetch() implementation — Contents API integration with Markdown extraction

### Modified Capabilities

(none — this is the initial implementation)

## Impact

- **Code**: `shared/src/` — new files `client.ts`, `types.ts`, `search.ts`, `fetch.ts`, `errors.ts`; update `index.ts`
- **Dependencies**: Add `@youdotcom-oss/sdk` to `@you-search/shared`
- **Consumers**: `pi-extension/src/index.ts` and `opencode-plugin/src/web-you-fetch.ts`, `opencode-plugin/src/web-you-search.ts` — import updated interfaces
- **Environment**: Requires `YOU_API_KEY` env variable set at runtime
