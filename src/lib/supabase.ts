import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vyohajurajknstksckik.supabase.co';
const supabaseAnonKey = 'sb_publishable_A6nwwEgjc3OR2PlotQG0Dg_h2u05Jjg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
