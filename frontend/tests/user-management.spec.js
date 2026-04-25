import { test, expect } from '@playwright/test';

// Mock data for the user profile response
const mockUserResponse = {
  success: true,
  user: {
    _id: 'user123',
    name: 'Test Student',
    email: 'test@student.com',
    role: 'student',
    studentId: 'IT23341968',
  },
  token: 'dummy-test-token'
};

const mockCheckAvailabilityResponse = {
  success: true,
  available: true,
  message: 'Available'
};

test.describe('User Management Tests', () => {

  test.describe('Login Page', () => {
    test.beforeEach(async ({ page }) => {
      // Navigate to login page
      await page.goto('/login');
    });

    test('renders login page correctly', async ({ page }) => {
      // Check for main elements
      await expect(page.locator('h2:has-text("Welcome back 👋")')).toBeVisible();
      await expect(page.locator('text=Sign in to your ProjectMate account')).toBeVisible();
      
      // Check inputs
      await expect(page.locator('input[name="identifier"]')).toBeVisible();
      await expect(page.locator('input[name="password"]')).toBeVisible();
      
      // Check sign in button
      await expect(page.locator('button:has-text("Sign In →")')).toBeVisible();
    });

    test('shows error on invalid login', async ({ page }) => {
      // Mock failed login
      await page.route('**/api/users/login', async route => {
        await route.fulfill({
          status: 401,
          contentType: 'application/json',
          body: JSON.stringify({ success: false, message: 'Invalid credentials' }),
        });
      });

      await page.fill('input[name="identifier"]', 'wrong@email.com');
      await page.fill('input[name="password"]', 'wrongpassword');
      await page.click('button:has-text("Sign In →")');

      // Expect error message to be visible
      await expect(page.locator('text=Invalid credentials')).toBeVisible();
    });

    test('successful login navigates to dashboard', async ({ page }) => {
      // Mock successful login
      await page.route('**/api/users/login', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(mockUserResponse),
        });
      });

      // Mock dashboard profile endpoint
      await page.route('**/api/profile/me', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(mockUserResponse.user),
        });
      });

      await page.fill('input[name="identifier"]', 'IT23341968');
      await page.fill('input[name="password"]', 'correctpassword');
      await page.click('button:has-text("Sign In →")');

      // Wait for navigation
      await page.waitForURL('**/dashboard*');
      
      // Verify we are on the dashboard
      expect(page.url()).toContain('/dashboard');
    });

    test('toggle password visibility', async ({ page }) => {
      const passwordInput = page.locator('input[name="password"]');
      const toggleBtn = page.locator('button.pw-toggle');

      // Initially should be password type
      await expect(passwordInput).toHaveAttribute('type', 'password');

      // Click toggle
      await toggleBtn.click();

      // Should be text type
      await expect(passwordInput).toHaveAttribute('type', 'text');

      // Click toggle again
      await toggleBtn.click();

      // Should be password type again
      await expect(passwordInput).toHaveAttribute('type', 'password');
    });
  });

  test.describe('Registration Flow', () => {
    test.beforeEach(async ({ page }) => {
      // Navigate to register page
      await page.goto('/register');
      
      // Mock availability check
      await page.route('**/api/users/check-availability*', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(mockCheckAvailabilityResponse),
        });
      });
    });

    test('renders step 1 correctly', async ({ page }) => {
      await expect(page.locator('h2:has-text("Create your account")')).toBeVisible();
      await expect(page.locator('input[name="firstName"]')).toBeVisible();
      await expect(page.locator('input[name="lastName"]')).toBeVisible();
      await expect(page.locator('input[name="email"]')).toBeVisible();
      await expect(page.locator('select[name="department"]')).toBeVisible();
      await expect(page.locator('select[name="yearOfStudy"]')).toBeVisible();
    });

    test('progresses through registration steps', async ({ page }) => {
      // Step 1
      await page.fill('input[name="firstName"]', 'John');
      await page.fill('input[name="lastName"]', 'Doe');
      await page.fill('input[name="email"]', 'john.doe@student.com');
      await page.selectOption('select[name="department"]', 'Computing');
      await page.selectOption('select[name="yearOfStudy"]', 'Year 2');
      
      await page.click('button:has-text("Continue →")');

      // Step 2
      await expect(page.locator('input[name="password"]')).toBeVisible();
      await page.fill('input[name="password"]', 'StrongPass123!');
      await page.fill('input[name="confirmPassword"]', 'StrongPass123!');
      
      // Check the terms agreement (assuming it's a checkbox)
      await page.click('input[type="checkbox"]');
      
      await page.click('button:has-text("Continue →")');

      // Step 3
      await expect(page.locator('input[name="studentId"]')).toBeVisible();
      await page.fill('input[name="studentId"]', 'IT23341968');
      await page.selectOption('select[name="specialization"]', 'Software Engineering');
      await page.selectOption('select[name="semester"]', 'Semester 1');
      await page.fill('input[name="bio"]', 'I am a passionate developer.');
      
      // Select a role from dropdown
      await page.click('.multiselect-header');
      await page.click('div.multiselect-option:has-text("Frontend Developer")');

      // Mock registration API
      await page.route('**/api/users/register', async route => {
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({ success: true, message: 'Registration successful' }),
        });
      });

      // Submit form
      await page.click('button:has-text("Create Account")');

      // Check for success modal
      await expect(page.locator('h2:has-text("Welcome to ProMate!")')).toBeVisible();
      await expect(page.locator('button:has-text("Get Started 🚀")')).toBeVisible();
    });
  });
});
