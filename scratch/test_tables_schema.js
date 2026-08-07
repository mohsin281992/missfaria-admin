import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const secretKey = process.env.SUPABASE_SECRET_KEY;

const supabase = createClient(supabaseUrl, secretKey);

async function checkSchema() {
  console.log('Checking existing tables/schema in Supabase...');

  // Try querying common table names
  const testNames = ['products', 'categories', 'orders', 'customers', 'settings', 'store', 'data', 'app_data', 'items', 'users'];
  for (const name of testNames) {
    const { data, error } = await supabase.from(name).select('*').limit(1);
    if (!error) {
      console.log(`FOUND TABLE: '${name}'`);
    }
  }

  // Try creating a test table via RPC or standard REST if enabled
  try {
    const { data: rpcData, error: rpcErr } = await supabase.rpc('exec_sql', { sql: 'SELECT 1;' });
    console.log('RPC exec_sql result:', { rpcData, rpcErr });
  } catch (e) {
    console.log('RPC exec_sql not available:', e.message);
  }
}

checkSchema();
