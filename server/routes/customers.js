import express from 'express';
import { getStore } from '../db.js';
import { supabase } from '../supabase.js';

const router = express.Router();

function mergeCustomers(local = [], remote = []) {
  const map = new Map();
  for (const c of local) {
    if (c && c.id) map.set(c.id, c);
  }
  for (const c of remote) {
    if (c && c.id) map.set(c.id, { ...map.get(c.id), ...c });
  }
  return Array.from(map.values());
}

// GET all customers (merges Supabase data with local store.json)
router.get('/', async (req, res) => {
  const store = getStore();
  const localCustomers = store.customers || [];
  let supabaseCustomers = [];

  if (supabase) {
    try {
      const { data, error } = await supabase.from('customers').select('*');
      if (!error && Array.isArray(data)) {
        supabaseCustomers = data;
      }
    } catch (e) {}
  }

  const customers = mergeCustomers(localCustomers, supabaseCustomers);
  res.json(customers);
});

export default router;
