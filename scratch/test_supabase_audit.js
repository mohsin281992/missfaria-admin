import { isSupabaseConnected, syncStoreToSupabase, supabase } from '../server/supabase.js';
import { getStore } from '../server/db.js';

console.log('=== SUPABASE PERSISTENCE AUDIT ===');
console.log('1. Is Supabase connected?', isSupabaseConnected());
console.log('2. Supabase Client Instance:', supabase ? 'Active' : 'NULL (SUPABASE_URL missing in .env)');

const currentData = getStore();
console.log('3. Store loaded locally:', {
  productsCount: currentData.products?.length || 0,
  categoriesCount: currentData.categories?.length || 0,
  ordersCount: currentData.orders?.length || 0,
  customersCount: currentData.customers?.length || 0,
  hasSettings: !!currentData.settings
});

console.log('4. Attempting syncStoreToSupabase()...');
const syncResult = await syncStoreToSupabase(currentData);
console.log('5. Sync result:', syncResult);
