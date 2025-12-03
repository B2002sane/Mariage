import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://syefssndewlymjxqbkqd.supabase.co'; // ton URL Supabase

const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN5ZWZzc25kZXdseW1qeHFia3FkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3NDgwNDgsImV4cCI6MjA4MDMyNDA0OH0._QJIPQwXEBINSjJTIXU3GyZEiV5twCP1pxw1JaBVjPs'; // ta clé anonyme

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
