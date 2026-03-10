import { Transaction, InventoryItem } from './types';

const STORAGE_KEY = 'cfn_transactions';
const INVENTORY_STORAGE_KEY = 'cfn_inventory';

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

export function getInventory(): InventoryItem[] {
  try {
    const data = localStorage.getItem(INVENTORY_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveInventory(inventory: InventoryItem[]) {
  localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(inventory));
}

export function addInventoryItem(t: InventoryItem) {
  const all = getInventory();
  all.push(t);
  saveInventory(all);
}

export function updateInventoryItem(t: InventoryItem) {
  const all = getInventory().map(item => item.id === t.id ? t : item);
  saveInventory(all);
}

export function deleteInventoryItem(id: string) {
  const all = getInventory().filter(item => item.id !== id);
  saveInventory(all);
}
