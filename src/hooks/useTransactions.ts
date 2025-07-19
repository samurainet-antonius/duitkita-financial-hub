
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, supabasePublic } from '@/integrations/supabase/client';
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

export const useWalletTransactions = (walletId?: string) => {
  return useQuery({
    queryKey: ['transactions', walletId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const currentUserId = user.id;
      
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
        .order('date', { ascending: false })
        .order('time', { ascending: false });

      if (walletId) {
        query = query.eq('wallet_id', walletId);
      }

      const { data: transactions, error } = await query;

      if (error) throw error;
      if (!transactions || transactions.length === 0) return [];

      // 2. Ambil user_id unik dari transaksi
      const userIds = [...new Set(transactions.map(tx => tx.user_id).filter(Boolean))];

      // 3. Ambil data profil dari schema public
      const { data: profiles, error: profileError } = await supabasePublic
        .from('profiles')
        .select('id, full_name')
        .in('id', userIds);

      if (profileError) throw profileError;

      // 4. Gabungkan profil ke transaksi
      const transactionsWithProfiles = transactions.map(tx => ({
        ...tx,
        user: profiles?.find(p => p.id === tx.user_id) || null,
        isOwner: tx.user_id === currentUserId, // ✅ Tambahkan info isOwner
      }));

      return transactionsWithProfiles;
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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Ensure user_id is set
      const transactionWithUserId = {
        ...transaction,
        user_id: user.id
      };

      const { data, error } = await supabase
        .from('transactions')
        .insert(transactionWithUserId)
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
      console.error('Transaction creation error:', error);
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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('transactions')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
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
      console.error('Transaction update error:', error);
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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
      
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
      console.error('Transaction deletion error:', error);
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};
