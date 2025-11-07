# Quick Start Guide

## 🚀 Get Started in 3 Minutes

### 1. Build Translations

```bash
cd packages/i18n
pnpm build
```

### 2. Use in Your Component

```tsx
import { useTranslations } from "next-intl";

function MyPage() {
  // Shared translations
  const tCommon = useTranslations("common");
  const tNav = useTranslations("navigation");

  // Page-specific translations
  const t = useTranslations("customers.list");

  return (
    <div>
      <h1>{t("title")}</h1>
      <Button>{tCommon("actions.save")}</Button>
    </div>
  );
}
```

### 3. Add New Translations

**English:** `packages/i18n/messages/admin/en/my-page/index.json`

```json
{
  "title": "My Page",
  "description": "This is my page"
}
```

**Arabic:** `packages/i18n/messages/admin/ar/my-page/index.json`

```json
{
  "title": "صفحتي",
  "description": "هذه صفحتي"
}
```

**Build & Use:**

```bash
cd packages/i18n && pnpm build
```

```tsx
const t = useTranslations('my-page')
<h1>{t('title')}</h1>
```

## 📚 Full Documentation

- **[README.md](./README.md)** - Complete API reference
- **[IMPLEMENTATION.md](./IMPLEMENTATION.md)** - What was built & how to use it
- **[MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)** - Migrate existing translations

## 🎯 Key Concepts

| Concept                  | Example                                         |
| ------------------------ | ----------------------------------------------- |
| **Folder = Namespace**   | `admin/en/customers/` → `t('customers.*')`      |
| **File = Sub-namespace** | `customers/list.json` → `t('customers.list.*')` |
| **index.json = Parent**  | `dashboard/index.json` → `t('dashboard.*')`     |
| **Shared = Cross-app**   | `shared/en/common.json` → Used by all apps      |

## ⚡ Commands

```bash
# Build once
pnpm build

# Watch mode (rebuilds on change)
pnpm build:watch

# Validate en/ar sync
pnpm validate
```

## 🎨 Translation Structure

```
packages/i18n/messages/
├── shared/en/          → t('navigation.*'), t('common.*'), t('auth.*')
├── admin/en/           → t('dashboard.*'), t('customers.*')
└── portal/en/          → t('dashboard.*'), t('subscriptions.*')
```

## ✅ That's It!

You're ready to go. Check the full docs for advanced usage.
