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

// Helper: ignore schema/table missing errors gracefully
function handleSupabaseError(tableName, error) {
  if (!error) return 'OK';
  if (error.code === '42P01' || error.message?.includes('schema cache')) {
    console.warn(`[Supabase Sync Note] Table '${tableName}' does not exist in Supabase yet. Changes saved to store.json.`);
    return `Table '${tableName}' missing`;
  }
  console.warn(`[Supabase Sync Warning] ${tableName}:`, error.message);
  return error.message;
}

export async function syncStoreToSupabase(storeData) {
  if (!supabase) {
    return { success: false, reason: 'SUPABASE_URL not configured in .env' };
  }
  
  const results = {};
  
  try {
    if (storeData.products && storeData.products.length > 0) {
      const { error } = await supabase.from('products').upsert(storeData.products, { onConflict: 'id' });
      results.products = handleSupabaseError('products', error);
    }
    
    if (storeData.categories && storeData.categories.length > 0) {
      const catRecords = storeData.categories.map(name => ({ name }));
      const { error } = await supabase.from('categories').upsert(catRecords, { onConflict: 'name' });
      results.categories = handleSupabaseError('categories', error);
    }
    
    if (storeData.orders && storeData.orders.length > 0) {
      const { error } = await supabase.from('orders').upsert(storeData.orders, { onConflict: 'id' });
      results.orders = handleSupabaseError('orders', error);
    }

    if (storeData.customers && storeData.customers.length > 0) {
      const { error } = await supabase.from('customers').upsert(storeData.customers, { onConflict: 'id' });
      results.customers = handleSupabaseError('customers', error);
    }

    if (storeData.settings) {
      const { error } = await supabase.from('settings').upsert({ id: 1, ...storeData.settings }, { onConflict: 'id' });
      results.settings = handleSupabaseError('settings', error);
    }

    if (storeData.announcementBar) {
      const { error } = await supabase.from('announcement_bar').upsert({ id: 1, ...storeData.announcementBar }, { onConflict: 'id' });
      results.announcement_bar = handleSupabaseError('announcement_bar', error);
    }

    if (storeData.trustBadges && storeData.trustBadges.length > 0) {
      const { error } = await supabase.from('trust_badges').upsert(storeData.trustBadges, { onConflict: 'id' });
      results.trust_badges = handleSupabaseError('trust_badges', error);
    }

    if (storeData.bundleOffers && storeData.bundleOffers.length > 0) {
      const { error } = await supabase.from('bundle_offers').upsert(storeData.bundleOffers, { onConflict: 'id' });
      results.bundle_offers = handleSupabaseError('bundle_offers', error);
    }

    if (storeData.stockCounters) {
      const { error } = await supabase.from('stock_counters').upsert({ id: 1, ...storeData.stockCounters }, { onConflict: 'id' });
      results.stock_counters = handleSupabaseError('stock_counters', error);
    }

    if (storeData.faqs && storeData.faqs.length > 0) {
      const { error } = await supabase.from('faqs').upsert(storeData.faqs, { onConflict: 'id' });
      results.faqs = handleSupabaseError('faqs', error);
    }

    if (storeData.reviews && storeData.reviews.length > 0) {
      const { error } = await supabase.from('reviews').upsert(storeData.reviews, { onConflict: 'id' });
      results.reviews = handleSupabaseError('reviews', error);
    }

    const hasCriticalErrors = Object.entries(results).some(([table, res]) => res !== 'OK' && !res.includes('missing'));
    return { success: !hasCriticalErrors, details: results };
  } catch (err) {
    console.warn('Supabase sync warning:', err.message);
    return { success: false, error: err.message, details: results };
  }
}

export async function fetchStoreFromSupabase() {
  if (!supabase) return null;
  try {
    const [prodsRes, catsRes, ordsRes, custsRes, setsRes] = await Promise.all([
      supabase.from('products').select('*').order('createdAt', { ascending: false }).catch(() => ({ data: null })),
      supabase.from('categories').select('name').catch(() => ({ data: null })),
      supabase.from('orders').select('*').order('createdAt', { ascending: false }).catch(() => ({ data: null })),
      supabase.from('customers').select('*').catch(() => ({ data: null })),
      supabase.from('settings').select('*').eq('id', 1).single().catch(() => ({ data: null }))
    ]);

    const products = prodsRes?.data || null;
    const categories = catsRes?.data ? catsRes.data.map(c => c.name) : null;
    const orders = ordsRes?.data || null;
    const customers = custsRes?.data || null;
    let settings = setsRes?.data || null;
    if (settings && settings.id) {
      delete settings.id;
    }

    return { products, categories, orders, customers, settings };
  } catch (err) {
    console.warn('Error reading store from Supabase:', err.message);
    return null;
  }
}

// Individual Entity Sync Helpers for realtime updates
export async function upsertProductInSupabase(product) {
  if (!supabase) return;
  await supabase.from('products').upsert([product], { onConflict: 'id' }).catch(e => handleSupabaseError('products', e));
}

export async function deleteProductFromSupabase(id) {
  if (!supabase) return;
  await supabase.from('products').delete().eq('id', id).catch(e => handleSupabaseError('products', e));
}

export async function upsertCategoryInSupabase(name) {
  if (!supabase) return;
  await supabase.from('categories').upsert([{ name }], { onConflict: 'name' }).catch(e => handleSupabaseError('categories', e));
}

export async function deleteCategoryFromSupabase(name) {
  if (!supabase) return;
  await supabase.from('categories').delete().eq('name', name).catch(e => handleSupabaseError('categories', e));
}

export async function upsertOrderInSupabase(order) {
  if (!supabase) return;
  await supabase.from('orders').upsert([order], { onConflict: 'id' }).catch(e => handleSupabaseError('orders', e));
}

export async function deleteOrderFromSupabase(id) {
  if (!supabase) return;
  await supabase.from('orders').delete().eq('id', id).catch(e => handleSupabaseError('orders', e));
}

export async function upsertSettingsInSupabase(settings) {
  if (!supabase) return;
  await supabase.from('settings').upsert({ id: 1, ...settings }, { onConflict: 'id' }).catch(e => handleSupabaseError('settings', e));
}
