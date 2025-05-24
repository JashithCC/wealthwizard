// Finance-related types

export type TransactionType = 'income' | 'expense' | 'transfer' | 'investment';

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  type: TransactionType;
  merchant?: string;
  roundUp?: number; // Amount rounded up for investment
}

export interface Account {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'investment' | 'credit';
  balance: number;
  currency: string;
  lastFour?: string; // Last 4 digits for cards
  institution?: string;
}

export interface Budget {
  id: string;
  category: string;
  allocated: number;
  spent: number;
  period: 'daily' | 'weekly' | 'monthly';
  color?: string;
}

export interface Investment {
  id: string;
  name: string;
  value: number;
  initialValue: number;
  growth: number; // Percentage
  type: 'stock' | 'etf' | 'crypto' | 'roundups';
  lastUpdated: string;
}

export interface FinancialInsight {
  id: string;
  title: string;
  description: string;
  type: 'tip' | 'alert' | 'achievement';
  priority: 'low' | 'medium' | 'high';
  date: string;
  read: boolean;
}

export interface BalanceForecast {
  date: string;
  balance: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  financialGoals?: string[];
  riskTolerance?: 'low' | 'medium' | 'high';
}