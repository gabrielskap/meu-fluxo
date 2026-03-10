import { Transaction, BUSINESS_LABELS } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Pencil, Trash2 } from 'lucide-react';
import { BusinessFilterBar } from './BusinessFilter';
import { BusinessFilter } from '@/lib/types';

interface Props {
  transactions: Transaction[];
  onEdit: (t: Transaction) => void;
  onDelete: (id: string) => void;
  businessFilter: BusinessFilter;
  setBusinessFilter: (f: BusinessFilter) => void;
}

function formatCurrency(v: number) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatDate(d: string) {
  return new Date(d + 'T12:00:00').toLocaleDateString('pt-BR');
}

export function TransactionHistory({ transactions, onEdit, onDelete, businessFilter, setBusinessFilter }: Props) {
  const sorted = [...transactions].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="space-y-4 pb-20">
      <h1 className="text-xl font-bold">Histórico</h1>

      <BusinessFilterBar value={businessFilter} onChange={setBusinessFilter} />

      {sorted.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            Nenhum registro encontrado.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {sorted.map(t => (
            <Card key={t.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${
                        t.type === 'receita'
                          ? 'bg-income-light text-income'
                          : 'bg-expense-light text-expense'
                      }`}>
                        {t.type === 'receita' ? 'Receita' : 'Gasto'}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {t.business === 'salao' ? '💇' : '👗'} {BUSINESS_LABELS[t.business]}
                      </span>
                    </div>
                    <p className="font-medium truncate">{t.description}</p>
                    <p className="text-xs text-muted-foreground">{t.category} • {formatDate(t.date)}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={`text-lg font-bold ${t.type === 'receita' ? 'text-income' : 'text-expense'}`}>
                      {t.type === 'receita' ? '+' : '-'}{formatCurrency(t.amount)}
                    </p>
                    <div className="flex gap-1 mt-1 justify-end">
                      <button
                        onClick={() => onEdit(t)}
                        className="p-2 rounded-lg hover:bg-secondary transition-colors"
                      >
                        <Pencil className="h-4 w-4 text-muted-foreground" />
                      </button>
                      <button
                        onClick={() => onDelete(t.id)}
                        className="p-2 rounded-lg hover:bg-expense-light transition-colors"
                      >
                        <Trash2 className="h-4 w-4 text-expense" />
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
