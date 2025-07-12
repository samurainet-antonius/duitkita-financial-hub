
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { userId } = await req.json()

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'User ID is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log('Deleting account for user:', userId)

    // Delete user data in order (respecting foreign key constraints)
    
    // 1. Delete transactions
    await supabaseClient
      .from('transactions')
      .delete()
      .eq('user_id', userId)

    // 2. Delete shared wallet access
    await supabaseClient
      .from('shared_wallets')
      .delete()
      .eq('user_id', userId)

    // 3. Delete wallets
    await supabaseClient
      .from('wallets')
      .delete()
      .eq('user_id', userId)

    // 4. Delete notification settings
    await supabaseClient
      .from('user_notifications')
      .delete()
      .eq('user_id', userId)

    // 5. Delete profile
    await supabaseClient
      .from('profiles')
      .delete()
      .eq('id', userId)

    // 6. Delete user account from auth
    const { error: deleteUserError } = await supabaseClient.auth.admin.deleteUser(userId)
    
    if (deleteUserError) {
      console.error('Error deleting user from auth:', deleteUserError)
      throw deleteUserError
    }

    console.log('Successfully deleted account for user:', userId)

    return new Response(
      JSON.stringify({ message: 'Account deleted successfully' }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Error deleting account:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
