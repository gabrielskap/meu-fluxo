import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { BusinessFilterBar } from './BusinessFilter';
import { BusinessFilter } from '@/lib/types';

interface Props {
  totalIncome: number;
  totalExpense: number;
  profit: number;
  monthlyData: { name: string; receitas: number; gastos: number }[];
  expensesByCategory: { name: string; value: number }[];
  highExpenseAlert: boolean;
  businessFilter: BusinessFilter;
  setBusinessFilter: (f: BusinessFilter) => void;
}

const PIE_COLORS = [
  'hsl(168, 60%, 38%)',
  'hsl(200, 60%, 50%)',
  'hsl(38, 92%, 50%)',
  'hsl(280, 50%, 55%)',
  'hsl(0, 72%, 51%)',
  'hsl(120, 40%, 45%)',
];

function formatCurrency(v: number) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function Dashboard(props: Props) {
  const { totalIncome, totalExpense, profit, monthlyData, expensesByCategory, highExpenseAlert, businessFilter, setBusinessFilter } = props;

  return (
    <div className="space-y-4 pb-20">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Controle Financeiro</h1>
      </div>

      <BusinessFilterBar value={businessFilter} onChange={setBusinessFilter} />

      {highExpenseAlert && (
        <Card className="border-warning bg-warning-light">
          <CardContent className="flex items-center gap-3 p-4">
            <AlertTriangle className="h-6 w-6 text-warning shrink-0" />
            <p className="text-sm font-medium text-foreground">
              ⚠️ Atenção! Seus gastos estão acima de 80% das receitas este mês.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="h-12 w-12 rounded-full bg-income-light flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-income" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Receitas do mês</p>
              <p className="text-xl font-bold text-income">{formatCurrency(totalIncome)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="h-12 w-12 rounded-full bg-expense-light flex items-center justify-center">
              <TrendingDown className="h-6 w-6 text-expense" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Gastos do mês</p>
              <p className="text-xl font-bold text-expense">{formatCurrency(totalExpense)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className={`h-12 w-12 rounded-full flex items-center justify-center ${profit >= 0 ? 'bg-income-light' : 'bg-expense-light'}`}>
              <DollarSign className={`h-6 w-6 ${profit >= 0 ? 'text-income' : 'text-expense'}`} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Lucro do mês</p>
              <p className={`text-xl font-bold ${profit >= 0 ? 'text-income' : 'text-expense'}`}>
                {formatCurrency(profit)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <h3 className="text-sm font-semibold mb-3 text-muted-foreground">Receitas vs Gastos (6 meses)</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 11 }} width={50} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: number) => formatCurrency(v)} />
                <Bar dataKey="receitas" fill="hsl(145, 63%, 42%)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="gastos" fill="hsl(0, 72%, 51%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {expensesByCategory.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <h3 className="text-sm font-semibold mb-3 text-muted-foreground">Gastos por Categoria</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expensesByCategory}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                    fontSize={10}
                  >
                    {expensesByCategory.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: number) => formatCurrency(v)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
