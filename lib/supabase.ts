import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-url.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

if (process.env.NEXT_PUBLIC_SUPABASE_URL === 'your_supabase_project_url' || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
  console.warn('Supabase URL or Anon Key is using placeholders. Checkout features will not work until you provide real keys in .env');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

