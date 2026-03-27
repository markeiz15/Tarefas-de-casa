import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://wdmcbfyzblvclckizjly.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_pct9CPedF3BKc02i_5orRQ_2-aOKJz3';

// Exportando o cliente para ser utilizado nos componentes
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
