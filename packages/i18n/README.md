# @repo/i18n

Centralized internationalization (i18n) configuration package for the tirdad-turbo monorepo.

## Overview

This package provides shared i18n configuration, types, utilities, and routing for both the `admin` and `portal` apps, ensuring consistency across the platform.

## Features

- 🌍 Centralized locale configuration (English & Arabic)
- 🧭 Shared routing utilities with next-intl
- 📝 TypeScript types for locale management
- 🔧 Utility functions for locale validation
- 🎯 RTL support for Arabic

## Installation

This package is internal to the monorepo. Add it to your app's dependencies:

```json
{
  "dependencies": {
    "@repo/i18n": "workspace:*"
  }
}
```

## Usage

### 1. Configure i18n in your app

Create or update `src/i18n.ts` in your app:

```ts
// apps/admin/src/i18n.ts or apps/portal/src/i18n.ts
import { createI18nConfig } from "@repo/i18n/config";

// Export the configured i18n
export default createI18nConfig("../messages");

// Re-export types and constants for convenience
export { LOCALES, DEFAULT_LOCALE, type Locale } from "@repo/i18n/config";
```

### 2. Configure routing

Create or update `src/i18n/routing.ts` in your app:

```ts
// apps/admin/src/i18n/routing.ts
import { createI18nRouting } from "@repo/i18n/routing";

// Create routing with default config
export const { routing, Link, redirect, usePathname, useRouter, getPathname } =
  createI18nRouting();
```

Or with custom configuration:

```ts
export const { routing, Link, redirect, usePathname, useRouter, getPathname } =
  createI18nRouting({
    localePrefix: "as-needed", // Override default 'always'
  });
```

### 3. Update Next.js config

```js
// next.config.js
const withNextIntl = require("next-intl/plugin")("./src/i18n.ts");

module.exports = withNextIntl({
  // your config
});
```

### 4. Use in components

```tsx
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

export default function MyComponent() {
  const t = useTranslations("MyNamespace");

  return (
    <div>
      <h1>{t("title")}</h1>
      <Link href="/about">{t("aboutLink")}</Link>
    </div>
  );
}
```

## API Reference

### Config

#### `createI18nConfig(messagesPath?: string)`

Creates a next-intl request config function.

**Parameters:**

- `messagesPath`: Path to messages directory (default: `'../messages'`)

**Returns:** Configured `getRequestConfig` function

#### `isValidLocale(locale: string)`

Validates if a locale string is supported.

#### `getValidLocale(locale: string | undefined | null)`

Returns a valid locale or the default locale.

### Routing

#### `createI18nRouting(config?: Partial<I18nRoutingConfig>)`

Creates routing configuration and navigation utilities.

**Returns:**

- `routing`: next-intl routing configuration
- `Link`: Localized Link component
- `redirect`: Localized redirect function
- `usePathname`: Hook to get current pathname
- `useRouter`: Hook to get router with i18n support
- `getPathname`: Function to get pathname for a given route

### Constants

- `LOCALES`: `['en', 'ar']` - Supported locale codes
- `DEFAULT_LOCALE`: `'en'` - Default locale
- `LOCALE_NAMES`: Display names for locales (native & English)
- `LOCALE_DIRECTIONS`: Text direction for each locale (`'ltr'` | `'rtl'`)

### Types

- `Locale`: Union type of supported locales
- `I18nConfig`: Configuration options interface
- `I18nRoutingConfig`: Routing configuration interface

## Directory Structure

```
packages/i18n/
├── src/
│   ├── config.ts       # Main configuration and factory functions
│   ├── routing.ts      # Routing utilities
│   ├── types.ts        # TypeScript types
│   ├── constants.ts    # Locale constants
│   └── index.ts        # Package exports
├── package.json
├── tsconfig.json
└── README.md
```

## Supported Locales

| Code | Language         | Direction |
| ---- | ---------------- | --------- |
| `en` | English          | LTR       |
| `ar` | Arabic (العربية) | RTL       |

## Migration from Local Config

If migrating from local i18n configs:

1. Install `@repo/i18n` dependency
2. Replace local config with `createI18nConfig()`
3. Replace local routing with `createI18nRouting()`
4. Update imports throughout the app
5. Remove old i18n config files

## Best Practices

1. **Always use the centralized config** - Don't duplicate locale lists
2. **Use TypeScript types** - Import `Locale` type for type safety
3. **Leverage utility functions** - Use `isValidLocale()` and `getValidLocale()`
4. **Consistent routing** - Use exported `Link`, `redirect`, etc. from routing
5. **Message organization** - Keep messages in `messages/` directory at app root

## Related Packages

- `next-intl`: Next.js internationalization library
- `@repo/ui`: Shared UI components with i18n support

## License

Private - Internal use only
