/**
 * Commitlint Configuration
 * 
 * Enforces conventional commit format for automated versioning and changelog generation.
 * 
 * Format: <type>(<scope>): <subject>
 * 
 * Types:
 * - feat: New feature (minor version)
 * - fix: Bug fix (patch version)
 * - docs: Documentation only
 * - style: Code formatting (no logic change)
 * - refactor: Code refactoring
 * - perf: Performance improvements
 * - test: Test additions/updates
 * - chore: Maintenance tasks
 * - ci: CI/CD changes
 * 
 * Breaking changes:
 * - Add ! after type: feat!: breaking change
 * - Or add BREAKING CHANGE: in footer
 */

module.exports = {
  extends: ['@commitlint/config-conventional'],
  
  rules: {
    // Enforce type to be in lower case
    'type-case': [2, 'always', 'lower-case'],
    
    // Allowed types
    'type-enum': [
      2,
      'always',
      [
        'feat',     // New feature
        'fix',      // Bug fix
        'docs',     // Documentation
        'style',    // Formatting
        'refactor', // Code refactoring
        'perf',     // Performance
        'test',     // Tests
        'chore',    // Maintenance
        'ci',       // CI/CD
        'revert',   // Revert commit
        'build',    // Build system
      ],
    ],
    
    // Scope is optional but must be lower-case if provided
    'scope-case': [2, 'always', 'lower-case'],
    
    // Subject must not be empty
    'subject-empty': [2, 'never'],
    
    // Subject must start with lower case
    'subject-case': [2, 'always', 'lower-case'],
    
    // Subject must not end with period
    'subject-full-stop': [2, 'never', '.'],
    
    // Header (type + scope + subject) max length
    'header-max-length': [2, 'always', 100],
    
    // Body max line length (soft limit)
    'body-max-line-length': [1, 'always', 100],
    
    // Footer max line length (soft limit)
    'footer-max-line-length': [1, 'always', 100],
  },
};
