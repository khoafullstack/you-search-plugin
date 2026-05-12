/**
 * @you-search/pi-extension
 *
 * Pi extension that registers web_you_fetch and web_you_search tools.
 */
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";
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

export default function (pi: ExtensionAPI) {
	// Register web_you_search tool
	pi.registerTool({
		name: "web_you_search",
		label: "Web You Search",
		description: "Search the web via You.com",
		parameters: Type.Object({
			query: Type.String({ description: "The search query" }),
			numResults: Type.Optional(
				Type.Number({ description: "Number of results to return", default: 5 }),
			),
		}),
		async execute(_toolCallId, params, _signal, _onUpdate, _ctx) {
			const client = createClient();
			if (!client) {
				return {
					content: [
						{
							type: "text",
							text: "Error: YOU_API_KEY environment variable is not set.",
						},
					],
					details: {},
				};
			}

			const response = await webYouSearch(
				{ query: params.query, numResults: params.numResults },
				client,
			);

			return {
				content: [{ type: "text", text: JSON.stringify(response, null, 2) }],
				details: {},
			};
		},
	});

	// Register web_you_fetch tool
	pi.registerTool({
		name: "web_you_fetch",
		label: "Web You Fetch",
		description: "Fetch content from URLs via You.com Contents API",
		parameters: Type.Object({
			urls: Type.Array(Type.String({ description: "URL to fetch" }), {
				description: "List of URLs to fetch content from",
			}),
		}),
		async execute(_toolCallId, params, _signal, _onUpdate, _ctx) {
			const client = createClient();
			if (!client) {
				return {
					content: [
						{
							type: "text",
							text: "Error: YOU_API_KEY environment variable is not set.",
						},
					],
					details: {},
				};
			}

			const response = await webYouFetch({ urls: params.urls }, client);

			return {
				content: [{ type: "text", text: JSON.stringify(response, null, 2) }],
				details: {},
			};
		},
	});
}
