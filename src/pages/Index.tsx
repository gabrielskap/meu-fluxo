import { useState } from 'react';
import { BottomNav } from '@/components/BottomNav';
import { Dashboard } from '@/components/Dashboard';
import { TransactionForm } from '@/components/TransactionForm';
import { TransactionHistory } from '@/components/TransactionHistory';
import { Reports } from '@/components/Reports';
import { useTransactions } from '@/hooks/useTransactions';
import { useAuth } from '@/hooks/useAuth';
import { Transaction } from '@/lib/types';
import { toast } from 'sonner';
import { LogOut } from 'lucide-react';

type Tab = 'dashboard' | 'add' | 'history' | 'reports';

const Index = () => {
  const [tab, setTab] = useState<Tab>('dashboard');
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const tx = useTransactions();
  const { signOut } = useAuth();

  const handleEdit = (t: Transaction) => {
    setEditingTx(t);
    setTab('add');
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este registro?')) {
      tx.deleteTransaction(id);
      toast.success('Registro excluído!');
    }
  };

  const handleSave = (t: Transaction) => {
    if (editingTx) {
      tx.updateTransaction(t);
      setEditingTx(null);
    } else {
      tx.addTransaction(t);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-lg mx-auto px-4 pt-4">
        <div className="flex justify-end mb-2">
          <button onClick={signOut} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg">
            <LogOut className="h-4 w-4" />
            Sair
          </button>
        </div>
        {tab === 'dashboard' && (
          <Dashboard
            totalIncome={tx.totalIncome}
            totalExpense={tx.totalExpense}
            profit={tx.profit}
            monthlyData={tx.monthlyData}
            expensesByCategory={tx.expensesByCategory}
            highExpenseAlert={tx.highExpenseAlert}
            businessFilter={tx.businessFilter}
            setBusinessFilter={tx.setBusinessFilter}
          />
        )}
        {tab === 'add' && (
          <TransactionForm
            onSave={handleSave}
            editingTransaction={editingTx}
            onCancelEdit={() => { setEditingTx(null); setTab('history'); }}
          />
        )}
        {tab === 'history' && (
          <TransactionHistory
            transactions={tx.transactions}
            onEdit={handleEdit}
            onDelete={handleDelete}
            businessFilter={tx.businessFilter}
            setBusinessFilter={tx.setBusinessFilter}
          />
        )}
        {tab === 'reports' && (
          <Reports
            transactions={tx.transactions}
            businessFilter={tx.businessFilter}
            setBusinessFilter={tx.setBusinessFilter}
          />
        )}
      </div>
      <BottomNav active={tab} onNavigate={(t) => { setTab(t); if (t !== 'add') setEditingTx(null); }} />
    </div>
  );
};

export default Index;
