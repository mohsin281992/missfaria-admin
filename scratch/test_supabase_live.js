import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const secretKey = process.env.SUPABASE_SECRET_KEY;
const pubKey = process.env.SUPABASE_PUBLISHABLE_KEY;

console.log('Testing Supabase Client connection with:', { supabaseUrl, secretKey, pubKey });

const clientWithSecret = createClient(supabaseUrl, secretKey);
const clientWithPub = createClient(supabaseUrl, pubKey);

async function testConnection() {
  console.log('\n--- 1. Testing query with SECRET KEY ---');
  try {
    const { data, error } = await clientWithSecret.from('products').select('*').limit(5);
    if (error) {
      console.error('Error querying products table (secret key):', error);
    } else {
      console.log('SUCCESS querying products table (secret key):', data);
    }
  } catch (err) {
    console.error('Exception querying products table (secret key):', err);
  }

  console.log('\n--- 2. Testing query with PUBLISHABLE KEY ---');
  try {
    const { data, error } = await clientWithPub.from('products').select('*').limit(5);
    if (error) {
      console.error('Error querying products table (pub key):', error);
    } else {
      console.log('SUCCESS querying products table (pub key):', data);
    }
  } catch (err) {
    console.error('Exception querying products table (pub key):', err);
  }

  console.log('\n--- 3. Testing other tables ---');
  for (const tableName of ['categories', 'orders', 'customers', 'settings']) {
    try {
      const { data, error } = await clientWithSecret.from(tableName).select('*').limit(1);
      if (error) {
        console.log(`Table '${tableName}' status:`, error.message, `(code: ${error.code})`);
      } else {
        console.log(`Table '${tableName}' exists! Rows count sample:`, data.length);
      }
    } catch (e) {
      console.log(`Table '${tableName}' error:`, e.message);
    }
  }
}

testConnection();
