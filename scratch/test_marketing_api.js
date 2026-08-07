import { syncStoreToSupabase } from '../server/supabase.js';
import { getStore } from '../server/db.js';

console.log('=== MARKETING MODULES & SUPABASE SYNC AUDIT ===');
const store = getStore();

console.log('Local store modules dataset checklist:');
console.log('1. Announcement Bar:', !!store.announcementBar, store.announcementBar?.tickerText?.slice(0, 30));
console.log('2. Trust Badges Count:', store.trustBadges?.length);
console.log('3. Bundle Offers Count:', store.bundleOffers?.length);
console.log('4. Stock Counters & Timers:', !!store.stockCounters, store.stockCounters?.flashSaleTitle);
console.log('5. FAQs Count:', store.faqs?.length);
console.log('6. Reviews Count:', store.reviews?.length);

console.log('\nTesting syncStoreToSupabase()...');
const res = await syncStoreToSupabase(store);
console.log('Sync Result:', res);
