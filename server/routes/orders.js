import express from 'express';
import { getStore, saveStore } from '../db.js';

const router = express.Router();

// GET all orders
router.get('/', (req, res) => {
  const store = getStore();
  res.json(store.orders || []);
});

// PATCH update order status
router.patch('/:id', (req, res) => {
  const { status } = req.body;
  if (!status) {
    return res.status(400).json({ error: 'Status is required' });
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
router.delete('/:id', (req, res) => {
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
