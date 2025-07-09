
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Tables, TablesInsert } from '@/integrations/supabase/types';

type SharedWallet = Tables<'shared_wallets'>;
type SharedWalletInsert = TablesInsert<'shared_wallets'>;

export const useSharedWallets = (walletId?: string) => {
  return useQuery({
    queryKey: ['shared-wallets', walletId],
    queryFn: async () => {
      let query = supabase
        .from('shared_wallets')
        .select(`
          *,
          wallets (
            id,
            name,
            type,
            balance,
            color,
            icon
          )
        `);
      
      if (walletId) {
        query = query.eq('wallet_id', walletId);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!walletId || walletId === undefined,
  });
};

export const useShareWallet = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ walletId, userEmail }: { walletId: string; userEmail: string }) => {
      // First, find the user by email
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .ilike('full_name', `%${userEmail}%`)
        .limit(1);
      
      if (profileError) throw profileError;
      if (!profiles || profiles.length === 0) {
        throw new Error('User tidak ditemukan');
      }

      const userId = profiles[0].id;

      // Check if already shared
      const { data: existing } = await supabase
        .from('shared_wallets')
        .select('id')
        .eq('wallet_id', walletId)
        .eq('user_id', userId)
        .single();

      if (existing) {
        throw new Error('Dompet sudah dibagikan ke user ini');
      }

      // Share the wallet
      const { data, error } = await supabase
        .from('shared_wallets')
        .insert({
          wallet_id: walletId,
          user_id: userId,
          role: 'user',
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['shared-wallets', variables.walletId] });
      toast({
        title: 'Berhasil!',
        description: 'Dompet berhasil dibagikan.',
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

export const useRemoveSharedAccess = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (sharedWalletId: string) => {
      const { error } = await supabase
        .from('shared_wallets')
        .delete()
        .eq('id', sharedWalletId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shared-wallets'] });
      toast({
        title: 'Berhasil!',
        description: 'Akses dompet berhasil dihapus.',
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
