import { create } from 'zustand';
import { Expense } from '../types';

interface ExpenseState {
  expenses: Expense[];
  setExpenses: (expenses: Expense[]) => void;
  addExpense: (expense: Expense) => void;
  updateExpense: (expense: Expense) => void;
  removeExpense: (expenseId: number) => void;
}

export const useExpenseStore = create<ExpenseState>((set, get) => ({
  expenses: [],
  setExpenses: (expenses) => set({ expenses }),
  addExpense: (expense) => set((state) => ({ expenses: [...state.expenses, expense] })),
  updateExpense: (expense) => set((state) => ({
    expenses: state.expenses.map((e) => (e.id === expense.id ? expense : e)),
  })),
  removeExpense: (expenseId) => set((state) => ({
    expenses: state.expenses.filter((e) => e.id !== expenseId),
  })),
}));
