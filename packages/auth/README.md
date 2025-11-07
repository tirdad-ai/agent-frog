# @repo/auth

NextAuth.js v5 authentication package for Tirdad Turbo monorepo with OAuth providers, credentials authentication, and secure session management.

## 📋 Table of Contents

- [Overview](#overview)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Components](#components)
- [Hooks](#hooks)
- [API Routes](#api-routes)
- [Authentication Flow](#authentication-flow)
- [Security Features](#security-features)

## 🎯 Overview

This package provides a complete authentication solution featuring:

- **NextAuth.js v5** (Auth.js) with modern authentication patterns
- **OAuth providers**: Google, GitHub, Discord
- **Credentials authentication** with secure password hashing
- **Session management** with JWT and database sessions
- **Pre-built UI components** using shadcn/ui
- **TypeScript support** with full type safety
- **Server and client hooks** for authentication state

## 📦 Installation

This package is automatically installed as a workspace dependency. To add it to a new app:

```json
{
  "dependencies": {
    "@repo/auth": "workspace:*",
    "@repo/database": "workspace:*",
    "@repo/ui": "workspace:*"
  }
}
```

## ⚙️ Configuration

### Environment Variables

Add these to your app's `.env.local`:

```bash
# NextAuth Configuration
AUTH_SECRET="your-secret-key-here" # Generate with: openssl rand -base64 32
AUTH_URL="http://localhost:3000" # Your app URL

# OAuth Providers
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

DISCORD_CLIENT_ID="your-discord-client-id"
DISCORD_CLIENT_SECRET="your-discord-client-secret"

# Database (from @repo/database)
DATABASE_URL="postgresql://username:password@localhost:5432/tirdad_turbo_dev"
```

### App Setup

1. **Add API route** in your Next.js app:

```typescript
// app/api/auth/[...nextauth]/route.ts
import { authOptions } from "@repo/auth/config";
import { handlers } from "@repo/auth/handlers";

export const { GET, POST } = handlers;
```

2. **Wrap your app** with SessionProvider:

```typescript
// app/layout.tsx or _app.tsx
import { SessionProvider } from '@repo/auth/provider'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <body>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}
```

3. **Configure middleware** (optional, for protected routes):

```typescript
// middleware.ts
export { default } from "@repo/auth/middleware";

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/api/protected/:path*"],
};
```

## 🚀 Usage

### Client-Side Authentication

```typescript
import { useAuth } from '@repo/auth/hooks'
import { SignInButton, SignOutButton, UserProfile } from '@repo/auth/components'

export default function HomePage() {
  const { user, isLoading, isSignedIn } = useAuth()

  if (isLoading) return <div>Loading...</div>

  return (
    <div>
      {isSignedIn ? (
        <div>
          <UserProfile user={user} />
          <SignOutButton />
        </div>
      ) : (
        <SignInButton />
      )}
    </div>
  )
}
```

### Server-Side Authentication

```typescript
import { auth } from '@repo/auth/config'

// In App Router (app directory)
export default async function ProtectedPage() {
  const session = await auth()

  if (!session?.user) {
    return <div>Please sign in to access this page</div>
  }

  return <div>Hello, {session.user.name}!</div>
}

// In API routes
export async function GET() {
  const session = await auth()

  if (!session?.user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return Response.json({ user: session.user })
}
```

### Form Authentication

```typescript
import { CredentialsForm } from '@repo/auth/components'

export default function LoginPage() {
  return (
    <div>
      <h1>Sign In</h1>
      <CredentialsForm />
      {/* Or include OAuth options */}
      <div>
        <SignInButton provider="google" />
        <SignInButton provider="github" />
      </div>
    </div>
  )
}
```

## 🧩 Components

### SignInButton

OAuth and credentials sign-in button with customizable providers:

```typescript
import { SignInButton } from '@repo/auth/components'

// OAuth providers
<SignInButton provider="google" />
<SignInButton provider="github" />
<SignInButton provider="discord" />

// Custom styling
<SignInButton
  provider="google"
  className="w-full bg-blue-600 hover:bg-blue-700"
  variant="outline"
>
  Continue with Google
</SignInButton>
```

### SignOutButton

Sign-out button with confirmation and loading states:

```typescript
import { SignOutButton } from '@repo/auth/components'

<SignOutButton />

// With custom text and styling
<SignOutButton className="text-red-600 hover:text-red-800">
  Log Out
</SignOutButton>
```

### UserProfile

Display user information with avatar and details:

```typescript
import { UserProfile } from '@repo/auth/components'

<UserProfile user={user} />

// With custom layout
<UserProfile
  user={user}
  showEmail
  showJoinDate
  avatarSize="lg"
/>
```

### CredentialsForm

Complete sign-in/sign-up form for credentials authentication:

```typescript
import { CredentialsForm } from '@repo/auth/components'

<CredentialsForm
  mode="signin" // or "signup"
  onSuccess={() => router.push('/dashboard')}
  onError={(error) => toast.error(error.message)}
/>
```

### AuthGuard

Protect components or pages from unauthenticated access:

```typescript
import { AuthGuard } from '@repo/auth/components'

<AuthGuard fallback={<LoginPrompt />}>
  <ProtectedContent />
</AuthGuard>
```

## 🎣 Hooks

### useAuth

Main authentication hook with user state and utilities:

```typescript
import { useAuth } from "@repo/auth/hooks";

const {
  user, // User object or null
  isLoading, // Loading state
  isSignedIn, // Boolean for auth status
  signIn, // Sign in function
  signOut, // Sign out function
  update, // Update session function
} = useAuth();
```

### useSession

Direct access to NextAuth session:

```typescript
import { useSession } from "@repo/auth/hooks";

const { data: session, status, update } = useSession();
```

### useAuthRedirect

Handle authentication redirects:

```typescript
import { useAuthRedirect } from "@repo/auth/hooks";

// Redirect unauthenticated users to login
useAuthRedirect({
  redirectTo: "/login",
  condition: "unauthenticated",
});

// Redirect authenticated users away from auth pages
useAuthRedirect({
  redirectTo: "/dashboard",
  condition: "authenticated",
});
```

## 🛣️ API Routes

The package provides these API endpoints:

| Endpoint                        | Method    | Description                  |
| ------------------------------- | --------- | ---------------------------- |
| `/api/auth/signin`              | GET, POST | Sign-in page and processing  |
| `/api/auth/signout`             | GET, POST | Sign-out page and processing |
| `/api/auth/callback/[provider]` | GET, POST | OAuth callback handling      |
| `/api/auth/session`             | GET       | Get current session          |
| `/api/auth/providers`           | GET       | Available auth providers     |
| `/api/auth/csrf`                | GET       | CSRF token                   |

### Custom API Routes

Extend authentication with custom endpoints:

```typescript
// app/api/auth/register/route.ts
import { hashPassword } from "@repo/auth/utils";
import { db } from "@repo/database/client";

export async function POST(request: Request) {
  const { email, password, name } = await request.json();

  // Hash password securely
  const hashedPassword = await hashPassword(password);

  try {
    const user = await db.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    return Response.json({ success: true, userId: user.id });
  } catch (error) {
    return Response.json({ error: "User already exists" }, { status: 409 });
  }
}
```

## 🔐 Authentication Flow

### OAuth Flow

1. User clicks OAuth sign-in button
2. Redirected to provider (Google/GitHub/Discord)
3. User authorizes app
4. Provider redirects back to callback URL
5. Session created and user signed in

### Credentials Flow

1. User submits email/password form
2. Credentials verified against database
3. Password compared using secure hashing
4. Session created upon successful verification

### Session Management

- **JWT tokens** for stateless sessions
- **Database sessions** for server-side validation
- **Automatic refresh** when tokens expire
- **Secure cookies** with httpOnly and sameSite flags

## 🛡️ Security Features

### Password Security

```typescript
import { hashPassword, verifyPassword } from "@repo/auth/utils";

// Secure password hashing with bcrypt
const hashedPassword = await hashPassword("user-password");

// Verify password against hash
const isValid = await verifyPassword("user-password", hashedPassword);
```

### CSRF Protection

Built-in CSRF protection for all authentication requests.

### Session Security

- HTTP-only cookies prevent XSS attacks
- SameSite cookie attribute prevents CSRF
- Secure flag for HTTPS-only transmission
- Automatic session rotation

### Environment Security

- Sensitive variables in `.env.local`
- Secure secret generation
- Provider credential validation

## 🎨 Styling

Components use shadcn/ui styling system with Tailwind CSS:

```typescript
// Custom button variants
<SignInButton
  provider="google"
  variant="outline"      // or "default", "destructive", "secondary", "ghost", "link"
  size="lg"             // or "default", "sm", "icon"
  className="w-full"
/>
```

## 🔧 Extending

### Add New OAuth Provider

1. **Install provider** (if needed):

```bash
pnpm add @auth/[provider]-adapter
```

2. **Add to configuration**:

```typescript
// packages/auth/src/config.ts
import Discord from "@auth/discord";

export const authOptions = {
  providers: [
    // ... existing providers
    Discord({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
    }),
  ],
};
```

3. **Add environment variables**:

```bash
DISCORD_CLIENT_ID="your-discord-client-id"
DISCORD_CLIENT_SECRET="your-discord-client-secret"
```

### Custom User Fields

Extend the user model in `@repo/database`:

```prisma
model User {
  // ... existing fields
  role     Role     @default(USER)
  metadata Json?
}

enum Role {
  USER
  ADMIN
  MODERATOR
}
```

Then update the session callback:

```typescript
// packages/auth/src/config.ts
export const authOptions = {
  callbacks: {
    session: async ({ session, user }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
          role: user.role,
        },
      };
    },
  },
};
```

## 🧪 Testing

Test authentication flows with the provided utilities:

```typescript
import { createMockSession, mockUser } from '@repo/auth/test-utils'

// Mock authenticated session
const mockSession = createMockSession(mockUser)

// Test protected component
render(
  <SessionProvider session={mockSession}>
    <ProtectedComponent />
  </SessionProvider>
)
```

## 🐛 Troubleshooting

### Common Issues

1. **"AUTH_SECRET not set"**
   - Generate with: `openssl rand -base64 32`
   - Add to `.env.local`

2. **OAuth callback errors**
   - Check provider configuration
   - Verify callback URLs match
   - Ensure all required scopes

3. **Database connection errors**
   - Verify `DATABASE_URL` is correct
   - Run `pnpm db:push` in database package

4. **Type errors**
   - Restart TypeScript server
   - Ensure all packages are up to date

### Debug Mode

Enable debug logging:

```bash
DEBUG=1 pnpm dev
```

Or set in environment:

```typescript
// Set in config for detailed logs
debug: process.env.NODE_ENV === "development";
```

## 📚 Learn More

- [NextAuth.js Documentation](https://authjs.dev/)
- [OAuth 2.0 Specification](https://oauth.net/2/)
- [Web Authentication (WebAuthn)](https://webauthn.guide/)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)

---

**Need help?** Check the monorepo's main README or open an issue in the repository.
