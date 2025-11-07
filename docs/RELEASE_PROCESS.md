# Release Process

This document explains how to use the automated versioning and release system powered by `release-it`.

## Overview

The boilerplate uses `release-it` to automate:
- Version bumping (semantic versioning)
- Git commits and tags
- Changelog generation (conventional commits)
- Building changed packages
- GitHub releases

## Quick Start

```bash
# Patch release (bug fixes)
pnpm release:patch

# Minor release (new features)
pnpm release:minor

# Major release (breaking changes)
pnpm release:major

# Interactive mode (choose version)
pnpm release
```

## Release Workflow

When you run a release command, the following happens automatically:

### 1. Pre-Release Validation
- Runs `pnpm lint` to check code quality
- Runs `pnpm typecheck` to verify TypeScript types
- Runs `pnpm test` to ensure all tests pass

### 2. Version Bump
- Updates version in root `package.json`
- Updates version in all workspace packages (`version-packages.js`)
- Generates/updates `CHANGELOG.md` using conventional commits

### 3. Post-Bump Build
- Detects changed packages by comparing git diff
- Builds only **buildable packages** that changed
- Skips **non-buildable packages** (built by consuming apps)
- Builds changed apps

### 4. Commit & Tag
- Creates git commit with message: `chore: release v{version}`
- Creates git tag: `v{version}`

### 5. GitHub Release
- Pushes commit and tags to remote
- Creates GitHub release with changelog

## Package Build Configuration

### Buildable Packages

These packages have a build step and output to `dist/`:

- **`@repo/services`** - Backend business logic (TypeScript → JS)
- **`@repo/database`** - Prisma client (generated)
- **`@repo/auth`** - Authentication utilities (TypeScript → JS)
- **`@repo/eslint-config`** - ESLint configurations (JSON/JS)
- **`@repo/typescript-config`** - TypeScript configurations (JSON)

**Why buildable?** These packages are consumed as compiled artifacts by apps and other packages.

### Non-Buildable Packages

These packages are **not built separately** - they're built by consuming apps:

- **`@repo/ui`** - React/shadcn components
  - Built by Next.js apps during their build process
  - Components are imported as source code
  
- **`@repo/ui-config`** - Tailwind configuration
  - Consumed directly by app's Tailwind build
  - No compilation needed
  
- **`@repo/i18n`** - Internationalization resources
  - JSON translation files bundled by Next.js
  - Built by `next-intl` during app build

**Why non-buildable?** These packages contain source code that needs to be processed in the context of the consuming app (for tree-shaking, CSS optimization, etc.).

### Apps

All apps are buildable:
- **`web`** - Next.js web application
- **`admin`** - Next.js admin application
- Any other Next.js apps

## Configuration Files

### `.release-it.json`

Main configuration for release-it:

```json
{
  "git": {
    "commitMessage": "chore: release v${version}",
    "tagName": "v${version}",
    "requireCleanWorkingDir": false
  },
  "npm": {
    "publish": false
  },
  "github": {
    "release": true
  },
  "hooks": {
    "before:init": ["pnpm lint", "pnpm typecheck", "pnpm test"],
    "after:bump": [
      "node scripts/version-packages.js",
      "node scripts/build-changed.js"
    ]
  },
  "plugins": {
    "@release-it/conventional-changelog": {
      "preset": "angular",
      "infile": "CHANGELOG.md"
    }
  }
}
```

### `scripts/version-packages.js`

Synchronizes version across all workspace packages:
- Reads version from root `package.json`
- Updates version in `packages/*/package.json`
- Updates version in `apps/*/package.json`

### `scripts/build-changed.js`

Intelligently builds only what's needed:
- Detects changed files using `git diff`
- Identifies changed packages and apps
- Skips non-buildable packages (ui, ui-config, i18n)
- Builds only buildable packages with changes
- Builds all changed apps
- Reports build summary

## Git Hooks (Automated Quality Gates)

The boilerplate uses **Husky** to enforce quality gates automatically:

### Pre-Commit Hook
**Runs on:** `git commit`  
**What it does:** Runs `lint-staged` to:
- Type check staged files
- Lint staged files with auto-fix
- Format staged files with Prettier

**Bypassing (not recommended):**
```bash
git commit --no-verify  # Skip pre-commit hooks
```

### Commit-Msg Hook
**Runs on:** `git commit`  
**What it does:** Validates commit message format using `commitlint`
- Enforces conventional commit format
- Blocks commits with invalid messages

**Example validation:**
```bash
# ✅ Valid commits (hook passes)
git commit -m "feat(auth): add login endpoint"
git commit -m "fix(api): resolve CORS issue"

# ❌ Invalid commits (hook blocks)
git commit -m "fixed stuff"  # Missing type and format
git commit -m "Added feature"  # Wrong case
```

### Pre-Push Hook
**Runs on:** `git push`  
**What it does:** Runs full validation suite:
- `pnpm test` - All tests must pass
- `pnpm typecheck` - No type errors
- `pnpm lint` - No lint errors

**Bypassing (not recommended):**
```bash
git push --no-verify  # Skip pre-push hooks
```

---

## Conventional Commits

Commit messages are automatically validated by the `commit-msg` hook.

**Format:**
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat:` - New feature (minor version bump)
- `fix:` - Bug fix (patch version bump)
- `docs:` - Documentation only
- `style:` - Code style changes (formatting)
- `refactor:` - Code refactoring
- `perf:` - Performance improvements
- `test:` - Adding/updating tests
- `chore:` - Maintenance tasks
- `ci:` - CI/CD changes

### Examples

```bash
# Patch release
git commit -m "fix(auth): resolve JWT expiration issue"

# Minor release
git commit -m "feat(ui): add new Button variants"

# Major release (breaking change)
git commit -m "feat(services)!: redesign user service API

BREAKING CHANGE: userService.getUser() now returns a Promise"
```

## Manual Release Steps

If you need to release manually or debug:

```bash
# 1. Run pre-release checks
pnpm lint
pnpm typecheck
pnpm test

# 2. Bump versions manually
npm version patch  # or minor, major
node scripts/version-packages.js

# 3. Build changed packages
node scripts/build-changed.js

# 4. Commit and tag
git add .
git commit -m "chore: release v0.1.0"
git tag v0.1.0

# 5. Push
git push origin main --follow-tags
```

## Troubleshooting

### Release fails at build step

Check which packages changed:
```bash
git diff --name-only HEAD~1
```

Manually test the build:
```bash
node scripts/build-changed.js
```

### Version not updating in packages

Run version script manually:
```bash
node scripts/version-packages.js
```

### GitHub release not created

Ensure you have `GITHUB_TOKEN` configured:
```bash
export GITHUB_TOKEN="your_token_here"
```

Or configure in `.release-it.json`:
```json
{
  "github": {
    "release": true,
    "tokenRef": "GITHUB_TOKEN"
  }
}
```

### Build fails for non-buildable packages

If a package shouldn't be built, add it to `NON_BUILDABLE_PACKAGES` in `scripts/build-changed.js`:

```js
const NON_BUILDABLE_PACKAGES = [
  'ui',
  'ui-config',
  'i18n',
  'your-package-name'  // Add here
];
```

## CI/CD Integration

For automated releases in CI/CD:

```yaml
# .github/workflows/release.yml
name: Release

on:
  push:
    branches: [main]

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0
      
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'pnpm'
      
      - run: pnpm install
      
      - name: Release
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: pnpm release --ci
```

## Best Practices

1. **Always run tests before releasing**
   - Tests run automatically, but ensure they're comprehensive

2. **Use conventional commits**
   - Enables automatic changelog generation
   - Makes version bumps semantic

3. **Review CHANGELOG.md**
   - Check generated changelog before pushing
   - Edit if needed for clarity

4. **Keep package.json scripts consistent**
   - Ensure all packages have `build` script if buildable
   - Document why a package doesn't have build script

5. **Don't manually edit versions**
   - Let release-it handle version bumping
   - Prevents version drift between packages

6. **Test builds locally first**
   - Run `pnpm build` before releasing
   - Catch build issues early

## Additional Resources

- [release-it documentation](https://github.com/release-it/release-it)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)
