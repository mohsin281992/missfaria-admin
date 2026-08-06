import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_GGxQUh0FAs-1ihxmstdl8w_Oc2Fna9d';

export const supabase = supabaseUrl ? createClient(supabaseUrl, supabaseKey) : null;
