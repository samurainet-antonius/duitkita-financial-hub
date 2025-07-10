
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
      
      const { data: sharedWallets, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;

      // Fetch profile data separately for each shared wallet
      const walletsWithProfiles = await Promise.all(
        (sharedWallets || []).map(async (wallet) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('id, full_name')
            .eq('id', wallet.user_id)
            .single();
          
          return {
            ...wallet,
            profiles: profile
          };
        })
      );
      
      return walletsWithProfiles;
    },
    enabled: !!walletId || walletId === undefined,
  });
};

export const useShareWallet = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ walletId, userEmail }: { walletId: string; userEmail: string }) => {
      // First, find the user by email using auth.users search
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) throw new Error('Anda harus login');

      // Search for user in profiles table by full_name or check in auth.users
      // Since we can't directly query auth.users, we'll search profiles first
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id, full_name')
        .or(`full_name.ilike.%${userEmail}%`)
        .limit(5);
      
      if (profileError) throw profileError;

      let targetUserId = null;

      // Check if we found a profile that matches
      if (profiles && profiles.length > 0) {
        // For exact email match or similar name match
        const exactMatch = profiles.find(p => 
          p.full_name?.toLowerCase() === userEmail.toLowerCase()
        );
        
        if (exactMatch) {
          targetUserId = exactMatch.id;
        } else if (profiles.length === 1) {
          targetUserId = profiles[0].id;
        } else {
          throw new Error('Ditemukan beberapa pengguna dengan nama serupa. Gunakan nama lengkap yang tepat.');
        }
      }

      if (!targetUserId) {
        throw new Error('Pengguna tidak ditemukan. Pastikan nama atau email sudah terdaftar.');
      }

      // Check if user is trying to share with themselves
      if (targetUserId === currentUser.id) {
        throw new Error('Anda tidak dapat membagikan dompet ke diri sendiri');
      }

      // Check if already shared
      const { data: existing } = await supabase
        .from('shared_wallets')
        .select('id')
        .eq('wallet_id', walletId)
        .eq('user_id', targetUserId)
        .single();

      if (existing) {
        throw new Error('Dompet sudah dibagikan ke pengguna ini');
      }

      // Share the wallet
      const { data, error } = await supabase
        .from('shared_wallets')
        .insert({
          wallet_id: walletId,
          user_id: targetUserId,
          role: 'user',
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['shared-wallets', variables.walletId] });
      queryClient.invalidateQueries({ queryKey: ['wallets'] });
      toast({
        title: 'Berhasil!',
        description: 'Dompet berhasil dibagikan.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Gagal membagikan dompet',
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
      queryClient.invalidateQueries({ queryKey: ['wallets'] });
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
