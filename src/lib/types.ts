export type BusinessType = 'salao' | 'loja';
export type TransactionType = 'receita' | 'gasto';

export const INCOME_CATEGORIES = [
  'Serviço do salão',
  'Venda de roupas',
  'Outros',
] as const;

export const EXPENSE_CATEGORIES = [
  'Produtos de cabelo',
  'Roupas (compra)',
  'Manutenção de equipamentos',
  'Despesas gerais',
] as const;

export const BUSINESS_LABELS: Record<BusinessType, string> = {
  salao: 'Salão de Beleza',
  loja: 'Loja de Roupas',
};

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  date: string;
  description: string;
  category: string;
  business: BusinessType;
}

export type BusinessFilter = BusinessType | 'todos';
