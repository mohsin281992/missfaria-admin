import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || 'https://xyzcompany.supabase.co'; // Check URL
const supabaseKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_PUBLISHABLE_KEY;

console.log('Testing Supabase Connection...');
console.log('SUPABASE_URL:', supabaseUrl);
console.log('SUPABASE_KEY:', supabaseKey ? 'PRESENT' : 'MISSING');

if (!process.env.SUPABASE_URL) {
  console.log('RESULT: SUPABASE_URL is missing in .env file!');
}
