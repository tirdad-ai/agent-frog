# Shared Packages Architecture ✅

## 📦 Complete Package Structure

```
packages/
├── eslint-config/          # Shared ESLint configuration
│   ├── base.js             # Base config for all projects
│   ├── next.js             # Next.js specific
│   ├── react.js            # React specific
│   ├── node.js             # Node.js/backend specific
│   └── package.json
│
├── typescript-config/      # Shared TypeScript configuration
│   ├── base.json           # Base tsconfig
│   ├── nextjs.json         # Next.js tsconfig
│   ├── react.json          # React library tsconfig
│   ├── node.json           # Node.js tsconfig
│   └── package.json
│
├── ui/                     # UI component library
│   ├── src/
│   │   ├── components/
│   │   │   ├── base/       # shadcn/ui components
│   │   │   └── custom/     # Custom compositions
│   │   └── lib/
│   │       └── utils.ts    # cn() helper
│   ├── tailwind.config.ts  # Shared Tailwind config
│   ├── postcss.config.js   # Shared PostCSS config
│   ├── components.json     # shadcn config
│   └── package.json
│
├── ui-config/              # UI configuration (Tailwind presets)
│   ├── tailwind.preset.ts  # Shared Tailwind preset
│   ├── colors.ts           # Design tokens
│   ├── animations.ts       # Animation definitions
│   └── package.json
│
├── auth/                   # Authentication package
│   ├── src/
│   │   ├── providers/
│   │   │   ├── next-auth.ts    # NextAuth configuration
│   │   │   ├── clerk.ts         # Clerk configuration
│   │   │   └── index.ts
│   │   ├── middleware/
│   │   │   ├── auth-middleware.ts
│   │   │   └── index.ts
│   │   ├── hooks/
│   │   │   ├── use-auth.ts
│   │   │   ├── use-session.ts
│   │   │   └── index.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   └── index.ts
│   └── package.json
│
├── services/               # Backend business logic
│   └── src/
│       ├── {domain}/
│       ├── infrastructure/
│       └── errors/
│
├── database/               # Database client & schema
│   ├── prisma/
│   │   └── schema.prisma
│   ├── src/
│   │   └── client.ts
│   └── package.json
│
└── i18n/                   # Internationalization
    ├── src/
    │   └── locales/
    └── package.json

apps/
├── web/                    # Next.js app
│   ├── src/
│   ├── tailwind.config.ts  # Extends ui-config preset
│   ├── tsconfig.json       # Extends typescript-config
│   └── .eslintrc.js        # Extends eslint-config
│
└── api/                    # Express/Hono API
    ├── src/
    ├── tsconfig.json       # Extends typescript-config
    └── .eslintrc.js        # Extends eslint-config
```

---

## 1️⃣ ESLint Config Package

### packages/eslint-config/

```
packages/eslint-config/
├── base.js          # Base rules for all
├── next.js          # Next.js + React
├── react.js         # React library
├── node.js          # Node.js/Express
└── package.json
```

### base.js

```javascript
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'import'],
  rules: {
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-explicit-any': 'warn',
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
        'newlines-between': 'always',
        alphabetize: { order: 'asc' },
      },
    ],
  },
};
```

### next.js

```javascript
module.exports = {
  extends: [
    './base.js',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'next/core-web-vitals',
  ],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
  },
};
```

### package.json

```json
{
  "name": "@repo/eslint-config",
  "version": "0.0.0",
  "private": true,
  "files": ["base.js", "next.js", "react.js", "node.js"],
  "devDependencies": {
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "eslint-config-next": "^14.0.0",
    "eslint-config-prettier": "^9.0.0",
    "eslint-plugin-import": "^2.29.0",
    "eslint-plugin-react": "^7.33.0",
    "eslint-plugin-react-hooks": "^4.6.0"
  }
}
```

### Usage in apps

```javascript
// apps/web/.eslintrc.js
module.exports = {
  extends: ['@repo/eslint-config/next'],
};

// apps/api/.eslintrc.js
module.exports = {
  extends: ['@repo/eslint-config/node'],
};

// packages/ui/.eslintrc.js
module.exports = {
  extends: ['@repo/eslint-config/react'],
};
```

---

## 2️⃣ TypeScript Config Package

### packages/typescript-config/

```
packages/typescript-config/
├── base.json        # Base config
├── nextjs.json      # Next.js extends base
├── react.json       # React library extends base
├── node.json        # Node.js extends base
└── package.json
```

### base.json

```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "compilerOptions": {
    "strict": true,
    "strictNullChecks": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "moduleDetection": "force"
  }
}
```

### nextjs.json

```json
{
  "extends": "./base.json",
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "jsx": "preserve",
    "module": "esnext",
    "moduleResolution": "bundler",
    "noEmit": true,
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### react.json

```json
{
  "extends": "./base.json",
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "dom", "dom.iterable"],
    "jsx": "react-jsx",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "declaration": true,
    "declarationMap": true,
    "outDir": "./dist"
  }
}
```

### node.json

```json
{
  "extends": "./base.json",
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022"],
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "declaration": true,
    "outDir": "./dist"
  }
}
```

### package.json

```json
{
  "name": "@repo/typescript-config",
  "version": "0.0.0",
  "private": true,
  "files": ["base.json", "nextjs.json", "react.json", "node.json"]
}
```

### Usage in apps

```json
// apps/web/tsconfig.json
{
  "extends": "@repo/typescript-config/nextjs.json",
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}

// apps/api/tsconfig.json
{
  "extends": "@repo/typescript-config/node.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  }
}

// packages/ui/tsconfig.json
{
  "extends": "@repo/typescript-config/react.json"
}
```

---

## 3️⃣ UI Config Package

### packages/ui-config/

```
packages/ui-config/
├── src/
│   ├── tailwind.preset.ts   # Tailwind preset
│   ├── colors.ts            # Design tokens
│   ├── animations.ts        # Animations
│   └── index.ts
└── package.json
```

### tailwind.preset.ts

```typescript
import type { Config } from 'tailwindcss';
import { colors } from './colors';
import { animations } from './animations';

export const tailwindPreset: Partial<Config> = {
  darkMode: ['class'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors,
      ...animations,
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
```

### colors.ts

```typescript
export const colors = {
  border: 'hsl(var(--border))',
  input: 'hsl(var(--input))',
  ring: 'hsl(var(--ring))',
  background: 'hsl(var(--background))',
  foreground: 'hsl(var(--foreground))',
  primary: {
    DEFAULT: 'hsl(var(--primary))',
    foreground: 'hsl(var(--primary-foreground))',
  },
  secondary: {
    DEFAULT: 'hsl(var(--secondary))',
    foreground: 'hsl(var(--secondary-foreground))',
  },
  destructive: {
    DEFAULT: 'hsl(var(--destructive))',
    foreground: 'hsl(var(--destructive-foreground))',
  },
  muted: {
    DEFAULT: 'hsl(var(--muted))',
    foreground: 'hsl(var(--muted-foreground))',
  },
  accent: {
    DEFAULT: 'hsl(var(--accent))',
    foreground: 'hsl(var(--accent-foreground))',
  },
  popover: {
    DEFAULT: 'hsl(var(--popover))',
    foreground: 'hsl(var(--popover-foreground))',
  },
  card: {
    DEFAULT: 'hsl(var(--card))',
    foreground: 'hsl(var(--card-foreground))',
  },
};
```

### package.json

```json
{
  "name": "@repo/ui-config",
  "version": "0.0.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts",
    "./tailwind": "./src/tailwind.preset.ts",
    "./colors": "./src/colors.ts"
  },
  "peerDependencies": {
    "tailwindcss": "^3.4.0"
  },
  "devDependencies": {
    "tailwindcss": "^3.4.0",
    "tailwindcss-animate": "^1.0.7"
  }
}
```

### Usage in apps

```typescript
// apps/web/tailwind.config.ts
import type { Config } from 'tailwindcss';
import { tailwindPreset } from '@repo/ui-config/tailwind';

const config: Config = {
  presets: [tailwindPreset],
  content: [
    './src/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      // App-specific overrides
    },
  },
};

export default config;
```

---

## 4️⃣ Auth Package

### packages/auth/

```
packages/auth/
├── src/
│   ├── providers/
│   │   ├── next-auth.ts
│   │   ├── clerk.ts
│   │   └── index.ts
│   ├── middleware/
│   │   ├── auth-middleware.ts
│   │   └── index.ts
│   ├── hooks/
│   │   ├── use-auth.ts
│   │   ├── use-session.ts
│   │   └── index.ts
│   ├── types/
│   │   └── index.ts
│   └── index.ts
└── package.json
```

### providers/next-auth.ts

```typescript
import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@repo/database';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
    error: '/error',
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Your authentication logic here
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          return null;
        }

        // Verify password (use bcrypt)
        // const isValid = await verifyPassword(credentials.password, user.password);
        // if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
};

export const handler = NextAuth(authOptions);
```

### hooks/use-auth.ts

```typescript
'use client';

import { useSession } from 'next-auth/react';

export function useAuth() {
  const { data: session, status } = useSession();

  return {
    user: session?.user,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading',
    isUnauthenticated: status === 'unauthenticated',
  };
}
```

### middleware/auth-middleware.ts

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function authMiddleware(request: NextRequest) {
  const token = await getToken({ req: request });

  const isAuthPage = request.nextUrl.pathname.startsWith('/login') ||
    request.nextUrl.pathname.startsWith('/signup');
  const isProtectedPage = request.nextUrl.pathname.startsWith('/dashboard');

  if (isProtectedPage && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}
```

### package.json

```json
{
  "name": "@repo/auth",
  "version": "0.0.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "dependencies": {
    "next-auth": "^4.24.0",
    "@auth/prisma-adapter": "^1.0.0",
    "bcryptjs": "^2.4.3"
  },
  "devDependencies": {
    "@types/bcryptjs": "^2.4.6"
  },
  "peerDependencies": {
    "@repo/database": "workspace:*",
    "react": "^18.0.0"
  }
}
```

### Usage in apps

```typescript
// apps/web/src/app/api/auth/[...nextauth]/route.ts
import { handler } from '@repo/auth/providers/next-auth';

export { handler as GET, handler as POST };

// apps/web/src/app/providers.tsx
'use client';

import { SessionProvider } from 'next-auth/react';

export function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}

// apps/web/src/app/[locale]/dashboard/page.tsx
import { useAuth } from '@repo/auth/hooks';

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <div>Not authenticated</div>;
  }

  return <div>Welcome, {user?.name}</div>;
}

// apps/web/src/middleware.ts
import { authMiddleware } from '@repo/auth/middleware';

export default authMiddleware;
```

---

## 📋 Complete Package Dependencies

### Root package.json

```json
{
  "name": "turbo-boilerplate",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "test": "turbo run test",
    "type-check": "turbo run type-check"
  },
  "devDependencies": {
    "turbo": "latest",
    "prettier": "^3.0.0"
  }
}
```

---

## ✅ Benefits

### For All Apps
- **Consistent linting** - Same rules everywhere
- **Consistent TypeScript** - Same strict mode, paths
- **Consistent styling** - Same Tailwind theme, colors, animations
- **Consistent auth** - Same NextAuth/Clerk setup

### For Developers
- **Single source of truth** - Update config once, applies everywhere
- **Easy setup** - New apps just extend configs
- **Type-safe** - Shared TypeScript configs ensure compatibility

### For Maintenance
- **Update once** - Change ESLint rule in one place
- **No drift** - All apps stay in sync
- **Easy upgrades** - Upgrade dependencies in packages only

---

**See WARP.md for complete agent orchestration with shared packages**
