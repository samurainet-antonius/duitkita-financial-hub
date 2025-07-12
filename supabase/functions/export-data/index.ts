
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ExportRequest {
  type: 'wallets' | 'transactions' | 'all';
  format: 'csv' | 'json';
  userId: string;
}

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const convertToCSV = (data: any[], headers: string[]) => {
  const csvHeaders = headers.join(',');
  const csvRows = data.map(row => 
    headers.map(header => {
      const value = row[header];
      // Handle values that might contain commas, quotes, or newlines
      if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value || '';
    }).join(',')
  );
  return [csvHeaders, ...csvRows].join('\n');
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, format, userId }: ExportRequest = await req.json();

    console.log('Export request:', { type, format, userId });

    if (!userId) {
      throw new Error('User ID is required');
    }

    let exportData: any = {};

    // Export wallets
    if (type === 'wallets' || type === 'all') {
      const { data: wallets, error: walletsError } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (walletsError) throw walletsError;
      exportData.wallets = wallets;
    }

    // Export transactions
    if (type === 'transactions' || type === 'all') {
      const { data: transactions, error: transactionsError } = await supabase
        .from('transactions')
        .select(`
          *,
          categories (name),
          wallets:wallet_id (name),
          to_wallets:to_wallet_id (name)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (transactionsError) throw transactionsError;
      
      // Flatten the data for better export
      const flattenedTransactions = transactions?.map(t => ({
        id: t.id,
        type: t.type,
        amount: t.amount,
        description: t.description,
        category: t.categories?.name || '',
        wallet: t.wallets?.name || '',
        to_wallet: t.to_wallets?.name || '',
        date: t.date,
        time: t.time,
        notes: t.notes || '',
        created_at: t.created_at
      }));

      exportData.transactions = flattenedTransactions;
    }

    // Format response based on requested format
    if (format === 'csv') {
      let csvContent = '';
      
      if (exportData.wallets) {
        const walletHeaders = ['id', 'name', 'type', 'balance', 'account_number', 'created_at'];
        csvContent += 'WALLETS\n';
        csvContent += convertToCSV(exportData.wallets, walletHeaders);
        csvContent += '\n\n';
      }
      
      if (exportData.transactions) {
        const transactionHeaders = ['id', 'type', 'amount', 'description', 'category', 'wallet', 'to_wallet', 'date', 'time', 'notes', 'created_at'];
        csvContent += 'TRANSACTIONS\n';
        csvContent += convertToCSV(exportData.transactions, transactionHeaders);
      }

      return new Response(csvContent, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="duitkita-export-${new Date().toISOString().split('T')[0]}.csv"`
        }
      });
    } else {
      // JSON format
      return new Response(JSON.stringify(exportData, null, 2), {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="duitkita-export-${new Date().toISOString().split('T')[0]}.json"`
        }
      });
    }

  } catch (error: any) {
    console.error('Export error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
};

serve(handler);
