
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Tables, TablesUpdate } from '@/integrations/supabase/types';

type UserNotification = Tables<'user_notifications'>;
type UserNotificationUpdate = TablesUpdate<'user_notifications'>;

export const useNotifications = () => {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('user_notifications')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error && error.code === 'PGRST116') {
        // No notification settings found, create default
        const { data: newData, error: insertError } = await supabase
          .from('user_notifications')
          .insert({
            user_id: user.id,
            push_notifications: true,
            email_notifications: false,
            transaction_notifications: true,
            shared_wallet_notifications: true,
            backup_notifications: true
          })
          .select()
          .single();
        
        if (insertError) throw insertError;
        return newData;
      }
      
      if (error) throw error;
      return data;
    },
  });
};

export const useUpdateNotifications = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (updates: UserNotificationUpdate) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('user_notifications')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast({
        title: 'Berhasil!',
        description: 'Pengaturan notifikasi berhasil diperbarui.',
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

export const useTriggerBackup = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase.functions.invoke('daily-backup', {
        body: { 
          scheduled: false,
          userId: user.id 
        }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: 'Backup Dimulai',
        description: 'Data backup akan dikirim ke email Anda dalam beberapa menit.',
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
