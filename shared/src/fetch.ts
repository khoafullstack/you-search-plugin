/**
 * @you-search/shared — webYouFetch
 *
 * Calls You.com Contents API and returns clean Markdown content.
 */
import type { YouClient } from "./client.js";
import type { YouFetchOptions, YouFetchResponse } from "./types.js";

const URL_REGEX = /^https?:\/\/.+/;

/**
 * Fetch content from URLs via You.com Contents API.
 *
 * @param options - Fetch options (urls required)
 * @param client - Pre-configured YouClient instance
 * @returns Normalized content results or error
 */
export async function webYouFetch(
	options: YouFetchOptions,
	client: YouClient,
): Promise<YouFetchResponse> {
	if (!options.urls || options.urls.length === 0) {
		return { error: "At least one URL is required" };
	}

	// Validate all URLs before making API call
	for (const url of options.urls) {
		if (!URL_REGEX.test(url)) {
			return { error: `Invalid URL: ${url}` };
		}
	}

	return client.fetchContent(options.urls);
}
