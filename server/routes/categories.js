import express from 'express';
import { getStore, saveStore } from '../db.js';
import { getDb, isMongoConnected } from '../mongodb.js';

const router = express.Router();

// GET all categories
router.get('/', async (req, res) => {
  if (isMongoConnected()) {
    try {
      const db = getDb();
      const cats = await db.collection('categories').find({}).toArray();
      return res.json(cats.map(c => c.name));
    } catch (err) {
      console.error('MongoDB categories error:', err);
    }
  }

  const store = getStore();
  res.json(store.categories || []);
});

// POST add category
router.post('/', async (req, res) => {
  const { name } = req.body;
  if (!name || typeof name !== 'string') {
    return res.status(400).json({ error: 'Category name is required' });
  }

  const trimmed = name.trim();

  if (isMongoConnected()) {
    try {
      const db = getDb();
      const existing = await db.collection('categories').findOne({ name: trimmed });
      if (!existing) {
        await db.collection('categories').insertOne({ name: trimmed });
      }
      const cats = await db.collection('categories').find({}).toArray();
      return res.status(201).json(cats.map(c => c.name));
    } catch (err) {
      console.error('MongoDB add category error:', err);
    }
  }

  const store = getStore();
  if (!store.categories.includes(trimmed)) {
    store.categories.push(trimmed);
    saveStore(store);
  }

  res.status(201).json(store.categories);
});

// DELETE category
router.delete('/:name', async (req, res) => {
  const categoryName = decodeURIComponent(req.params.name);

  if (isMongoConnected()) {
    try {
      const db = getDb();
      await db.collection('categories').deleteOne({ name: categoryName });
      const cats = await db.collection('categories').find({}).toArray();
      return res.json(cats.map(c => c.name));
    } catch (err) {
      console.error('MongoDB delete category error:', err);
    }
  }

  const store = getStore();
  store.categories = store.categories.filter(c => c !== categoryName);
  saveStore(store);

  res.json(store.categories);
});

export default router;
