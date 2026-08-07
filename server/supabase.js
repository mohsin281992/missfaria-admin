import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || '';

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
  
  const results = {};
  
  try {
    if (storeData.products && storeData.products.length > 0) {
      const { error: pErr } = await supabase.from('products').upsert(storeData.products, { onConflict: 'id' });
      results.products = pErr ? pErr.message : 'OK';
    }
    
    if (storeData.categories && storeData.categories.length > 0) {
      const catRecords = storeData.categories.map(name => ({ name }));
      const { error: cErr } = await supabase.from('categories').upsert(catRecords, { onConflict: 'name' });
      results.categories = cErr ? cErr.message : 'OK';
    }
    
    if (storeData.orders && storeData.orders.length > 0) {
      const { error: oErr } = await supabase.from('orders').upsert(storeData.orders, { onConflict: 'id' });
      results.orders = oErr ? oErr.message : 'OK';
    }

    if (storeData.customers && storeData.customers.length > 0) {
      const { error: custErr } = await supabase.from('customers').upsert(storeData.customers, { onConflict: 'id' });
      results.customers = custErr ? custErr.message : 'OK';
    }

    if (storeData.settings) {
      const { error: sErr } = await supabase.from('settings').upsert({ id: 1, ...storeData.settings }, { onConflict: 'id' });
      results.settings = sErr ? sErr.message : 'OK';
    }

    if (storeData.announcementBar) {
      const { error: abErr } = await supabase.from('announcement_bar').upsert({ id: 1, ...storeData.announcementBar }, { onConflict: 'id' });
      results.announcement_bar = abErr ? abErr.message : 'OK';
    }

    if (storeData.trustBadges && storeData.trustBadges.length > 0) {
      const { error: tbErr } = await supabase.from('trust_badges').upsert(storeData.trustBadges, { onConflict: 'id' });
      results.trust_badges = tbErr ? tbErr.message : 'OK';
    }

    if (storeData.bundleOffers && storeData.bundleOffers.length > 0) {
      const { error: boErr } = await supabase.from('bundle_offers').upsert(storeData.bundleOffers, { onConflict: 'id' });
      results.bundle_offers = boErr ? boErr.message : 'OK';
    }

    if (storeData.stockCounters) {
      const { error: scErr } = await supabase.from('stock_counters').upsert({ id: 1, ...storeData.stockCounters }, { onConflict: 'id' });
      results.stock_counters = scErr ? scErr.message : 'OK';
    }

    if (storeData.faqs && storeData.faqs.length > 0) {
      const { error: faqErr } = await supabase.from('faqs').upsert(storeData.faqs, { onConflict: 'id' });
      results.faqs = faqErr ? faqErr.message : 'OK';
    }

    if (storeData.reviews && storeData.reviews.length > 0) {
      const { error: revErr } = await supabase.from('reviews').upsert(storeData.reviews, { onConflict: 'id' });
      results.reviews = revErr ? revErr.message : 'OK';
    }

    const hasErrors = Object.values(results).some(val => val !== 'OK');
    return { success: !hasErrors, details: results };
  } catch (err) {
    console.warn('Supabase sync warning:', err.message);
    return { success: false, error: err.message, details: results };
  }
}export async function fetchStoreFromSupabase() {
  if (!supabase) return null;
  try {
    const [prodsRes, catsRes, ordsRes, custsRes, setsRes] = await Promise.all([
      supabase.from('products').select('*').order('createdAt', { ascending: false }),
      supabase.from('categories').select('name'),
      supabase.from('orders').select('*').order('createdAt', { ascending: false }),
      supabase.from('customers').select('*'),
      supabase.from('settings').select('*').eq('id', 1).single()
    ]);

    const products = prodsRes.data || null;
    const categories = catsRes.data ? catsRes.data.map(c => c.name) : null;
    const orders = ordsRes.data || null;
    const customers = custsRes.data || null;
    let settings = setsRes.data || null;
    if (settings && settings.id) {
      delete settings.id;
    }

    return { products, categories, orders, customers, settings };
  } catch (err) {
    console.warn('Error reading store from Supabase:', err.message);
    return null;
  }
}

export async function deleteProductFromSupabase(id) {
  if (!supabase) return;
  await supabase.from('products').delete().eq('id', id).catch(e => console.warn('Supabase product delete err:', e.message));
}

export async function deleteCategoryFromSupabase(name) {
  if (!supabase) return;
  await supabase.from('categories').delete().eq('name', name).catch(e => console.warn('Supabase category delete err:', e.message));
}

export async function deleteOrderFromSupabase(id) {
  if (!supabase) return;
  await supabase.from('orders').delete().eq('id', id).catch(e => console.warn('Supabase order delete err:', e.message));
}

