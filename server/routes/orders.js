import express from 'express';
import { getStore, saveStore } from '../db.js';
import { getDb, isMongoConnected } from '../mongodb.js';

const router = express.Router();

// GET all orders
router.get('/', async (req, res) => {
  if (isMongoConnected()) {
    try {
      const db = getDb();
      const orders = await db.collection('orders').find({}).toArray();
      return res.json(orders);
    } catch (err) {
      console.error('MongoDB orders error:', err);
    }
  }

  const store = getStore();
  res.json(store.orders || []);
});

// PATCH update order status
router.patch('/:id', async (req, res) => {
  const { status } = req.body;
  if (!status) {
    return res.status(400).json({ error: 'Status is required' });
  }

  if (isMongoConnected()) {
    try {
      const db = getDb();
      await db.collection('orders').updateOne({ id: req.params.id }, { $set: { status } });
      const updated = await db.collection('orders').findOne({ id: req.params.id });
      if (updated) return res.json(updated);
    } catch (err) {
      console.error('MongoDB update order error:', err);
    }
  }

  const store = getStore();
  const order = store.orders.find(o => o.id === req.params.id);

  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  order.status = status;
  saveStore(store);

  res.json(order);
});

// DELETE order
router.delete('/:id', async (req, res) => {
  if (isMongoConnected()) {
    try {
      const db = getDb();
      const result = await db.collection('orders').deleteOne({ id: req.params.id });
      if (result.deletedCount > 0) {
        return res.json({ message: 'Order deleted successfully', id: req.params.id });
      }
    } catch (err) {
      console.error('MongoDB delete order error:', err);
    }
  }

  const store = getStore();
  const initialLength = store.orders.length;
  store.orders = store.orders.filter(o => o.id !== req.params.id);

  if (store.orders.length === initialLength) {
    return res.status(404).json({ error: 'Order not found' });
  }

  saveStore(store);
  res.json({ message: 'Order deleted successfully', id: req.params.id });
});

export default router;
