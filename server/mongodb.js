import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import { initialProducts, initialOrders, initialCustomers, categoryList, defaultSettings } from '../src/data/mockData.js';

dotenv.config();

const uri = process.env.MONGODB_URI || 'mongodb+srv://mohsin281992_db_user:EiNwR8r0KnuWHnug@cluster0.4ojolsx.mongodb.net/miss_faria_db?retryWrites=true&w=majority';

let client;
let db;
let isConnected = false;

export async function connectMongoDB() {

  try {
    client = new MongoClient(uri);
    await client.connect();
    db = client.db('miss_faria_db');
    isConnected = true;
    console.log('✅ Connected successfully to MongoDB Atlas database: miss_faria_db');
    
    // Seed database if collections are empty
    await seedInitialDataIfNeeded();
    return true;
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    isConnected = false;
    return false;
  }
}

async function seedInitialDataIfNeeded() {
  if (!db) return;
  try {
    const productsCount = await db.collection('products').countDocuments();
    if (productsCount === 0) {
      console.log('🌱 Seeding initial products to MongoDB...');
      await db.collection('products').insertMany(initialProducts);
    }

    const categoriesCount = await db.collection('categories').countDocuments();
    if (categoriesCount === 0) {
      console.log('🌱 Seeding initial categories to MongoDB...');
      await db.collection('categories').insertMany(categoryList.map(name => ({ name })));
    }

    const ordersCount = await db.collection('orders').countDocuments();
    if (ordersCount === 0) {
      console.log('🌱 Seeding initial orders to MongoDB...');
      await db.collection('orders').insertMany(initialOrders);
    }

    const customersCount = await db.collection('customers').countDocuments();
    if (customersCount === 0) {
      console.log('🌱 Seeding initial customers to MongoDB...');
      await db.collection('customers').insertMany(initialCustomers);
    }

    const settingsCount = await db.collection('settings').countDocuments();
    if (settingsCount === 0) {
      console.log('🌱 Seeding initial settings to MongoDB...');
      await db.collection('settings').insertOne({ _id: 'store_settings', ...defaultSettings });
    }
  } catch (err) {
    console.error('Error seeding initial data to MongoDB:', err);
  }
}

export function getDb() {
  return db;
}

export function isMongoConnected() {
  return isConnected;
}
