import { supabase } from './supabase';
import { Transaction, InventoryItem } from './types';

export async function getTransactions(): Promise<Transaction[]> {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .order('date', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function addTransaction(t: Transaction): Promise<void> {
  const { data: { session } } = await supabase.auth.getSession();
  const item = session?.user ? { ...t, user_id: session.user.id } : t;
  const { error } = await supabase.from('transactions').insert([item]);
  if (error) throw error;
}

export async function updateTransaction(t: Transaction): Promise<void> {
  const { error } = await supabase
    .from('transactions')
    .update(t)
    .eq('id', t.id);
  if (error) throw error;
}

export async function deleteTransaction(id: string): Promise<void> {
  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

export async function getInventory(): Promise<InventoryItem[]> {
  const { data, error } = await supabase
    .from('inventory')
    .select('*')
    .order('name', { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function addInventoryItem(t: InventoryItem): Promise<void> {
  const { data: { session } } = await supabase.auth.getSession();
  const item = session?.user ? { ...t, user_id: session.user.id } : t;
  const { error } = await supabase.from('inventory').insert([item]);
  if (error) throw error;
}

export async function updateInventoryItem(t: InventoryItem): Promise<void> {
  const { error } = await supabase
    .from('inventory')
    .update(t)
    .eq('id', t.id);
  if (error) throw error;
}

export async function deleteInventoryItem(id: string): Promise<void> {
  const { error } = await supabase
    .from('inventory')
    .delete()
    .eq('id', id);
  if (error) throw error;
}
