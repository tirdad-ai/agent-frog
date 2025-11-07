#!/usr/bin/env tsx
import * as fs from "fs";
import * as path from "path";
import { glob } from "glob";

const MESSAGES_DIR = path.join(__dirname, "../messages");
const DIST_DIR = path.join(__dirname, "../dist");

interface Messages {
  [key: string]: any;
}

/**
 * Recursively merge JSON files from a directory into a nested object
 * Directory structure becomes namespace structure
 */
function mergeJsonFiles(files: string[], baseDir: string): Messages {
  const merged: Messages = {};

  for (const file of files) {
    const content = fs.readFileSync(file, "utf-8");
    const data = JSON.parse(content);

    // Get relative path from baseDir and create namespace
    const relativePath = path.relative(baseDir, file);
    const namespace = relativePath
      .replace(/\.json$/, "") // Remove .json extension
      .split(path.sep) // Split by directory separator
      .filter((part) => part !== "en" && part !== "ar"); // Remove locale folders

    // Set data at the correct namespace
    if (namespace.length === 1 && namespace[0] === "index") {
      // If file is index.json at root, merge directly
      Object.assign(merged, data);
    } else if (namespace[namespace.length - 1] === "index") {
      // If file is index.json in a folder, use folder name
      namespace.pop(); // Remove 'index'
      setNested(merged, namespace, data);
    } else {
      // Normal file, use full path as namespace
      setNested(merged, namespace, data);
    }
  }

  return merged;
}

/**
 * Set a value in a nested object using an array of keys
 */
function setNested(obj: Messages, keys: string[], value: any): void {
  let current = obj;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!current[key]) {
      current[key] = {};
    }
    current = current[key];
  }

  const lastKey = keys[keys.length - 1];
  if (current[lastKey]) {
    // Merge if already exists
    Object.assign(current[lastKey], value);
  } else {
    current[lastKey] = value;
  }
}

/**
 * Build messages for a specific scope (shared, admin, portal, console) and locale
 */
async function buildMessagesForScope(
  scope: "shared" | "admin" | "portal" | "console",
  locale: "en" | "ar",
): Promise<void> {
  const scopeDir = path.join(MESSAGES_DIR, scope, locale);

  if (!fs.existsSync(scopeDir)) {
    console.warn(`⚠️  Directory not found: ${scopeDir}`);
    return;
  }

  // Find all JSON files recursively
  const pattern = path.join(scopeDir, "**/*.json").replace(/\\/g, "/");
  const files = await glob(pattern);

  if (files.length === 0) {
    console.warn(`⚠️  No JSON files found in: ${scopeDir}`);
    return;
  }

  console.log(`📦 Building ${scope}/${locale}... (${files.length} files)`);

  // Merge all files
  const merged = mergeJsonFiles(files, scopeDir);

  // Write output
  const outputDir = path.join(DIST_DIR, scope);
  const outputFile = path.join(outputDir, `${locale}.json`);

  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(outputFile, JSON.stringify(merged, null, 2));

  console.log(`✅ Built: ${path.relative(process.cwd(), outputFile)}`);
}

/**
 * Build all messages
 */
async function buildAll(): Promise<void> {
  console.log("🏗️  Building i18n messages...\n");

  const scopes: Array<"shared" | "admin" | "portal" | "console"> = [
    "shared",
    "admin",
    "portal",
    "console",
  ];
  const locales: Array<"en" | "ar"> = ["en", "ar"];

  // Clean dist directory
  if (fs.existsSync(DIST_DIR)) {
    fs.rmSync(DIST_DIR, { recursive: true });
  }

  // Build all combinations
  for (const scope of scopes) {
    for (const locale of locales) {
      await buildMessagesForScope(scope, locale);
    }
  }

  console.log("\n✨ Build complete!");
}

/**
 * Watch mode
 */
function watch(): void {
  console.log("👀 Watching for changes...\n");

  // Initial build
  buildAll();

  // Watch for changes
  fs.watch(MESSAGES_DIR, { recursive: true }, (eventType, filename) => {
    if (filename && filename.endsWith(".json")) {
      console.log(`\n🔄 Change detected: ${filename}`);
      buildAll();
    }
  });
}

// Main
const args = process.argv.slice(2);
const isWatch = args.includes("--watch") || args.includes("-w");

if (isWatch) {
  watch();
} else {
  buildAll().catch((error) => {
    console.error("❌ Build failed:", error);
    process.exit(1);
  });
}
