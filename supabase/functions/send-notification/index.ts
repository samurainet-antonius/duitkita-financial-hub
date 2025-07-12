
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NotificationRequest {
  transactionId: string;
  walletId: string;
  userId: string;
  amount: number;
  description: string;
  type: 'income' | 'expense' | 'transfer';
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { transactionId, walletId, userId, amount, description, type }: NotificationRequest = await req.json();

    console.log('Sending notification for transaction:', transactionId);

    // Get wallet info
    const { data: wallet, error: walletError } = await supabase
      .from('wallets')
      .select('name, user_id')
      .eq('id', walletId)
      .single();

    if (walletError || !wallet) {
      console.error('Error fetching wallet:', walletError);
      throw new Error('Wallet not found');
    }

    // Get users who have access to this wallet (shared users)
    const { data: sharedAccess, error: sharedError } = await supabase
      .from('shared_wallets')
      .select(`
        user_id,
        profiles!inner(
          full_name
        ),
        user_notifications!inner(
          shared_wallet_notifications,
          email_notifications
        )
      `)
      .eq('wallet_id', walletId)
      .eq('user_notifications.shared_wallet_notifications', true)
      .neq('user_id', userId); // Don't notify the person who made the transaction

    if (sharedError) {
      console.error('Error fetching shared access:', sharedError);
      throw sharedError;
    }

    // Get transaction creator info
    const { data: creator } = await supabase.auth.admin.getUserById(userId);
    const { data: creatorProfile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', userId)
      .single();

    const creatorName = creatorProfile?.full_name || creator?.user?.email || 'Seseorang';

    // Send notifications to shared users
    for (const access of sharedAccess || []) {
      try {
        const { data: authUser } = await supabase.auth.admin.getUserById(access.user_id);
        
        if (!authUser.user?.email) {
          console.log(`No email found for user ${access.user_id}`);
          continue;
        }

        // Only send email notification if user has email notifications enabled
        if (access.user_notifications?.email_notifications) {
          const typeText = type === 'income' ? 'Pemasukan' : type === 'expense' ? 'Pengeluaran' : 'Transfer';
          const amountFormatted = new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR'
          }).format(amount);

          await resend.emails.send({
            from: 'DuitKita <noreply@duitkita.com>',
            to: [authUser.user.email],
            subject: `${typeText} Baru di Dompet ${wallet.name}`,
            html: `
              <h2>Notifikasi Transaksi</h2>
              <p>Halo ${access.profiles?.full_name || 'Pengguna'},</p>
              <p>Ada ${typeText.toLowerCase()} baru di dompet yang Anda akses:</p>
              <div style="background-color: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
                <p><strong>Dompet:</strong> ${wallet.name}</p>
                <p><strong>Tipe:</strong> ${typeText}</p>
                <p><strong>Jumlah:</strong> ${amountFormatted}</p>
                <p><strong>Deskripsi:</strong> ${description}</p>
                <p><strong>Oleh:</strong> ${creatorName}</p>
              </div>
              <p>Masuk ke aplikasi DuitKita untuk melihat detail lengkap.</p>
              <br>
              <p>Salam,<br>Tim DuitKita</p>
            `,
          });

          console.log(`Notification sent to ${authUser.user.email}`);
        }

      } catch (error) {
        console.error(`Error sending notification to user ${access.user_id}:`, error);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Notifications sent to ${sharedAccess?.length || 0} users` 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error: any) {
    console.error('Error in send-notification function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
};

serve(handler);
