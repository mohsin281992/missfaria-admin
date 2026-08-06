import express from 'express';
import { getStore, saveStore } from '../db.js';
import { getDb, isMongoConnected } from '../mongodb.js';

const router = express.Router();

// GET all products (with optional filtering)
router.get('/', async (req, res) => {
  if (isMongoConnected()) {
    try {
      const db = getDb();
      const { category, search, status } = req.query;
      let query = {};

      if (category && category !== 'All') {
        query.primaryCategory = category;
      }
      if (status) {
        query.publishStatus = status;
      }
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { sku: { $regex: search, $options: 'i' } },
          { brand: { $regex: search, $options: 'i' } }
        ];
      }

      const products = await db.collection('products').find(query).toArray();
      return res.json(products);
    } catch (err) {
      console.error('MongoDB products error:', err);
    }
  }

  // Fallback to store.json
  const store = getStore();
  let products = store.products || [];
  
  const { category, search, status } = req.query;

  if (category && category !== 'All') {
    products = products.filter(p => p.primaryCategory === category);
  }

  if (search) {
    const q = search.toLowerCase();
    products = products.filter(p => 
      p.title?.toLowerCase().includes(q) ||
      p.sku?.toLowerCase().includes(q) ||
      p.brand?.toLowerCase().includes(q) ||
      p.tags?.some(t => t.toLowerCase().includes(q))
    );
  }

  if (status) {
    products = products.filter(p => p.publishStatus === status);
  }

  res.json(products);
});

// GET single product
router.get('/:id', async (req, res) => {
  if (isMongoConnected()) {
    try {
      const db = getDb();
      const product = await db.collection('products').findOne({ id: req.params.id });
      if (product) return res.json(product);
    } catch (err) {
      console.error('MongoDB product by id error:', err);
    }
  }

  const store = getStore();
  const product = store.products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

// POST create product
router.post('/', async (req, res) => {
  const now = new Date().toISOString().split('T')[0];
  const newProduct = {
    ...req.body,
    id: `prod-${Date.now()}`,
    createdAt: now,
    updatedAt: now
  };

  if (isMongoConnected()) {
    try {
      const db = getDb();
      await db.collection('products').insertOne(newProduct);
      return res.status(201).json(newProduct);
    } catch (err) {
      console.error('MongoDB insert product error:', err);
    }
  }

  const store = getStore();
  store.products.unshift(newProduct);
  saveStore(store);

  res.status(201).json(newProduct);
});

// PUT update product
router.put('/:id', async (req, res) => {
  const now = new Date().toISOString().split('T')[0];

  if (isMongoConnected()) {
    try {
      const db = getDb();
      const existing = await db.collection('products').findOne({ id: req.params.id });
      if (existing) {
        const updated = { ...existing, ...req.body, updatedAt: now };
        delete updated._id; // avoid mutating immutable _id
        await db.collection('products').updateOne({ id: req.params.id }, { $set: updated });
        return res.json(updated);
      }
    } catch (err) {
      console.error('MongoDB update product error:', err);
    }
  }

  const store = getStore();
  const index = store.products.findIndex(p => p.id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const updatedProduct = {
    ...store.products[index],
    ...req.body,
    updatedAt: now
  };

  store.products[index] = updatedProduct;
  saveStore(store);

  res.json(updatedProduct);
});

// DELETE product
router.delete('/:id', async (req, res) => {
  if (isMongoConnected()) {
    try {
      const db = getDb();
      const result = await db.collection('products').deleteOne({ id: req.params.id });
      if (result.deletedCount > 0) {
        return res.json({ message: 'Product deleted successfully', id: req.params.id });
      }
    } catch (err) {
      console.error('MongoDB delete product error:', err);
    }
  }

  const store = getStore();
  const initialCount = store.products.length;
  store.products = store.products.filter(p => p.id !== req.params.id);
  
  if (store.products.length === initialCount) {
    return res.status(404).json({ error: 'Product not found' });
  }

  saveStore(store);
  res.json({ message: 'Product deleted successfully', id: req.params.id });
});

// POST duplicate product
router.post('/:id/duplicate', async (req, res) => {
  const now = new Date().toISOString().split('T')[0];

  if (isMongoConnected()) {
    try {
      const db = getDb();
      const product = await db.collection('products').findOne({ id: req.params.id });
      if (product) {
        const duplicated = {
          ...product,
          id: `prod-${Date.now()}`,
          title: `${product.title} (Copy)`,
          sku: `${product.sku}-COPY`,
          slug: `${product.slug}-copy`,
          createdAt: now,
          updatedAt: now
        };
        delete duplicated._id;
        await db.collection('products').insertOne(duplicated);
        return res.status(201).json(duplicated);
      }
    } catch (err) {
      console.error('MongoDB duplicate product error:', err);
    }
  }

  const store = getStore();
  const product = store.products.find(p => p.id === req.params.id);

  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const duplicated = {
    ...product,
    id: `prod-${Date.now()}`,
    title: `${product.title} (Copy)`,
    sku: `${product.sku}-COPY`,
    slug: `${product.slug}-copy`,
    createdAt: now,
    updatedAt: now
  };

  store.products.unshift(duplicated);
  saveStore(store);

  res.status(201).json(duplicated);
});

export default router;
