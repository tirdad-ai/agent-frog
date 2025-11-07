/**
 * Database Client Export
 * 
 * Compatibility layer for @repo/auth package
 */

import prisma from './lib/prisma'

// Export as 'db' for auth package compatibility
export const db = prisma

// Also export as default
export default prisma
