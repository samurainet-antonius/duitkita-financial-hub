
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, supabasePublic } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Tables, TablesInsert } from '@/integrations/supabase/types';

type SharedWallet = Tables<'shared_wallets'>;
type SharedWalletInsert = TablesInsert<'shared_wallets'>;

export const useSharedWallets = (walletId?: string) => {
  return useQuery({
    queryKey: ['shared-wallets', walletId],
    queryFn: async () => {
      // Ambil user aktif
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) throw new Error("User not authenticated");

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
        `)
        .eq('user_id', user.id);  // pastikan bukan pemilik
      
      if (walletId) {
        query = query.eq('wallet_id', walletId);
      }
      
      const { data: sharedWallets, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;

      // Fetch profile data separately for each shared wallet
      const walletsWithProfiles = await Promise.all(
        (sharedWallets || []).map(async (wallet) => {
          const { data: profile } = await supabasePublic
            .from('profiles')
            .select('id, full_name')
            .eq('id', wallet.user_id)
            .single();
          
          return {
            ...wallet,
            isShared: true,
            role: wallet.role,         // ⬅️ Ini penting
            sharedBy: profile,  
          };
        })
      );
      
      return walletsWithProfiles;
    },
    enabled: !!walletId || walletId === undefined,
  });
};

export const usedWalletShared = (walletId?: string) => {
  return useQuery({
    queryKey: ['shared-wallets', walletId],
    queryFn: async () => {
      // Ambil user aktif
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) throw new Error("User not authenticated");

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
      
      const { data: sharedWallets, error } = await query.neq('role', 'owner').order('created_at', { ascending: false });
      
      if (error) throw error;

      // Fetch profile data separately for each shared wallet
      const walletsWithProfiles = await Promise.all(
        (sharedWallets || []).map(async (wallet) => {
          const { data: profile } = await supabasePublic
            .from('profiles')
            .select('id, full_name')
            .eq('id', wallet.user_id)
            .single();
          
          return {
            ...wallet,
            isShared: true,         // ⬅️ Ini penting
            sharedBy: profile,  
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

      // Search for user in profiles table by full_name or email-like pattern
      const { data: profiles, error: profileError } = await supabasePublic
        .from('profiles')
        .select('id, full_name, email')
        .eq(`email`, userEmail);
      
      if (profileError) throw profileError;

      let targetUserId = null;

      // Check if we found a profile that matches
      if (profiles && profiles.length > 0) {
        // For exact match (case insensitive)
        const exactMatch = profiles.find(p => 
          p.full_name?.toLowerCase().trim() === userEmail.toLowerCase().trim()
        );
        
        if (exactMatch) {
          targetUserId = exactMatch.id;
        } else if (profiles.length === 1) {
          // If only one result, use it
          targetUserId = profiles[0].id;
        } else {
          // Multiple matches found
          const suggestion = profiles.map(p => p.full_name).join(', ');
          throw new Error(`Ditemukan beberapa pengguna: ${suggestion}. Gunakan nama lengkap yang tepat.`);
        }
      }

      // If no match found by name, try to search by pattern matching
      if (!targetUserId) {
        const { data: partialProfiles, error: partialError } = await supabasePublic
          .from('profiles')
          .select('id, full_name')
          .ilike('full_name', `%${userEmail}%`)
          .limit(10);

        if (partialError) throw partialError;

        if (partialProfiles && partialProfiles.length > 0) {
          if (partialProfiles.length === 1) {
            targetUserId = partialProfiles[0].id;
          } else {
            const suggestions = partialProfiles.map(p => p.full_name).slice(0, 3).join(', ');
            throw new Error(`Pengguna tidak ditemukan persis. Apakah maksud Anda: ${suggestions}?`);
          }
        }
      }

      if (!targetUserId) {
        throw new Error('Pengguna tidak ditemukan. Pastikan nama lengkap atau email sudah terdaftar di aplikasi.');
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
