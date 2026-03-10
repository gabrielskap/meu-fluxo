import { Card, CardContent } from '@/components/ui/card';
import { Transaction } from '@/lib/types';
import { BusinessFilterBar } from './BusinessFilter';
import { BusinessFilter } from '@/lib/types';
import { useMemo, useState } from 'react';

interface Props {
  transactions: Transaction[];
  businessFilter: BusinessFilter;
  setBusinessFilter: (f: BusinessFilter) => void;
}

function formatCurrency(v: number) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function Reports({ transactions, businessFilter, setBusinessFilter }: Props) {
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());

  const monthTx = useMemo(() => {
    return transactions.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
    });
  }, [transactions, selectedMonth, selectedYear]);

  const income = monthTx.filter(t => t.type === 'receita').reduce((s, t) => s + t.amount, 0);
  const expense = monthTx.filter(t => t.type === 'gasto').reduce((s, t) => s + t.amount, 0);
  const profit = income - expense;

  const topExpenses = useMemo(() => {
    const map: Record<string, number> = {};
    monthTx.filter(t => t.type === 'gasto').forEach(t => {
      map[t.category] = (map[t.category] || 0) + t.amount;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [monthTx]);

  const monthLabel = new Date(selectedYear, selectedMonth).toLocaleString('pt-BR', { month: 'long', year: 'numeric' });

  return (
    <div className="space-y-4 pb-20">
      <h1 className="text-xl font-bold">Relatório Mensal</h1>

      <BusinessFilterBar value={businessFilter} onChange={setBusinessFilter} />

      <div className="flex gap-2 items-center">
        <button
          onClick={() => {
            if (selectedMonth === 0) { setSelectedMonth(11); setSelectedYear(y => y - 1); }
            else setSelectedMonth(m => m - 1);
          }}
          className="px-3 py-2 rounded-lg bg-secondary text-secondary-foreground font-medium"
        >
          ←
        </button>
        <span className="flex-1 text-center font-semibold capitalize">{monthLabel}</span>
        <button
          onClick={() => {
            if (selectedMonth === 11) { setSelectedMonth(0); setSelectedYear(y => y + 1); }
            else setSelectedMonth(m => m + 1);
          }}
          className="px-3 py-2 rounded-lg bg-secondary text-secondary-foreground font-medium"
        >
          →
        </button>
      </div>

      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Total de Receitas</span>
            <span className="font-bold text-income text-lg">{formatCurrency(income)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Total de Despesas</span>
            <span className="font-bold text-expense text-lg">{formatCurrency(expense)}</span>
          </div>
          <hr className="border-border" />
          <div className="flex justify-between items-center">
            <span className="font-semibold">Lucro Final</span>
            <span className={`font-bold text-xl ${profit >= 0 ? 'text-income' : 'text-expense'}`}>
              {formatCurrency(profit)}
            </span>
          </div>
        </CardContent>
      </Card>

      {topExpenses.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">Categorias que mais gastam</h3>
            <div className="space-y-3">
              {topExpenses.map(([cat, val]) => {
                const pct = expense > 0 ? (val / expense) * 100 : 0;
                return (
                  <div key={cat}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">{cat}</span>
                      <span className="text-muted-foreground">{formatCurrency(val)} ({pct.toFixed(0)}%)</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-expense rounded-full transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {monthTx.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            Nenhum registro neste mês.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
