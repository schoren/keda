import { test, expect } from '@playwright/test';

test('Record Demo Video', async ({ page }) => {
  // Click Visualizer: Show a ripple effect on every click
  await page.addInitScript(() => {
    window.addEventListener('click', (e) => {
      const circle = document.createElement('div');
      circle.style.position = 'fixed';
      circle.style.width = '30px';
      circle.style.height = '30px';
      circle.style.borderRadius = '50%';
      circle.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';
      circle.style.border = '2px solid white';
      circle.style.left = `${e.clientX - 15}px`;
      circle.style.top = `${e.clientY - 15}px`;
      circle.style.pointerEvents = 'none';
      circle.style.zIndex = '999999';
      circle.style.transition = 'all 0.4s ease-out';
      document.body.appendChild(circle);
      setTimeout(() => {
        circle.style.transform = 'scale(2)';
        circle.style.opacity = '0';
      }, 0);
      setTimeout(() => circle.remove(), 400);
    }, true);
  });

  page.on('console', msg => console.log(`[Browser Console] ${msg.text()}`));

  await page.goto('/');
  // Wait for Flutter to be ready
  await page.locator('flt-glass-pane').waitFor({ state: 'attached' });
  await page.waitForTimeout(2000); // Wait for initial load

  // 1. Dashboard Overview
  console.log('Step 1: Dashboard Overview');
  await expect(page.getByRole('button', { name: /Budget|Spent/i })).toBeVisible();
  await page.waitForTimeout(1000);

  // 2. Add New Expense
  console.log('Step 2: Add New Expense');
  await page.getByRole('group', { name: /Supermarket/i }).click();

  // New Expense Screen
  await expect(page.getByRole('textbox', { name: 'Amount' })).toBeVisible();
  await page.getByRole('textbox', { name: 'Amount' }).fill('100');
  await page.getByRole('textbox', { name: 'Note (optional)' }).fill('Weekly grocery shopping');

  await page.waitForTimeout(500);
  await page.getByRole('button', { name: 'Save Expense' }).click();

  // 3. Verification & Category Details
  console.log('Step 3: Verification & Details');
  await expect(page.getByRole('group', { name: /Supermarket \$342\.20/i })).toBeVisible();
  await page.waitForTimeout(1000);

  // Navigate to category details via the menu
  const supermarketCard = page.getByRole('group', { name: /Supermarket/i });
  await supermarketCard.getByRole('button').click();
  await page.getByRole('menuitem', { name: 'View Detail' }).click();

  // Wait for Detail screen header
  await expect(page.getByRole('heading', { name: 'Supermarket' })).toBeVisible();
  await page.waitForTimeout(2000); // Show history details

  // 4. Home Navigation & Summary Listing
  console.log('Step 4: Home Navigation & Summary Listing');

  // Go back to Home using the Back button
  await page.getByRole('button', { name: 'Back' }).click();
  await expect(page.getByRole('button', { name: /Budget|Spent/i })).toBeVisible();
  await page.waitForTimeout(1000);

  // Click on the summary card to see all expenses
  await page.getByRole('button', { name: /Budget|Spent/i }).click();

  // Verify redirected to "All Expenses"
  await expect(page.getByRole('heading', { name: 'All Expenses' })).toBeVisible();
  await page.waitForTimeout(2000); // Final view
});
