import express from 'express';
import { getStore } from '../db.js';

const router = express.Router();

// GET all customers
router.get('/', (req, res) => {
  const store = getStore();
  res.json(store.customers || []);
});

export default router;
