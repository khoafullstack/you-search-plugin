## Context

The `shared/` workspace currently has stub functions (`webYouFetch`, `webYouSearch`) that throw "Not implemented yet". Two consumers depend on these:

- `pi-extension/` — registers Pi tools via `registerTool()`
- `opencode-plugin/` — registers OpenCode tools via `client.registerTool()`

Both consumers import from `@you-search/shared` and expect the same function signatures. The You.com platform provides an official TypeScript SDK (`@youdotcom-oss/sdk`) and a REST API at `ydc-index.io`.

## Goals / Non-Goals

**Goals:**

- Implement a working `YouClient` that wraps the You.com SDK
- `webYouSearch()` returns normalized search results from You.com Search API
- `webYouFetch()` returns clean Markdown content from given URLs via Contents API
- API key loaded from `YOU_API_KEY` env variable
- Errors returned as result objects (not thrown) so agents can display them
- Response format: compact `{ title, url, snippet, content? }` — no raw API leaking

**Non-Goals:**

- Research API integration (future capability)
- Caching layer (premature optimization)
- Streaming responses
- Pagination support (can add later)
- Livecrawl in search (search returns snippets only; fetch handles full content)

## Decisions

### D1: Official SDK over raw HTTP

**Decision**: Use `@youdotcom-oss/sdk` as the underlying HTTP client.

**Rationale**: The SDK provides typed request/response models, built-in error classes (`YouError`), and handles auth headers automatically. Raw fetch would require re-implementing all of this.

**Alternatives considered**:

- Raw `fetch()` — lighter but needs manual type definitions, error mapping, header management. Chosen against because the SDK already solves these well and is official.
- `node-fetch` — unnecessary since Node 18+ has native `fetch` and the SDK handles transport.

### D2: YouClient class as central wrapper

**Decision**: Create a `YouClient` class that initializes the SDK and exposes `search()` and `fetchContent()` methods.

```
YouClient
├── constructor(config: { apiKey: string })
├── search(query, options) → SearchResult[]
└── fetchContent(urls, options) → FetchResult[]
```

**Rationale**: Encapsulates SDK initialization, provides a clean interface for consumers, and makes testing easier (mock the client, not the SDK).

**Alternatives considered**:

- Standalone functions that init SDK per call — wasteful, no connection reuse.
- Global singleton — harder to test, inflexible for different API keys.

### D3: Env variable for API key

**Decision**: `YOU_API_KEY` environment variable. Loaded once at `YouClient` construction.

**Rationale**: Simple, works across both agents (Pi and OpenCode), no config file management. Agents already run in environments where env vars are natural.

**Alternatives considered**:

- Config file (.you-search.json) — adds file I/O complexity, harder to rotate keys.
- Agent-specific config — breaks shared/ abstraction, couples to each agent's config system.

### D4: Error-as-result pattern

**Decision**: Functions never throw. Errors return as `{ error: string }` in the result type.

**Rationale**: Coding agents need to display errors to users. Throwing would require try/catch in every consumer. Returning error messages lets agents handle gracefully.

**Alternatives considered**:

- Throwing custom errors — consumers must catch, easy to forget, crashes agent if uncaught.
- Returning `null` — loses error context.

### D5: Response normalization

**Decision**: Map API responses to a flat, simple format:

```typescript
interface SearchResult {
  title: string;
  url: string;
  snippet: string;
}

interface FetchResult {
  url: string;
  title: string;
  content: string; // Markdown
}
```

**Rationale**: Agents don't need raw API metadata (search_uuid, latency, favicon_url). They need title + URL + content to reason about. Keeping it simple reduces token usage in agent context.

## Risks / Trade-offs

- **[SDK bundle size]** → The SDK may pull in transitive deps. Mitigation: it's a dev/runtime dep in shared/, not bundled into agent binaries.
- **[API key exposure]** → Env var could be logged. Mitigation: standard practice, agents don't log env vars. Never include key in tool output.
- **[Rate limits]** → You.com has rate limits (429). Mitigation: return descriptive error message; consumers can retry logic later.
- **[SDK version drift]** → SDK may lag behind API changes. Mitigation: pin SDK version, upgrade deliberately.
