import { createClient } from "@supabase/supabase-js";

const default_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qaHZ3b254ZGFjZXhhc25ramhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc5NzA1OTMsImV4cCI6MjA0MzU0NjU5M30.-5Bu3ladbvlrIrYitu6V14lp-oPHab4M-UnUtzwRrb0'

const supabaseUrl = process.env.SUPABASE_URL || 'https://ojhvwonxdacexasnkjhp.supabase.co'
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || default_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
