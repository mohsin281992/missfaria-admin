import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

import productsRouter from './routes/products.js';
import categoriesRouter from './routes/categories.js';
import ordersRouter from './routes/orders.js';
import customersRouter from './routes/customers.js';
import settingsRouter from './routes/settings.js';
import analyticsRouter from './routes/analytics.js';
import uploadRouter from './routes/upload.js';
import marketingRouter from './routes/marketing.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOAD_DIR = path.join(__dirname, 'uploads');

try {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }
} catch (err) {
  console.warn('Could not create UPLOAD_DIR on startup (e.g. read-only filesystem):', err.message);
}

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend requests
app.use(cors());

// Parse JSON request bodies
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Serve static upload directory for images
app.use('/uploads', express.static(UPLOAD_DIR));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', serverTime: new Date().toISOString() });
});

// API Routes
app.use('/api/products', productsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/customers', customersRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/marketing', marketingRouter);


import { getStore } from './db.js';
import { syncStoreToSupabase } from './supabase.js';

// Start server if not running in Vercel serverless environment
if (!process.env.VERCEL) {
  app.listen(PORT, async () => {
    console.log(`==================================================`);
    console.log(`🚀 Node.js Backend Server running on port ${PORT}`);
    console.log(`📡 API Base URL: http://localhost:${PORT}/api`);
    console.log(`🖼️ Uploads URL:  http://localhost:${PORT}/uploads`);
    console.log(`==================================================`);
    
    // Attempt auto-syncing local database store to Supabase on server start
    const syncRes = await syncStoreToSupabase(getStore());
    if (syncRes.success) {
      console.log('⚡ All data successfully synced & live on Supabase!');
    } else {
      console.log('ℹ️ Supabase sync status:', syncRes.reason || syncRes.details || syncRes.error);
    }
  });
}


export default app;
