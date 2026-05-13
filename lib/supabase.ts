import { createClient } from '@supabase/supabase-js'

// This pulls the secret keys from your .env.local file
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// This creates the connection to your Supabase database
export const supabase = createClient(supabaseUrl, supabaseAnonKey)