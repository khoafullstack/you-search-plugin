# You Search Plugin 🔍

Web search & fetch tools for AI coding agents, powered by [You.com API](https://you.com/docs/).

This project provides two tools — **`web_you_search`** and **`web_you_fetch`** — that allow AI agents to search the web and fetch content from URLs in real-time.

## 🛠️ Tools

| Tool                 | Description                                                     |
| -------------------- | --------------------------------------------------------------- |
| **`web_you_search`** | Search the web via You.com. Returns titles, URLs, and snippets. |
| **`web_you_fetch`**  | Fetch full content from URLs via You.com Contents API.          |

### Example Usage

```
> Search: "latest Node.js LTS version"
> Fetch: ["https://nodejs.org", "https://github.com/nodejs/release"]
```

## 📦 Packages

| Package                       | Description                                |
| ----------------------------- | ------------------------------------------ |
| `@you-search/shared`          | Core logic shared between plugins          |
| `@you-search/opencode-plugin` | Plugin for [OpenCode](https://opencode.ai) |
| `@you-search/pi-extension`    | Extension for [Pi](https://pi.dev)         |

## ⚡ Quick Start

### 1. Get You.com API Key

1. Sign up at [you.com](https://you.com)
2. Go to [API Settings](https://you.com/developers/api-keys)
3. Create a new API key
4. Copy the key

### 2. Set Environment Variable

```bash
# Add to your shell profile (~/.zshrc, ~/.bashrc, etc.)
export YOU_API_KEY="your-api-key-here"

# Or create a .env file in your project root
echo 'YOU_API_KEY=your-api-key-here' > .env
```

### 3. Install

Choose your platform:

---

#### 🟣 For OpenCode

```bash
# Clone and build
git clone https://github.com/khoafullstack/you-search-plugin.git
cd you-search-plugin
pnpm install
pnpm build

# Copy plugin to OpenCode
cp -r opencode-plugin/dist .opencode/plugin/you-search
```

Or install via OpenCode CLI (when published):

```bash
opencode plugin add @you-search/opencode-plugin
```

---

#### 🔵 For Pi

```bash
# Clone and build
git clone https://github.com/khoafullstack/you-search-plugin.git
cd you-search-plugin
pnpm install
pnpm build

# Copy extension to Pi extensions folder
cp -r pi-extension/dist ~/.pi/extensions/you-search
```

Or install via Pi CLI (when published):

```bash
pi extension add @you-search/pi-extension
```

---

## 🏗️ Development

### Prerequisites

- [Node.js](https://nodejs.org) >= 20
- [pnpm](https://pnpm.io) >= 9
- [You.com API Key](https://you.com/developers/api-keys)

### Setup

```bash
# Clone the repo
git clone https://github.com/khoafullstack/you-search-plugin.git
cd you-search-plugin

# Install dependencies
pnpm install

# Set API key
export YOU_API_KEY="your-api-key-here"

# Build all packages
pnpm build
```

### Project Structure

```
you-search-plugin/
├── shared/                  # Core logic (@you-search/shared)
│   └── src/
│       ├── client.ts        # YouClient wrapper
│       ├── search.ts        # web_you_search implementation
│       ├── fetch.ts         # web_you_fetch implementation
│       └── types.ts         # TypeScript types
├── opencode-plugin/         # OpenCode plugin
│   └── src/
│       └── plugin.ts        # Plugin registration
├── pi-extension/            # Pi extension
│   └── src/
│       └── index.ts         # Extension registration
├── openspec/                # You.com API specs
└── package.json
```

### Scripts

```bash
pnpm build          # Build all packages
pnpm dev            # Watch mode for development
pnpm changeset      # Create a changeset for versioning
pnpm version        # Bump versions (via changesets)
pnpm release        # Publish packages
```

## 📝 Releasing

This project uses [Changesets](https://github.com/changesets/changesets) for version management.

```bash
# Create a changeset
pnpm changeset

# Follow prompts to select packages and describe changes
# Commit the changeset file
git add .
git commit -m "feat: add new feature"
git push origin main

# GitHub Actions will automatically:
# 1. Create a "Version Packages" PR
# 2. When merged, bump versions and create a GitHub Release
```

## 📄 License

ISC

## 🔗 Links

- [You.com API Docs](https://you.com/docs/)
- [OpenCode Docs](https://opencode.ai/docs)
- [Pi Docs](https://pi.dev/docs/latest)
- [GitHub Issues](https://github.com/khoafullstack/you-search-plugin/issues)
