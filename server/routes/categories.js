import express from 'express';
import { getStore, saveStore } from '../db.js';
import { supabase, upsertCategoryInSupabase, deleteCategoryFromSupabase } from '../supabase.js';

const router = express.Router();

// GET all categories (merges live Supabase data with local store.json)
router.get('/', async (req, res) => {
  const store = getStore();
  const localCategories = store.categories || [];
  let supabaseCategories = [];

  if (supabase) {
    try {
      const { data, error } = await supabase.from('categories').select('name');
      if (!error && Array.isArray(data)) {
        supabaseCategories = data.map(c => c.name);
      }
    } catch (e) {}
  }

  // Deduplicated merged categories
  const categories = Array.from(new Set([...localCategories, ...supabaseCategories]));

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

  store.categories = store.categories || [];
  if (!store.categories.includes(trimmed)) {
    store.categories.push(trimmed);
    await saveStore(store);
  }

  await upsertCategoryInSupabase(trimmed);

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
