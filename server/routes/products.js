import express from 'express';
import { getStore, saveStore } from '../db.js';
import { supabase, upsertProductInSupabase, deleteProductFromSupabase } from '../supabase.js';

const router = express.Router();

// Utility function to merge Supabase products with local store products by ID
function mergeProducts(localList = [], supabaseList = []) {
  const map = new Map();
  // Insert local products first
  for (const p of localList) {
    if (p && p.id) map.set(p.id, p);
  }
  // Overlay/merge Supabase products
  for (const p of supabaseList) {
    if (p && p.id) {
      map.set(p.id, { ...map.get(p.id), ...p });
    }
  }
  return Array.from(map.values());
}

// GET all products (Merges live Supabase data with local store.json)
router.get('/', async (req, res) => {
  const store = getStore();
  let localProducts = store.products || [];
  let supabaseProducts = [];

  if (supabase) {
    try {
      const { data, error } = await supabase.from('products').select('*').order('createdAt', { ascending: false });
      if (!error && Array.isArray(data)) {
        supabaseProducts = data;
      }
    } catch (e) {
      console.warn('Supabase products fetch failed, using local store fallback:', e.message);
    }
  }

  // Merge products from both sources so no product is ever lost
  let products = mergeProducts(localProducts, supabaseProducts);

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
      p.tags?.some(t => typeof t === 'string' && t.toLowerCase().includes(q))
    );
  }

  if (status) {
    products = products.filter(p => p.publishStatus === status);
  }

  res.json(products);
});

// GET single product
router.get('/:id', async (req, res) => {
  const store = getStore();
  let product = (store.products || []).find(p => p.id === req.params.id);

  if (supabase) {
    try {
      const { data, error } = await supabase.from('products').select('*').eq('id', req.params.id).single();
      if (!error && data) {
        product = { ...(product || {}), ...data };
      }
    } catch (e) {}
  }

  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

// POST create product
router.post('/', async (req, res) => {
  const store = getStore();
  const now = new Date().toISOString().split('T')[0];
  
  const newProduct = {
    ...req.body,
    id: req.body.id || `prod-${Date.now()}`,
    createdAt: req.body.createdAt || now,
    updatedAt: now
  };

  store.products = store.products || [];
  store.products.unshift(newProduct);
  await saveStore(store);

  // Sync to Supabase
  await upsertProductInSupabase(newProduct);

  res.status(201).json(newProduct);
});

// PUT update product
router.put('/:id', async (req, res) => {
  const store = getStore();
  store.products = store.products || [];
  const index = store.products.findIndex(p => p.id === req.params.id);
  
  const updatedProduct = {
    ...(index !== -1 ? store.products[index] : {}),
    ...req.body,
    id: req.params.id,
    updatedAt: new Date().toISOString().split('T')[0]
  };

  if (index !== -1) {
    store.products[index] = updatedProduct;
  } else {
    store.products.unshift(updatedProduct);
  }

  await saveStore(store);

  // Sync to Supabase
  await upsertProductInSupabase(updatedProduct);

  res.json(updatedProduct);
});

// DELETE product
router.delete('/:id', async (req, res) => {
  const store = getStore();
  store.products = (store.products || []).filter(p => p.id !== req.params.id);
  
  await saveStore(store);
  await deleteProductFromSupabase(req.params.id);

  res.json({ message: 'Product deleted successfully', id: req.params.id });
});

// POST duplicate product
router.post('/:id/duplicate', async (req, res) => {
  const store = getStore();
  let product = (store.products || []).find(p => p.id === req.params.id);

  if (!product && supabase) {
    const { data } = await supabase.from('products').select('*').eq('id', req.params.id).single();
    if (data) product = data;
  }

  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const now = new Date().toISOString().split('T')[0];
  const duplicated = {
    ...product,
    id: `prod-${Date.now()}`,
    title: `${product.title} (Copy)`,
    sku: product.sku ? `${product.sku}-COPY` : `COPY-${Date.now()}`,
    slug: product.slug ? `${product.slug}-copy` : `copy-${Date.now()}`,
    createdAt: now,
    updatedAt: now
  };

  store.products.unshift(duplicated);
  await saveStore(store);
  await upsertProductInSupabase(duplicated);

  res.status(201).json(duplicated);
});

export default router;
