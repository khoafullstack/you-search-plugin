## ADDED Requirements

### Requirement: YouClient initialization

The system SHALL provide a `YouClient` class that wraps the You.com SDK. The constructor SHALL accept a config object with an `apiKey` string field. The client SHALL initialize the underlying You.com SDK with the provided API key.

#### Scenario: Successful initialization

- **WHEN** a `YouClient` is created with a valid API key
- **THEN** the client is ready to make API calls

#### Scenario: Missing API key

- **WHEN** a `YouClient` is created with an empty or missing API key
- **THEN** the constructor SHALL throw an error with message "API key is required"

### Requirement: API key from environment

The system SHALL export a helper function `getApiKeyFromEnv()` that reads the `YOU_API_KEY` environment variable. If the variable is not set, the function SHALL return `undefined`.

#### Scenario: Env variable set

- **WHEN** `YOU_API_KEY` is set in the environment
- **THEN** `getApiKeyFromEnv()` returns the key string

#### Scenario: Env variable not set

- **WHEN** `YOU_API_KEY` is not set in the environment
- **THEN** `getApiKeyFromEnv()` returns `undefined`

### Requirement: Error result format

All public methods of `YouClient` SHALL never throw exceptions. Errors SHALL be returned as part of the result with an `error` field containing a human-readable message.

#### Scenario: API returns 401

- **WHEN** the You.com API returns a 401 Unauthorized response
- **THEN** the method returns `{ error: "Invalid API key. Check YOUR_API_KEY environment variable." }`

#### Scenario: API returns 429

- **WHEN** the You.com API returns a 429 Rate Limited response
- **THEN** the method returns `{ error: "Rate limited by You.com. Please retry later." }`

#### Scenario: Network error

- **WHEN** a network error occurs (DNS failure, timeout, etc.)
- **THEN** the method returns `{ error: "Network error: <original message>" }`
