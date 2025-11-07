import crypto from "crypto";

// Set up test environment variables BEFORE module imports
// This must run at module load time, not in beforeAll

// Generate a valid 32-byte encryption key for tests
if (!process.env.ENCRYPTION_KEY) {
  process.env.ENCRYPTION_KEY = crypto.randomBytes(32).toString("hex");
}

// Force test database URL (always use TEST_DATABASE_URL in tests)
process.env.DATABASE_URL =
  process.env.TEST_DATABASE_URL ||
  "postgresql://tirdad_test:tirdad_test_password@localhost:5434/tirdad_test";

// Set test Super Admin password
if (!process.env.SUPER_ADMIN_PASSWORD) {
  process.env.SUPER_ADMIN_PASSWORD = "Admin@123456";
}

// Set NODE_ENV to test (if not already set)
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = "test";
}
