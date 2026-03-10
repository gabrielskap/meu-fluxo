import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { InventoryItem, BusinessFilter } from '@/lib/types';
import { getInventory, addInventoryItem as addInv, updateInventoryItem as updateInv, deleteInventoryItem as deleteInv } from '@/lib/store';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export function useInventory() {
  const [businessFilter, setBusinessFilter] = useState<BusinessFilter>('todos');
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: inventory = [], isLoading } = useQuery({
    queryKey: ['inventory', user?.id],
    queryFn: getInventory,
    enabled: !!user,
  });

  const addMutation = useMutation({
    mutationFn: addInv,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
    onError: (error) => {
      toast.error('Erro ao adicionar item: ' + error.message);
    }
  });

  const updateMutation = useMutation({
    mutationFn: updateInv,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
    onError: (error) => {
      toast.error('Erro ao atualizar item: ' + error.message);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteInv,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
    onError: (error) => {
      toast.error('Erro ao remover item: ' + error.message);
    }
  });

  const addInventoryItem = (t: InventoryItem) => addMutation.mutate(t);
  const updateInventoryItem = (t: InventoryItem) => updateMutation.mutate(t);
  const deleteInventoryItem = (id: string) => deleteMutation.mutate(id);

  const filtered = useMemo(() => {
    if (businessFilter === 'todos') return inventory;
    return inventory.filter((t: InventoryItem) => t.business === businessFilter);
  }, [inventory, businessFilter]);

  const totalValue = useMemo(() => {
    return filtered.reduce((acc: number, item: InventoryItem) => acc + (item.price * item.quantity), 0);
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
    isLoading,
  };
}
