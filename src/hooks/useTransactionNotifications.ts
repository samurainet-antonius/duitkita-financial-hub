
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface NotificationData {
  transactionId: string;
  walletId: string;
  userId: string;
  amount: number;
  description: string;
  type: 'income' | 'expense' | 'transfer';
}

export const useSendTransactionNotification = () => {
  return useMutation({
    mutationFn: async (data: NotificationData) => {
      const { data: result, error } = await supabase.functions.invoke('send-notification', {
        body: data
      });

      if (error) throw error;
      return result;
    },
    onError: (error) => {
      console.error('Error sending transaction notification:', error);
    },
  });
};
