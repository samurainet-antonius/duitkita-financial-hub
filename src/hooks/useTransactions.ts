
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

type Transaction = Tables<'transactions'>;
type TransactionInsert = Omit<TablesInsert<'transactions'>, 'user_id'>;
type TransactionUpdate = TablesUpdate<'transactions'>;

export const useTransactions = (walletId?: string) => {
  return useQuery({
    queryKey: ['transactions', walletId],
    queryFn: async () => {
      let query = supabase
        .from('transactions')
        .select(`
          *,
          categories (
            id,
            name,
            color,
            icon
          ),
          wallets!transactions_wallet_id_fkey (
            id,
            name
          ),
          to_wallets:wallets!transactions_to_wallet_id_fkey (
            id,
            name
          )
        `);
      
      if (walletId) {
        query = query.or(`wallet_id.eq.${walletId},to_wallet_id.eq.${walletId}`);
      }
      
      const { data, error } = await query.order('date', { ascending: false }).order('time', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
};

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (transaction: TransactionInsert & { receiptFile?: File }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      let receiptUrl = null;

      // Upload receipt if provided
      if (transaction.receiptFile) {
        const fileName = `${user.id}/${Date.now()}-${transaction.receiptFile.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('transaction-receipts')
          .upload(fileName, transaction.receiptFile);

        if (uploadError) throw uploadError;
        receiptUrl = uploadData.path;
      }

      // Remove receiptFile from transaction data before inserting
      const { receiptFile, ...transactionData } = transaction;

      const { data, error } = await supabase
        .from('transactions')
        .insert({
          ...transactionData,
          user_id: user.id,
          receipt_url: receiptUrl,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['wallets'] });
      toast({
        title: 'Berhasil!',
        description: 'Transaksi berhasil ditambahkan.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateTransaction = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: TransactionUpdate }) => {
      const { data, error } = await supabase
        .from('transactions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['wallets'] });
      toast({
        title: 'Berhasil!',
        description: 'Transaksi berhasil diperbarui.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['wallets'] });
      toast({
        title: 'Berhasil!',
        description: 'Transaksi berhasil dihapus.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};
