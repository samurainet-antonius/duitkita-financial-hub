
-- Create shared_wallets table
CREATE TABLE duitkita.shared_wallets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_id UUID REFERENCES duitkita.wallets(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('owner', 'user')),
  shared_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(wallet_id, user_id)
);

-- Enable RLS on shared_wallets
ALTER TABLE duitkita.shared_wallets ENABLE ROW LEVEL SECURITY;

-- RLS policies for shared_wallets
CREATE POLICY "Users can view shared wallets they have access to" 
  ON duitkita.shared_wallets 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Wallet owners can share their wallets" 
  ON duitkita.shared_wallets 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM duitkita.wallets 
      WHERE id = wallet_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Wallet owners can manage sharing" 
  ON duitkita.shared_wallets 
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM duitkita.wallets 
      WHERE id = wallet_id AND user_id = auth.uid()
    )
  );

-- Create function to check if user has access to wallet
CREATE OR REPLACE FUNCTION duitkita.user_has_wallet_access(wallet_uuid UUID, user_uuid UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM duitkita.wallets w 
    WHERE w.id = wallet_uuid AND w.user_id = user_uuid
    UNION
    SELECT 1 FROM duitkita.shared_wallets sw 
    WHERE sw.wallet_id = wallet_uuid AND sw.user_id = user_uuid
  );
$$;

-- Create function to check if user is wallet owner
CREATE OR REPLACE FUNCTION duitkita.user_is_wallet_owner(wallet_uuid UUID, user_uuid UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM duitkita.wallets w 
    WHERE w.id = wallet_uuid AND w.user_id = user_uuid
  );
$$;

-- Update wallets RLS policies to include shared access
DROP POLICY IF EXISTS "Users can view own wallets" ON duitkita.wallets;
CREATE POLICY "Users can view accessible wallets" 
  ON duitkita.wallets 
  FOR SELECT 
  USING (
    user_id = auth.uid() OR 
    duitkita.user_has_wallet_access(id, auth.uid())
  );

DROP POLICY IF EXISTS "Users can update own wallets" ON duitkita.wallets;
CREATE POLICY "Only wallet owners can update wallets" 
  ON duitkita.wallets 
  FOR UPDATE 
  USING (duitkita.user_is_wallet_owner(id, auth.uid()));

-- Update transactions RLS policies to allow shared wallet access
DROP POLICY IF EXISTS "Users can view own transactions" ON duitkita.transactions;
CREATE POLICY "Users can view accessible transactions" 
  ON duitkita.transactions 
  FOR SELECT 
  USING (
    user_id = auth.uid() OR 
    duitkita.user_has_wallet_access(wallet_id, auth.uid()) OR
    duitkita.user_has_wallet_access(to_wallet_id, auth.uid())
  );

DROP POLICY IF EXISTS "Users can insert own transactions" ON duitkita.transactions;
CREATE POLICY "Users can insert transactions to accessible wallets" 
  ON duitkita.transactions 
  FOR INSERT 
  WITH CHECK (
    user_id = auth.uid() AND (
      duitkita.user_has_wallet_access(wallet_id, auth.uid()) OR
      duitkita.user_has_wallet_access(to_wallet_id, auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can update own transactions" ON duitkita.transactions;
CREATE POLICY "Users can update transactions in accessible wallets" 
  ON duitkita.transactions 
  FOR UPDATE 
  USING (
    user_id = auth.uid() AND (
      duitkita.user_has_wallet_access(wallet_id, auth.uid()) OR
      duitkita.user_has_wallet_access(to_wallet_id, auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can delete own transactions" ON duitkita.transactions;
CREATE POLICY "Users can delete transactions in accessible wallets" 
  ON duitkita.transactions 
  FOR DELETE 
  USING (
    user_id = auth.uid() AND (
      duitkita.user_has_wallet_access(wallet_id, auth.uid()) OR
      duitkita.user_has_wallet_access(to_wallet_id, auth.uid())
    )
  );

-- Create trigger to automatically add wallet owner to shared_wallets
CREATE OR REPLACE FUNCTION duitkita.add_wallet_owner_to_shared()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO duitkita.shared_wallets (wallet_id, user_id, role)
  VALUES (NEW.id, NEW.user_id, 'owner');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_wallet_created
  AFTER INSERT ON duitkita.wallets
  FOR EACH ROW EXECUTE FUNCTION duitkita.add_wallet_owner_to_shared();
