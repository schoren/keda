export interface Household {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
}

export interface User {
  id: string;
  created_at: string;
  updated_at: string;
  email: string;
  google_id: string;
  name: string;
  picture_url: string;
  color: string;
  household_id: string;
}

export interface Account {
  id: string;
  created_at: string;
  updated_at: string;
  type: string;
  name: string;
  brand?: string;
  bank?: string;
  display_name: string;
  household_id: string;
}

export interface Category {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  icon: string;
  monthly_budget: number;
  is_active: boolean;
  household_id: string;
}

export interface Transaction {
  id: string;
  created_at: string;
  updated_at: string;
  account_id: string;
  category_id: string;
  user_id: string;
  user?: User;
  amount: number;
  date: string;
  note: string;
  type: 'expense' | 'income';
  household_id: string;
}

export interface Expense extends Transaction {
  type: 'expense';
}

export interface CreateExpenseRequest {
  amount: number;
  category_id: string;
  account_id: string;
  note?: string;
  date?: string;
}

export interface Invitation {
  id: string;
  created_at: string;
  updated_at: string;
  code: string;
  email: string;
  household_id: string;
  status: 'pending' | 'accepted' | 'expired';
}

export type AccountType = 'cash' | 'card' | 'bank';

export interface Recommendation {
  category_id: string;
  category: string;
  action: string;
  amount: number;
}

export interface MemberInfo {
  id: string;
  name: string;
  email: string;
  picture_url?: string;
  color?: string;
  status: 'active' | 'pending';
  invite_code?: string;
}
