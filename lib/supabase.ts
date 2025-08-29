import { createClient } from '@supabase/supabase-js';

// The application was failing because it was trying to read Supabase credentials
// from `process.env`, which is not available in this browser-only environment.
// The credentials are now defined here directly to ensure the database connection is established.
// In a production environment, these should be managed through a secure environment variable system.
const supabaseUrl = "https://oduqbidlonpeysuwtgtx.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9kdXFiaWRsb25wZXlzdXd0Z3R4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwNzk3NzAsImV4cCI6MjA3MTY1NTc3MH0.Aepgg6nzq1tlgNXo7RIkTFoWEEwFGJYjzLZg-MUmeYE";

/**
 * The singleton instance of the Supabase client.
 * This is used throughout the application to interact with the Supabase backend.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);