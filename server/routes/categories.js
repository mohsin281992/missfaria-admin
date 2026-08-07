import express from 'express';
import { getStore, saveStore } from '../db.js';
import { deleteCategoryFromSupabase } from '../supabase.js';

const router = express.Router();

// GET all categories
router.get('/', (req, res) => {
  const store = getStore();
  res.json(store.categories || []);
});

// POST add category
router.post('/', (req, res) => {
  const { name } = req.body;
  if (!name || typeof name !== 'string') {
    return res.status(400).json({ error: 'Category name is required' });
  }

  const trimmed = name.trim();
  const store = getStore();

  if (!store.categories.includes(trimmed)) {
    store.categories.push(trimmed);
    saveStore(store);
  }

  res.status(201).json(store.categories);
});

// DELETE category
router.delete('/:name', (req, res) => {
  const categoryName = decodeURIComponent(req.params.name);
  const store = getStore();

  store.categories = store.categories.filter(c => c !== categoryName);
  saveStore(store);
  deleteCategoryFromSupabase(categoryName);

  res.json(store.categories);
});

export default router;

