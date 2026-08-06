import express from 'express';
import { getStore } from '../db.js';
import { getDb, isMongoConnected } from '../mongodb.js';

const router = express.Router();

// GET all customers
router.get('/', async (req, res) => {
  if (isMongoConnected()) {
    try {
      const db = getDb();
      const customers = await db.collection('customers').find({}).toArray();
      return res.json(customers);
    } catch (err) {
      console.error('MongoDB customers error:', err);
    }
  }

  const store = getStore();
  res.json(store.customers || []);
});

export default router;
