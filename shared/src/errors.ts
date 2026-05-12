/**
 * @you-search/shared — Error formatting
 *
 * Maps HTTP status codes and error types to human-readable messages.
 * All public functions return errors as values, never throw.
 */

export function formatApiError(statusCode: number): string {
	switch (statusCode) {
		case 401:
			return "Invalid API key. Check YOUR_API_KEY environment variable.";
		case 402:
			return "Insufficient credits. Please add funds at you.com/platform.";
		case 403:
			return "Access denied. Your API key may not have permission for this resource.";
		case 404:
			return "Resource not found.";
		case 429:
			return "Rate limited by You.com. Please retry later.";
		default:
			if (statusCode >= 500) {
				return `You.com server error (${statusCode}). Please try again later.`;
			}
			return `API error: HTTP ${statusCode}`;
	}
}

export function formatNetworkError(error: unknown): string {
	const message = error instanceof Error ? error.message : String(error);
	return `Network error: ${message}`;
}
