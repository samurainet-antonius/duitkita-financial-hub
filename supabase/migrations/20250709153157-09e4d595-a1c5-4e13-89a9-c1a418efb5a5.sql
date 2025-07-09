
-- Create shared_wallets table
CREATE TABLE public.shared_wallets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_id UUID REFERENCES public.wallets(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('owner', 'user')),
  shared_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(wallet_id, user_id)
);

-- Enable RLS on shared_wallets
ALTER TABLE public.shared_wallets ENABLE ROW LEVEL SECURITY;

-- RLS policies for shared_wallets
CREATE POLICY "Users can view shared wallets they have access to" 
  ON public.shared_wallets 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Wallet owners can share their wallets" 
  ON public.shared_wallets 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.wallets 
      WHERE id = wallet_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Wallet owners can manage sharing" 
  ON public.shared_wallets 
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.wallets 
      WHERE id = wallet_id AND user_id = auth.uid()
    )
  );

-- Create function to check if user has access to wallet
CREATE OR REPLACE FUNCTION public.user_has_wallet_access(wallet_uuid UUID, user_uuid UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.wallets w 
    WHERE w.id = wallet_uuid AND w.user_id = user_uuid
    UNION
    SELECT 1 FROM public.shared_wallets sw 
    WHERE sw.wallet_id = wallet_uuid AND sw.user_id = user_uuid
  );
$$;

-- Create function to check if user is wallet owner
CREATE OR REPLACE FUNCTION public.user_is_wallet_owner(wallet_uuid UUID, user_uuid UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.wallets w 
    WHERE w.id = wallet_uuid AND w.user_id = user_uuid
  );
$$;

-- Update wallets RLS policies to include shared access
DROP POLICY IF EXISTS "Users can view own wallets" ON public.wallets;
CREATE POLICY "Users can view accessible wallets" 
  ON public.wallets 
  FOR SELECT 
  USING (
    user_id = auth.uid() OR 
    public.user_has_wallet_access(id, auth.uid())
  );

DROP POLICY IF EXISTS "Users can update own wallets" ON public.wallets;
CREATE POLICY "Only wallet owners can update wallets" 
  ON public.wallets 
  FOR UPDATE 
  USING (public.user_is_wallet_owner(id, auth.uid()));

-- Update transactions RLS policies to allow shared wallet access
DROP POLICY IF EXISTS "Users can view own transactions" ON public.transactions;
CREATE POLICY "Users can view accessible transactions" 
  ON public.transactions 
  FOR SELECT 
  USING (
    user_id = auth.uid() OR 
    public.user_has_wallet_access(wallet_id, auth.uid()) OR
    public.user_has_wallet_access(to_wallet_id, auth.uid())
  );

DROP POLICY IF EXISTS "Users can insert own transactions" ON public.transactions;
CREATE POLICY "Users can insert transactions to accessible wallets" 
  ON public.transactions 
  FOR INSERT 
  WITH CHECK (
    user_id = auth.uid() AND (
      public.user_has_wallet_access(wallet_id, auth.uid()) OR
      public.user_has_wallet_access(to_wallet_id, auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can update own transactions" ON public.transactions;
CREATE POLICY "Users can update transactions in accessible wallets" 
  ON public.transactions 
  FOR UPDATE 
  USING (
    user_id = auth.uid() AND (
      public.user_has_wallet_access(wallet_id, auth.uid()) OR
      public.user_has_wallet_access(to_wallet_id, auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can delete own transactions" ON public.transactions;
CREATE POLICY "Users can delete transactions in accessible wallets" 
  ON public.transactions 
  FOR DELETE 
  USING (
    user_id = auth.uid() AND (
      public.user_has_wallet_access(wallet_id, auth.uid()) OR
      public.user_has_wallet_access(to_wallet_id, auth.uid())
    )
  );

-- Create trigger to automatically add wallet owner to shared_wallets
CREATE OR REPLACE FUNCTION public.add_wallet_owner_to_shared()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.shared_wallets (wallet_id, user_id, role)
  VALUES (NEW.id, NEW.user_id, 'owner');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_wallet_created
  AFTER INSERT ON public.wallets
  FOR EACH ROW EXECUTE FUNCTION public.add_wallet_owner_to_shared();
