
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export const useExportData = () => {
  const { toast } = useToast();
  const { user } = useAuth();

  const exportData = async (type: 'wallets' | 'transactions' | 'all', format: 'csv' | 'json' = 'csv') => {
    try {
      if (!user) {
        throw new Error('User not authenticated');
      }

      console.log('Starting export:', { type, format, userId: user.id });

      const { data, error } = await supabase.functions.invoke('export-data', {
        body: {
          type,
          format,
          userId: user.id
        }
      });

      if (error) {
        console.error('Export function error:', error);
        throw error;
      }

      // Create blob and download
      const blob = new Blob([data], { 
        type: format === 'csv' ? 'text/csv' : 'application/json' 
      });
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `duitkita-export-${new Date().toISOString().split('T')[0]}.${format}`;
      
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: 'Berhasil!',
        description: 'Data berhasil dieksport',
      });

    } catch (error: any) {
      console.error('Export error:', error);
      toast({
        title: 'Error',
        description: `Gagal mengekspor data: ${error.message}`,
        variant: 'destructive',
      });
    }
  };

  return { exportData };
};
