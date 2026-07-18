import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Mock object to prevent runtime errors when Supabase is not configured
const mockSupabase = {
  auth: {
    getSession: () => Promise.resolve({ data: { session: null } }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    signInWithPassword: () => Promise.resolve({ error: new Error('Supabase not configured') }),
    signOut: () => Promise.resolve(),
    updateUser: () => Promise.resolve({ error: new Error('Supabase not configured') }),
    resetPasswordForEmail: () => Promise.resolve({ error: new Error('Supabase not configured') })
  },
  from: () => ({
    select: () => ({
      eq: () => Promise.resolve({ data: [], error: null }),
      order: () => Promise.resolve({ data: [], error: null })
    }),
    insert: () => Promise.resolve({ error: new Error('Supabase not configured') }),
    update: () => ({
      eq: () => Promise.resolve({ error: new Error('Supabase not configured') })
    })
  })
};

export const supabase = supabaseUrl && supabaseAnonKey && supabaseUrl !== 'your_supabase_project_url'
  ? createClient(supabaseUrl, supabaseAnonKey)
  : mockSupabase;
