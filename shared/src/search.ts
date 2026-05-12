/**
 * @you-search/shared — webYouSearch
 *
 * Calls You.com Search API and returns normalized results.
 */
import type { YouClient } from "./client.js";
import type { YouSearchOptions, YouSearchResponse } from "./types.js";

/**
 * Search the web via You.com.
 *
 * @param options - Search options (query required, numResults optional)
 * @param client - Pre-configured YouClient instance
 * @returns Normalized search results or error
 */
export async function webYouSearch(
	options: YouSearchOptions,
	client: YouClient,
): Promise<YouSearchResponse> {
	if (!options.query || options.query.trim() === "") {
		return { error: "Query cannot be empty" };
	}

	return client.search(options.query, options.numResults);
}
