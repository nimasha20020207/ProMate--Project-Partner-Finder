import { test, expect } from '@playwright/test';

const mockAdmin = {
  _id: 'admin123',
  name: 'Admin User',
  email: 'admin@promate.com',
  role: 'admin',
};

const mockReports = {
  totalStudents: 150,
  totalProjects: 45,
  totalRequests: 20,
  pendingRequests: 5
};

const mockStudents = [
  { 
    _id: 's1', 
    fullName: 'John Doe', 
    studentId: 'IT21000001', 
    email: 'john@student.com', 
    degreeProgram: 'BSc SE',
    department: 'Software Engineering'
  },
  { 
    _id: 's2', 
    fullName: 'Jane Smith', 
    studentId: 'IT21000002', 
    email: 'jane@student.com', 
    degreeProgram: 'BSc IT',
    department: 'Information Technology'
  }
];

const mockProjects = [
  { 
    _id: 'p1', 
    title: 'AI Assistant', 
    description: 'AI project description', 
    domain: ['Artificial Intelligence'],
    projectType: 'Research',
    teamSize: 4,
    academicConstraints: { year: 3, semester: 2, minimumCGPA: 3.0 },
    essentialSkills: { languages: ['Python', 'JS'], frameworks: ['React'] },
    requiredRoles: ['Frontend Developer', 'Backend Developer'],
    availabilityRequirement: { weeklyHours: 10, durationWeeks: 12 }
  }
];

test.describe('Admin Panel Tests', () => {

  test.beforeEach(async ({ page }) => {
    // 1. Mock the /api/profile/me endpoint to authenticate as admin
    await page.route('**/api/profile/me', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockAdmin),
      });
    });

    // 2. Mock Reports API for Admindashboard
    await page.route('**/api/admin/reports*', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockReports),
      });
    });

    // 3. Mock Students API for Studentmanagement
    await page.route('**/api/admin/students*', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockStudents),
      });
    });

    // 4. Mock Projects API for Projectmanagement
    await page.route('**/api/admin/projects*', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockProjects),
      });
    });

    // 5. Navigate to a blank page first to set localStorage
    await page.goto('/');
    
    // Set a dummy token so the app thinks we are logged in
    await page.evaluate(() => {
      localStorage.setItem('token', 'dummy-admin-token');
    });
  });

  test('Admindashboard renders correctly with stats', async ({ page }) => {
    await page.goto('/admindashboard');

    // Wait for the welcome text
    await expect(page.locator("text=Welcome back! Here's what's happening today.")).toBeVisible();

    // Verify stats from mockReports
    await expect(page.locator('p', { hasText: /^150$/ })).toBeVisible(); // Total Students
    await expect(page.locator('p', { hasText: /^45$/ })).toBeVisible(); // Total Projects
    await expect(page.locator('p', { hasText: /^20$/ })).toBeVisible(); // Total Requests
    await expect(page.locator('p', { hasText: /^5$/ })).toBeVisible(); // Pending Requests
  });

  test('Studentmanagement page renders correctly with students', async ({ page }) => {
    await page.goto('/studentman');

    // Verify headers
    await expect(page.locator('h1:has-text("New Users")')).toBeVisible();

    // Verify mock students are displayed
    await expect(page.locator('h2:has-text("John Doe")').first()).toBeVisible();
    await expect(page.locator('text=IT21000001').first()).toBeVisible();
    
    await expect(page.locator('h2:has-text("Jane Smith")').first()).toBeVisible();
    await expect(page.locator('text=IT21000002').first()).toBeVisible();
  });

  test('Projectmanagement page renders correctly with projects', async ({ page }) => {
    await page.goto('/projectman');

    // Verify headers
    await expect(page.locator('h1:has-text("New Projects")')).toBeVisible();

    // Verify mock projects are displayed
    await expect(page.locator('h2:has-text("AI Assistant")')).toBeVisible();
    await expect(page.locator('text=AI project description')).toBeVisible();
    await expect(page.locator('span:has-text("Artificial Intelligence")')).toBeVisible();
  });

  test('Buttons on Studentmanagement page are visible', async ({ page }) => {
    await page.goto('/studentman');

    // Check if View Profile, Verify, and Suspend buttons are present on cards
    await expect(page.locator('button:has-text("View Profile")').first()).toBeVisible();
    await expect(page.locator('button:has-text("Verify⭐")').first()).toBeVisible();
    await expect(page.locator('button:has-text("Suspend")').first()).toBeVisible();

    // Check for "View All Users" button
    await expect(page.locator('button:has-text("View All Users")')).toBeVisible();
  });

  test('Buttons on Projectmanagement page are visible', async ({ page }) => {
    await page.goto('/projectman');

    // Check if View, Approve, and Reject buttons are present on cards
    await expect(page.locator('button:has-text("View")').first()).toBeVisible();
    await expect(page.locator('button:has-text("Approve")').first()).toBeVisible();
    await expect(page.locator('button:has-text("Reject")').first()).toBeVisible();
  });
});
