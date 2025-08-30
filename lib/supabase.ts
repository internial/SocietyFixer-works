import { createClient } from '@supabase/supabase-js';

// --- IMPORTANT ---
// You can find your Supabase URL and anon key in your project's API settings.
export const supabaseUrl = 'https://zoqupyhxbpzwwxqqtzkl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpvcXVweWh4YnB6d3d4cXF0emtsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY1ODY1NzYsImV4cCI6MjA3MjE2MjU3Nn0.JmeqsdivbuYihRg54HsGVmgUE_uGlBpiIQKD6-uWwZc';

// Ensure the variables are provided before trying to create a client.
if (!supabaseUrl || !supabaseAnonKey ) {
  throw new Error("Supabase credentials are not configured. Please open 'lib/supabase.ts' and add your project URL and anon key.");
}

/**
 * The singleton instance of the Supabase client.
 * This is used throughout the application to interact with the Supabase backend.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);