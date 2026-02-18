import { Account, Category, Household, Transaction, User } from './entities';

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

  // Transactions
  async getTransactions(month?: string): Promise<Transaction[]> {
    const path = `${this.householdPath}/transactions${month ? `?month=${month}` : ''}`;
    return this.request<Transaction[]>(path);
  }

  async createTransaction(transaction: Partial<Transaction>): Promise<Transaction> {
    return this.request<Transaction>(`${this.householdPath}/transactions`, {
      method: 'POST',
      body: JSON.stringify(transaction),
    });
  }

  // Summary
  async getSummary(month: string): Promise<MonthlySummary> {
    return this.request<MonthlySummary>(`${this.householdPath}/summary/${month}`);
  }
}
