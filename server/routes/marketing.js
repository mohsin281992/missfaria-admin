import express from 'express';
import { getStore, saveStore } from '../db.js';
import { supabase } from '../supabase.js';

const router = express.Router();

// =========================================================
// 1 & 2. ANNOUNCEMENT BAR
// =========================================================
router.get('/announcement', (req, res) => {
  const store = getStore();
  res.json(store.announcementBar || {});
});

router.put('/announcement', async (req, res) => {
  const store = getStore();
  store.announcementBar = {
    ...store.announcementBar,
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  await saveStore(store);
  res.json(store.announcementBar);
});

// =========================================================
// 3. TRUST BADGES
// =========================================================
router.get('/trust-badges', (req, res) => {
  const store = getStore();
  res.json(store.trustBadges || []);
});

router.post('/trust-badges', async (req, res) => {
  const store = getStore();
  const newBadge = {
    id: `tb-${Date.now()}`,
    title: req.body.title || 'New Trust Badge',
    subtitle: req.body.subtitle || '',
    icon: req.body.icon || 'ShieldCheck',
    iconColor: req.body.iconColor || '#6366f1',
    bgColor: req.body.bgColor || 'rgba(99, 102, 241, 0.12)',
    active: req.body.active ?? true,
    position: (store.trustBadges?.length || 0) + 1
  };
  store.trustBadges = store.trustBadges || [];
  store.trustBadges.push(newBadge);
  await saveStore(store);
  res.status(201).json(newBadge);
});

router.put('/trust-badges/:id', async (req, res) => {
  const store = getStore();
  const index = (store.trustBadges || []).findIndex(b => b.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Badge not found' });

  store.trustBadges[index] = { ...store.trustBadges[index], ...req.body };
  await saveStore(store);
  res.json(store.trustBadges[index]);
});

router.delete('/trust-badges/:id', async (req, res) => {
  const store = getStore();
  store.trustBadges = (store.trustBadges || []).filter(b => b.id !== req.params.id);
  await saveStore(store);
  if (supabase) supabase.from('trust_badges').delete().eq('id', req.params.id).catch(() => {});
  res.json({ message: 'Badge deleted successfully', id: req.params.id });
});

// =========================================================
// 4. BUNDLE OFFERS
// =========================================================
router.get('/bundles', (req, res) => {
  const store = getStore();
  res.json(store.bundleOffers || []);
});

router.post('/bundles', async (req, res) => {
  const store = getStore();
  const newBundle = {
    id: `bnd-${Date.now()}`,
    title: req.body.title || 'New Bundle Offer',
    description: req.body.description || '',
    productIds: req.body.productIds || [],
    discountType: req.body.discountType || 'percentage',
    discountValue: req.body.discountValue || 10,
    bundlePrice: req.body.bundlePrice || 0,
    badge: req.body.badge || 'SPECIAL BUNDLE',
    active: req.body.active ?? true,
    createdAt: new Date().toISOString().split('T')[0]
  };
  store.bundleOffers = store.bundleOffers || [];
  store.bundleOffers.unshift(newBundle);
  await saveStore(store);
  res.status(201).json(newBundle);
});

router.put('/bundles/:id', async (req, res) => {
  const store = getStore();
  const index = (store.bundleOffers || []).findIndex(b => b.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Bundle not found' });

  store.bundleOffers[index] = { ...store.bundleOffers[index], ...req.body };
  await saveStore(store);
  res.json(store.bundleOffers[index]);
});

router.delete('/bundles/:id', async (req, res) => {
  const store = getStore();
  store.bundleOffers = (store.bundleOffers || []).filter(b => b.id !== req.params.id);
  await saveStore(store);
  if (supabase) supabase.from('bundle_offers').delete().eq('id', req.params.id).catch(() => {});
  res.json({ message: 'Bundle deleted successfully', id: req.params.id });
});

// =========================================================
// 5. LIMITED STOCK COUNTERS & FLASH SALE
// =========================================================
router.get('/stock-counters', (req, res) => {
  const store = getStore();
  res.json(store.stockCounters || {});
});

router.put('/stock-counters', async (req, res) => {
  const store = getStore();
  store.stockCounters = {
    ...store.stockCounters,
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  await saveStore(store);
  res.json(store.stockCounters);
});

// =========================================================
// 6. FAQS MODULE
// =========================================================
router.get('/faqs', (req, res) => {
  const store = getStore();
  res.json(store.faqs || []);
});

router.post('/faqs', async (req, res) => {
  const store = getStore();
  const newFaq = {
    id: `faq-${Date.now()}`,
    question: req.body.question || 'New Question',
    answer: req.body.answer || '',
    category: req.body.category || 'General',
    active: req.body.active ?? true,
    position: (store.faqs?.length || 0) + 1
  };
  store.faqs = store.faqs || [];
  store.faqs.push(newFaq);
  await saveStore(store);
  res.status(201).json(newFaq);
});

router.put('/faqs/:id', async (req, res) => {
  const store = getStore();
  const index = (store.faqs || []).findIndex(f => f.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'FAQ not found' });

  store.faqs[index] = { ...store.faqs[index], ...req.body };
  await saveStore(store);
  res.json(store.faqs[index]);
});

router.delete('/faqs/:id', async (req, res) => {
  const store = getStore();
  store.faqs = (store.faqs || []).filter(f => f.id !== req.params.id);
  await saveStore(store);
  if (supabase) supabase.from('faqs').delete().eq('id', req.params.id).catch(() => {});
  res.json({ message: 'FAQ deleted successfully', id: req.params.id });
});

// =========================================================
// 7. CUSTOMER REVIEWS MODULE
// =========================================================
router.get('/reviews', (req, res) => {
  const store = getStore();
  res.json(store.reviews || []);
});

router.post('/reviews', async (req, res) => {
  const store = getStore();
  const newReview = {
    id: `rev-${Date.now()}`,
    productId: req.body.productId || 'prod-1',
    productTitle: req.body.productTitle || 'General Product',
    reviewerName: req.body.reviewerName || 'Anonymous',
    reviewerEmail: req.body.reviewerEmail || '',
    rating: req.body.rating || 5,
    title: req.body.title || 'Great Product!',
    comment: req.body.comment || '',
    status: req.body.status || 'Approved',
    verified: req.body.verified ?? true,
    avatar: req.body.avatar || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80`,
    date: new Date().toISOString().split('T')[0]
  };
  store.reviews = store.reviews || [];
  store.reviews.unshift(newReview);
  await saveStore(store);
  res.status(201).json(newReview);
});

router.patch('/reviews/:id/status', async (req, res) => {
  const { status } = req.body;
  const store = getStore();
  const review = (store.reviews || []).find(r => r.id === req.params.id);
  if (!review) return res.status(404).json({ error: 'Review not found' });

  review.status = status;
  await saveStore(store);
  res.json(review);
});

router.delete('/reviews/:id', async (req, res) => {
  const store = getStore();
  store.reviews = (store.reviews || []).filter(r => r.id !== req.params.id);
  await saveStore(store);
  if (supabase) supabase.from('reviews').delete().eq('id', req.params.id).catch(() => {});
  res.json({ message: 'Review deleted successfully', id: req.params.id });
});

export default router;
