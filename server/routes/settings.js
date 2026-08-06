import express from 'express';
import { getStore, saveStore } from '../db.js';

const router = express.Router();

// GET store settings
router.get('/', (req, res) => {
  const store = getStore();
  res.json(store.settings || {});
});

// PUT update store settings
router.put('/', (req, res) => {
  const store = getStore();
  store.settings = {
    ...store.settings,
    ...req.body
  };
  saveStore(store);
  res.json(store.settings);
});

export default router;
