/**
 * NextAuth.js v5 Main File
 *
 * Exports auth handlers and utility functions
 */

import NextAuth from "next-auth";
import type { Session } from "next-auth";
import { authConfig } from "./auth.config";

// Create NextAuth instance
const nextAuth = NextAuth(authConfig);

// Export handlers individually with explicit types to avoid inference issues
export const handlers: any = nextAuth.handlers;
export const auth: any = nextAuth.auth;
export const signIn: any = nextAuth.signIn;
export const signOut: any = nextAuth.signOut;
