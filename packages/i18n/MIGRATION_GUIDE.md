# Translation Migration Guide

This guide explains how to migrate existing flat translation files to the new nested structure.

## Overview

**Old Structure:**

```
apps/admin/messages/
├── en.json  (all translations in one file)
└── ar.json
```

**New Structure:**

```
packages/i18n/messages/
├── shared/en/         (common translations)
│   ├── common.json
│   ├── navigation.json
│   ├── auth.json
│   └── errors.json
├── admin/en/          (admin-specific)
│   ├── dashboard/index.json
│   ├── customers/list.json
│   ├── customers/detail.json
│   └── ...
└── portal/en/         (portal-specific)
    └── ...
```

## Migration Steps

### 1. Identify Translation Categories

Review your current translations and categorize them:

- **Shared** - Used across multiple apps (auth, navigation, common actions, errors)
- **App-Specific** - Only used in one app (page-specific content)

### 2. Split Shared Translations

From `apps/admin/messages/en.json` and `apps/portal/messages/en.json`:

**Extract to `packages/i18n/messages/shared/en/`:**

```json
// common.json
{
  "actions": { "save": "...", "cancel": "..." },
  "status": { "loading": "...", "error": "..." },
  "labels": { "name": "...", "email": "..." }
}

// navigation.json
{
  "dashboard": "Dashboard",
  "customers": "Customers",
  ...
}

// auth.json
{
  "sign_in": "Sign In",
  "email": "Email",
  ...
}

// errors.json
{
  "generic_error": "An error occurred",
  ...
}
```

### 3. Split App-Specific Translations

**For Admin App:**

```json
// packages/i18n/messages/admin/en/dashboard/index.json
{
  "welcome": "Welcome to Tirdad Admin",
  "metrics": {
    "total_revenue": "Total Revenue",
    ...
  }
}

// packages/i18n/messages/admin/en/customers/list.json
{
  "title": "Customers",
  "add_customer": "Add Customer",
  "table": { ... }
}

// packages/i18n/messages/admin/en/customers/detail.json
{
  "title": "Customer Details",
  "overview": "Overview",
  ...
}
```

**For Portal App:**

```json
// packages/i18n/messages/portal/en/dashboard/index.json
{
  "welcome": "Welcome to Tirdad Portal",
  ...
}
```

### 4. Create Matching Arabic Files

For every English file, create a matching Arabic file with the same structure:

```
shared/en/common.json → shared/ar/common.json
admin/en/customers/list.json → admin/ar/customers/list.json
```

### 5. Run Build Script

```bash
cd packages/i18n
pnpm build
```

This merges all nested files into flat bundles in `dist/`:

- `dist/shared/en.json`
- `dist/admin/en.json`
- `dist/portal/en.json`

### 6. Validate Translations

```bash
cd packages/i18n
pnpm validate
```

Ensures:

- All English files have matching Arabic files
- All keys exist in both languages
- No extra or missing translations

### 7. Update Component Usage

**Before:**

```tsx
const t = useTranslations();
t("navigation.dashboard"); // Top-level namespace
```

**After:**

```tsx
const t = useTranslations("navigation");
t("dashboard"); // Scoped to namespace

// Or for page-specific:
const t = useTranslations("customers.list");
t("title");
```

### 8. Remove Old Files (After Testing)

Once migration is complete and tested:

```bash
# Remove old flat files
rm apps/admin/messages/en.json
rm apps/admin/messages/ar.json
rm apps/portal/messages/en.json
rm apps/portal/messages/ar.json
```

## File Naming Conventions

### Folder Structure Maps to Namespaces

```
messages/admin/en/customers/list.json → t('customers.list.key')
messages/admin/en/dashboard/index.json → t('dashboard.key')
```

### Special Files

- **`index.json`** - Represents the parent folder namespace
  - `dashboard/index.json` → `t('dashboard.key')`
  - Root `index.json` merges at top level

### Naming Guidelines

1. **Folders** = Feature or page section (`customers`, `invoices`, `settings`)
2. **Files** = Sub-page or view (`list.json`, `detail.json`, `create.json`)
3. **Use kebab-case** for file/folder names
4. **Keep hierarchy flat** (max 2-3 levels deep)

## Example Migration

### Before (apps/admin/messages/en.json)

```json
{
  "navigation": {
    "dashboard": "Dashboard",
    "customers": "Customers"
  },
  "dashboard": {
    "welcome": "Welcome",
    "total_revenue": "Total Revenue"
  },
  "customers": {
    "title": "Customers",
    "add_customer": "Add Customer"
  },
  "common": {
    "save": "Save",
    "cancel": "Cancel"
  }
}
```

### After

**`packages/i18n/messages/shared/en/navigation.json`**

```json
{
  "dashboard": "Dashboard",
  "customers": "Customers"
}
```

**`packages/i18n/messages/shared/en/common.json`**

```json
{
  "actions": {
    "save": "Save",
    "cancel": "Cancel"
  }
}
```

**`packages/i18n/messages/admin/en/dashboard/index.json`**

```json
{
  "welcome": "Welcome",
  "total_revenue": "Total Revenue"
}
```

**`packages/i18n/messages/admin/en/customers/list.json`**

```json
{
  "title": "Customers",
  "add_customer": "Add Customer"
}
```

### Component Usage Changes

**Before:**

```tsx
const t = useTranslations()
<h1>{t('dashboard.welcome')}</h1>
<Button>{t('common.save')}</Button>
```

**After:**

```tsx
const tDashboard = useTranslations('dashboard')
const tCommon = useTranslations('common')
<h1>{tDashboard('welcome')}</h1>
<Button>{tCommon('actions.save')}</Button>
```

## Tips

1. **Start Small** - Migrate one section at a time
2. **Run Validation Often** - Catch missing translations early
3. **Use Watch Mode** - `pnpm build:watch` during development
4. **Test Thoroughly** - Check both English and Arabic versions
5. **Keep Related Keys Together** - Group by feature, not by type

## Common Issues

### Missing Translation Error

```
Error: Missing message: "customers.list.title"
```

**Solution:** Ensure the file exists and is built:

```bash
cd packages/i18n
pnpm build
```

### Arabic File Missing

```
⚠️ Missing Arabic translation file: customers/list.json
```

**Solution:** Create matching Arabic file with same structure.

### Wrong Namespace

```tsx
// ❌ Wrong
const t = useTranslations();
t("customers.list.title");

// ✅ Correct
const t = useTranslations("customers.list");
t("title");
```

## Scripts Reference

```bash
# Build all translations
pnpm build

# Build and watch for changes
pnpm build:watch

# Validate translation sync
pnpm validate

# Type check
pnpm type-check
```

## Need Help?

If you encounter issues during migration:

1. Check build output for errors
2. Run validation to identify missing translations
3. Verify file structure matches examples
4. Ensure Arabic files mirror English structure
