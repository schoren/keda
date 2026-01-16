import { test, expect } from '@playwright/test';

test('Record Demo Video', async ({ page }) => {
  // Helpers for visual effects
  const highlight = async (locator: any) => {
    await locator.evaluate((el: HTMLElement) => {
      const rect = el.getBoundingClientRect();
      const highlight = document.createElement('div');
      highlight.id = 'demo-highlight';
      highlight.style.position = 'fixed';
      highlight.style.left = `${rect.left - 4}px`;
      highlight.style.top = `${rect.top - 4}px`;
      highlight.style.width = `${rect.width + 8}px`;
      highlight.style.height = `${rect.height + 8}px`;
      highlight.style.border = '4px solid #FACC15'; // Yellow highlight
      highlight.style.borderRadius = '8px';
      highlight.style.backgroundColor = 'rgba(250, 204, 21, 0.1)';
      highlight.style.zIndex = '999999';
      highlight.style.pointerEvents = 'none';
      // Cinematic Spotlight: Darken everything else
      highlight.style.boxShadow = '0 0 0 9999px rgba(0, 0, 0, 0.6)';
      document.body.appendChild(highlight);
    });
    await page.waitForTimeout(2000); // Give user time to see the target in the spotlight
    await page.evaluate(() => document.getElementById('demo-highlight')?.remove());
  };

  // Click Visualizer: Show a ripple effect on every click
  await page.addInitScript(() => {
    window.addEventListener('click', (e) => {
      const circle = document.createElement('div');
      circle.style.position = 'fixed';
      circle.style.width = '40px';
      circle.style.height = '40px';
      circle.style.borderRadius = '50%';
      circle.style.backgroundColor = 'rgba(250, 204, 21, 0.4)';
      circle.style.border = '2px solid white';
      circle.style.left = `${e.clientX - 20}px`;
      circle.style.top = `${e.clientY - 20}px`;
      circle.style.pointerEvents = 'none';
      circle.style.zIndex = '999999';
      circle.style.transition = 'all 0.5s ease-out';
      document.body.appendChild(circle);
      setTimeout(() => {
        circle.style.transform = 'scale(2.5)';
        circle.style.opacity = '0';
      }, 0);
      setTimeout(() => circle.remove(), 500);
    }, true);
  });

  page.on('console', msg => console.log(`[Browser Console] ${msg.text()}`));

  await page.goto('/');
  // Wait for Flutter to be ready
  await page.locator('flt-glass-pane').waitFor({ state: 'attached' });
  await page.waitForTimeout(3000);

  // 1. Dashboard Overview
  console.log('Step 1: Dashboard Overview');
  const summaryCard = page.getByRole('button', { name: /Budget|Spent/i });
  await highlight(summaryCard);
  await page.waitForTimeout(1000);

  // 2. Add New Expense
  console.log('Step 2: Add New Expense');
  const supermarketBtn = page.getByRole('group', { name: /Supermarket/i });
  await highlight(supermarketBtn);
  await supermarketBtn.click();

  // New Expense Screen
  const amountInput = page.getByRole('textbox', { name: 'Amount' });
  await expect(amountInput).toBeVisible();
  await highlight(amountInput);
  await amountInput.pressSequentially('20.50', { delay: 100 });

  const noteInput = page.getByRole('textbox', { name: 'Note (optional)' });
  await highlight(noteInput);
  await noteInput.click();
  await noteInput.pressSequentially('Drive-Thru Burger', { delay: 100 });
  await page.waitForTimeout(500);

  const saveBtn = page.getByRole('button', { name: 'Save Expense' });
  await highlight(saveBtn);
  await saveBtn.click();

  // 3. Verification & Category Details
  console.log('Step 3: Verification & Details');
  const updatedSupermarket = page.getByRole('group', { name: /Supermarket \$421\.70/i });
  await expect(updatedSupermarket).toBeVisible();
  await highlight(updatedSupermarket);

  // Navigate to category details via the menu
  const menuBtn = page.getByRole('group', { name: /Supermarket/i }).getByRole('button');
  await highlight(menuBtn);
  await menuBtn.click();

  const viewDetail = page.getByRole('menuitem', { name: 'View Detail' });
  await highlight(viewDetail);
  await viewDetail.click();

  // Wait for Detail screen header
  await expect(page.getByRole('heading', { name: 'Supermarket' })).toBeVisible();
  await page.waitForTimeout(2000);

  // 4. Home Navigation & Summary Listing
  console.log('Step 4: Home Navigation & Summary Listing');

  // Go back to Home using the Back button
  const backBtn = page.getByRole('button', { name: 'Back' });
  await highlight(backBtn);
  await backBtn.click();

  await expect(page.getByRole('button', { name: /Budget|Spent/i })).toBeVisible();
  await page.waitForTimeout(1000);

  // Click on the summary card to see all expenses
  const mainSummary = page.getByRole('button', { name: /Budget|Spent/i });
  await highlight(mainSummary);
  await mainSummary.click();

  // Verify redirected to "All Expenses"
  await expect(page.getByRole('heading', { name: 'All Expenses' })).toBeVisible();
  await page.waitForTimeout(3000);
});
