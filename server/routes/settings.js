import express from 'express';
import { getStore, saveStore } from '../db.js';
import { getDb, isMongoConnected } from '../mongodb.js';

const router = express.Router();

// GET store settings
router.get('/', async (req, res) => {
  if (isMongoConnected()) {
    try {
      const db = getDb();
      const settings = await db.collection('settings').findOne({ _id: 'store_settings' });
      if (settings) {
        const { _id, ...cleanSettings } = settings;
        return res.json(cleanSettings);
      }
    } catch (err) {
      console.error('MongoDB settings fetch error:', err);
    }
  }

  const store = getStore();
  res.json(store.settings || {});
});

// PUT update store settings
router.put('/', async (req, res) => {
  if (isMongoConnected()) {
    try {
      const db = getDb();
      await db.collection('settings').updateOne(
        { _id: 'store_settings' },
        { $set: req.body },
        { upsert: true }
      );
      const updated = await db.collection('settings').findOne({ _id: 'store_settings' });
      if (updated) {
        const { _id, ...cleanSettings } = updated;
        return res.json(cleanSettings);
      }
    } catch (err) {
      console.error('MongoDB settings update error:', err);
    }
  }

  const store = getStore();
  store.settings = {
    ...store.settings,
    ...req.body
  };
  saveStore(store);
  res.json(store.settings);
});

export default router;
