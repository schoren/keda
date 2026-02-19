import { Account, Category, Household, Invitation, MemberInfo, Recommendation, Transaction, User } from './entities';

export interface AuthResponse {
  token: string;
  user: User;
  household_id: string;
}

export interface MonthlySummary {
  month: string;
  total_budget: number;
  total_spent: number;
  categories: {
    id: string;
    name: string;
    budget: number;
    spent: number;
    remaining: number;
  }[];
}

export class ApiClient {
  private baseUrl: string;
  private token: string | null = null;
  private householdId: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  }

  setToken(token: string) {
    this.token = token;
  }

  setHouseholdId(id: string) {
    this.householdId = id;
  }

  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${path.startsWith('/') ? path : `/${path}`}`;

    const headers = new Headers(options.headers);
    if (this.token) {
      headers.set('Authorization', `Bearer ${this.token}`);
    }
    if (!headers.has('Content-Type') && options.body) {
      headers.set('Content-Type', 'application/json');
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || `HTTP Error: ${response.status}`);
    }

    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }

  // Auth
  async loginWithGoogle(idToken?: string, accessToken?: string, inviteCode?: string): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ id_token: idToken, access_token: accessToken, invite_code: inviteCode }),
    });
  }

  // Households
  private get householdPath() {
    if (!this.householdId) throw new Error('Household ID not set');
    return `/households/${this.householdId}`;
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return this.request<Category[]>(`${this.householdPath}/categories`);
  }

  async createCategory(category: Partial<Category>): Promise<Category> {
    return this.request<Category>(`${this.householdPath}/categories`, {
      method: 'POST',
      body: JSON.stringify(category),
    });
  }

  async updateCategory(id: string, category: Partial<Category>): Promise<Category> {
    return this.request<Category>(`${this.householdPath}/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(category),
    });
  }

  async deleteCategory(id: string): Promise<void> {
    await this.request<void>(`${this.householdPath}/categories/${id}`, {
      method: 'DELETE',
    });
  }

  // Accounts
  async getAccounts(): Promise<Account[]> {
    return this.request<Account[]>(`${this.householdPath}/accounts`);
  }

  async createAccount(account: Partial<Account>): Promise<Account> {
    return this.request<Account>(`${this.householdPath}/accounts`, {
      method: 'POST',
      body: JSON.stringify(account),
    });
  }

  async updateAccount(id: string, account: Partial<Account>): Promise<Account> {
    return this.request<Account>(`${this.householdPath}/accounts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(account),
    });
  }

  async deleteAccount(id: string): Promise<void> {
    await this.request<void>(`${this.householdPath}/accounts/${id}`, {
      method: 'DELETE',
    });
  }

  // Transactions
  async getTransactions(options?: { month?: string; categoryId?: string } | string): Promise<Transaction[]> {
    let month: string | undefined;
    let categoryId: string | undefined;

    if (typeof options === 'string') {
      month = options;
    } else if (options) {
      month = options.month;
      categoryId = options.categoryId;
    }

    const params = new URLSearchParams();
    if (month) params.append('month', month);
    if (categoryId) params.append('category_id', categoryId);

    const queryString = params.toString();
    const path = `${this.householdPath}/transactions${queryString ? `?${queryString}` : ''}`;
    return this.request<Transaction[]>(path);
  }

  async createTransaction(transaction: Partial<Transaction>): Promise<Transaction> {
    return this.request<Transaction>(`${this.householdPath}/transactions`, {
      method: 'POST',
      body: JSON.stringify(transaction),
    });
  }

  async updateTransaction(id: string, transaction: Partial<Transaction>): Promise<Transaction> {
    return this.request<Transaction>(`${this.householdPath}/transactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(transaction),
    });
  }

  async deleteTransaction(id: string): Promise<void> {
    await this.request<void>(`${this.householdPath}/transactions/${id}`, {
      method: 'DELETE',
    });
  }

  // Summary
  async getSummary(month: string): Promise<MonthlySummary> {
    return this.request<MonthlySummary>(`${this.householdPath}/summary/${month}`);
  }

  // Recommendations
  async getRecommendations(): Promise<Recommendation[]> {
    const data = await this.request<{ suggestions: Recommendation[] }>(`${this.householdPath}/recommendations`);
    return data.suggestions;
  }

  async applyRecommendations(recommendations: Recommendation[]): Promise<void> {
    await this.request<void>(`${this.householdPath}/recommendations/apply`, {
      method: 'POST',
      body: JSON.stringify({ recommendations }),
    });
  }

  // Members
  async getMembers(): Promise<MemberInfo[]> {
    return this.request<MemberInfo[]>(`${this.householdPath}/members`);
  }

  async removeMember(memberId: string): Promise<void> {
    await this.request<void>(`${this.householdPath}/members/${memberId}`, {
      method: 'DELETE',
    });
  }

  // Invitations
  async createInvitation(email: string): Promise<Invitation> {
    return this.request<Invitation>(`${this.householdPath}/invitations`, {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  // Suggested Notes
  async getSuggestedNotes(categoryId: string): Promise<string[]> {
    return this.request<string[]>(`${this.householdPath}/transactions/suggestions?category_id=${categoryId}`);
  }

  // Server Version
  async getServerVersion(): Promise<string> {
    const data = await this.request<{ version: string }>('/version');
    return data.version;
  }
}

// Utility: format money with locale
export function formatMoney(amount: number, locale: string = 'es'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

