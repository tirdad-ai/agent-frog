# Packages Overview

**Last Updated:** 2025-11-07  
**Monorepo:** Turborepo with pnpm workspaces

---

## Table of Contents

1. [Package Structure](#package-structure)
2. [@repo/auth](#repoauth)
3. [@repo/database](#repodatabase)
4. [@repo/services](#reposervices)
5. [@repo/ui](#repoui)
6. [@repo/i18n](#repoi18n)
7. [@repo/types](#repotypes)
8. [@repo/tests](#repotests)
9. [@repo/eslint-config](#repoeslint-config)
10. [@repo/typescript-config](#repotypescript-config)
11. [Usage Examples](#usage-examples)

---

## Package Structure

```
packages/
├── auth/                   # NextAuth.js v5 authentication
├── database/               # Prisma schema + client
├── services/               # Backend business logic (service layer)
├── ui/                     # shadcn/ui components + custom compositions
├── i18n/                   # next-intl configuration + translations
├── types/                  # Shared TypeScript types
├── tests/                  # Shared test utilities + setup
├── eslint-config/          # Shared ESLint configurations
└── typescript-config/      # Shared TypeScript configurations
```

---

## @repo/auth

**Purpose:** Centralized authentication using NextAuth.js v5

**Location:** `packages/auth/`

### Structure

```
auth/
├── src/
│   ├── auth.ts         # NextAuth configuration
│   └── auth.config.ts  # Auth options
├── package.json
└── tsconfig.json
```

### Features

- NextAuth.js v5 setup
- Credentials provider configured
- Session management
- JWT strategy
- Type-safe auth exports

### Usage

**In API routes:**

```typescript
import { auth } from '@repo/auth';

export async function GET(request: Request) {
  const session = await auth();
  
  if (!session?.user) {
    return new Response('Unauthorized', { status: 401 });
  }
  
  // Protected logic here
}
```

**In Server Components:**

```typescript
import { auth } from '@repo/auth';

export default async function DashboardPage() {
  const session = await auth();
  
  if (!session) {
    redirect('/login');
  }
  
  return <div>Welcome, {session.user.name}</div>;
}
```

### Configuration

Environment variables required:
```env
AUTH_SECRET=your-secret-key
AUTH_URL=http://localhost:3000
```

---

## @repo/database

**Purpose:** Prisma ORM schema and client for PostgreSQL

**Location:** `packages/database/`

### Structure

```
database/
├── prisma/
│   └── schema.prisma   # Database schema
├── src/
│   └── client.ts       # Prisma client instance
├── package.json
└── tsconfig.json
```

### Current Schema

**Models:**
- `User` - User accounts (email, name, image)
- `Account` - OAuth account connections
- `Session` - User sessions
- `VerificationToken` - Email verification tokens

**Example Model:**
```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  image         String?
  role          Role      @default(USER)
  accounts      Account[]
  sessions      Session[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

enum Role {
  ADMIN
  USER
}
```

### Usage

**Import Prisma client:**

```typescript
import { prisma } from '@repo/database';

// Query users
const users = await prisma.user.findMany();

// Create user
const user = await prisma.user.create({
  data: {
    email: 'user@example.com',
    name: 'John Doe',
  },
});
```

### Commands

```bash
# Generate Prisma client
pnpm db:generate

# Create migration
pnpm db:migrate:dev

# Push schema (development)
pnpm db:push

# Open Prisma Studio
pnpm db:studio
```

---

## @repo/services

**Purpose:** Backend business logic using service layer pattern

**Location:** `packages/services/`

### Structure

```
services/
├── src/
│   ├── {domain}/               # Example: user/
│   │   ├── {domain}.service.ts      # Business logic
│   │   ├── {domain}.repository.ts   # Database operations
│   │   ├── {domain}.types.ts        # TypeScript types
│   │   └── index.ts                 # Exports
│   ├── infrastructure/
│   │   └── logger/                  # Shared infrastructure
│   └── index.ts                     # Package exports
└── package.json
```

### Architecture Pattern

**Service Layer (Business Logic):**
```typescript
// packages/services/src/user/user.service.ts
import { logger } from '../infrastructure/logger';
import { UserRepository } from './user.repository';
import type { CreateUserInput } from './user.types';

export class UserService {
  private repository: UserRepository;

  constructor() {
    this.repository = new UserRepository();
  }

  async createUser(data: CreateUserInput) {
    // 1. Validate
    const existing = await this.repository.findByEmail(data.email);
    if (existing) {
      throw new Error('User already exists');
    }

    // 2. Business logic
    const user = await this.repository.create(data);
    
    // 3. Log
    logger.info('User created', { userId: user.id });
    
    return user;
  }
}
```

**Repository Pattern (Database Operations):**
```typescript
// packages/services/src/user/user.repository.ts
import { prisma } from '@repo/database';

export class UserRepository {
  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  async create(data: CreateUserInput) {
    return prisma.user.create({ data });
  }
}
```

### Usage in API Routes

**Thin API routes - orchestration only:**

```typescript
// apps/web/app/api/users/route.ts
import { UserService } from '@repo/services';

const userService = new UserService();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const user = await userService.createUser(body);
    return Response.json(user, { status: 201 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }
}
```

### Key Principles

- ✅ All business logic in services
- ✅ All database queries in repositories
- ✅ API routes are thin (orchestration only)
- ✅ Services are testable (mock repositories)
- ❌ No business logic in API routes
- ❌ No direct Prisma calls in services

---

## @repo/ui

**Purpose:** Shared UI components using shadcn/ui + Tailwind CSS

**Location:** `packages/ui/`

### Structure

```
ui/
├── src/
│   ├── components/
│   │   ├── base/          # shadcn/ui components (DO NOT MODIFY)
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── card.tsx
│   │   │   └── ...
│   │   └── custom/        # Custom compositions
│   │       └── index.ts
│   ├── lib/
│   │   └── utils.ts       # cn() utility
│   └── index.ts
└── package.json
```

### Components

**Base Components (shadcn/ui):**
- Button, Input, Label, Select, Checkbox, Radio
- Dialog, Sheet, Popover, Dropdown Menu
- Card, Badge, Avatar, Separator
- Table, Data Table
- Form, Toast, Alert
- And more...

**Custom Compositions:**
Build on top of base components for app-specific needs.

### Usage

**Import base components:**

```typescript
import { Button } from '@repo/ui/base/button';
import { Input } from '@repo/ui/base/input';
import { Card } from '@repo/ui/base/card';

export function LoginForm() {
  return (
    <Card>
      <Input placeholder="Email" />
      <Button>Sign In</Button>
    </Card>
  );
}
```

**Styling with Tailwind:**

```typescript
import { Button } from '@repo/ui/base/button';
import { cn } from '@repo/ui/lib/utils';

export function CustomButton({ className, ...props }) {
  return (
    <Button 
      className={cn('bg-blue-500 hover:bg-blue-600', className)}
      {...props}
    />
  );
}
```

### Adding New shadcn Components

```bash
cd packages/ui
npx shadcn-ui@latest add [component-name]
```

### Key Principles

- ✅ Use shadcn/ui base components only
- ✅ Build custom compositions on top of base
- ✅ Use Tailwind CSS for all styling
- ❌ No other UI libraries (MUI, Chakra, etc.)
- ❌ No CSS-in-JS or CSS modules
- ❌ Don't modify base components directly

---

## @repo/i18n

**Purpose:** Internationalization using next-intl

**Location:** `packages/i18n/`

### Structure

```
i18n/
├── messages/
│   └── en/
│       └── common.json     # Example translations
├── src/
│   ├── config.ts           # i18n configuration
│   ├── routing.ts          # Routing configuration
│   ├── types.ts            # TypeScript types
│   └── constants.ts        # Supported locales
└── package.json
```

### Configuration

**Supported locales:** English (en) by default

**Example translations:**

```json
{
  "welcome": "Welcome",
  "hello": "Hello, {name}",
  "navigation": {
    "home": "Home",
    "about": "About"
  },
  "actions": {
    "save": "Save",
    "cancel": "Cancel"
  },
  "messages": {
    "success": "Operation completed successfully",
    "error": "An error occurred"
  }
}
```

### Usage

**In Server Components:**

```typescript
import { getTranslations } from 'next-intl/server';

export default async function HomePage() {
  const t = await getTranslations('common');
  
  return <h1>{t('welcome')}</h1>;
}
```

**In Client Components:**

```typescript
'use client';
import { useTranslations } from 'next-intl';

export function WelcomeMessage({ name }) {
  const t = useTranslations('common');
  
  return <p>{t('hello', { name })}</p>;
}
```

### Adding New Languages

1. Create message file: `packages/i18n/messages/[locale]/common.json`
2. Add locale to `src/constants.ts`
3. Update routing configuration

### Key Principles

- ✅ All user-facing text uses i18n
- ✅ No hardcoded strings
- ✅ Support for interpolation ({name})
- ✅ Nested translation keys
- ❌ No inline text strings

---

## @repo/types

**Purpose:** Shared TypeScript types across packages

**Location:** `packages/types/`

### Structure

```
types/
├── src/
│   └── index.ts        # Shared type definitions
└── package.json
```

### Example Types

```typescript
// packages/types/src/index.ts

export type Role = 'ADMIN' | 'USER';

export interface User {
  id: string;
  email: string;
  name: string | null;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

### Usage

```typescript
import type { User, ApiResponse } from '@repo/types';

export async function getUser(id: string): Promise<ApiResponse<User>> {
  const user = await prisma.user.findUnique({ where: { id } });
  return { data: user };
}
```

### Key Principles

- ✅ Share types between frontend and backend
- ✅ Keep types DRY (Don't Repeat Yourself)
- ✅ Use for API contracts
- ❌ No implementation logic in this package

---

## @repo/tests

**Purpose:** Shared test utilities and setup

**Location:** `packages/tests/`

### Structure

```
tests/
├── fixtures/           # Test data
├── helpers/
│   └── db.ts          # Database test helpers
├── integration/
│   └── user.service.test.ts    # Example integration test
├── setup.ts           # Vitest setup
├── vitest.config.ts   # Vitest configuration
└── package.json
```

### Database Test Helpers

```typescript
// packages/tests/helpers/db.ts
import { prisma } from '@repo/database';

export async function cleanupDatabase() {
  await prisma.user.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
}

export async function createTestUser(data: Partial<User> = {}) {
  return prisma.user.create({
    data: {
      email: data.email || 'test@example.com',
      name: data.name || 'Test User',
      ...data,
    },
  });
}
```

### Example Integration Test

```typescript
// packages/tests/integration/user.service.test.ts
import { describe, it, expect, afterEach } from 'vitest';
import { UserService } from '@repo/services';
import { cleanupDatabase } from '../helpers/db';

describe('UserService', () => {
  afterEach(async () => {
    await cleanupDatabase();
  });

  it('should create a new user', async () => {
    const userService = new UserService();
    const userData = {
      name: 'John Doe',
      email: 'john@example.com',
    };

    const user = await userService.createUser(userData);

    expect(user).toBeDefined();
    expect(user.email).toBe(userData.email);
  });
});
```

### Usage

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

---

## @repo/eslint-config

**Purpose:** Shared ESLint configurations

**Location:** `packages/eslint-config/`

### Configurations

- `base.js` - Base ESLint rules
- `next.js` - Next.js specific rules
- `react.js` - React specific rules
- `node.js` - Node.js specific rules

### Usage

```json
{
  "extends": ["@repo/eslint-config/next"]
}
```

---

## @repo/typescript-config

**Purpose:** Shared TypeScript configurations

**Location:** `packages/typescript-config/`

### Configurations

- `base.json` - Base TypeScript config
- `nextjs.json` - Next.js specific config
- `react.json` - React specific config
- `node.json` - Node.js specific config

### Usage

```json
{
  "extends": "@repo/typescript-config/nextjs.json"
}
```

---

## Usage Examples

### Full Stack Feature Example

**1. Database Schema**

```prisma
// packages/database/prisma/schema.prisma
model Post {
  id        String   @id @default(cuid())
  title     String
  content   String
  authorId  String
  author    User     @relation(fields: [authorId], references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

**2. Service Layer**

```typescript
// packages/services/src/post/post.service.ts
export class PostService {
  async createPost(data: CreatePostInput) {
    return this.repository.create(data);
  }

  async getPosts() {
    return this.repository.findAll();
  }
}
```

**3. API Route**

```typescript
// apps/web/app/api/posts/route.ts
import { PostService } from '@repo/services';
import { auth } from '@repo/auth';

export async function POST(request: Request) {
  const session = await auth();
  if (!session) return new Response('Unauthorized', { status: 401 });

  const body = await request.json();
  const postService = new PostService();
  const post = await postService.createPost({
    ...body,
    authorId: session.user.id,
  });

  return Response.json(post);
}
```

**4. Frontend Component**

```typescript
// apps/web/components/posts/create-post-form.tsx
'use client';
import { Button, Input } from '@repo/ui';
import { useTranslations } from 'next-intl';
import { Formik, Form, Field } from 'formik';

export function CreatePostForm() {
  const t = useTranslations('posts');

  return (
    <Formik
      initialValues={{ title: '', content: '' }}
      onSubmit={async (values) => {
        await fetch('/api/posts', {
          method: 'POST',
          body: JSON.stringify(values),
        });
      }}
    >
      <Form>
        <Field as={Input} name="title" placeholder={t('title')} />
        <Field as={Input} name="content" placeholder={t('content')} />
        <Button type="submit">{t('create')}</Button>
      </Form>
    </Formik>
  );
}
```

---

## Package Dependencies

### Dependency Graph

```
apps/web
  ├── @repo/auth
  ├── @repo/ui
  ├── @repo/services
  │   ├── @repo/database
  │   └── @repo/types
  ├── @repo/i18n
  └── @repo/types

@repo/services
  ├── @repo/database
  └── @repo/types

@repo/tests
  ├── @repo/database
  ├── @repo/services
  └── @repo/types
```

---

## Best Practices

### Package Guidelines

1. **Keep packages focused** - Each package has a single responsibility
2. **Minimize dependencies** - Only depend on what you need
3. **Export public APIs** - Use index.ts to control exports
4. **Document changes** - Update this file when adding features
5. **Test packages** - Write tests for shared logic

### Import Guidelines

```typescript
// ✅ Good: Import from package root
import { Button } from '@repo/ui';
import { UserService } from '@repo/services';

// ❌ Bad: Deep imports
import { Button } from '@repo/ui/src/components/base/button';
import { UserService } from '@repo/services/src/user/user.service';
```

### Adding New Packages

1. Create package directory: `packages/[name]/`
2. Add `package.json` with `"name": "@repo/[name]"`
3. Add to workspace in root `package.json`
4. Configure TypeScript and ESLint
5. Document in this file

---

## Troubleshooting

### Common Issues

**Issue:** Types not recognized across packages  
**Solution:** Run `pnpm build` to compile TypeScript declarations

**Issue:** Prisma client outdated  
**Solution:** Run `pnpm db:generate`

**Issue:** Package not found  
**Solution:** Run `pnpm install` at root

**Issue:** Circular dependencies  
**Solution:** Review dependency graph, refactor if needed

---

## Version History

- **2025-11-07** - Initial documentation with 9 packages
- Package structure cleaned to generic examples
- All packages documented with usage examples

---

**For agent-specific guidance, see `.agent-prompts/` directory**
