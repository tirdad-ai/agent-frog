/**
 * Example E2E Test
 * 
 * Framework: Playwright
 * Pattern: End-to-end user flow testing
 * Purpose: Test complete user journeys across the application
 * 
 * This example shows:
 * - User registration and login flow
 * - Page navigation testing
 * - Form interactions
 * - Real browser testing (Chromium, Firefox, WebKit)
 */

import { test, expect } from '@playwright/test';

test.describe('User Registration Flow', () => {
  test('should allow new user to register and login', async ({ page }) => {
    // Generate unique email for this test run
    const testEmail = `test-${Date.now()}@example.com`;
    const testPassword = 'SecurePass123!';
    const testName = 'Test User';

    // Step 1: Navigate to registration page
    await page.goto('/register');
    await expect(page).toHaveTitle(/Register/);

    // Step 2: Fill registration form
    await page.getByLabel(/email/i).fill(testEmail);
    await page.getByLabel(/name/i).fill(testName);
    await page.getByLabel(/password/i).fill(testPassword);

    // Step 3: Submit registration
    await page.getByRole('button', { name: /register/i }).click();

    // Step 4: Verify redirect to login page
    await expect(page).toHaveURL('/login');
    await expect(page.getByText(/registration successful/i)).toBeVisible();

    // Step 5: Login with new credentials
    await page.getByLabel(/email/i).fill(testEmail);
    await page.getByLabel(/password/i).fill(testPassword);
    await page.getByRole('button', { name: /login/i }).click();

    // Step 6: Verify redirect to dashboard
    await expect(page).toHaveURL('/dashboard');

    // Step 7: Verify user name is displayed
    await expect(page.getByText(testName)).toBeVisible();

    // Step 8: Verify user is authenticated
    await expect(page.getByRole('button', { name: /logout/i })).toBeVisible();
  });

  test('should show validation errors for invalid registration', async ({ page }) => {
    await page.goto('/register');

    // Try to submit empty form
    await page.getByRole('button', { name: /register/i }).click();

    // Verify validation errors
    await expect(page.getByText(/email is required/i)).toBeVisible();
    await expect(page.getByText(/name is required/i)).toBeVisible();
    await expect(page.getByText(/password is required/i)).toBeVisible();
  });

  test('should not allow registration with existing email', async ({ page }) => {
    const existingEmail = 'existing@example.com';

    await page.goto('/register');

    await page.getByLabel(/email/i).fill(existingEmail);
    await page.getByLabel(/name/i).fill('Test User');
    await page.getByLabel(/password/i).fill('SecurePass123!');
    await page.getByRole('button', { name: /register/i }).click();

    // Verify error message
    await expect(page.getByText(/email already exists/i)).toBeVisible();
    await expect(page).toHaveURL('/register'); // Should stay on registration page
  });
});

test.describe('User Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/password/i).fill('SecurePass123!');
    await page.getByRole('button', { name: /login/i }).click();
    await expect(page).toHaveURL('/dashboard');
  });

  test('should display user information', async ({ page }) => {
    // Verify dashboard content
    await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible();
    await expect(page.getByText(/test@example.com/i)).toBeVisible();
  });

  test('should allow user to logout', async ({ page }) => {
    // Click logout
    await page.getByRole('button', { name: /logout/i }).click();

    // Verify redirect to login page
    await expect(page).toHaveURL('/login');
    await expect(page.getByText(/logged out successfully/i)).toBeVisible();
  });
});

test.describe('User Management (Admin)', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin
    await page.goto('/login');
    await page.getByLabel(/email/i).fill('admin@example.com');
    await page.getByLabel(/password/i).fill('AdminPass123!');
    await page.getByRole('button', { name: /login/i }).click();
    await expect(page).toHaveURL('/dashboard');
  });

  test('should create, edit, and delete user', async ({ page }) => {
    // Navigate to users page
    await page.getByRole('link', { name: /users/i }).click();
    await expect(page).toHaveURL('/users');

    // Create new user
    await page.getByRole('button', { name: /create user/i }).click();
    await page.getByLabel(/email/i).fill(`new-user-${Date.now()}@example.com`);
    await page.getByLabel(/name/i).fill('New User');
    await page.getByRole('button', { name: /save/i }).click();

    // Verify user appears in list
    await expect(page.getByText(/new user/i)).toBeVisible();

    // Edit user
    await page.getByRole('row', { name: /new user/i }).getByRole('button', { name: /edit/i }).click();
    await page.getByLabel(/name/i).fill('Updated User');
    await page.getByRole('button', { name: /save/i }).click();

    // Verify update
    await expect(page.getByText(/updated user/i)).toBeVisible();

    // Delete user
    await page.getByRole('row', { name: /updated user/i }).getByRole('button', { name: /delete/i }).click();
    await page.getByRole('button', { name: /confirm/i }).click();

    // Verify deletion
    await expect(page.getByText(/updated user/i)).not.toBeVisible();
  });
});
