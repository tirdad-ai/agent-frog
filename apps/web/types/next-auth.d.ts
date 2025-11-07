/**
 * NextAuth.js Type Definitions
 * 
 * Extends NextAuth types with custom user properties
 */

import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: string
      tenantId: string
      tenantSlug: string
      locale: string
    } & DefaultSession['user']
  }

  interface User {
    id: string
    role: string
    tenantId: string
    tenantSlug: string
    locale: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: string
    tenantId: string
    tenantSlug: string
    locale: string
  }
}
