
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

interface BackupRequest {
  scheduled?: boolean;
  userId?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { scheduled, userId }: BackupRequest = await req.json();

    console.log('Starting backup process, scheduled:', scheduled);

    // Get users who have backup notifications enabled
    const { data: users, error: usersError } = await supabase
      .from('user_notifications')
      .select(`
        user_id,
        backup_notifications,
        profiles!inner(
          full_name,
          id
        )
      `)
      .eq('backup_notifications', true);

    if (usersError) {
      console.error('Error fetching users:', usersError);
      throw usersError;
    }

    console.log(`Found ${users?.length || 0} users with backup enabled`);

    // Process each user
    for (const userNotification of users || []) {
      try {
        // Get user email from auth.users
        const { data: authUser } = await supabase.auth.admin.getUserById(userNotification.user_id);
        
        if (!authUser.user?.email) {
          console.log(`No email found for user ${userNotification.user_id}`);
          continue;
        }

        // Get user's wallets
        const { data: wallets, error: walletsError } = await supabase
          .from('wallets')
          .select('*')
          .eq('user_id', userNotification.user_id);

        if (walletsError) {
          console.error('Error fetching wallets:', walletsError);
          continue;
        }

        // Get user's transactions
        const { data: transactions, error: transactionsError } = await supabase
          .from('transactions')
          .select(`
            *,
            categories(name),
            wallets!transactions_wallet_id_fkey(name),
            to_wallets:wallets!transactions_to_wallet_id_fkey(name)
          `)
          .eq('user_id', userNotification.user_id);

        if (transactionsError) {
          console.error('Error fetching transactions:', transactionsError);
          continue;
        }

        // Create CSV content for wallets
        const walletsCSV = [
          'ID,Nama,Tipe,Saldo,Nomor Rekening,Aktif,Dibuat,Diperbarui',
          ...(wallets || []).map(w => 
            `${w.id},"${w.name}","${w.type}",${w.balance || 0},"${w.account_number || ''}",${w.is_active},${w.created_at},${w.updated_at}`
          )
        ].join('\n');

        // Create CSV content for transactions
        const transactionsCSV = [
          'ID,Tanggal,Waktu,Tipe,Jumlah,Deskripsi,Catatan,Kategori,Dompet,Ke Dompet,Dibuat,Diperbarui',
          ...(transactions || []).map(t => 
            `${t.id},${t.date},${t.time},"${t.type}",${t.amount},"${t.description}","${t.notes || ''}","${t.categories?.name || ''}","${t.wallets?.name || ''}","${t.to_wallets?.name || ''}",${t.created_at},${t.updated_at}`
          )
        ].join('\n');

        const today = new Date().toLocaleDateString('id-ID');
        const userName = userNotification.profiles?.full_name || 'Pengguna';

        // Send email with CSV attachments
        await resend.emails.send({
          from: 'DuitKita <noreply@duitkita.com>',
          to: [authUser.user.email],
          subject: `Backup Data Keuangan DuitKita - ${today}`,
          html: `
            <h2>Backup Data Keuangan Harian</h2>
            <p>Halo ${userName},</p>
            <p>Berikut adalah backup data keuangan Anda untuk tanggal ${today}.</p>
            <p>Data yang disertakan:</p>
            <ul>
              <li><strong>Dompet:</strong> ${wallets?.length || 0} dompet</li>
              <li><strong>Transaksi:</strong> ${transactions?.length || 0} transaksi</li>
            </ul>
            <p>File CSV terlampir berisi semua data keuangan Anda. Simpan file ini dengan aman.</p>
            <br>
            <p>Salam,<br>Tim DuitKita</p>
          `,
          attachments: [
            {
              filename: `dompet_${today.replace(/\//g, '-')}.csv`,
              content: Buffer.from(walletsCSV, 'utf-8'),
            },
            {
              filename: `transaksi_${today.replace(/\//g, '-')}.csv`,
              content: Buffer.from(transactionsCSV, 'utf-8'),
            }
          ]
        });

        console.log(`Backup sent to ${authUser.user.email}`);

      } catch (error) {
        console.error(`Error processing backup for user ${userNotification.user_id}:`, error);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Backup processed for ${users?.length || 0} users` 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error: any) {
    console.error('Error in daily-backup function:', error);
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
