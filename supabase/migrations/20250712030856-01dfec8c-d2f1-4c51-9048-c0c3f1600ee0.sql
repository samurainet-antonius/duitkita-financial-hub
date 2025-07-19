
-- Create notifications table to store user notification preferences
CREATE TABLE duitkita.user_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  push_notifications BOOLEAN DEFAULT true,
  email_notifications BOOLEAN DEFAULT false,
  transaction_notifications BOOLEAN DEFAULT true,
  shared_wallet_notifications BOOLEAN DEFAULT true,
  backup_notifications BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for notifications
ALTER TABLE duitkita.user_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notification settings" 
  ON duitkita.user_notifications 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notification settings" 
  ON duitkita.user_notifications 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own notification settings" 
  ON duitkita.user_notifications 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create function to automatically create notification preferences for new users
CREATE OR REPLACE FUNCTION duitkita.handle_new_user_notifications()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO duitkita.user_notifications (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$;

-- Create trigger for new user notifications
CREATE TRIGGER on_auth_user_created_notifications
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE PROCEDURE duitkita.handle_new_user_notifications();

-- Enable pg_cron extension for scheduled tasks
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule daily backup at 2 AM
SELECT cron.schedule(
  'daily-backup-export',
  '0 2 * * *',
  $$
  SELECT net.http_post(
    url := 'https://fhmsgmbqpodihbtqnnsj.supabase.co/functions/v1/daily-backup',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZobXNnbWJxcG9kaWhidHFubnNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIwNzI1MzQsImV4cCI6MjA2NzY0ODUzNH0.alhDM8Hf7IGGib76-DuONOopRXNj-YBDhqiZVrhtAfA"}'::jsonb,
    body := '{"scheduled": true}'::jsonb
  );
  $$
);
