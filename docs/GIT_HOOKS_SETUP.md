# Git Hooks Setup

This document explains the git hooks configured for the boilerplate and how to set them up.

## Overview

The boilerplate uses **Husky** for git hooks management with the following hooks:

| Hook | Trigger | Purpose |
|------|---------|---------|
| `pre-commit` | Before commit | Lint and format staged files |
| `commit-msg` | During commit | Validate commit message format |
| `pre-push` | Before push | Run full test suite |

---

## Automatic Setup

Git hooks are automatically installed when you run:

```bash
pnpm install
```

This runs the `prepare` script which executes `husky` to set up the hooks.

---

## Manual Setup

If hooks aren't working, manually set them up:

```bash
# Install dependencies
pnpm install

# Initialize husky
pnpm prepare

# Verify hooks are executable
chmod +x .husky/pre-commit
chmod +x .husky/commit-msg
chmod +x .husky/pre-push
```

---

## Hook Details

### Pre-Commit Hook

**File:** `.husky/pre-commit`

**What it does:**
- Runs `lint-staged` on staged files only
- Type checks staged TypeScript files
- Lints with ESLint (auto-fixes issues)
- Formats with Prettier

**Configuration:** `.lintstagedrc.js`

**Example workflow:**
```bash
# 1. Make changes
echo "const x = 1" > src/file.ts

# 2. Stage changes
git add src/file.ts

# 3. Commit (hook runs automatically)
git commit -m "feat(core): add new feature"

# Hook output:
# ✔ Preparing lint-staged...
# ✔ Running tasks for staged files...
# ✔ Applying modifications from tasks...
# ✔ Cleaning up temporary files...
```

**Bypassing:**
```bash
git commit --no-verify -m "feat: emergency fix"
```

---

### Commit-Msg Hook

**File:** `.husky/commit-msg`

**What it does:**
- Validates commit message using `commitlint`
- Ensures conventional commit format
- Blocks invalid commit messages

**Configuration:** `commitlint.config.js`

**Valid commit types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Code formatting
- `refactor` - Code refactoring
- `perf` - Performance
- `test` - Tests
- `chore` - Maintenance
- `ci` - CI/CD
- `revert` - Revert
- `build` - Build system

**Examples:**

```bash
# ✅ Valid commits
git commit -m "feat(auth): add JWT authentication"
git commit -m "fix(api): resolve CORS issue"
git commit -m "docs: update README"
git commit -m "feat(auth)!: breaking change in auth API"

# ❌ Invalid commits (hook blocks)
git commit -m "Added new feature"        # Wrong format
git commit -m "feat: Added new feature"  # Wrong case (should be lowercase)
git commit -m "FEAT: new feature"        # Type must be lowercase
git commit -m "update"                   # Missing type
```

**Hook output on error:**
```
⧗   input: Added new feature
✖   subject may not be empty [subject-empty]
✖   type may not be empty [type-empty]

✖   found 2 problems, 0 warnings
ⓘ   Get help: https://github.com/conventional-changelog/commitlint/#what-is-commitlint

husky - commit-msg hook exited with code 1 (error)
```

**Bypassing:**
```bash
git commit --no-verify -m "emergency fix"
```

---

### Pre-Push Hook

**File:** `.husky/pre-push`

**What it does:**
- Runs `pnpm test` - All tests must pass
- Runs `pnpm typecheck` - No TypeScript errors
- Runs `pnpm lint` - No ESLint errors

**Example workflow:**
```bash
# 1. Commit changes
git commit -m "feat(api): add new endpoint"

# 2. Push (hook runs automatically)
git push origin main

# Hook output:
# 🔍 Running validation gates...
# Running tests...
# ✓ All tests passed (15 passed)
# Running typecheck...
# ✓ No type errors
# Running lint...
# ✓ No lint errors
# ✅ All validation gates passed!
```

**If validation fails:**
```
🔍 Running validation gates...
Running tests...
✗ 2 tests failed
error Command failed with exit code 1.
husky - pre-push hook exited with code 1 (error)
```

**Bypassing:**
```bash
git push --no-verify
```

**Note:** Only bypass if you're absolutely sure (e.g., urgent hotfix). Bypassing removes quality guarantees.

---

## Troubleshooting

### Hooks not running

**Check if hooks are installed:**
```bash
ls -la .husky/
```

Should show:
```
pre-commit
commit-msg
pre-push
```

**Reinstall hooks:**
```bash
rm -rf .husky
pnpm prepare
```

**Verify permissions:**
```bash
chmod +x .husky/pre-commit
chmod +x .husky/commit-msg
chmod +x .husky/pre-push
```

---

### Commitlint errors

**Common error:**
```
✖   subject may not be empty [subject-empty]
```

**Fix:** Ensure commit message has format `type(scope): subject`

**Verify commitlint config:**
```bash
cat commitlint.config.js
```

**Test commit message:**
```bash
echo "feat(api): add endpoint" | pnpm commitlint
```

---

### Lint-staged errors

**If lint-staged hangs:**
- Check if ESLint/Prettier configs are valid
- Try running manually:
  ```bash
  pnpm lint-staged
  ```

**If type check fails:**
- Verify `tsconfig.json` exists
- Run typecheck manually:
  ```bash
  pnpm typecheck
  ```

---

### Pre-push too slow

If pre-push hook takes too long, consider:

**Option 1: Skip specific checks locally**
Edit `.husky/pre-push` and comment out slow checks:
```bash
# pnpm test  # Skip tests locally
pnpm typecheck
pnpm lint
```

**Option 2: Run checks in CI only**
Remove `.husky/pre-push` and rely on CI/CD for full validation.

**Option 3: Use --no-verify judiciously**
```bash
git push --no-verify  # Only when necessary
```

---

## Configuration Files

### `commitlint.config.js`
- Defines conventional commit rules
- Customizable types, scopes, and formats
- Located at project root

### `.lintstagedrc.js`
- Defines what commands run on staged files
- Separate configs for different file types
- Located at project root

### `.husky/` directory
- Contains hook scripts
- Managed by Husky
- Hooks are shell scripts

---

## Disabling Hooks (Not Recommended)

### Temporarily disable all hooks
```bash
# For single commit
git commit --no-verify

# For single push
git push --no-verify
```

### Permanently disable hooks
```bash
# Remove husky
pnpm remove husky

# Remove hook directory
rm -rf .husky

# Remove prepare script from package.json
# Edit package.json and remove: "prepare": "husky"
```

**Warning:** Disabling hooks removes quality guarantees and may lead to failed CI builds.

---

## Best Practices

1. **Never bypass hooks without reason**
   - Hooks ensure code quality
   - Bypassing leads to technical debt

2. **Fix issues, don't bypass**
   - If hook fails, fix the issue
   - Don't use `--no-verify` as default

3. **Keep hooks fast**
   - Only check staged files (pre-commit)
   - Run full suite in CI, not locally

4. **Commit often with proper messages**
   - Makes git history meaningful
   - Enables automated changelog

5. **Update hooks as project evolves**
   - Add new validations as needed
   - Remove unnecessary checks

---

## CI/CD Integration

Hooks run locally, but CI/CD should also validate:

```yaml
# .github/workflows/ci.yml
name: CI

on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
      
      - run: pnpm install
      - run: pnpm lint
      - run: pnpm typecheck
      - run: pnpm test
      - run: pnpm build
      
      # Validate commit messages
      - run: npx commitlint --from HEAD~1 --to HEAD --verbose
```

This ensures quality even if hooks are bypassed locally.

---

## Additional Resources

- [Husky Documentation](https://typicode.github.io/husky/)
- [Commitlint Documentation](https://commitlint.js.org/)
- [Lint-Staged Documentation](https://github.com/okonet/lint-staged)
- [Conventional Commits](https://www.conventionalcommits.org/)
