import { BusinessFilter as FilterType, BUSINESS_LABELS } from '@/lib/types';

interface Props {
  value: FilterType;
  onChange: (v: FilterType) => void;
}

const options: { value: FilterType; label: string }[] = [
  { value: 'todos', label: 'Todos' },
  { value: 'salao', label: BUSINESS_LABELS.salao },
  { value: 'loja', label: BUSINESS_LABELS.loja },
];

export function BusinessFilterBar({ value, onChange }: Props) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {options.map(opt => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
            value === opt.value
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-secondary-foreground hover:bg-accent'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
