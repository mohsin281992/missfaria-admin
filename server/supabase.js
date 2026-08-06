import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_GGxQUh0FAs-1ihxmstdl8w_Oc2Fna9d';

export const supabase = (supabaseUrl && supabaseUrl.startsWith('http')) 
  ? createClient(supabaseUrl, supabaseKey) 
  : null;

export function isSupabaseConnected() {
  return !!supabase;
}

export async function syncStoreToSupabase(storeData) {
  if (!supabase) {
    return { success: false, reason: 'SUPABASE_URL not configured in .env' };
  }
  try {
    // Attempt saving to Supabase kv/store table or individual tables
    if (storeData.products && storeData.products.length > 0) {
      await supabase.from('products').upsert(storeData.products, { onConflict: 'id' }).catch(() => {});
    }
    if (storeData.categories && storeData.categories.length > 0) {
      const catRecords = storeData.categories.map(name => ({ name }));
      await supabase.from('categories').upsert(catRecords, { onConflict: 'name' }).catch(() => {});
    }
    if (storeData.orders && storeData.orders.length > 0) {
      await supabase.from('orders').upsert(storeData.orders, { onConflict: 'id' }).catch(() => {});
    }
    return { success: true };
  } catch (err) {
    console.warn('Supabase sync warning:', err.message);
    return { success: false, error: err.message };
  }
}
