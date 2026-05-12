## ADDED Requirements

### Requirement: webYouSearch function

The system SHALL export an async function `webYouSearch(options: YouSearchOptions)` that calls the You.com Search API and returns normalized search results.

#### Scenario: Successful search

- **WHEN** `webYouSearch({ query: "typescript best practices" })` is called with a valid API key
- **THEN** the function returns `{ results: [...] }` where each result has `title`, `url`, and `snippet` fields

#### Scenario: Search with count limit

- **WHEN** `webYouSearch({ query: "nodejs", numResults: 3 })` is called
- **THEN** the Search API request includes `count: 3` and at most 3 results are returned

#### Scenario: Empty query

- **WHEN** `webYouSearch({ query: "" })` is called
- **THEN** the function returns `{ error: "Query cannot be empty" }`

#### Scenario: No results found

- **WHEN** the Search API returns zero results for a valid query
- **THEN** the function returns `{ results: [] }`

### Requirement: Search response normalization

Each search result SHALL be normalized to a flat object with:

- `title` (string): The page title
- `url` (string): The page URL
- `snippet` (string): First snippet from the API response, or empty string if none

The system SHALL NOT expose raw API metadata (search_uuid, latency, favicon_url, etc.) in the output.

#### Scenario: Result with snippets

- **WHEN** the API returns a result with `snippets: ["First excerpt", "Second excerpt"]`
- **THEN** the normalized result's `snippet` field is `"First excerpt"`

#### Scenario: Result without snippets

- **WHEN** the API returns a result with `snippets: []`
- **THEN** the normalized result's `snippet` field is `""`

### Requirement: YouSearchOptions type

The `YouSearchOptions` interface SHALL have:

- `query` (string, required): The search query
- `numResults` (number, optional, default 5): Max results per source type

#### Scenario: Default numResults

- **WHEN** `numResults` is not provided
- **THEN** the API request uses `count: 5`
