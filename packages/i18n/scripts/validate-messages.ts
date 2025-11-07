#!/usr/bin/env tsx
import * as fs from "fs";
import * as path from "path";
import { glob } from "glob";

const MESSAGES_DIR = path.join(__dirname, "../messages");

interface ValidationError {
  type: "missing" | "extra" | "mismatch";
  scope: string;
  file: string;
  key: string;
  message: string;
}

/**
 * Get all keys from a nested object
 */
function getKeys(obj: any, prefix = ""): string[] {
  const keys: string[] = [];

  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      keys.push(...getKeys(value, fullKey));
    } else {
      keys.push(fullKey);
    }
  }

  return keys;
}

/**
 * Load and parse a JSON file
 */
function loadJson(filePath: string): any {
  const content = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(content);
}

/**
 * Compare two sets of keys and return differences
 */
function compareKeys(
  enKeys: string[],
  arKeys: string[],
  scope: string,
  file: string,
): ValidationError[] {
  const errors: ValidationError[] = [];
  const enSet = new Set(enKeys);
  const arSet = new Set(arKeys);

  // Find missing keys in Arabic
  for (const key of enKeys) {
    if (!arSet.has(key)) {
      errors.push({
        type: "missing",
        scope,
        file,
        key,
        message: `Missing Arabic translation for key: ${key}`,
      });
    }
  }

  // Find extra keys in Arabic
  for (const key of arKeys) {
    if (!enSet.has(key)) {
      errors.push({
        type: "extra",
        scope,
        file,
        key,
        message: `Extra Arabic translation (not in English): ${key}`,
      });
    }
  }

  return errors;
}

/**
 * Validate messages for a specific scope
 */
async function validateScope(
  scope: "shared" | "admin" | "portal",
): Promise<ValidationError[]> {
  const errors: ValidationError[] = [];
  const enDir = path.join(MESSAGES_DIR, scope, "en");
  const arDir = path.join(MESSAGES_DIR, scope, "ar");

  if (!fs.existsSync(enDir)) {
    console.warn(`⚠️  English directory not found: ${enDir}`);
    return errors;
  }

  if (!fs.existsSync(arDir)) {
    console.warn(`⚠️  Arabic directory not found: ${arDir}`);
    return errors;
  }

  // Get all English files
  const enPattern = path.join(enDir, "**/*.json").replace(/\\/g, "/");
  const enFiles = await glob(enPattern);

  for (const enFile of enFiles) {
    const relativePath = path.relative(enDir, enFile);
    const arFile = path.join(arDir, relativePath);

    // Check if corresponding Arabic file exists
    if (!fs.existsSync(arFile)) {
      errors.push({
        type: "missing",
        scope,
        file: relativePath,
        key: "",
        message: `Missing Arabic translation file: ${relativePath}`,
      });
      continue;
    }

    // Load and compare keys
    try {
      const enData = loadJson(enFile);
      const arData = loadJson(arFile);

      const enKeys = getKeys(enData);
      const arKeys = getKeys(arData);

      const fileErrors = compareKeys(enKeys, arKeys, scope, relativePath);
      errors.push(...fileErrors);
    } catch (error) {
      errors.push({
        type: "mismatch",
        scope,
        file: relativePath,
        key: "",
        message: `Failed to parse or compare files: ${error}`,
      });
    }
  }

  // Check for extra Arabic files
  const arPattern = path.join(arDir, "**/*.json").replace(/\\/g, "/");
  const arFiles = await glob(arPattern);

  for (const arFile of arFiles) {
    const relativePath = path.relative(arDir, arFile);
    const enFile = path.join(enDir, relativePath);

    if (!fs.existsSync(enFile)) {
      errors.push({
        type: "extra",
        scope,
        file: relativePath,
        key: "",
        message: `Extra Arabic translation file (not in English): ${relativePath}`,
      });
    }
  }

  return errors;
}

/**
 * Print validation results
 */
function printResults(errors: ValidationError[]): void {
  if (errors.length === 0) {
    console.log("✅ All translations are in sync!\n");
    return;
  }

  console.log(`❌ Found ${errors.length} validation error(s):\n`);

  // Group errors by scope
  const grouped = errors.reduce(
    (acc, error) => {
      if (!acc[error.scope]) {
        acc[error.scope] = [];
      }
      acc[error.scope].push(error);
      return acc;
    },
    {} as Record<string, ValidationError[]>,
  );

  for (const [scope, scopeErrors] of Object.entries(grouped)) {
    console.log(`\n📁 ${scope.toUpperCase()}`);
    console.log("─".repeat(50));

    for (const error of scopeErrors) {
      const icon =
        error.type === "missing" ? "⚠️" : error.type === "extra" ? "🔸" : "❌";
      console.log(`${icon} ${error.message}`);
      if (error.file) {
        console.log(`   File: ${error.file}`);
      }
    }
  }

  console.log("\n");
}

/**
 * Main validation
 */
async function validate(): Promise<void> {
  console.log("🔍 Validating i18n messages...\n");

  const scopes: Array<"shared" | "admin" | "portal"> = [
    "shared",
    "admin",
    "portal",
  ];
  const allErrors: ValidationError[] = [];

  for (const scope of scopes) {
    console.log(`Checking ${scope}...`);
    const errors = await validateScope(scope);
    allErrors.push(...errors);
  }

  console.log("");
  printResults(allErrors);

  if (allErrors.length > 0) {
    process.exit(1);
  }
}

// Run validation
validate().catch((error) => {
  console.error("❌ Validation failed:", error);
  process.exit(1);
});
