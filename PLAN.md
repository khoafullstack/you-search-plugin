# Plan: Setup pnpm Workspaces + Install Packages

## Context

Project `you-search-plugin` muốn tạo 2 tools (`web_you_fetch`, `web_you_search`) dùng You.com Platform:

- **OpenCode**: dùng **Skill** (markdown-based, `SKILL.md`)
- **Pi**: dùng **Extension** (TypeScript module, `registerTool()`)
- **shared/**: workspace chung chứa core logic

Hiện tại: 3 thư mục trống (`opencode-plugin/`, `pi-extension/`, `shared/`), chưa có `pnpm-workspace.yaml`, chưa có sub-`package.json`.

---

## Approach

### Bước 1: Tạo `pnpm-workspace.yaml`

```yaml
packages:
  - "shared"
  - "opencode-plugin"
  - "pi-extension"
```

### Bước 2: Setup workspace `shared/`

**Package name**: `@you-search/shared`

**package.json**:

```json
{
  "name": "@you-search/shared",
  "version": "0.0.1",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  },
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch"
  }
}
```

**Dependencies** (core logic cho You.com API):

- `node-fetch` — HTTP client (hoặc dùng native `fetch` vì Node 18+)
- `zod` — Schema validation cho API requests/responses

**Dev dependencies**:

- `typescript` — Compiler
- `@types/node` — Node.js types

### Bước 3: Setup workspace `pi-extension/`

**Package name**: `@you-search/pi-extension`

**package.json**:

```json
{
  "name": "@you-search/pi-extension",
  "version": "0.0.1",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch"
  }
}
```

**Dependencies**:

- `@earendil-works/pi-coding-agent` — Extension types (`ExtensionAPI`, `ExtensionContext`)
- `typebox` — Schema definitions cho tool parameters
- `@you-search/shared` — Workspace dependency (core logic)

**Dev dependencies**:

- `typescript`
- `@types/node`

### Bước 4: Setup workspace `opencode-plugin/`

**Package name**: `@you-search/opencode-plugin`

OpenCode plugins là **JS/TypeScript modules** hook vào 25+ events (tool, file, permission, session, TUI...). Plugin export async function nhận context và return event handler. Đặt trong `.opencode/plugin/` (project) hoặc `~/.config/opencode/plugin/` (global).

**package.json**:

```json
{
  "name": "@you-search/opencode-plugin",
  "version": "0.0.1",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  },
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch"
  }
}
```

**Dependencies**:

- `@you-search/shared` — Workspace dependency (core You.com API logic)

**Dev dependencies**:

- `typescript`
- `@types/node`

**Cấu trúc thư mục**:

```
opencode-plugin/
├── package.json
├── tsconfig.json
├── .opencode/
│   ├── plugin/                    # Plugin JS/TS modules
│   │   ├── web-you-fetch.js       # Built output hoặc source
│   │   └── web-you-search.js
│   └── skills/                    # SKILL.md (optional, cho discoverability)
│       ├── web-you-fetch/
│       │   └── SKILL.md
│       └── web-you-search/
│           └── SKILL.md
└── src/
    ├── web-you-fetch.ts           # Plugin: hook events + registerTool()
    ├── web-you-search.ts          # Plugin: hook events + registerTool()
    └── index.ts                   # Export all plugins
```

**Plugin pattern** (theo skill `creating-opencode-plugins`):

```typescript
// src/web-you-fetch.ts
import { youFetch } from "@you-search/shared";

export const WebYouFetchPlugin = async ({ project, client }) => {
  // Register custom tool
  await client.registerTool({
    name: "web_you_fetch",
    description: "Fetch content from You.com",
    parameters: {
      /* schema */
    },
    handler: async (params) => {
      /* ... */
    },
  });

  return {
    event: async ({ event }) => {
      // Hook into tool.execute.before/after, file.edited, etc.
    },
  };
};
```

### Bước 5: Root TypeScript Config

Tạo `tsconfig.json` ở root làm base config:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true
  },
  "exclude": ["node_modules", "dist"]
}
```

Mỗi workspace sẽ có `tsconfig.json` riêng extend từ root:

```json
{
  "extends": "../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src"]
}
```

### Bước 6: Install Từng Workspace

Thực hiện theo thứ tự (workspace trước, rồi dependents):

**Round 1 — shared/**:

```bash
pnpm --filter @you-search/shared add zod
pnpm --filter @you-search/shared add -D typescript @types/node
```

**Round 2 — pi-extension/**:

```bash
pnpm --filter @you-search/pi-extension add @you-search/shared
pnpm --filter @you-search/pi-extension add @earendil-works/pi-coding-agent typebox
pnpm --filter @you-search/pi-extension add -D typescript @types/node
```

**Round 3 — opencode-plugin/**:

```bash
pnpm --filter @you-search/opencode-plugin add @you-search/shared
pnpm --filter @you-search/opencode-plugin add -D typescript @types/node
```

**Hoặc install all từ root** (sau khi workspace đã được define):

```bash
pnpm install
```

---

## Files to Modify/Create

| File                                                       | Action                                           |
| ---------------------------------------------------------- | ------------------------------------------------ |
| `pnpm-workspace.yaml`                                      | **Create** — Workspace config                    |
| `tsconfig.json` (root)                                     | **Create** — Base TypeScript config              |
| `shared/package.json`                                      | **Create** — Shared workspace package            |
| `shared/tsconfig.json`                                     | **Create** — Shared TS config                    |
| `shared/src/index.ts`                                      | **Create** — Entry point (placeholder)           |
| `pi-extension/package.json`                                | **Create** — Pi extension package                |
| `pi-extension/tsconfig.json`                               | **Create** — Pi TS config                        |
| `pi-extension/src/index.ts`                                | **Create** — Extension entry (placeholder)       |
| `opencode-plugin/package.json`                             | **Create** — OpenCode skill package              |
| `opencode-plugin/tsconfig.json`                            | **Create** — OpenCode TS config                  |
| `opencode-plugin/src/web-you-fetch.ts`                     | **Create** — Plugin module (hook + registerTool) |
| `opencode-plugin/src/web-you-search.ts`                    | **Create** — Plugin module (hook + registerTool) |
| `opencode-plugin/src/index.ts`                             | **Create** — Export all plugins                  |
| `opencode-plugin/.opencode/skills/web-you-fetch/SKILL.md`  | **Create** — Skill definition (discoverability)  |
| `opencode-plugin/.opencode/skills/web-you-search/SKILL.md` | **Create** — Skill definition (discoverability)  |

---

## Verification

1. **Check workspace resolution**:

   ```bash
   pnpm ls --depth 0 -r
   ```

   Phải thấy 3 workspaces: `@you-search/shared`, `@you-search/pi-extension`, `@you-search/opencode-plugin`

2. **Check TypeScript compilation**:

   ```bash
   pnpm -r run build
   ```

   Không có lỗi compile

3. **Check dependency linking**:

   ```bash
   pnpm ls -r
   ```

   `@you-search/shared` phải xuất hiện trong dependencies của cả 2 workspace kia

4. **Check Pi extension loadable**:

   ```bash
   cd pi-extension && pi -e ./src/index.ts
   ```

5. **Check OpenCode plugin loadable**:
   ```bash
   cd opencode-plugin && pnpm build
   # Kiểm tra dist/ có output
   # Copy plugin to .opencode/plugin/ và chạy opencode
   ```

---

## Notes

- Root `package.json` hiện tại đã có `"type": "module"` — giữ nguyên
- Root `package.json` cần thêm `"private": true` để tránh publish nhầm
- OpenCode plugins là JS/TypeScript modules hook vào events, đặt trong `.opencode/plugin/`
- SKILL.md song song với plugin giúp agent discover skill name + description
- Pi extension import từ `@earendil-works/pi-coding-agent` cần cài khi dev
- `zod` trong shared dùng để validate You.com API responses
- Tham khảo skill `.agents/skills/creating-opencode-plugins/SKILL.md` cho plugin API details
