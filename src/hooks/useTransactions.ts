
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useSendTransactionNotification } from './useTransactionNotifications';
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

type Transaction = Tables<'transactions'>;
type TransactionInsert = TablesInsert<'transactions'>;
type TransactionUpdate = TablesUpdate<'transactions'>;

export const useTransactions = (walletId?: string) => {
  return useQuery({
    queryKey: ['transactions', walletId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      let query = supabase
        .from('transactions')
        .select(`
          *,
          categories (
            name,
            id
          ),
          wallets!transactions_wallet_id_fkey (
            name,
            id
          ),
          to_wallets:wallets!transactions_to_wallet_id_fkey (
            name,
            id
          )
        `)
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .order('time', { ascending: false });

      if (walletId) {
        query = query.eq('wallet_id', walletId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data;
    },
  });
};

export const useTransaction = (id: string) => {
  return useQuery({
    queryKey: ['transaction', id],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          categories (
            name,
            id
          ),
          wallets!transactions_wallet_id_fkey (
            name,
            id
          ),
          to_wallets:wallets!transactions_to_wallet_id_fkey (
            name,
            id
          )
        `)
        .eq('id', id)
        .eq('user_id', user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
  });
};

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const sendNotification = useSendTransactionNotification();

  return useMutation({
    mutationFn: async (transaction: TransactionInsert) => {
      const { data, error } = await supabase
        .from('transactions')
        .insert(transaction)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['wallets'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      
      // Send notification for shared wallet transactions
      if (data.wallet_id && (data.type === 'income' || data.type === 'expense')) {
        sendNotification.mutate({
          transactionId: data.id,
          walletId: data.wallet_id,
          userId: data.user_id,
          amount: data.amount,
          description: data.description,
          type: data.type as 'income' | 'expense' | 'transfer'
        });
      }
      
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
    mutationFn: async ({ id, ...updates }: { id: string } & TransactionUpdate) => {
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
      queryClient.invalidateQueries({ queryKey: ['transaction'] });
      queryClient.invalidateQueries({ queryKey: ['wallets'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
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
      queryClient.invalidateQueries({ queryKey: ['transaction'] });
       queryClient.invalidateQueries({ queryKey: ['wallets'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
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
