/**
 * NextAuth.js v5 Configuration
 *
 * JWT-based authentication with multi-tenant support
 */

import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { AuthService } from "@repo/services";

const authService = new AuthService();

export const authConfig: NextAuthConfig = {
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const result = await authService.login(
            {
              email: credentials.email as string,
              password: credentials.password as string,
            },
            {
              ipAddress: "0.0.0.0", // Will be set by middleware
              userAgent: "web",
            },
          );

          console.log("[NextAuth] Login result:", {
            userId: result.user.id,
            tenantStatus: result.currentTenant.status,
            role: result.membership.role,
            totalMemberships: result.totalMemberships,
          });

          // Check tenant status
          if (
            result.currentTenant.status !== "ACTIVE" &&
            result.membership.role !== "SUPER_ADMIN"
          ) {
            console.error("[NextAuth] Tenant not active:", {
              status: result.currentTenant.status,
              role: result.membership.role,
            });
            throw new Error("Tenant is not active");
          }

          return {
            id: result.user.id,
            email: result.user.email,
            name: result.user.name,
            role: result.membership.role,
            tenantId: result.currentTenant.id,
            tenantSlug: result.currentTenant.slug,
            locale: result.user.locale,
          };
        } catch (error) {
          console.error("[NextAuth] Auth error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // On sign in, add custom claims to token
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.tenantId = user.tenantId;
        token.tenantSlug = user.tenantSlug;
        token.locale = user.locale;
      }
      return token;
    },
    async session({ session, token }) {
      // Add custom claims to session
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.tenantId = token.tenantId as string;
        session.user.tenantSlug = token.tenantSlug as string;
        session.user.locale = token.locale as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
};
