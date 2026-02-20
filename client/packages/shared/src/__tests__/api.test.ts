import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ApiClient, formatMoney } from '../api.js';
import type { Recommendation } from '../entities.js';

// Mock global fetch
const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

function mockResponse(data: unknown, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(data),
  };
}

function mock204() {
  return { ok: true, status: 204, json: () => Promise.resolve({}) };
}

describe('ApiClient', () => {
  let api: ApiClient;

  beforeEach(() => {
    vi.clearAllMocks();
    api = new ApiClient('http://localhost:8090');
    api.setToken('test-token');
    api.setHouseholdId('household-1');
  });

  // ── Auth ──────────────────────────────────────────────────

  describe('loginWithGoogle', () => {
    it('sends POST with id_token and access_token', async () => {
      const authResponse = { token: 'jwt', user: { id: 'u1' }, household_id: 'h1' };
      mockFetch.mockResolvedValueOnce(mockResponse(authResponse));

      const result = await api.loginWithGoogle('id-tok', 'access-tok', 'invite-code');

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8090/auth/google',
        expect.objectContaining({ method: 'POST' }),
      );
      const body = JSON.parse(
        (mockFetch.mock.calls[0]![1] as RequestInit).body as string,
      );
      expect(body).toEqual({
        id_token: 'id-tok',
        access_token: 'access-tok',
        invite_code: 'invite-code',
      });
      expect(result).toEqual(authResponse);
    });
  });

  // ── Categories ────────────────────────────────────────────

  describe('categories', () => {
    it('getCategories calls GET', async () => {
      mockFetch.mockResolvedValueOnce(mockResponse([{ id: 'c1', name: 'Food' }]));
      const result = await api.getCategories();
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8090/households/household-1/categories',
        expect.anything(),
      );
      expect(result).toEqual([{ id: 'c1', name: 'Food' }]);
    });

    it('createCategory calls POST', async () => {
      mockFetch.mockResolvedValueOnce(mockResponse({ id: 'c2', name: 'Transport' }));
      await api.createCategory({ name: 'Transport', monthly_budget: 100 });
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8090/households/household-1/categories',
        expect.objectContaining({ method: 'POST' }),
      );
    });

    it('updateCategory calls PUT with id', async () => {
      mockFetch.mockResolvedValueOnce(mockResponse({ id: 'c1', name: 'Updated' }));
      await api.updateCategory('c1', { name: 'Updated' });
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8090/households/household-1/categories/c1',
        expect.objectContaining({ method: 'PUT' }),
      );
    });

    it('deleteCategory calls DELETE with id', async () => {
      mockFetch.mockResolvedValueOnce(mock204());
      await api.deleteCategory('c1');
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8090/households/household-1/categories/c1',
        expect.objectContaining({ method: 'DELETE' }),
      );
    });
  });

  // ── Accounts ──────────────────────────────────────────────

  describe('accounts', () => {
    it('getAccounts calls GET', async () => {
      mockFetch.mockResolvedValueOnce(mockResponse([{ id: 'a1' }]));
      const result = await api.getAccounts();
      expect(result).toEqual([{ id: 'a1' }]);
    });

    it('createAccount calls POST', async () => {
      mockFetch.mockResolvedValueOnce(mockResponse({ id: 'a2' }));
      await api.createAccount({ name: 'Cash', type: 'cash' });
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8090/households/household-1/accounts',
        expect.objectContaining({ method: 'POST' }),
      );
    });

    it('updateAccount calls PUT', async () => {
      mockFetch.mockResolvedValueOnce(mockResponse({ id: 'a1' }));
      await api.updateAccount('a1', { name: 'Updated' });
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8090/households/household-1/accounts/a1',
        expect.objectContaining({ method: 'PUT' }),
      );
    });

    it('deleteAccount calls DELETE', async () => {
      mockFetch.mockResolvedValueOnce(mock204());
      await api.deleteAccount('a1');
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8090/households/household-1/accounts/a1',
        expect.objectContaining({ method: 'DELETE' }),
      );
    });
  });

  // ── Transactions ──────────────────────────────────────────

  describe('transactions', () => {
    it('getTransactions without month calls GET without query', async () => {
      mockFetch.mockResolvedValueOnce(mockResponse([]));
      await api.getTransactions();
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8090/households/household-1/transactions',
        expect.anything(),
      );
    });

    it('getTransactions with month appends query param', async () => {
      mockFetch.mockResolvedValueOnce(mockResponse([]));
      await api.getTransactions('2026-02');
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8090/households/household-1/transactions?month=2026-02',
        expect.anything(),
      );
    });

    it('createTransaction calls POST', async () => {
      mockFetch.mockResolvedValueOnce(mockResponse({ id: 't1' }));
      await api.createTransaction({ amount: -50, note: 'test' });
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8090/households/household-1/transactions',
        expect.objectContaining({ method: 'POST' }),
      );
    });

    it('updateTransaction calls PUT', async () => {
      mockFetch.mockResolvedValueOnce(mockResponse({ id: 't1' }));
      await api.updateTransaction('t1', { amount: -75 });
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8090/households/household-1/transactions/t1',
        expect.objectContaining({ method: 'PUT' }),
      );
    });

    it('deleteTransaction calls DELETE', async () => {
      mockFetch.mockResolvedValueOnce(mock204());
      await api.deleteTransaction('t1');
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8090/households/household-1/transactions/t1',
        expect.objectContaining({ method: 'DELETE' }),
      );
    });
  });

  // ── Summary ───────────────────────────────────────────────

  describe('summary', () => {
    it('getSummary calls GET with month', async () => {
      const summary = { month: '2026-02', total_budget: 1000, total_spent: 500, categories: [] };
      mockFetch.mockResolvedValueOnce(mockResponse(summary));
      const result = await api.getSummary('2026-02');
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8090/households/household-1/summary/2026-02',
        expect.anything(),
      );
      expect(result).toEqual(summary);
    });
  });

  // ── Recommendations ───────────────────────────────────────

  describe('recommendations', () => {
    it('getRecommendations calls GET', async () => {
      mockFetch.mockResolvedValueOnce(mockResponse({ suggestions: [{ category_id: 'c1', category: 'Food', action: 'reduce', amount: 50 }] }));
      const result = await api.getRecommendations();
      expect(result).toEqual([{ category_id: 'c1', category: 'Food', action: 'reduce', amount: 50 }]);
    });

    it('applyRecommendations calls POST with recommendations', async () => {
      mockFetch.mockResolvedValueOnce(mock204());
      const recs: Recommendation[] = [{ category_id: 'c1', category: 'Food', action: 'reduce', amount: 50 }];
      await api.applyRecommendations(recs);
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8090/households/household-1/recommendations/apply',
        expect.objectContaining({ method: 'POST' }),
      );
    });
  });

  // ── Members ───────────────────────────────────────────────

  describe('members', () => {
    it('getMembers calls GET', async () => {
      mockFetch.mockResolvedValueOnce(mockResponse([{ id: 'm1', name: 'Alex' }]));
      const result = await api.getMembers();
      expect(result).toEqual([{ id: 'm1', name: 'Alex' }]);
    });

    it('removeMember calls DELETE with id', async () => {
      mockFetch.mockResolvedValueOnce(mock204());
      await api.removeMember('m1');
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8090/households/household-1/members/m1',
        expect.objectContaining({ method: 'DELETE' }),
      );
    });
  });

  // ── Invitations ───────────────────────────────────────────

  describe('invitations', () => {
    it('createInvitation calls POST with email', async () => {
      mockFetch.mockResolvedValueOnce(mockResponse({ id: 'i1', code: 'abc123' }));
      const result = await api.createInvitation('test@example.com');
      const body = JSON.parse((mockFetch.mock.calls[0]![1] as RequestInit).body as string);
      expect(body).toEqual({ email: 'test@example.com' });
      expect(result.code).toBe('abc123');
    });
  });

  // ── Suggested Notes ───────────────────────────────────────

  describe('suggestedNotes', () => {
    it('getSuggestedNotes calls GET with category_id', async () => {
      mockFetch.mockResolvedValueOnce(mockResponse(['Almuerzo', 'Cena']));
      const result = await api.getSuggestedNotes('c1');
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8090/households/household-1/categories/c1/suggested-notes',
        expect.anything(),
      );
      expect(result).toEqual(['Almuerzo', 'Cena']);
    });
  });

  // ── Server Version ────────────────────────────────────────

  describe('serverVersion', () => {
    it('getServerVersion calls GET /version', async () => {
      mockFetch.mockResolvedValueOnce(mockResponse({ version: '1.2.3' }));
      const result = await api.getServerVersion();
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8090/version',
        expect.anything(),
      );
      expect(result).toBe('1.2.3');
    });
  });

  // ── Category Helpers ─────────────────────────────────────

  describe('category helpers', () => {
    it('createExpense calls POST with type expense', async () => {
      mockFetch.mockResolvedValueOnce(mockResponse({ id: 't1' }));
      await api.createExpense({
        amount: -50,
        category_id: 'c1',
        account_id: 'a1',
        note: 'test',
      });
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8090/households/household-1/transactions',
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('"type":"expense"'),
        }),
      );
    });

    it('getCategoryHistory calls getTransactions with category_id', async () => {
      mockFetch.mockResolvedValueOnce(mockResponse([{ id: 't1', note: 'test' }]));
      const result = await api.getCategoryHistory('c1');
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8090/households/household-1/transactions?category_id=c1',
        expect.anything(),
      );
      expect(result).toEqual([{ id: 't1', note: 'test' }]);
    });

    it('getCategoryBalance returns remaining for category in summary', async () => {
      const summary = {
        month: '2026-02',
        categories: [{ id: 'c1', remaining: 100 }, { id: 'c2', remaining: 50 }]
      };
      mockFetch.mockResolvedValueOnce(mockResponse(summary));
      const result = await api.getCategoryBalance('c1', '2026-02');
      expect(result).toBe(100);
    });

    it('getCategoryBalance returns 0 if category not found', async () => {
      const summary = {
        month: '2026-02',
        categories: [{ id: 'c2', remaining: 50 }]
      };
      mockFetch.mockResolvedValueOnce(mockResponse(summary));
      const result = await api.getCategoryBalance('c1', '2026-02');
      expect(result).toBe(0);
    });
  });

  // ── Error Handling ────────────────────────────────────────

  describe('error handling', () => {
    it('throws on non-ok response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: () => Promise.resolve({ error: 'Not found' }),
      });
      await expect(api.getCategories()).rejects.toThrow('Not found');
    });

    it('throws when household ID not set', async () => {
      const freshApi = new ApiClient('http://localhost:8090');
      freshApi.setToken('tok');
      await expect(freshApi.getCategories()).rejects.toThrow('Household ID not set');
    });

    it('sets Authorization header when token is present', async () => {
      mockFetch.mockResolvedValueOnce(mockResponse([]));
      await api.getCategories();
      const headers = mockFetch.mock.calls[0]![1].headers as Headers;
      expect(headers.get('Authorization')).toBe('Bearer test-token');
    });
  });
});

// ── formatMoney ───────────────────────────────────────────

describe('formatMoney', () => {
  it('formats with 2 decimal places using USD currency', () => {
    const result = formatMoney(1234.5);
    // Result depends on locale, but should contain the amount
    expect(result).toContain('1');
    expect(result).toContain('234');
    expect(result).toContain('50');
  });

  it('formats zero correctly', () => {
    const result = formatMoney(0);
    expect(result).toContain('0');
  });
});
