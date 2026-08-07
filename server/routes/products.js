import express from 'express';
import { getStore, saveStore } from '../db.js';
import { supabase, deleteProductFromSupabase } from '../supabase.js';

const router = express.Router();

// GET all products (fetches live from Supabase with local fallback)
router.get('/', async (req, res) => {
  let products = [];
  
  if (supabase) {
    try {
      const { data, error } = await supabase.from('products').select('*').order('createdAt', { ascending: false });
      if (!error && Array.isArray(data) && data.length > 0) {
        products = data;
      }
    } catch (e) {
      console.warn('Supabase products fetch failed, using local store fallback:', e.message);
    }
  }

  if (!products.length) {
    const store = getStore();
    products = store.products || [];
  }
  
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
  if (supabase) {
    try {
      const { data, error } = await supabase.from('products').select('*').eq('id', req.params.id).single();
      if (!error && data) {
        return res.json(data);
      }
    } catch (e) {}
  }

  const store = getStore();
  const product = (store.products || []).find(p => p.id === req.params.id);
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
    createdAt: now,
    updatedAt: now
  };

  store.products.unshift(newProduct);
  await saveStore(store);

  if (supabase) {
    await supabase.from('products').upsert([newProduct], { onConflict: 'id' }).catch(e => console.warn('Supabase product upsert err:', e.message));
  }

  res.status(201).json(newProduct);
});

// PUT update product
router.put('/:id', async (req, res) => {
  const store = getStore();
  const index = (store.products || []).findIndex(p => p.id === req.params.id);
  
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

  if (supabase) {
    await supabase.from('products').upsert([updatedProduct], { onConflict: 'id' }).catch(e => console.warn('Supabase product update err:', e.message));
  }

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

  if (supabase) {
    await supabase.from('products').upsert([duplicated], { onConflict: 'id' }).catch(e => console.warn('Supabase product duplicate err:', e.message));
  }

  res.status(201).json(duplicated);
});

export default router;

