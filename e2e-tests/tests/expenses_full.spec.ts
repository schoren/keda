import { test, expect } from '@playwright/test';

const API_URL = process.env.API_URL || 'http://localhost:8090';

test.describe('Expenses Creator Info E2E', () => {
  test('Transaction response includes preloaded creator info', async ({ request }) => {
    // 1. Login
    const loginResponse = await request.post(`${API_URL}/auth/test-login`, {
      data: {
        email: 'creator@example.com',
        name: 'Creator User',
      },
    });
    expect(loginResponse.ok()).toBeTruthy();
    const loginData = await loginResponse.json();
    const { token, household_id } = loginData;

    // 2. Create category
    const catResponse = await request.post(`${API_URL}/households/${household_id}/categories`, {
      headers: { 'Authorization': `Bearer ${token}` },
      data: { name: 'Food', monthly_budget: 100 },
    });
    const cat = await catResponse.json();

    // 3. Create account
    const accResponse = await request.post(`${API_URL}/households/${household_id}/accounts`, {
      headers: { 'Authorization': `Bearer ${token}` },
      data: { name: 'Cash', type: 'cash' },
    });
    const acc = await accResponse.json();

    // 4. Create transaction
    const txResponse = await request.post(`${API_URL}/households/${household_id}/transactions`, {
      headers: { 'Authorization': `Bearer ${token}` },
      data: {
        category_id: cat.id,
        account_id: acc.id,
        amount: 25.0,
        date: new Date().toISOString(),
        note: 'E2E Note',
      },
    });
    expect(txResponse.ok()).toBeTruthy();

    // 5. Get transactions and verify creator info
    const getTxResponse = await request.get(`${API_URL}/households/${household_id}/transactions`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    expect(getTxResponse.ok()).toBeTruthy();
    const transactions = await getTxResponse.json();

    expect(transactions.length).toBeGreaterThan(0);
    const tx = transactions.find((t: any) => t.note === 'E2E Note');
    expect(tx).toBeTruthy();
    expect(tx.user).toBeTruthy();
    expect(tx.user.name).toBe('Creator User');
    expect(tx.user_id).toBe(loginData.user.id);
  });
});
