#!/usr/bin/env node
/**
 * Version Packages Script
 * 
 * Updates version in all workspace packages to match the root version.
 * Called automatically by release-it after version bump.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const newVersion = process.argv[2];

if (!newVersion) {
  console.error('❌ Error: Version argument required');
  console.error('Usage: node version-packages.js <version>');
  process.exit(1);
}

console.log(`\n📦 Updating workspace packages to v${newVersion}...\n`);

function updatePackageJson(filePath, packageName) {
  try {
    const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    content.version = newVersion;
    fs.writeFileSync(filePath, JSON.stringify(content, null, 2) + '\n');
    console.log(`  ✅ ${packageName} → v${newVersion}`);
    return true;
  } catch (error) {
    console.log(`  ⚠️  ${packageName} - no package.json or error`);
    return false;
  }
}

// Update all packages
const packagesDir = path.join(process.cwd(), 'packages');
if (fs.existsSync(packagesDir)) {
  const packages = fs.readdirSync(packagesDir);
  console.log(`📦 Packages (${packages.length}):`);
  packages.forEach(pkg => {
    const pkgPath = path.join(packagesDir, pkg, 'package.json');
    if (fs.existsSync(pkgPath)) {
      updatePackageJson(pkgPath, `packages/${pkg}`);
    }
  });
}

// Update all apps
const appsDir = path.join(process.cwd(), 'apps');
if (fs.existsSync(appsDir)) {
  const apps = fs.readdirSync(appsDir);
  console.log(`\n🚀 Apps (${apps.length}):`);
  apps.forEach(app => {
    const appPath = path.join(appsDir, app, 'package.json');
    if (fs.existsSync(appPath)) {
      updatePackageJson(appPath, `apps/${app}`);
    }
  });
}

console.log(`\n✅ All workspace packages updated to v${newVersion}\n`);
