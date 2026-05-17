import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://cywccfxglanhketofhyw.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_Bvk4aCHwE4V_LAaauYbEcg_OpxMh973';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
