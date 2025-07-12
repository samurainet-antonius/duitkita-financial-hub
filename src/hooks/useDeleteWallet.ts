
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useDeleteWallet = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (walletId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Check if wallet has transactions
      const { data: transactions } = await supabase
        .from('transactions')
        .select('id')
        .or(`wallet_id.eq.${walletId},to_wallet_id.eq.${walletId}`)
        .limit(1);

      if (transactions && transactions.length > 0) {
        throw new Error('Tidak dapat menghapus dompet yang masih memiliki transaksi');
      }

      // Delete shared access first
      await supabase
        .from('shared_wallets')
        .delete()
        .eq('wallet_id', walletId);

      // Delete wallet
      const { error } = await supabase
        .from('wallets')
        .delete()
        .eq('id', walletId)
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallets'] });
      toast({
        title: 'Berhasil!',
        description: 'Dompet berhasil dihapus.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Gagal menghapus dompet',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};
