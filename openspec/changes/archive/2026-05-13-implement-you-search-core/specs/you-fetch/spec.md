## ADDED Requirements

### Requirement: webYouFetch function

The system SHALL export an async function `webYouFetch(options: YouFetchOptions)` that calls the You.com Contents API and returns clean Markdown content for the given URLs.

#### Scenario: Successful fetch

- **WHEN** `webYouFetch({ urls: ["https://example.com"] })` is called with a valid API key
- **THEN** the function returns `{ results: [...] }` where each result has `url`, `title`, and `content` fields

#### Scenario: Multiple URLs

- **WHEN** `webYouFetch({ urls: ["https://a.com", "https://b.com"] })` is called
- **THEN** the Contents API request includes both URLs and results contain entries for each

#### Scenario: Empty URL list

- **WHEN** `webYouFetch({ urls: [] })` is called
- **THEN** the function returns `{ error: "At least one URL is required" }`

#### Scenario: Invalid URL

- **WHEN** one of the provided URLs is not a valid HTTP/HTTPS URL
- **THEN** the function returns `{ error: "Invalid URL: <url>" }`

#### Scenario: URL not reachable

- **WHEN** the Contents API cannot fetch a specific URL (404, timeout, etc.)
- **THEN** that URL's result SHALL have `content: ""` and other URLs continue to be processed

### Requirement: Fetch response normalization

Each fetch result SHALL be normalized to a flat object with:

- `url` (string): The original URL
- `title` (string): The page title from the API response
- `content` (string): The Markdown content, or empty string if unavailable

#### Scenario: Markdown content available

- **WHEN** the API returns `markdown: "# Title\n\nFull content..."`
- **THEN** the result's `content` field is `"# Title\n\nFull content..."`

#### Scenario: Markdown content unavailable

- **WHEN** the API returns no markdown for a URL
- **THEN** the result's `content` field is `""`

### Requirement: YouFetchOptions type

The `YouFetchOptions` interface SHALL have:

- `urls` (string[], required): List of URLs to fetch content from

#### Scenario: Single URL

- **WHEN** `urls` contains exactly one entry
- **THEN** the API request is made with that single URL
