import express from 'express';
import { getStore, saveStore } from '../db.js';

const router = express.Router();

// GET all products (with optional filtering)
router.get('/', (req, res) => {
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
router.get('/:id', (req, res) => {
  const store = getStore();
  const product = store.products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

// POST create product
router.post('/', (req, res) => {
  const store = getStore();
  const now = new Date().toISOString().split('T')[0];
  
  const newProduct = {
    ...req.body,
    id: `prod-${Date.now()}`,
    createdAt: now,
    updatedAt: now
  };

  store.products.unshift(newProduct);
  saveStore(store);

  res.status(201).json(newProduct);
});

// PUT update product
router.put('/:id', (req, res) => {
  const store = getStore();
  const index = store.products.findIndex(p => p.id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const updatedProduct = {
    ...store.products[index],
    ...req.body,
    updatedAt: new Date().toISOString().split('T')[0]
  };

  store.products[index] = updatedProduct;
  saveStore(store);

  res.json(updatedProduct);
});

// DELETE product
router.delete('/:id', (req, res) => {
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
router.post('/:id/duplicate', (req, res) => {
  const store = getStore();
  const product = store.products.find(p => p.id === req.params.id);

  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const now = new Date().toISOString().split('T')[0];
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
