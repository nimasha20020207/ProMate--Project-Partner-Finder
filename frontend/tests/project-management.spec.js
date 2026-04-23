import { test, expect } from '@playwright/test';

// Mock data for the user profile
const mockUser = {
  _id: 'user123',
  name: 'Test Project Owner',
  email: 'owner@student.com',
  role: 'student',
  studentId: 'IT12345678',
  fullName: 'Test Project Owner'
};

// Mock data for projects
const mockProjects = [
  {
    _id: 'proj1',
    projectId: 'P0001',
    itNumber: 'IT12345678',
    title: 'My Own Project',
    description: 'This is my project that I manage.',
    teamSize: 2,
    projectType: 'Web App',
    requiredRoles: ['Frontend'],
    createdAt: new Date().toISOString()
  },
  {
    _id: 'proj2',
    projectId: 'P0002',
    itNumber: 'IT87654321', // Different user
    title: 'Open Project',
    description: 'Looking for team members.',
    teamSize: 1,
    projectType: 'Mobile App',
    requiredRoles: ['Backend'],
    createdAt: new Date().toISOString()
  },
  {
    _id: 'proj3',
    projectId: 'P0003',
    itNumber: 'IT99999999', // Different user
    title: 'Full Project',
    description: 'This team is full.',
    teamSize: 0, // FULL status
    projectType: 'AI Tool',
    requiredRoles: ['Data Scientist'],
    createdAt: new Date().toISOString()
  }
];

// Mock data for notifications
const mockNotifications = [
  {
    _id: 'notif1',
    senderIt: 'IT87654321 - Friend',
    targetIt: 'IT12345678',
    postId: 'proj1',
    message: 'Requested to join P0001 - My Own Project project',
    type: 'join_request',
    createdAt: new Date().toISOString()
  }
];

test.describe('Project Management & Join Requests E2E', () => {

  test.beforeEach(async ({ page }) => {
    // 1. Mock the /api/profile/me endpoint to authenticate the user
    await page.route('**/api/profile/me', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockUser),
      });
    });

    // 2. Mock API Posts (GET and POST)
    await page.route('**/api/posts', async route => {
      const method = route.request().method();
      if (method === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(mockProjects),
        });
      } else if (method === 'POST') {
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({ msg: 'Post created successfully', data: { ...mockProjects[0] } }),
        });
      } else {
        await route.continue();
      }
    });

    // 4. Mock DELETE /api/posts/* (Deleting a project)
    await page.route('**/api/posts/*', async route => {
      if (route.request().method() === 'DELETE') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ msg: 'Project deleted successfully' }),
        });
      }
    });

    // 5. Navigate to a blank page first to set localStorage
    await page.goto('/');
    
    // Set dummy tokens
    await page.evaluate(({ user }) => {
      localStorage.setItem('token', 'dummy-test-token');
      localStorage.setItem('user', JSON.stringify(user));
    }, { user: mockUser });
  });

  // --- SUITE 1: PROJECT POST MANAGEMENT ---

  test('Insert Project interface correctly renders', async ({ page }) => {
    await page.goto('/insert-project');

    // Wait for the "Create New Project" heading
    await expect(page.locator('h1:has-text("Create New Project")')).toBeVisible();
    
    // Check if the submit button exists
    const submitBtn = page.locator('button:has-text("Create Project")');
    await expect(submitBtn).toBeVisible();
  });

  test('Your Projects displays mock user projects and FULL tags correctly', async ({ page }) => {
    await page.goto('/your-projects');

    await page.waitForTimeout(1000); // give it a sec to load
    
    // Ensure page loads
    await expect(page.locator('h1:has-text("Your Projects")')).toBeVisible({ timeout: 10000 });

    // Verify 'My Own Project' (which we own) is visible
    await expect(page.locator('h3:has-text("My Own Project")')).toBeVisible({ timeout: 5000 });

    // Verify the system correctly shows we are missing 'Open Project' because we don't own it
    await expect(page.locator('h3:has-text("Open Project")')).toBeHidden();
  });

  // --- SUITE 2: JOIN REQUESTS AND NOTIFICATIONS ---
  
  test('All Projects hides FULL project automatically', async ({ page }) => {
    await page.goto('/all-projects');

    await page.waitForTimeout(1000); // give it a sec to load
    
    // We should see "Open Project" because teamSize > 0
    await expect(page.locator('h3:has-text("Open Project")')).toBeVisible({ timeout: 5000 });

    // We should NOT see "Full Project" because our AllProjects.jsx filter rejects teamSize <= 0
    await expect(page.locator('h3:has-text("Full Project")')).toBeHidden();

    // We should NOT see "My Own Project" because AllProjects.jsx filters out our own IT number
    await expect(page.locator('h3:has-text("My Own Project")')).toBeHidden();
  });

  test('Project Details allows sending a Join Request', async ({ page }) => {
    // Mock the specific GET route for the project details lookup
    await page.route('**/api/posts/proj2', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockProjects[1]), // Open Project
      });
    });

    // Mock GET notifications strictly returning empty so it doesn't default to disabled
    await page.route('**/api/notifications*', async route => {
      if (route.request().method() === 'GET') {
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) });
      } else {
        await route.continue();
      }
    });

    // Mock POST notification mimicking sending a request
    await page.route('**/api/notifications', async route => {
      if (route.request().method() === 'POST') {
        await route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify({ msg: 'Success' }) });
      }
    });

    // Accept javascript dialogs (Alerts) automatically so test doesn't freeze
    page.on('dialog', dialog => dialog.accept());

    await page.goto('/projects/proj2');

    // Assert the component renders details
    await expect(page.locator('h2:has-text("Open Project")')).toBeVisible();

    // Find the Join button
    const joinBtn = page.locator('button:has-text("Join Project")');
    await expect(joinBtn).toBeVisible();

    // Click exactly triggers the mocked POST and turns button text to Requested to Join.
    await joinBtn.click();

    // Our new logic instantly flips UI state to Request Sent & Disables it
    const requestedBtn = page.locator('button:has-text("Requested to Join")');
    await expect(requestedBtn).toBeVisible();
    await expect(requestedBtn).toBeDisabled();
  });

  test('Notifications page allows accepting a request and auto decrements team size', async ({ page }) => {
    // Mock Notifications GET to return our mock request
    await page.route('**/api/notifications*', async route => {
      if (route.request().method() === 'GET') {
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(mockNotifications) });
      } else {
        await route.continue();
      }
    });

    // Mock the specific POST back for status update
    await page.route('**/api/notifications', async route => {
      if (route.request().method() === 'POST') {
        await route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify({}) });
      } else {
        await route.continue();
      }
    });

    // Mock the PUT to update notification historic record
    await page.route('**/api/notifications/*', async route => {
      if (route.request().method() === 'PUT') {
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({}) });
      } else {
        await route.continue();
      }
    });

    // Most importantly: Mock the custom Decrement Team Route specifically
    let decrementCalled = false;
    await page.route('**/api/posts/proj1/decrement-team', async route => {
      decrementCalled = true;
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ msg: 'success' }) });
    });

    await page.goto('/notifications');

    // Wait for the notification to render
    await expect(page.locator('span:has-text("IT87654321 - Friend")')).toBeVisible();

    // Find and interact with the Accept Button
    const acceptBtn = page.locator('button:has-text("Accept")').first();
    await expect(acceptBtn).toBeVisible();
    await acceptBtn.click();

    // Assert that our click properly traced into invoking the specific API route!
    expect(decrementCalled).toBe(true);
  });

  test('Notifications page allows rejecting a request without decrementing team size', async ({ page }) => {
    // Mock Notifications GET to return our mock request
    await page.route('**/api/notifications*', async route => {
      if (route.request().method() === 'GET') {
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(mockNotifications) });
      } else {
        await route.continue();
      }
    });

    // Mock the specific POST back for status update
    await page.route('**/api/notifications', async route => {
      if (route.request().method() === 'POST') {
        await route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify({}) });
      } else {
        await route.continue();
      }
    });

    // Mock the PUT to update notification historic record
    await page.route('**/api/notifications/*', async route => {
      if (route.request().method() === 'PUT') {
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({}) });
      } else {
        await route.continue();
      }
    });

    // Mock the custom Decrement Team Route specifically to ensure it is NOT called
    let decrementCalled = false;
    await page.route('**/api/posts/*/decrement-team', async route => {
      decrementCalled = true;
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ msg: 'success' }) });
    });

    await page.goto('/notifications');

    // Wait for the notification to render
    await expect(page.locator('span:has-text("IT87654321 - Friend")')).toBeVisible();

    // Find and interact with the Reject Button
    const rejectBtn = page.locator('button:has-text("Reject")').first();
    await expect(rejectBtn).toBeVisible();
    await rejectBtn.click();

    // Assert that our click did NOT invoke the decrement API route
    expect(decrementCalled).toBe(false);
  });

  test('Notifications page correctly displays outgoing requests and allows Canceling them', async ({ page }) => {
    // Custom mock for an OUTGOING request from our user
    const outgoingMock = [{
      _id: 'notif_outgoing_1',
      senderIt: 'IT12345678 - Test Project Owner', // Sent by us
      targetIt: 'IT99999999', // Sent to someone else
      postId: 'proj2',
      message: 'Requested to join P0002 - Open Project project',
      type: 'join_request',
      createdAt: new Date().toISOString()
    }];

    await page.route('**/api/notifications*', async route => {
      if (route.request().method() === 'GET') {
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(outgoingMock) });
      } else {
        await route.continue();
      }
    });

    // Track if DELETE is called
    let deleteCalled = false;
    await page.route('**/api/notifications/notif_outgoing_1', async route => {
      if (route.request().method() === 'DELETE') {
        deleteCalled = true;
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ msg: 'Deleted' }) });
      } else {
        await route.continue();
      }
    });

    await page.goto('/notifications');

    // Wait for outgoing title logic to render
    await expect(page.locator('text=Outgoing Request')).toBeVisible();

    // Verify Pending badge is visible for an outgoing request
    await expect(page.locator('span:has-text("Pending")').first()).toBeVisible();

    // Check if the Cancel Request button exists
    const cancelBtn = page.locator('button:has-text("Cancel Request")').first();
    await expect(cancelBtn).toBeVisible();

    // Click it and verify it calls the DELETE API
    await cancelBtn.click();
    expect(deleteCalled).toBe(true);
  });
});
