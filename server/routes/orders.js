import express from 'express';
import { getStore, saveStore } from '../db.js';
import { supabase, upsertOrderInSupabase, deleteOrderFromSupabase } from '../supabase.js';

const router = express.Router();

function mergeOrders(localOrders = [], supabaseOrders = []) {
  const map = new Map();
  for (const o of localOrders) {
    if (o && o.id) map.set(o.id, o);
  }
  for (const o of supabaseOrders) {
    if (o && o.id) map.set(o.id, { ...map.get(o.id), ...o });
  }
  return Array.from(map.values());
}

// GET all orders (merges Supabase data with local store.json)
router.get('/', async (req, res) => {
  const store = getStore();
  const localOrders = store.orders || [];
  let supabaseOrders = [];

  if (supabase) {
    try {
      const { data, error } = await supabase.from('orders').select('*').order('createdAt', { ascending: false });
      if (!error && Array.isArray(data)) {
        supabaseOrders = data;
      }
    } catch (e) {}
  }

  const orders = mergeOrders(localOrders, supabaseOrders);
  res.json(orders);
});

// PATCH update order status
router.patch('/:id', async (req, res) => {
  const { status } = req.body;
  if (!status) {
    return res.status(400).json({ error: 'Status is required' });
  }

  const store = getStore();
  store.orders = store.orders || [];
  const order = store.orders.find(o => o.id === req.params.id);

  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  order.status = status;
  await saveStore(store);
  await upsertOrderInSupabase(order);

  res.json(order);
});

// DELETE order
router.delete('/:id', async (req, res) => {
  const store = getStore();
  store.orders = store.orders || [];
  const initialLength = store.orders.length;
  store.orders = store.orders.filter(o => o.id !== req.params.id);

  if (store.orders.length === initialLength) {
    return res.status(404).json({ error: 'Order not found' });
  }

  await saveStore(store);
  await deleteOrderFromSupabase(req.params.id);

  res.json({ message: 'Order deleted successfully', id: req.params.id });
});

export default router;
