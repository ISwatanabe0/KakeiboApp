import { useState } from 'react';
import { getAllExpenses, addExpense, deleteExpense } from '../db/db';
import type { Expense } from '../types/expense';

export function useExpenseStore() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);

  // 支出一覧を取得
  const fetchExpenses = async () => {
    setLoading(true);
    const data = await getAllExpenses();
    setExpenses(data);
    setLoading(false);
  };

  // 支出を追加
  const add = async (expense: Omit<Expense, 'id' | 'created_at'>) => {
    await addExpense(expense);
    await fetchExpenses();
  };

  // 支出を削除
  const remove = async (id: number) => {
    await deleteExpense(id);
    await fetchExpenses();
  };

  return {
    expenses,
    loading,
    fetchExpenses,
    add,
    remove,
  };
}
