/**
 * @you-search/shared — Type definitions
 */

// ─── Client Config ───────────────────────────────────────────

export interface YouClientConfig {
	apiKey: string;
}

// ─── Search ──────────────────────────────────────────────────

export interface YouSearchOptions {
	query: string;
	numResults?: number;
}

export interface SearchResult {
	title: string;
	url: string;
	snippet: string;
}

export type YouSearchResponse = { results: SearchResult[] } | { error: string };

// ─── Fetch (Contents) ───────────────────────────────────────

export interface YouFetchOptions {
	urls: string[];
}

export interface FetchResult {
	url: string;
	title: string;
	content: string;
}

export type YouFetchResponse = { results: FetchResult[] } | { error: string };
