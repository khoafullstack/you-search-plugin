/**
 * OpenCode plugin for web_you_fetch and web_you_search tools.
 *
 * Registers both You.com tools in a single plugin.
 * Place built output in .opencode/plugin/ to activate.
 */
import type { Plugin } from "@opencode-ai/plugin";
import { tool } from "@opencode-ai/plugin";
import {
	YouClient,
	getApiKeyFromEnv,
	webYouFetch,
	webYouSearch,
} from "@you-search/shared";

function createClient(): YouClient | null {
	const apiKey = getApiKeyFromEnv();
	if (!apiKey) return null;
	return new YouClient({ apiKey });
}

export const YouSearchPlugin: Plugin = async (_input) => {
	return {
		tool: {
			web_you_search: tool({
				description: "Search the web via You.com",
				args: {
					query: tool.schema.string().describe("The search query"),
					numResults: tool.schema
						.number()
						.optional()
						.describe("Number of results to return (default: 5)"),
				},
				async execute(args, _ctx) {
					const client = createClient();
					if (!client) {
						return "Error: YOU_API_KEY environment variable is not set.";
					}

					const response = await webYouSearch(
						{ query: args.query, numResults: args.numResults },
						client,
					);
					return JSON.stringify(response, null, 2);
				},
			}),

			web_you_fetch: tool({
				description: "Fetch content from URLs via You.com Contents API",
				args: {
					urls: tool.schema
						.array(tool.schema.string())
						.describe("List of URLs to fetch content from"),
				},
				async execute(args, _ctx) {
					const client = createClient();
					if (!client) {
						return "Error: YOU_API_KEY environment variable is not set.";
					}

					const response = await webYouFetch({ urls: args.urls }, client);
					return JSON.stringify(response, null, 2);
				},
			}),
		},
	};
};
