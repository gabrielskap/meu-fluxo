import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BusinessFilter as BusinessFilterFilter, BusinessType, InventoryItem, BUSINESS_LABELS } from '@/lib/types';
import { toast } from 'sonner';
import { useInventory } from '@/hooks/useInventory';
import { Package, Plus, Pencil, Trash2 } from 'lucide-react';
import { BusinessFilterBar } from '@/components/BusinessFilter';

interface InventoryProps {
  businessFilter: BusinessFilterFilter;
  setBusinessFilter: (f: BusinessFilterFilter) => void;
}

export function Inventory({ businessFilter, setBusinessFilter }: InventoryProps) {
  const inv = useInventory();
  
  // Set the filter on the hook to match the parent's filter so filtering works properly
  if (inv.businessFilter !== businessFilter) {
    inv.setBusinessFilter(businessFilter);
  }

  const [view, setView] = useState<'list' | 'form'>('list');
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [business, setBusiness] = useState<BusinessType>('salao');

  const openForm = (item?: InventoryItem) => {
    if (item) {
      setEditingItem(item);
      setName(item.name);
      setQuantity(item.quantity.toString());
      setPrice(item.price.toString());
      setBusiness(item.business);
    } else {
      setEditingItem(null);
      setName('');
      setQuantity('');
      setPrice('');
      setBusiness('salao');
    }
    setView('form');
  };

  const closeForm = () => {
    setView('list');
    setEditingItem(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const q = parseInt(quantity);
    const p = parseFloat(price);

    if (!name.trim()) {
      toast.error('Informe um nome para o produto');
      return;
    }
    if (isNaN(q) || q < 0) {
      toast.error('Informe uma quantidade válida');
      return;
    }
    if (isNaN(p) || p < 0) {
      toast.error('Informe um preço válido');
      return;
    }

    const item: InventoryItem = {
      id: editingItem?.id || crypto.randomUUID(),
      name: name.trim(),
      quantity: q,
      price: p,
      business,
    };

    if (editingItem) {
      inv.updateInventoryItem(item);
      toast.success('Produto atualizado!');
    } else {
      inv.addInventoryItem(item);
      toast.success('Produto adicionado ao estoque!');
    }
    closeForm();
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este produto do estoque?')) {
      inv.deleteInventoryItem(id);
      toast.success('Produto excluído!');
    }
  };

  if (view === 'form') {
    return (
      <div className="space-y-4 pb-20 fade-in">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Package className="h-6 w-6" />
          {editingItem ? 'Editar Produto' : 'Novo Produto'}
        </h1>
        <Card>
          <CardContent className="p-4">
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <Label className="text-base cursor-pointer">Nome do Produto</Label>
                <Input
                  placeholder="Ex: Shampoo, Vestido..."
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="h-12 mt-1"
                  maxLength={100}
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <Label className="text-base cursor-pointer">Quantidade</Label>
                  <Input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={quantity}
                    onChange={e => setQuantity(e.target.value)}
                    className="h-12 mt-1"
                  />
                </div>
                <div className="flex-1">
                  <Label className="text-base cursor-pointer">Preço (R$)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0,00"
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                    className="h-12 mt-1"
                  />
                </div>
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

              <Button type="submit" className="w-full h-14 text-base font-semibold mt-4">
                {editingItem ? 'Atualizar Produto' : 'Salvar Produto'}
              </Button>
              <Button type="button" variant="outline" className="w-full h-12" onClick={closeForm}>
                Cancelar
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-20 fade-in">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Package className="h-6 w-6 text-primary" />
          Estoque
        </h1>
        <Button onClick={() => openForm()} size="sm" className="gap-1 rounded-full px-4 h-9 shadow-sm">
          <Plus className="h-4 w-4" /> Novo
        </Button>
      </div>

      <BusinessFilterBar value={businessFilter} onChange={setBusinessFilter} />

      <Card className="bg-gradient-to-br from-indigo-50/50 to-blue-50/50 dark:from-indigo-950/20 dark:to-blue-950/20 border-indigo-100 dark:border-indigo-900 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Valor Total em Estoque</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-foreground">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(inv.totalValue)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {inv.inventory.length} {inv.inventory.length === 1 ? 'produto cadastrado' : 'produtos cadastrados'}
          </p>
        </CardContent>
      </Card>

      <div className="space-y-3 mt-4">
        {inv.inventory.length === 0 ? (
          <div className="text-center py-10 bg-card rounded-2xl border border-border shadow-sm">
            <Package className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground font-medium">Nenhum produto cadastrado.</p>
            <p className="text-sm text-muted-foreground/70 mt-1">Adicione produtos para controlar seu estoque.</p>
          </div>
        ) : (
          inv.inventory.map(item => (
            <Card key={item.id} className="overflow-hidden shadow-sm hover:shadow transition-shadow border-muted/60">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-lg leading-tight">{item.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                        item.business === 'salao' 
                          ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                          : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      }`}>
                        {BUSINESS_LABELS[item.business]}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-1 bg-secondary/50 p-1 rounded-lg">
                    <button
                      onClick={() => openForm(item)}
                      className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-md transition-colors dark:text-blue-400 dark:hover:bg-blue-900/40"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 text-red-600 hover:bg-red-100 rounded-md transition-colors dark:text-red-400 dark:hover:bg-red-900/40"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-4 pt-3 border-t border-border/50">
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground mb-0.5">Quantidade</span>
                    <span className={`font-semibold text-base ${item.quantity <= 2 ? 'text-red-600 dark:text-red-400' : ''}`}>
                      {item.quantity} un.
                    </span>
                  </div>
                  <div className="flex flex-col text-right">
                    <span className="text-xs text-muted-foreground mb-0.5">Preço un.</span>
                    <span className="font-semibold text-base">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
