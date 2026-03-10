import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Transaction, BusinessFilter } from '@/lib/types';
import { getTransactions, addTransaction as addTx, updateTransaction as updateTx, deleteTransaction as deleteTx } from '@/lib/store';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export function useTransactions() {
  const [businessFilter, setBusinessFilter] = useState<BusinessFilter>('todos');
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['transactions', user?.id],
    queryFn: getTransactions,
    enabled: !!user,
  });

  const addMutation = useMutation({
    mutationFn: addTx,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
    onError: (error) => {
      toast.error('Erro ao adicionar transação: ' + error.message);
    }
  });

  const updateMutation = useMutation({
    mutationFn: updateTx,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
    onError: (error) => {
      toast.error('Erro ao atualizar transação: ' + error.message);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTx,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
    onError: (error) => {
      toast.error('Erro ao remover transação: ' + error.message);
    }
  });

  const addTransaction = (t: Transaction) => addMutation.mutate(t);
  const updateTransaction = (t: Transaction) => updateMutation.mutate(t);
  const deleteTransaction = (id: string) => deleteMutation.mutate(id);

  const filtered = useMemo(() => {
    if (businessFilter === 'todos') return transactions;
    return transactions.filter((t: Transaction) => t.business === businessFilter);
  }, [transactions, businessFilter]);

  const currentMonth = useMemo(() => {
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();
    return filtered.filter((t: Transaction) => {
      const d = new Date(t.date);
      return d.getMonth() === month && d.getFullYear() === year;
    });
  }, [filtered]);

  const totalIncome = useMemo(() => currentMonth.filter((t: Transaction) => t.type === 'receita').reduce((s: number, t: Transaction) => s + t.amount, 0), [currentMonth]);
  const totalExpense = useMemo(() => currentMonth.filter((t: Transaction) => t.type === 'gasto').reduce((s: number, t: Transaction) => s + t.amount, 0), [currentMonth]);
  const profit = totalIncome - totalExpense;

  const expensesByCategory = useMemo(() => {
    const map: Record<string, number> = {};
    currentMonth.filter((t: Transaction) => t.type === 'gasto').forEach((t: Transaction) => {
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
      const monthTx = filtered.filter((t: Transaction) => {
        const td = new Date(t.date);
        return td.getMonth() === month && td.getFullYear() === year;
      });
      months.push({
        name: label,
        receitas: monthTx.filter((t: Transaction) => t.type === 'receita').reduce((s: number, t: Transaction) => s + t.amount, 0),
        gastos: monthTx.filter((t: Transaction) => t.type === 'gasto').reduce((s: number, t: Transaction) => s + t.amount, 0),
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
    isLoading
  };
}
