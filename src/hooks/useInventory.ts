import { useState, useCallback, useMemo } from 'react';
import { InventoryItem, BusinessFilter } from '@/lib/types';
import { getInventory, addInventoryItem as addInv, updateInventoryItem as updateInv, deleteInventoryItem as deleteInv } from '@/lib/store';

export function useInventory() {
  const [inventory, setInventory] = useState<InventoryItem[]>(getInventory);
  const [businessFilter, setBusinessFilter] = useState<BusinessFilter>('todos');

  const refresh = useCallback(() => setInventory(getInventory()), []);

  const addInventoryItem = useCallback((t: InventoryItem) => {
    addInv(t);
    refresh();
  }, [refresh]);

  const updateInventoryItem = useCallback((t: InventoryItem) => {
    updateInv(t);
    refresh();
  }, [refresh]);

  const deleteInventoryItem = useCallback((id: string) => {
    deleteInv(id);
    refresh();
  }, [refresh]);

  const filtered = useMemo(() => {
    if (businessFilter === 'todos') return inventory;
    return inventory.filter(t => t.business === businessFilter);
  }, [inventory, businessFilter]);

  const totalValue = useMemo(() => {
    return filtered.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  }, [filtered]);

  return {
    inventory: filtered,
    allInventory: inventory,
    businessFilter,
    setBusinessFilter,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    totalValue,
  };
}
