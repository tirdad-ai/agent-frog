#!/usr/bin/env node
/**
 * Build Changed Packages Script
 * 
 * Intelligently builds only:
 * - Changed packages that are buildable
 * - Skips non-buildable packages (like ui, ui-config, i18n)
 * - These non-buildable packages are built by consuming apps
 * 
 * Called automatically by release-it after version bump.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration: Define which packages need to be built
const BUILDABLE_PACKAGES = [
  'services',      // Backend business logic
  'database',      // Prisma client
  'auth',          // Auth utilities
  'eslint-config', // ESLint configs
  'typescript-config' // TypeScript configs
];

// Packages that are built by consuming apps (DO NOT BUILD)
const NON_BUILDABLE_PACKAGES = [
  'ui',          // React components - built by apps
  'ui-config',   // Tailwind config - consumed by apps
  'i18n'         // Translations - bundled by apps
];

function execCommand(command, options = {}) {
  try {
    return execSync(command, {
      encoding: 'utf-8',
      stdio: options.silent ? 'pipe' : 'inherit',
      ...options
    });
  } catch (error) {
    if (!options.ignoreError) {
      throw error;
    }
    return '';
  }
}

function getChangedFiles() {
  try {
    // Get changed files compared to last commit
    const output = execCommand('git diff --name-only HEAD~1', { silent: true, ignoreError: true });
    return output.split('\n').filter(Boolean);
  } catch {
    // If git diff fails, assume all packages changed (first release)
    return [];
  }
}

function getChangedPackages() {
  const changedFiles = getChangedFiles();
  const packages = new Set();
  const apps = new Set();
  
  changedFiles.forEach(file => {
    if (file.startsWith('packages/')) {
      const pkg = file.split('/')[1];
      packages.add(pkg);
    } else if (file.startsWith('apps/')) {
      const app = file.split('/')[1];
      apps.add(app);
    }
  });
  
  return {
    packages: Array.from(packages),
    apps: Array.from(apps)
  };
}

function isBuildable(packageName) {
  return BUILDABLE_PACKAGES.includes(packageName);
}

function isNonBuildable(packageName) {
  return NON_BUILDABLE_PACKAGES.includes(packageName);
}

function hasPackageJson(type, name) {
  const pkgPath = path.join(process.cwd(), type, name, 'package.json');
  return fs.existsSync(pkgPath);
}

function hasBuildScript(type, name) {
  const pkgPath = path.join(process.cwd(), type, name, 'package.json');
  if (!fs.existsSync(pkgPath)) return false;
  
  try {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
    return pkg.scripts && pkg.scripts.build;
  } catch {
    return false;
  }
}

function buildPackage(packageName) {
  console.log(`\n📦 Package: ${packageName}`);
  
  if (!hasPackageJson('packages', packageName)) {
    console.log(`  ⊘  No package.json found, skipping`);
    return { success: true, skipped: true };
  }
  
  if (isNonBuildable(packageName)) {
    console.log(`  ⊘  Non-buildable (consumed by apps), skipping`);
    return { success: true, skipped: true };
  }
  
  if (!isBuildable(packageName)) {
    console.log(`  ⊘  Not in buildable list, skipping`);
    return { success: true, skipped: true };
  }
  
  if (!hasBuildScript('packages', packageName)) {
    console.log(`  ⊘  No build script found, skipping`);
    return { success: true, skipped: true };
  }
  
  try {
    console.log(`  🔨 Building...`);
    execCommand(`pnpm --filter @repo/${packageName} build`);
    console.log(`  ✅ Built successfully`);
    return { success: true, skipped: false };
  } catch (error) {
    console.log(`  ❌ Build failed`);
    return { success: false, skipped: false };
  }
}

function buildApp(appName) {
  console.log(`\n🚀 App: ${appName}`);
  
  if (!hasPackageJson('apps', appName)) {
    console.log(`  ⊘  No package.json found, skipping`);
    return { success: true, skipped: true };
  }
  
  if (!hasBuildScript('apps', appName)) {
    console.log(`  ⊘  No build script found, skipping`);
    return { success: true, skipped: true };
  }
  
  try {
    console.log(`  🔨 Building...`);
    execCommand(`pnpm --filter ${appName} build`);
    console.log(`  ✅ Built successfully`);
    return { success: true, skipped: false };
  } catch (error) {
    console.log(`  ❌ Build failed`);
    return { success: false, skipped: false };
  }
}

function main() {
  console.log('\n🏗️  Building changed packages...\n');
  
  const { packages, apps } = getChangedPackages();
  
  if (packages.length === 0 && apps.length === 0) {
    console.log('ℹ️  No changed packages detected (possibly first release)');
    console.log('   Skipping build step - run `pnpm build` manually if needed\n');
    return;
  }
  
  console.log(`📦 Changed packages: ${packages.length}`);
  console.log(`🚀 Changed apps: ${apps.length}\n`);
  
  const results = {
    packagesBuilt: 0,
    packagesSkipped: 0,
    packagesFailed: 0,
    appsBuilt: 0,
    appsSkipped: 0,
    appsFailed: 0
  };
  
  // Build packages
  if (packages.length > 0) {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Building Packages');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    for (const pkg of packages) {
      const result = buildPackage(pkg);
      if (result.skipped) {
        results.packagesSkipped++;
      } else if (result.success) {
        results.packagesBuilt++;
      } else {
        results.packagesFailed++;
      }
    }
  }
  
  // Build apps
  if (apps.length > 0) {
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Building Apps');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    for (const app of apps) {
      const result = buildApp(app);
      if (result.skipped) {
        results.appsSkipped++;
      } else if (result.success) {
        results.appsBuilt++;
      } else {
        results.appsFailed++;
      }
    }
  }
  
  // Summary
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Build Summary');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📦 Packages: ${results.packagesBuilt} built, ${results.packagesSkipped} skipped, ${results.packagesFailed} failed`);
  console.log(`🚀 Apps: ${results.appsBuilt} built, ${results.appsSkipped} skipped, ${results.appsFailed} failed`);
  
  const totalFailed = results.packagesFailed + results.appsFailed;
  
  if (totalFailed > 0) {
    console.log(`\n❌ ${totalFailed} build(s) failed\n`);
    process.exit(1);
  }
  
  console.log('\n✅ All builds successful\n');
}

main();
