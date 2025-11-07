import crypto from "crypto";
import bcrypt from "bcryptjs";

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "";
const BCRYPT_ROUNDS = 12;

/**
 * Validates the encryption key
 */
function validateEncryptionKey(): void {
  if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length !== 64) {
    throw new Error(
      "ENCRYPTION_KEY must be a 64-character hex string (32 bytes). " +
        "Generate one with: openssl rand -hex 32",
    );
  }
}

/**
 * Encrypts a plaintext string using AES-256-GCM
 * Format: iv:authTag:encrypted (all base64 encoded)
 *
 * @param plainText - The text to encrypt
 * @returns Encrypted string in format "iv:authTag:encrypted"
 */
export function encrypt(plainText: string): string {
  if (!plainText) {
    throw new Error("Cannot encrypt empty string");
  }

  validateEncryptionKey();

  // Convert hex key to Buffer (32 bytes for AES-256)
  const key = Buffer.from(ENCRYPTION_KEY, "hex");

  // Generate random IV (16 bytes for AES)
  const iv = crypto.randomBytes(16);

  // Create cipher
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);

  // Encrypt the plaintext
  let encrypted = cipher.update(plainText, "utf8", "base64");
  encrypted += cipher.final("base64");

  // Get the authentication tag
  const authTag = cipher.getAuthTag();

  // Return in format: iv:authTag:encrypted (all base64)
  return `${iv.toString("base64")}:${authTag.toString("base64")}:${encrypted}`;
}

/**
 * Decrypts an encrypted string using AES-256-GCM
 *
 * @param encryptedText - The encrypted text in format "iv:authTag:encrypted"
 * @returns Decrypted plaintext string
 */
export function decrypt(encryptedText: string): string {
  if (!encryptedText) {
    throw new Error("Cannot decrypt empty string");
  }

  validateEncryptionKey();

  // Split the encrypted text into components
  const parts = encryptedText.split(":");
  if (parts.length !== 3) {
    throw new Error(
      'Invalid encrypted text format. Expected "iv:authTag:encrypted"',
    );
  }

  const ivBase64 = parts[0]!;
  const authTagBase64 = parts[1]!;
  const encrypted = parts[2]!;

  // Convert from base64 to Buffer
  const key = Buffer.from(ENCRYPTION_KEY, "hex");
  const iv = Buffer.from(ivBase64, "base64");
  const authTag = Buffer.from(authTagBase64, "base64");

  // Create decipher
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(authTag);

  // Decrypt the text
  const decrypted =
    decipher.update(encrypted, "base64", "utf8") + decipher.final("utf8");

  return decrypted;
}

/**
 * Hashes a password using bcrypt with 12 rounds
 *
 * @param password - The plaintext password
 * @returns Hashed password (format: $2b$12$...)
 */
export async function hashPassword(password: string): Promise<string> {
  if (!password) {
    throw new Error("Cannot hash empty password");
  }

  if (password.length < 8) {
    throw new Error("Password must be at least 8 characters long");
  }

  const salt = await bcrypt.genSalt(BCRYPT_ROUNDS);
  const hashedPassword = await bcrypt.hash(password, salt);

  return hashedPassword;
}

/**
 * Verifies a password against a bcrypt hash
 *
 * @param password - The plaintext password to verify
 * @param hash - The bcrypt hash to verify against
 * @returns True if password matches, false otherwise
 */
export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  if (!password || !hash) {
    return false;
  }

  try {
    const isMatch = await bcrypt.compare(password, hash);
    return isMatch;
  } catch (error) {
    // If bcrypt compare fails (e.g., invalid hash format), return false
    return false;
  }
}

/**
 * Generates a cryptographically secure random string
 *
 * @param length - Length of the random string (default: 32)
 * @returns Random hex string
 */
export function generateRandomString(length: number = 32): string {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString("hex")
    .slice(0, length);
}

/**
 * Generates a URL-safe slug from a string
 *
 * @param text - The text to convert to a slug
 * @returns URL-safe slug
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove non-word chars
    .replace(/[\s_-]+/g, "-") // Replace spaces, underscores with -
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing -
}

/**
 * Generates a unique slug by appending a random suffix
 *
 * @param baseSlug - The base slug
 * @returns Unique slug with random suffix
 */
export function generateUniqueSlug(baseSlug: string): string {
  const randomSuffix = crypto.randomBytes(3).toString("hex"); // 6 chars
  return `${baseSlug}-${randomSuffix}`;
}
