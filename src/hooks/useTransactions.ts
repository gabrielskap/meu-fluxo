import { useState, useCallback, useMemo } from 'react';
import { Transaction, BusinessFilter } from '@/lib/types';
import { getTransactions, saveTransactions, addTransaction as addTx, updateTransaction as updateTx, deleteTransaction as deleteTx } from '@/lib/store';

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>(getTransactions);
  const [businessFilter, setBusinessFilter] = useState<BusinessFilter>('todos');

  const refresh = useCallback(() => setTransactions(getTransactions()), []);

  const addTransaction = useCallback((t: Transaction) => {
    addTx(t);
    refresh();
  }, [refresh]);

  const updateTransaction = useCallback((t: Transaction) => {
    updateTx(t);
    refresh();
  }, [refresh]);

  const deleteTransaction = useCallback((id: string) => {
    deleteTx(id);
    refresh();
  }, [refresh]);

  const filtered = useMemo(() => {
    if (businessFilter === 'todos') return transactions;
    return transactions.filter(t => t.business === businessFilter);
  }, [transactions, businessFilter]);

  const currentMonth = useMemo(() => {
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();
    return filtered.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === month && d.getFullYear() === year;
    });
  }, [filtered]);

  const totalIncome = useMemo(() => currentMonth.filter(t => t.type === 'receita').reduce((s, t) => s + t.amount, 0), [currentMonth]);
  const totalExpense = useMemo(() => currentMonth.filter(t => t.type === 'gasto').reduce((s, t) => s + t.amount, 0), [currentMonth]);
  const profit = totalIncome - totalExpense;

  const expensesByCategory = useMemo(() => {
    const map: Record<string, number> = {};
    currentMonth.filter(t => t.type === 'gasto').forEach(t => {
      map[t.category] = (map[t.category] || 0) + t.amount;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [currentMonth]);

  const monthlyData = useMemo(() => {
    const now = new Date();
    const months: { name: string; receitas: number; gastos: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const month = d.getMonth();
      const year = d.getFullYear();
      const label = d.toLocaleString('pt-BR', { month: 'short' });
      const monthTx = filtered.filter(t => {
        const td = new Date(t.date);
        return td.getMonth() === month && td.getFullYear() === year;
      });
      months.push({
        name: label,
        receitas: monthTx.filter(t => t.type === 'receita').reduce((s, t) => s + t.amount, 0),
        gastos: monthTx.filter(t => t.type === 'gasto').reduce((s, t) => s + t.amount, 0),
      });
    }
    return months;
  }, [filtered]);

  const highExpenseAlert = totalExpense > totalIncome * 0.8 && totalIncome > 0;

  return {
    transactions: filtered,
    allTransactions: transactions,
    businessFilter,
    setBusinessFilter,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    totalIncome,
    totalExpense,
    profit,
    expensesByCategory,
    monthlyData,
    highExpenseAlert,
    currentMonth,
  };
}
