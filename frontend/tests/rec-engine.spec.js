import { test, expect } from '@playwright/test';

// Mock data for the user profile
const mockUser = {
  _id: 'user123',
  name: 'Test Student',
  email: 'test@student.com',
  role: 'student',
  studentId: 'S1',
};

// Mock data for the recommendations endpoint
const mockRecommendations = [
  {
    score: 0.85,
    explanation: 'High match based on your MERN stack experience.',
    details: {
      matchedSkills: ['React', 'Node.js', 'MongoDB'],
    },
    project: {
      _id: 'proj1',
      title: 'Full Stack Event Manager',
      description: 'A platform to manage university events.',
      domain: ['Web Development', 'Education'],
      essentialSkills: {
        frontend: ['React', 'Tailwind'],
        backend: ['Node.js', 'MongoDB']
      },
      academicConstraints: {
        specialization: ['SE', 'IT'],
        year: 3,
        semester: 2
      }
    }
  },
  {
    score: 0.60,
    explanation: 'Moderate match due to Python experience.',
    details: {
      matchedSkills: ['Python'],
    },
    project: {
      _id: 'proj2',
      title: 'AI Chatbot',
      description: 'An AI-powered chatbot for student inquiries.',
      domain: ['Artificial Intelligence'],
      essentialSkills: {
        ai: ['Python', 'NLP'],
      },
      academicConstraints: {
        specialization: ['DS', 'SE'],
        year: 3,
        semester: 2
      }
    }
  }
];

test.describe('Recommendation Engine Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    // 1. Mock the /api/profile/me endpoint to authenticate the user
    await page.route('**/api/profile/me', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockUser),
      });
    });

    // 2. Mock the recommendations API
    await page.route('**/api/recommendations/projects/*', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockRecommendations),
      });
    });

    // 3. Navigate to a blank page first to set localStorage
    await page.goto('/');
    
    // Set a dummy token so the app thinks we are logged in
    await page.evaluate(() => {
      localStorage.setItem('token', 'dummy-test-token');
    });
  });

  test('RecProjects page displays the recommendations list', async ({ page }) => {
    // Navigate to the RecProjects page
    await page.goto('/recprojects');

    // Wait for the recommendations to load
    await expect(page.locator('text=Recommendation Summary')).toBeVisible();

    // Check if the summary card shows 2 projects
    await expect(page.locator('text=You have 2 project recommendations.')).toBeVisible();

    // Check if the project cards are rendered
    await expect(page.locator('h3:has-text("Full Stack Event Manager")')).toBeVisible();
    await expect(page.locator('h3:has-text("AI Chatbot")')).toBeVisible();

    // Check if essential skills are rendered
    await expect(page.locator('span:has-text("React")')).toBeVisible();
    await expect(page.locator('span:has-text("Python")')).toBeVisible();

    // Check if domains are rendered
    await expect(page.locator('span:has-text("Web Development")')).toBeVisible();
  });

  test('ProjectRecommendations page displays scores and visual progress', async ({ page }) => {
    // Navigate to the Recommendations page
    await page.goto('/recs');

    // Wait for the project cards to render
    await expect(page.locator('h3:has-text("Full Stack Event Manager")')).toBeVisible();

    // Verify the percentage scores are displayed
    await expect(page.locator('text=85%').first()).toBeVisible();
    await expect(page.locator('text=60%').first()).toBeVisible();

    // Verify the explanations are rendered
    await expect(page.locator('text=High match based on your MERN stack experience.')).toBeVisible();

    // Verify the matched skills tags are rendered
    await expect(page.locator('span:has-text("MongoDB")')).toBeVisible();
  });

  test('Buttons on RecProjects navigate correctly or trigger actions', async ({ page }) => {
    await page.goto('/recprojects');

    // Test the "Find your best match project" button
    const findMatchBtn = page.locator('button:has-text("Find your best match project💡")');
    await expect(findMatchBtn).toBeVisible();
    
    // Test the "Top match candidates for you" button
    const candidatesBtn = page.locator('button:has-text("Top match candidates for you 🏆")');
    await expect(candidatesBtn).toBeVisible();
    
    // Test the "View Project" button on a card
    const viewProjectBtns = page.locator('button:has-text("View Project")');
    await expect(viewProjectBtns.first()).toBeVisible();
  });
});
