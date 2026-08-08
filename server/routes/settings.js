import express from 'express';
import { getStore, saveStore } from '../db.js';
import { supabase, upsertSettingsInSupabase } from '../supabase.js';

const router = express.Router();

// GET store settings (merging Supabase settings with local fallback)
router.get('/', async (req, res) => {
  const store = getStore();
  let settings = store.settings || {};

  if (supabase) {
    try {
      const { data, error } = await supabase.from('settings').select('*').eq('id', 1).single();
      if (!error && data) {
        delete data.id;
        settings = { ...settings, ...data };
      }
    } catch (e) {}
  }

  res.json(settings);
});

// PUT update store settings
router.put('/', async (req, res) => {
  const store = getStore();
  store.settings = {
    ...store.settings,
    ...req.body
  };

  await saveStore(store);
  await upsertSettingsInSupabase(store.settings);

  res.json(store.settings);
});

export default router;
