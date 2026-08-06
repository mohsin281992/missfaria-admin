import express from 'express';
import { getStore } from '../db.js';
import { getDb, isMongoConnected } from '../mongodb.js';

const router = express.Router();

// GET analytics overview metrics
router.get('/', async (req, res) => {
  let products = [];
  let orders = [];
  let customers = [];

  if (isMongoConnected()) {
    try {
      const db = getDb();
      products = await db.collection('products').find({}).toArray();
      orders = await db.collection('orders').find({}).toArray();
      customers = await db.collection('customers').find({}).toArray();
    } catch (err) {
      console.error('MongoDB analytics fetch error:', err);
    }
  }

  if (products.length === 0 && orders.length === 0) {
    const store = getStore();
    products = store.products || [];
    orders = store.orders || [];
    customers = store.customers || [];
  }

  const totalRevenue = orders.reduce((sum, order) => {
    return order.status !== 'Refunded' && order.status !== 'Cancelled' ? sum + Number(order.total || 0) : sum;
  }, 0);

  const totalOrders = orders.length;
  const totalProducts = products.length;
  const lowStockCount = products.filter(p => Number(p.stockQuantity) <= Number(p.lowStockThreshold || 10)).length;
  const totalCustomers = customers.length;

  const categoryDistribution = products.reduce((acc, p) => {
    const cat = p.primaryCategory || 'Uncategorized';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  res.json({
    metrics: {
      totalRevenue: Number(totalRevenue.toFixed(2)),
      totalOrders,
      totalProducts,
      lowStockCount,
      totalCustomers
    },
    categoryDistribution
  });
});

export default router;
