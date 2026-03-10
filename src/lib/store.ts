import { Transaction } from './types';

const STORAGE_KEY = 'cfn_transactions';

export function getTransactions(): Transaction[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveTransactions(transactions: Transaction[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}

export function addTransaction(t: Transaction) {
  const all = getTransactions();
  all.push(t);
  saveTransactions(all);
}

export function updateTransaction(t: Transaction) {
  const all = getTransactions().map(item => item.id === t.id ? t : item);
  saveTransactions(all);
}

export function deleteTransaction(id: string) {
  const all = getTransactions().filter(item => item.id !== id);
  saveTransactions(all);
}
