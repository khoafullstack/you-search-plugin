# @anhkhoa2109/pi-you-search

Pi extension for **web_you_search** and **web_you_fetch** tools powered by [You.com](https://you.com).

## Features

- 🔍 **web_you_search** — Search the web via You.com Search API
- 📄 **web_you_fetch** — Fetch and extract content from URLs via You.com Contents API

## Install

```bash
# npm
npm install @anhkhoa2109/pi-you-search

# pnpm
pnpm add @anhkhoa2109/pi-you-search
```

## Setup

1. Get your API key from [you.com/platform](https://you.com/platform)
2. Set the environment variable:

```bash
export YOU_API_KEY="your-api-key-here"
```

3. Add the extension to your Pi configuration.

## Usage

Once installed and configured, the extension automatically registers two tools in Pi:

### web_you_search

```json
{
  "query": "your search query",
  "numResults": 5
}
```

### web_you_fetch

```json
{
  "urls": ["https://example.com", "https://example.org"]
}
```

## License

MIT
