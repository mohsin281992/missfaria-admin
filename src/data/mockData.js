export const initialProducts = [
  {
    id: 'prod-1',
    // Core Information
    title: 'AuraPro Wireless Noise-Canceling Headphones',
    sku: 'AUR-NC-900',
    slug: 'aurapro-wireless-noise-canceling-headphones',
    description: 'Experience studio-grade acoustic clarity with active hybrid noise cancellation, 40-hour continuous battery playback, custom EQ presets, and ergonomic memory foam cushion cups for all-day comfort.',
    shortDescription: 'Premium hybrid noise-canceling headphones with 40-hour battery life.',
    brand: 'AuraSound',

    // Inventory & Pricing
    basePrice: 299.99,
    salePrice: 249.99,
    costPrice: 110.00,
    stockQuantity: 42,
    lowStockThreshold: 10,
    backorderSetting: 'allow', // 'allow', 'notify', 'disallow'

    // Physical Attributes & Variations
    weight: 0.28,
    dimensions: { length: 18.5, width: 16.0, height: 8.2 },
    unitType: 'metric', // 'metric' (kg/cm) or 'imperial' (lbs/in)
    attributes: [
      { name: 'Color', options: ['Obsidian Black', 'Midnight Navy', 'Arctic White'] },
      { name: 'Storage Case', options: ['Hard Shell', 'Travel Pouch'] }
    ],
    variations: [
      { id: 'var-1', sku: 'AUR-NC-900-BLK-H', color: 'Obsidian Black', case: 'Hard Shell', price: 249.99, stock: 20 },
      { id: 'var-2', sku: 'AUR-NC-900-NVY-H', color: 'Midnight Navy', case: 'Hard Shell', price: 249.99, stock: 12 },
      { id: 'var-3', sku: 'AUR-NC-900-WHT-P', color: 'Arctic White', case: 'Travel Pouch', price: 239.99, stock: 10 }
    ],

    // Media & Assets
    mainImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80'
    ],
    videoUrls: ['https://www.youtube.com/watch?v=dQw4w9WgXcQ'],
    altText: 'Over-ear black wireless noise canceling headphones resting on dark background',

    // Categorization & Relations
    primaryCategory: 'Electronics',
    subCategories: ['Audio', 'Headphones', 'Wireless'],
    tags: ['Bluetooth 5.3', 'Noise Canceling', 'Hi-Res Audio', 'Best Seller'],
    relatedProducts: ['prod-2', 'prod-3'],
    upSellProducts: ['prod-4'],

    // SEO Data
    metaTitle: 'Buy AuraPro Noise-Canceling Wireless Headphones | AuraSound',
    metaDescription: 'Shop AuraPro noise-canceling headphones featuring 40h battery, ultra-low latency audio, and ergonomic comfort. Free shipping on orders over $50.',
    metaKeywords: ['wireless headphones', 'noise canceling', 'aurasound', 'bluetooth headset'],

    // Shipping & Logistics
    shippingClass: 'Standard Parcel',
    packageWeight: 0.45,
    packageDimensions: { length: 22, width: 20, height: 10 },
    freeShipping: true,

    // Status & Visibility
    publishStatus: 'published', // 'published', 'draft', 'pending'
    visibility: 'public', // 'public', 'hidden', 'password'
    featured: true,

    createdAt: '2026-07-15',
    updatedAt: '2026-08-01'
  },
  {
    id: 'prod-2',
    title: 'Chronos Ultra Smart Fitness Watch',
    sku: 'CHR-SMW-500',
    slug: 'chronos-ultra-smart-fitness-watch',
    description: 'Track your vital health metrics in real-time with optical heart sensor, SpO2 blood oxygen monitor, built-in dual-band GPS, AMOLED retina touch display, and 50m water resistance rating.',
    shortDescription: 'Advanced AMOLED smartwatch with GPS & 14-day health tracking battery.',
    brand: 'Chronos Tech',

    basePrice: 199.99,
    salePrice: 169.99,
    costPrice: 68.00,
    stockQuantity: 8, // Low stock warning trigger
    lowStockThreshold: 15,
    backorderSetting: 'notify',

    weight: 0.05,
    dimensions: { length: 4.4, width: 3.8, height: 1.0 },
    unitType: 'metric',
    attributes: [
      { name: 'Strap Color', options: ['Space Gray', 'Rose Gold', 'Ocean Green'] },
      { name: 'Size', options: ['40mm', '44mm'] }
    ],
    variations: [
      { id: 'var-2-1', sku: 'CHR-SMW-500-GRY-44', color: 'Space Gray', size: '44mm', price: 169.99, stock: 5 },
      { id: 'var-2-2', sku: 'CHR-SMW-500-RGD-40', color: 'Rose Gold', size: '40mm', price: 169.99, stock: 3 }
    ],

    mainImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80'
    ],
    videoUrls: [],
    altText: 'Smart fitness watch displaying heart rate graph on dark wristband',

    primaryCategory: 'Electronics',
    subCategories: ['Wearables', 'Smartwatches', 'Fitness'],
    tags: ['AMOLED', 'GPS', 'Heart Rate', 'Waterproof'],
    relatedProducts: ['prod-1'],
    upSellProducts: ['prod-5'],

    metaTitle: 'Chronos Ultra Smart Fitness Watch with GPS & Health Tracker',
    metaDescription: 'Order the Chronos Ultra Smartwatch. Features 14-day battery life, AMOLED screen, SpO2 sensor, and 50m water resistance.',
    metaKeywords: ['smartwatch', 'fitness tracker', 'gps watch', 'chronos'],

    shippingClass: 'Express Eligible',
    packageWeight: 0.22,
    packageDimensions: { length: 12, width: 12, height: 8 },
    freeShipping: true,

    publishStatus: 'published',
    visibility: 'public',
    featured: true,

    createdAt: '2026-07-20',
    updatedAt: '2026-08-04'
  },
  {
    id: 'prod-3',
    title: 'Vanguard Vintage Leather Bomber Jacket',
    sku: 'VNG-JKT-101',
    slug: 'vanguard-vintage-leather-bomber-jacket',
    description: 'Handcrafted from 100% full-grain lambskin leather, lined with breathable quilted satin, featuring antique brass hardware zippers and tailored rib-knit collar trim.',
    shortDescription: 'Full-grain lambskin leather bomber jacket with antique brass zippers.',
    brand: 'Vanguard Apparel',

    basePrice: 450.00,
    salePrice: 389.00,
    costPrice: 160.00,
    stockQuantity: 18,
    lowStockThreshold: 5,
    backorderSetting: 'disallow',

    weight: 1.45,
    dimensions: { length: 65.0, width: 52.0, height: 5.0 },
    unitType: 'metric',
    attributes: [
      { name: 'Color', options: ['Espresso Brown', 'Classic Black'] },
      { name: 'Size', options: ['S', 'M', 'L', 'XL'] }
    ],
    variations: [
      { id: 'var-3-1', sku: 'VNG-JKT-101-BRN-M', color: 'Espresso Brown', size: 'M', price: 389.00, stock: 10 },
      { id: 'var-3-2', sku: 'VNG-JKT-101-BLK-L', color: 'Classic Black', size: 'L', price: 389.00, stock: 8 }
    ],

    mainImage: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?auto=format&fit=crop&w=800&q=80'
    ],
    videoUrls: [],
    altText: 'Brown genuine leather bomber jacket hanging against wooden backdrop',

    primaryCategory: 'Apparel',
    subCategories: ['Outerwear', 'Jackets', 'Leather'],
    tags: ['Full-Grain Leather', 'Vintage', 'Handcrafted'],
    relatedProducts: [],
    upSellProducts: [],

    metaTitle: 'Vanguard Genuine Leather Bomber Jacket | Handmade Men\'s Apparel',
    metaDescription: 'Elevate your style with Vanguard Vintage Full-Grain Lambskin Leather Bomber Jacket. Crafted for comfort, durability, and classic aesthetic.',
    metaKeywords: ['leather jacket', 'bomber jacket', 'vanguard outerwear'],

    shippingClass: 'Heavy Goods',
    packageWeight: 1.80,
    packageDimensions: { length: 45, width: 35, height: 12 },
    freeShipping: true,

    publishStatus: 'published',
    visibility: 'public',
    featured: false,

    createdAt: '2026-06-10',
    updatedAt: '2026-07-28'
  },
  {
    id: 'prod-4',
    title: 'KeyMech Wireless RGB Mechanical Keyboard',
    sku: 'KMC-RGB-75',
    slug: 'keymech-wireless-rgb-mechanical-keyboard',
    description: 'Hot-swappable gasket mount 75% compact wireless keyboard featuring lubricated tactile switches, sound dampening silicone foam layers, customizable per-key RGB backlighting, and tri-mode connectivity (2.4GHz, Bluetooth 5.1, USB-C).',
    shortDescription: 'Gasket-mounted 75% mechanical keyboard with hot-swappable tactile switches.',
    brand: 'KeyMech Studio',

    basePrice: 149.99,
    salePrice: 129.99,
    costPrice: 52.00,
    stockQuantity: 65,
    lowStockThreshold: 12,
    backorderSetting: 'allow',

    weight: 0.92,
    dimensions: { length: 32.5, width: 14.0, height: 4.2 },
    unitType: 'metric',
    attributes: [
      { name: 'Switch Type', options: ['Gateron Pro Yellow (Linear)', 'Gateron Pro Brown (Tactile)', 'Gateron Pro Blue (Clicky)'] },
      { name: 'Frame Color', options: ['Frosted Acrylic', 'Matte Black', 'Retro Gray'] }
    ],
    variations: [
      { id: 'var-4-1', sku: 'KMC-RGB-75-YLW-BLK', switch: 'Linear', frame: 'Matte Black', price: 129.99, stock: 35 },
      { id: 'var-4-2', sku: 'KMC-RGB-75-BRN-ACR', switch: 'Tactile', frame: 'Frosted Acrylic', price: 139.99, stock: 30 }
    ],

    mainImage: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=800&q=80'
    ],
    videoUrls: [],
    altText: 'Custom RGB mechanical keyboard with glowing keycaps on desk mat',

    primaryCategory: 'Electronics',
    subCategories: ['Computer Peripherals', 'Keyboards', 'Gaming'],
    tags: ['Mechanical', 'Hot-Swappable', 'RGB', 'Wireless'],
    relatedProducts: ['prod-1'],
    upSellProducts: [],

    metaTitle: 'KeyMech Wireless 75% Hot-Swappable RGB Mechanical Keyboard',
    metaDescription: 'Shop KeyMech 75% Mechanical Keyboard. Features gasket mounting, lubricated tactile switches, customizable RGB lighting, and tri-mode wireless setup.',
    metaKeywords: ['mechanical keyboard', 'rgb keyboard', 'hot swappable', 'keymech'],

    shippingClass: 'Standard Parcel',
    packageWeight: 1.15,
    packageDimensions: { length: 36, width: 18, height: 6 },
    freeShipping: false,

    publishStatus: 'published',
    visibility: 'public',
    featured: true,

    createdAt: '2026-07-02',
    updatedAt: '2026-08-05'
  },
  {
    id: 'prod-5',
    title: 'ErgoMaster Pro Ergonomic Mesh Office Chair',
    sku: 'ERG-CHR-90',
    slug: 'ergomaster-pro-ergonomic-mesh-office-chair',
    description: 'Designed for lumbar health with dynamic 3D self-adjusting lumbar support, breathable Korean high-density mesh, 4D adjustable armrests, synchronous tilt mechanism with 3 locking positions, and heavy-duty class 4 gas lift cylinder.',
    shortDescription: 'High-back ergonomic mesh desk chair with 3D dynamic lumbar support.',
    brand: 'ErgoSpace',

    basePrice: 399.00,
    salePrice: 349.00,
    costPrice: 145.00,
    stockQuantity: 3, // Very low stock
    lowStockThreshold: 8,
    backorderSetting: 'notify',

    weight: 18.5,
    dimensions: { length: 68.0, width: 68.0, height: 125.0 },
    unitType: 'metric',
    attributes: [
      { name: 'Mesh Color', options: ['Graphite Black', 'Slate Silver'] }
    ],
    variations: [
      { id: 'var-5-1', sku: 'ERG-CHR-90-BLK', color: 'Graphite Black', price: 349.00, stock: 3 }
    ],

    mainImage: 'https://images.unsplash.com/photo-1580481072645-022f9a6d8310?auto=format&fit=crop&w=800&q=80',
    galleryImages: [],
    videoUrls: [],
    altText: 'Modern black ergonomic mesh office chair in bright home office workspace',

    primaryCategory: 'Furniture',
    subCategories: ['Office Furniture', 'Chairs', 'Ergonomic'],
    tags: ['Ergonomic', 'Lumbar Support', 'Mesh', 'Office'],
    relatedProducts: ['prod-4'],
    upSellProducts: [],

    metaTitle: 'ErgoMaster Pro Ergonomic High-Back Mesh Desk Chair',
    metaDescription: 'Upgrade your workspace with ErgoMaster Pro Ergonomic Mesh Chair. Engineered for posture correction, comfort, and durability with 5-year warranty.',
    metaKeywords: ['ergonomic chair', 'mesh office chair', 'desk chair', 'lumbar support'],

    shippingClass: 'Freight Heavy',
    packageWeight: 21.0,
    packageDimensions: { length: 75, width: 66, height: 42 },
    freeShipping: false,

    publishStatus: 'published',
    visibility: 'public',
    featured: false,

    createdAt: '2026-05-18',
    updatedAt: '2026-07-22'
  }
];

export const initialOrders = [
  { id: 'ORD-9842', customer: 'Sophia Reynolds', email: 'sophia.r@example.com', date: '2026-08-06', items: 2, total: 419.98, status: 'Completed', paymentMethod: 'Credit Card' },
  { id: 'ORD-9841', customer: 'Marcus Vance', email: 'm.vance@example.com', date: '2026-08-06', items: 1, total: 169.99, status: 'Processing', paymentMethod: 'PayPal' },
  { id: 'ORD-9840', customer: 'Elena Rostova', email: 'elena.rostova@example.com', date: '2026-08-05', items: 3, total: 648.97, status: 'Shipped', paymentMethod: 'Apple Pay' },
  { id: 'ORD-9839', customer: 'David Chen', email: 'dchen88@example.com', date: '2026-08-05', items: 1, total: 129.99, status: 'Completed', paymentMethod: 'Credit Card' },
  { id: 'ORD-9838', customer: 'Amara Okafor', email: 'amara.o@example.com', date: '2026-08-04', items: 1, total: 389.00, status: 'Pending', paymentMethod: 'Credit Card' },
  { id: 'ORD-9837', customer: 'Liam Thorne', email: 'lthorne@example.com', date: '2026-08-03', items: 4, total: 849.50, status: 'Refunded', paymentMethod: 'Store Credit' }
];

export const initialCustomers = [
  { id: 'CUST-101', name: 'Sophia Reynolds', email: 'sophia.r@example.com', ordersCount: 14, totalSpent: 3420.50, tier: 'VIP Gold', status: 'Active', joined: '2025-01-12' },
  { id: 'CUST-102', name: 'Marcus Vance', email: 'm.vance@example.com', ordersCount: 5, totalSpent: 890.00, tier: 'Regular', status: 'Active', joined: '2025-06-23' },
  { id: 'CUST-103', name: 'Elena Rostova', email: 'elena.rostova@example.com', ordersCount: 22, totalSpent: 5910.00, tier: 'VIP Platinum', status: 'Active', joined: '2024-11-05' },
  { id: 'CUST-104', name: 'David Chen', email: 'dchen88@example.com', ordersCount: 2, totalSpent: 279.98, tier: 'New Member', status: 'Active', joined: '2026-07-01' },
  { id: 'CUST-105', name: 'Amara Okafor', email: 'amara.o@example.com', ordersCount: 8, totalSpent: 1640.20, tier: 'Regular', status: 'Active', joined: '2025-09-18' }
];

export const categoryList = [
  'Electronics',
  'Apparel',
  'Furniture',
  'Home & Living',
  'Sports & Outdoors',
  'Beauty & Personal Care'
];

export const worldCurrencies = [
  { code: 'USD', symbol: '$', name: 'USD ($) - US Dollar' },
  { code: 'EUR', symbol: '€', name: 'EUR (€) - Euro' },
  { code: 'GBP', symbol: '£', name: 'GBP (£) - British Pound' },
  { code: 'JPY', symbol: '¥', name: 'JPY (¥) - Japanese Yen' },
  { code: 'CAD', symbol: 'CA$', name: 'CAD (CA$) - Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'AUD (A$) - Australian Dollar' },
  { code: 'CHF', symbol: 'CHF', name: 'CHF (CHF) - Swiss Franc' },
  { code: 'CNY', symbol: '¥', name: 'CNY (¥) - Chinese Yuan' },
  { code: 'INR', symbol: '₹', name: 'INR (₹) - Indian Rupee' },
  { code: 'AED', symbol: 'AED', name: 'AED (AED) - UAE Dirham' },
  { code: 'BRL', symbol: 'R$', name: 'BRL (R$) - Brazilian Real' },
  { code: 'MXN', symbol: 'MX$', name: 'MXN (MX$) - Mexican Peso' },
  { code: 'SGD', symbol: 'S$', name: 'SGD (S$) - Singapore Dollar' },
  { code: 'HKD', symbol: 'HK$', name: 'HKD (HK$) - Hong Kong Dollar' },
  { code: 'NZD', symbol: 'NZ$', name: 'NZD (NZ$) - New Zealand Dollar' },
  { code: 'KRW', symbol: '₩', name: 'KRW (₩) - South Korean Won' },
  { code: 'SEK', symbol: 'kr', name: 'SEK (kr) - Swedish Krona' },
  { code: 'NOK', symbol: 'kr', name: 'NOK (kr) - Norwegian Krone' },
  { code: 'DKK', symbol: 'kr', name: 'DKK (kr) - Danish Krone' },
  { code: 'PLN', symbol: 'zł', name: 'PLN (zł) - Polish Zloty' },
  { code: 'ZAR', symbol: 'R', name: 'ZAR (R) - South African Rand' },
  { code: 'TRY', symbol: '₺', name: 'TRY (₺) - Turkish Lira' },
  { code: 'SAR', symbol: 'SR', name: 'SAR (SR) - Saudi Riyal' },
  { code: 'EGP', symbol: 'E£', name: 'EGP (E£) - Egyptian Pound' },
  { code: 'THB', symbol: '฿', name: 'THB (฿) - Thai Baht' },
  { code: 'IDR', symbol: 'Rp', name: 'IDR (Rp) - Indonesian Rupiah' },
  { code: 'MYR', symbol: 'RM', name: 'MYR (RM) - Malaysian Ringgit' },
  { code: 'PHP', symbol: '₱', name: 'PHP (₱) - Philippine Peso' },
  { code: 'PKR', symbol: 'Rs', name: 'PKR (Rs) - Pakistani Rupee' },
  { code: 'BDT', symbol: '৳', name: 'BDT (৳) - Bangladeshi Taka' },
  { code: 'NGN', symbol: '₦', name: 'NGN (₦) - Nigerian Naira' },
  { code: 'ARS', symbol: '$', name: 'ARS ($) - Argentine Peso' },
  { code: 'CLP', symbol: '$', name: 'CLP ($) - Chilean Peso' },
  { code: 'COP', symbol: '$', name: 'COP ($) - Colombian Peso' },
  { code: 'PEN', symbol: 'S/', name: 'PEN (S/) - Peruvian Sol' },
  { code: 'VND', symbol: '₫', name: 'VND (₫) - Vietnamese Dong' },
  { code: 'ILS', symbol: '₪', name: 'ILS (₪) - Israeli New Shekel' },
  { code: 'HUF', symbol: 'Ft', name: 'HUF (Ft) - Hungarian Forint' },
  { code: 'CZK', symbol: 'Kč', name: 'CZK (Kč) - Czech Koruna' },
  { code: 'RON', symbol: 'lei', name: 'RON (lei) - Romanian Leu' },
  { code: 'KWD', symbol: 'KD', name: 'KWD (KD) - Kuwaiti Dinar' },
  { code: 'QAR', symbol: 'QR', name: 'QAR (QR) - Qatari Riyal' },
  { code: 'OMR', symbol: 'OMR', name: 'OMR (OMR) - Omani Rial' },
  { code: 'BHD', symbol: 'BD', name: 'BHD (BD) - Bahraini Dinar' }
];

export const defaultSettings = {
  storeName: 'Miss Faria Admin',
  contactEmail: 'admin@missfaria-store.com',
  currency: 'USD ($) - US Dollar',
  lowStockGlobalThreshold: 10,
  defaultWeightUnit: 'kg',
  defaultDimensionUnit: 'cm',
  freeShippingThreshold: 100.00,
  autoGenerateSKU: true,
  theme: 'light'
};
