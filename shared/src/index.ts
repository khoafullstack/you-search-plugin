/**
 * @you-search/shared
 *
 * Core logic for web_you_fetch and web_you_search tools.
 * Shared between OpenCode plugin and Pi extension.
 */

// ─── Types ───────────────────────────────────────────────────
export type {
	YouClientConfig,
	YouSearchOptions,
	YouFetchOptions,
	SearchResult,
	FetchResult,
	YouSearchResponse,
	YouFetchResponse,
} from "./types.js";

// ─── Client ──────────────────────────────────────────────────
export { YouClient, getApiKeyFromEnv } from "./client.js";

// ─── Tools ───────────────────────────────────────────────────
export { webYouSearch } from "./search.js";
export { webYouFetch } from "./fetch.js";

// ─── Errors ──────────────────────────────────────────────────
export { formatApiError, formatNetworkError } from "./errors.js";
