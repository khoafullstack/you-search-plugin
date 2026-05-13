# Plan: Setup Release Pipeline cho You Search Plugin

## Context

Dự án `you-search-plugin` là monorepo với 3 packages (pnpm workspaces):

- `@you-search/shared` (v0.0.1) — core logic chung
- `@you-search/opencode-plugin` (v0.0.1) — plugin cho OpenCode
- `@you-search/pi-extension` (v0.0.1) — extension cho Pi

Hiện tại chưa có CI/CD, chưa có release process. Cần setup:

1. **Changesets** — tự động quản lý version + changelog
2. **GitHub Actions** — CI/CD tự động build + release
3. **Tạo release v0.0.1** — release đầu tiên

---

## Approach

### Bước 1: Setup Changesets

Changesets là tool chuẩn cho monorepo versioning.它 sẽ:

- Theo dõi changes qua `.changeset/*.md` files
- Tự động bump version đúng cách
- Generate CHANGELOG.md

**Files cần tạo/sửa:**

- `.changeset/config.json` — config changesets
- `package.json` — thêm scripts cho changesets

### Bước 2: Setup GitHub Actions CI/CD

Tạo 2 workflows:

1. **CI** (`ci.yml`) — build & test khi push/PR
2. **Release** (`release.yml`) — tự động release khi merge to main

**Files cần tạo:**

- `.github/workflows/ci.yml`
- `.github/workflows/release.yml`

### Bước 3: Tạo Release v0.0.1

Sau khi setup xong, tạo release đầu tiên:

- Tạo git tag `v0.0.1`
- Tạo GitHub Release với release notes

---

## Files to Modify/Create

| File                            | Action | Mô tả                                           |
| ------------------------------- | ------ | ----------------------------------------------- |
| `.changeset/config.json`        | CREATE | Config changesets cho monorepo                  |
| `package.json`                  | EDIT   | Thêm scripts: `changeset`, `version`, `release` |
| `.github/workflows/ci.yml`      | CREATE | CI workflow: build khi push                     |
| `.github/workflows/release.yml` | CREATE | Release workflow: auto release khi merge        |

---

## Reuse Existing Code

- `pnpm-workspace.yaml` — đã có cấu hình packages, reuse
- `package.json` scripts — thêm vào existing scripts
- Git tags — dùng git tag truyền thống + gh CLI

---

## Steps

### Step 1: Install Changesets

```bash
pnpm add -Dw @changesets/cli
```

### Step 2: Init Changesets

```bash
pnpm changeset init
```

→ Tạo `.changeset/config.json`

### Step 3: Edit .changeset/config.json

Config cho monorepo:

```json
{
  "$schema": "https://unpkg.com/@changesets/config@3.0.0/schema.json",
  "changelog": "@changesets/cli/changelog",
  "commit": false,
  "fixed": [],
  "linked": [["@you-search/opencode-plugin", "@you-search/pi-extension"]],
  "access": "public",
  "baseBranch": "main",
  "updateInternalDependencies": "patch",
  "ignore": []
}
```

### Step 4: Add scripts to root package.json

```json
{
  "scripts": {
    "changeset": "changeset",
    "version": "changeset version",
    "release": "changeset publish",
    "build": "pnpm -r build"
  }
}
```

### Step 5: Create GitHub Actions CI Workflow

`.github/workflows/ci.yml`:

- Trigger: push to main, PR to main
- Jobs: install → build → (optional: test)

### Step 6: Create GitHub Actions Release Workflow

`.github/workflows/release.yml`:

- Trigger: push to main
- Jobs: install → build → changeset version → git push (version bump)
- Không publish npm (packages giữ `private: true`)

### Step 7: Create Release v0.0.1

```bash
# Tạo tag
git tag v0.0.1
git push origin v0.0.1

# Tạo release với gh CLI
gh release create v0.0.1 \
  --title "v0.0.1 - Initial Release" \
  --notes "## You Search Plugin v0.0.1

### 🚀 Features
- OpenCode plugin for web search
- Pi extension for web search
- Shared core logic"

# Commit & Push
git add .
git commit -m "chore: setup changesets and CI/CD"
git push origin main
```

---

## Verification

1. **Changesets**:

   ```bash
   pnpm changeset  # Should show changeset wizard
   ```

2. **CI Workflow**:

   ```bash
   gh workflow list  # Should show ci.yml
   ```

3. **Release Workflow**:

   ```bash
   gh workflow list  # Should show release.yml
   ```

4. **Release v0.0.1**:
   ```bash
   gh release list  # Should show v0.0.1
   ```

---

## Note: Không publish npm

Các packages giữ nguyên `"private": true`, chỉ tạo GitHub Release với source code.

---

## Summary

Sau khi hoàn thành:

- ✅ Changesets quản lý version + changelog tự động
- ✅ CI chạy build khi có PR/push
- ✅ Release workflow tự động bump version khi merge to main
- ✅ Release v0.0.1 đầu tiên trên GitHub (không publish npm)
