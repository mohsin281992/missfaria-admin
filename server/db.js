import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { 
  initialProducts, 
  initialOrders, 
  initialCustomers, 
  categoryList, 
  defaultSettings,
  defaultAnnouncementBar,
  defaultTrustBadges,
  defaultBundleOffers,
  defaultStockCounters,
  defaultFaqs,
  defaultReviews
} from '../src/data/mockData.js';
import { syncStoreToSupabase } from './supabase.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'store.json');

// Ensure data directory exists
try {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
} catch (e) {
  console.warn('Could not create DATA_DIR:', e.message);
}

// Initial default database state
const initialData = {
  products: initialProducts,
  categories: categoryList,
  orders: initialOrders,
  customers: initialCustomers,
  settings: defaultSettings,
  announcementBar: defaultAnnouncementBar,
  trustBadges: defaultTrustBadges,
  bundleOffers: defaultBundleOffers,
  stockCounters: defaultStockCounters,
  faqs: defaultFaqs,
  reviews: defaultReviews
};

// Read database from store.json
export function getStore() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      saveStore(initialData);
      return initialData;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw);

    // Merge missing initial defaults if store.json was created before marketing modules
    let modified = false;
    for (const key of Object.keys(initialData)) {
      if (parsed[key] === undefined || parsed[key] === null) {
        parsed[key] = initialData[key];
        modified = true;
      }
    }
    if (modified) {
      saveStore(parsed);
    }
    return parsed;
  } catch (error) {
    console.error('Error reading store.json, returning fallback initial data:', error);
    return initialData;
  }
}

// Save database to store.json and sync to Supabase
export async function saveStore(data) {
  let diskSuccess = false;
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    diskSuccess = true;
  } catch (error) {
    console.error('Error saving store.json:', error.message);
  }

  // Attempt Supabase sync asynchronously/non-blocking for web responses
  try {
    const syncRes = await syncStoreToSupabase(data);
    return { success: diskSuccess || syncRes.success, syncResult: syncRes };
  } catch (err) {
    console.warn('Supabase auto-sync error:', err.message);
    return { success: diskSuccess, error: err.message };
  }
}
