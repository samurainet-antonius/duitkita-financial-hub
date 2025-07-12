
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export const useDeleteAccount = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Call edge function to delete all user data
      const { error } = await supabase.functions.invoke('delete-user-account', {
        body: { userId: user.id }
      });

      if (error) throw error;

      // Sign out user
      await supabase.auth.signOut();
    },
    onSuccess: () => {
      toast({
        title: 'Akun berhasil dihapus',
        description: 'Semua data Anda telah dihapus secara permanen.',
      });
      navigate('/');
    },
    onError: (error) => {
      toast({
        title: 'Gagal menghapus akun',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};
