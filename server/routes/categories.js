import express from 'express';
import { getStore, saveStore } from '../db.js';
import { supabase, deleteCategoryFromSupabase } from '../supabase.js';

const router = express.Router();

// GET all categories (live from Supabase with fallback)
router.get('/', async (req, res) => {
  let categories = [];
  if (supabase) {
    try {
      const { data, error } = await supabase.from('categories').select('name');
      if (!error && Array.isArray(data) && data.length > 0) {
        categories = data.map(c => c.name);
      }
    } catch (e) {}
  }

  if (!categories.length) {
    const store = getStore();
    categories = store.categories || [];
  }

  res.json(categories);
});

// POST add category
router.post('/', async (req, res) => {
  const { name } = req.body;
  if (!name || typeof name !== 'string') {
    return res.status(400).json({ error: 'Category name is required' });
  }

  const trimmed = name.trim();
  const store = getStore();

  if (!store.categories.includes(trimmed)) {
    store.categories.push(trimmed);
    await saveStore(store);
  }

  if (supabase) {
    await supabase.from('categories').upsert([{ name: trimmed }], { onConflict: 'name' }).catch(e => console.warn('Supabase category add err:', e.message));
  }

  res.status(201).json(store.categories);
});

// DELETE category
router.delete('/:name', async (req, res) => {
  const categoryName = decodeURIComponent(req.params.name);
  const store = getStore();

  store.categories = (store.categories || []).filter(c => c !== categoryName);
  await saveStore(store);
  await deleteCategoryFromSupabase(categoryName);

  res.json(store.categories);
});

export default router;


