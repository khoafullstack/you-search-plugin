/**
 * @you-search/shared — YouClient
 *
 * Wraps the official You.com SDK with error-as-result pattern.
 * All methods never throw — errors are returned as { error: string }.
 */
import { You } from "@youdotcom-oss/sdk";
import type {
	YouClientConfig,
	YouSearchResponse,
	YouFetchResponse,
} from "./types.js";
import { formatApiError, formatNetworkError } from "./errors.js";

export class YouClient {
	private you: You;

	constructor(config: YouClientConfig) {
		if (!config.apiKey) {
			throw new Error("API key is required");
		}
		this.you = new You({ apiKeyAuth: config.apiKey });
	}

	async search(query: string, count?: number): Promise<YouSearchResponse> {
		try {
			const result = await this.you.search({
				query,
				...(count !== undefined ? { count } : {}),
			});

			const webResults = result.results?.web ?? [];

			return {
				results: webResults.map((r) => ({
					title: r.title ?? "",
					url: r.url ?? "",
					snippet: r.snippets?.[0] ?? "",
				})),
			};
		} catch (error: unknown) {
			// SDK may throw ResponseValidationError even on valid 200 responses
			// with data in error.rawValue — extract and use it
			const raw = extractRawValue(error);
			if (raw?.results?.web) {
				return {
					results: raw.results.web.map((r: any) => ({
						title: r.title ?? "",
						url: r.url ?? "",
						snippet: r.snippets?.[0] ?? "",
					})),
				};
			}
			return { error: handleSdkError(error) };
		}
	}

	async fetchContent(urls: string[]): Promise<YouFetchResponse> {
		try {
			const pages = await this.you.contents({
				urls,
				formats: ["markdown"],
			});

			return {
				results: pages.map((p) => ({
					url: p.url ?? "",
					title: p.title ?? "",
					content: p.markdown ?? "",
				})),
			};
		} catch (error: unknown) {
			// SDK may throw ResponseValidationError even on valid responses
			const raw = extractRawValue(error);
			if (Array.isArray(raw)) {
				return {
					results: raw.map((p: any) => ({
						url: p.url ?? "",
						title: p.title ?? "",
						content: p.markdown ?? "",
					})),
				};
			}
			return { error: handleSdkError(error) };
		}
	}
}

// ─── Helpers ─────────────────────────────────────────────────

function handleSdkError(error: unknown): string {
	// YouError from the SDK has statusCode
	if (
		typeof error === "object" &&
		error !== null &&
		"statusCode" in error &&
		typeof (error as any).statusCode === "number"
	) {
		return formatApiError((error as any).statusCode);
	}
	return formatNetworkError(error);
}

/**
 * Extract rawValue from SDK ResponseValidationError.
 * The SDK may throw on valid 200 responses with schema mismatches,
 * but the actual data is in error.rawValue.
 */
function extractRawValue(error: unknown): any {
	if (typeof error === "object" && error !== null && "rawValue" in error) {
		return (error as any).rawValue;
	}
	return null;
}

// ─── Env Helper ──────────────────────────────────────────────

export function getApiKeyFromEnv(): string | undefined {
	return process.env.YOU_API_KEY;
}
