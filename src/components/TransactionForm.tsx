import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Transaction, TransactionType, BusinessType, INCOME_CATEGORIES, EXPENSE_CATEGORIES, BUSINESS_LABELS } from '@/lib/types';
import { toast } from 'sonner';

interface Props {
  onSave: (t: Transaction) => void;
  editingTransaction?: Transaction | null;
  onCancelEdit?: () => void;
}

export function TransactionForm({ onSave, editingTransaction, onCancelEdit }: Props) {
  const [type, setType] = useState<TransactionType>(editingTransaction?.type || 'receita');
  const [amount, setAmount] = useState(editingTransaction?.amount.toString() || '');
  const [date, setDate] = useState(editingTransaction?.date || new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState(editingTransaction?.description || '');
  const [category, setCategory] = useState(editingTransaction?.category || '');
  const [business, setBusiness] = useState<BusinessType>(editingTransaction?.business || 'salao');

  const categories = type === 'receita' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (!parsedAmount || parsedAmount <= 0) {
      toast.error('Informe um valor válido');
      return;
    }
    if (!category) {
      toast.error('Selecione uma categoria');
      return;
    }
    if (!description.trim()) {
      toast.error('Informe uma descrição');
      return;
    }

    onSave({
      id: editingTransaction?.id || crypto.randomUUID(),
      type,
      amount: parsedAmount,
      date,
      description: description.trim(),
      category,
      business,
    });

    toast.success(editingTransaction ? 'Registro atualizado!' : 'Registro salvo!');

    if (!editingTransaction) {
      setAmount('');
      setDescription('');
      setCategory('');
    }
  };

  return (
    <div className="space-y-4 pb-20">
      <h1 className="text-xl font-bold">
        {editingTransaction ? 'Editar Registro' : 'Novo Registro'}
      </h1>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => { setType('receita'); setCategory(''); }}
          className={`flex-1 py-3 rounded-xl text-base font-semibold transition-colors ${
            type === 'receita'
              ? 'bg-income text-income-foreground'
              : 'bg-secondary text-secondary-foreground'
          }`}
        >
          💰 Receita
        </button>
        <button
          type="button"
          onClick={() => { setType('gasto'); setCategory(''); }}
          className={`flex-1 py-3 rounded-xl text-base font-semibold transition-colors ${
            type === 'gasto'
              ? 'bg-expense text-expense-foreground'
              : 'bg-secondary text-secondary-foreground'
          }`}
        >
          💸 Gasto
        </button>
      </div>

      <Card>
        <CardContent className="p-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="text-base">Valor (R$)</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                placeholder="0,00"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="text-lg h-12 mt-1"
              />
            </div>

            <div>
              <Label className="text-base">Data</Label>
              <Input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="h-12 mt-1"
              />
            </div>

            <div>
              <Label className="text-base">Negócio</Label>
              <div className="flex gap-2 mt-1">
                {(['salao', 'loja'] as BusinessType[]).map(b => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setBusiness(b)}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      business === b
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-secondary-foreground'
                    }`}
                  >
                    {b === 'salao' ? '💇 ' : '👗 '}{BUSINESS_LABELS[b]}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-base">Categoria</Label>
              <div className="flex flex-wrap gap-2 mt-1">
                {categories.map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      category === cat
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-secondary-foreground'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-base">Descrição</Label>
              <Input
                placeholder="Ex: Corte de cabelo, Venda de vestido..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="h-12 mt-1"
                maxLength={200}
              />
            </div>

            <Button type="submit" className="w-full h-14 text-base font-semibold">
              {editingTransaction ? 'Atualizar' : 'Salvar Registro'}
            </Button>

            {editingTransaction && onCancelEdit && (
              <Button type="button" variant="outline" className="w-full h-12" onClick={onCancelEdit}>
                Cancelar
              </Button>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
