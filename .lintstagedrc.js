/**
 * Lint-Staged Configuration
 * 
 * Runs linting and formatting on staged files before commit.
 * This ensures code quality without running checks on entire codebase.
 */

module.exports = {
  // TypeScript/JavaScript files
  '**/*.{ts,tsx,js,jsx}': (filenames) => [
    // Type check (only if tsconfig exists in the directory)
    'pnpm typecheck',
    
    // ESLint with auto-fix
    `pnpm eslint --fix ${filenames.join(' ')}`,
    
    // Prettier format
    `pnpm prettier --write ${filenames.join(' ')}`,
  ],
  
  // JSON, Markdown, YAML files
  '**/*.{json,md,mdx,yml,yaml}': (filenames) => [
    // Prettier format
    `pnpm prettier --write ${filenames.join(' ')}`,
  ],
  
  // CSS, SCSS files
  '**/*.{css,scss}': (filenames) => [
    // Prettier format
    `pnpm prettier --write ${filenames.join(' ')}`,
  ],
};
