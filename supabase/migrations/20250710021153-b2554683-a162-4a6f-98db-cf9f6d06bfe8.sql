
-- Add receipt_url column to transactions table
ALTER TABLE public.transactions ADD COLUMN receipt_url text;

-- Create storage bucket for transaction receipts
INSERT INTO storage.buckets (id, name, public)
VALUES ('transaction-receipts', 'transaction-receipts', true);

-- Create storage policy for transaction receipts
CREATE POLICY "Users can upload their own receipts" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'transaction-receipts' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own receipts" ON storage.objects
FOR SELECT USING (
  bucket_id = 'transaction-receipts' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own receipts" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'transaction-receipts' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own receipts" ON storage.objects
FOR DELETE USING (
  bucket_id = 'transaction-receipts' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
