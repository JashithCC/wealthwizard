import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { mockTransactions } from '@/mocks/transactions';
import { mockAccounts } from '@/mocks/accounts';
import { mockBudgets } from '@/mocks/budgets';
import { mockInvestments } from '@/mocks/investments';
import { mockInsights } from '@/mocks/insights';
import { mockForecast } from '@/mocks/forecast';
import { Transaction, Account, Budget, Investment, FinancialInsight, BalanceForecast } from '@/types/finance';

interface FinanceState {
  // Data
  transactions: Transaction[];
  accounts: Account[];
  budgets: Budget[];
  investments: Investment[];
  insights: FinancialInsight[];
  forecast: BalanceForecast[];
  
  // UI state
  selectedAccountId: string | null;
  selectedTimeRange: 'week' | 'month' | 'year';
  
  // Actions
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  
  addAccount: (account: Omit<Account, 'id'>) => void;
  updateAccount: (id: string, updates: Partial<Account>) => void;
  deleteAccount: (id: string) => void;
  
  updateBudget: (id: string, updates: Partial<Budget>) => void;
  
  markInsightAsRead: (id: string) => void;
  
  setSelectedAccountId: (id: string | null) => void;
  setSelectedTimeRange: (range: 'week' | 'month' | 'year') => void;
}

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set) => ({
      // Initial data from mocks
      transactions: mockTransactions,
      accounts: mockAccounts,
      budgets: mockBudgets,
      investments: mockInvestments,
      insights: mockInsights,
      forecast: mockForecast,
      
      // UI state
      selectedAccountId: mockAccounts[0]?.id || null,
      selectedTimeRange: 'month',
      
      // Actions
      addTransaction: (transaction) => set((state) => {
        const newTransaction = {
          ...transaction,
          id: Date.now().toString(),
        };
        
        return { 
          transactions: [newTransaction, ...state.transactions] 
        };
      }),
      
      updateTransaction: (id, updates) => set((state) => ({
        transactions: state.transactions.map(transaction => 
          transaction.id === id ? { ...transaction, ...updates } : transaction
        )
      })),
      
      deleteTransaction: (id) => set((state) => ({
        transactions: state.transactions.filter(transaction => transaction.id !== id)
      })),
      
      addAccount: (account) => set((state) => {
        const newAccount = {
          ...account,
          id: Date.now().toString(),
        };
        
        return { 
          accounts: [...state.accounts, newAccount] 
        };
      }),
      
      updateAccount: (id, updates) => set((state) => ({
        accounts: state.accounts.map(account => 
          account.id === id ? { ...account, ...updates } : account
        )
      })),
      
      deleteAccount: (id) => set((state) => ({
        accounts: state.accounts.filter(account => account.id !== id)
      })),
      
      updateBudget: (id, updates) => set((state) => ({
        budgets: state.budgets.map(budget => 
          budget.id === id ? { ...budget, ...updates } : budget
        )
      })),
      
      markInsightAsRead: (id) => set((state) => ({
        insights: state.insights.map(insight => 
          insight.id === id ? { ...insight, read: true } : insight
        )
      })),
      
      setSelectedAccountId: (id) => set({ selectedAccountId: id }),
      
      setSelectedTimeRange: (range) => set({ selectedTimeRange: range })
    }),
    {
      name: 'finance-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        // Only persist these fields
        selectedAccountId: state.selectedAccountId,
        selectedTimeRange: state.selectedTimeRange,
        insights: state.insights, // To remember which insights were read
      }),
    }
  )
);