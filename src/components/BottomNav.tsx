import { LayoutDashboard, PlusCircle, List, FileBarChart, Package } from 'lucide-react';

export type Tab = 'dashboard' | 'add' | 'history' | 'inventory' | 'reports';

interface BottomNavProps {
  active: Tab;
  onNavigate: (tab: Tab) => void;
}

const items: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'dashboard', label: 'Início', icon: LayoutDashboard },
  { id: 'add', label: 'Registrar', icon: PlusCircle },
  { id: 'history', label: 'Histórico', icon: List },
  { id: 'inventory', label: 'Estoque', icon: Package },
  { id: 'reports', label: 'Relatório', icon: FileBarChart },
];

export function BottomNav({ active, onNavigate }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border safe-area-bottom">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {items.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg transition-colors min-w-[64px] ${
              active === id
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon className="h-5 w-5" />
            <span className="text-[10px] font-medium">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
