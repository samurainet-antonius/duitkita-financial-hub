
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabasePublic } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

type Profile = Tables<'profiles'>;
type ProfileInsert = TablesInsert<'profiles'>;
type ProfileUpdate = TablesUpdate<'profiles'>;

export const useProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabasePublic.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabasePublic
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (updates: ProfileUpdate) => {
      const { data: { user } } = await supabasePublic.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabasePublic
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast({
        title: 'Berhasil!',
        description: 'Profil berhasil diperbarui.',
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
