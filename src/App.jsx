import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardView from './views/DashboardView';
import CatalogView from './views/CatalogView';
import CategoriesView from './views/CategoriesView';
import SalesView from './views/SalesView';
import CustomersView from './views/CustomersView';
import SettingsView from './views/SettingsView';
import AnalyticsView from './views/AnalyticsView';
import StoreModulesView from './views/StoreModulesView';
import ProductFormModal from './components/ProductFormModal';

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
} from './data/mockData';

import * as api from './services/api';



export default function App() {
  // Initialize state with localStorage cache fallback for zero data loss
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('aetheria_products');
      return saved ? JSON.parse(saved) : initialProducts;
    } catch {
      return initialProducts;
    }
  });

  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('aetheria_orders');
      return saved ? JSON.parse(saved) : initialOrders;
    } catch {
      return initialOrders;
    }
  });

  const [customers, setCustomers] = useState(() => {
    try {
      const saved = localStorage.getItem('aetheria_customers');
      return saved ? JSON.parse(saved) : initialCustomers;
    } catch {
      return initialCustomers;
    }
  });

  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('aetheria_settings');
      return saved ? JSON.parse(saved) : defaultSettings;
    } catch {
      return defaultSettings;
    }
  });

  const [categories, setCategories] = useState(() => {
    try {
      const saved = localStorage.getItem('aetheria_categories');
      return saved ? JSON.parse(saved) : categoryList;
    } catch {
      return categoryList;
    }
  });

  const [announcementBar, setAnnouncementBar] = useState(() => {
    try {
      const saved = localStorage.getItem('aetheria_announcement');
      return saved ? JSON.parse(saved) : defaultAnnouncementBar;
    } catch { return defaultAnnouncementBar; }
  });

  const [trustBadges, setTrustBadges] = useState(() => {
    try {
      const saved = localStorage.getItem('aetheria_trust_badges');
      return saved ? JSON.parse(saved) : defaultTrustBadges;
    } catch { return defaultTrustBadges; }
  });

  const [bundleOffers, setBundleOffers] = useState(() => {
    try {
      const saved = localStorage.getItem('aetheria_bundle_offers');
      return saved ? JSON.parse(saved) : defaultBundleOffers;
    } catch { return defaultBundleOffers; }
  });

  const [stockCounters, setStockCounters] = useState(() => {
    try {
      const saved = localStorage.getItem('aetheria_stock_counters');
      return saved ? JSON.parse(saved) : defaultStockCounters;
    } catch { return defaultStockCounters; }
  });

  const [faqs, setFaqs] = useState(() => {
    try {
      const saved = localStorage.getItem('aetheria_faqs');
      return saved ? JSON.parse(saved) : defaultFaqs;
    } catch { return defaultFaqs; }
  });

  const [reviews, setReviews] = useState(() => {
    try {
      const saved = localStorage.getItem('aetheria_reviews');
      return saved ? JSON.parse(saved) : defaultReviews;
    } catch { return defaultReviews; }
  });

  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  const [activeTab, setActiveTab] = useState('catalog');
  const [activeModuleTab, setActiveModuleTab] = useState('announcement');
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('aetheria_theme');
    return savedTheme || 'light';
  });
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Sync state changes to localStorage automatically
  useEffect(() => {
    try { localStorage.setItem('aetheria_products', JSON.stringify(products)); } catch (e) { console.warn(e); }
  }, [products]);

  useEffect(() => {
    try { localStorage.setItem('aetheria_categories', JSON.stringify(categories)); } catch (e) { console.warn(e); }
  }, [categories]);

  useEffect(() => {
    try { localStorage.setItem('aetheria_orders', JSON.stringify(orders)); } catch (e) { console.warn(e); }
  }, [orders]);

  useEffect(() => {
    try { localStorage.setItem('aetheria_customers', JSON.stringify(customers)); } catch (e) { console.warn(e); }
  }, [customers]);

  useEffect(() => {
    try { localStorage.setItem('aetheria_settings', JSON.stringify(settings)); } catch (e) { console.warn(e); }
  }, [settings]);

  useEffect(() => {
    try { localStorage.setItem('aetheria_announcement', JSON.stringify(announcementBar)); } catch (e) { console.warn(e); }
  }, [announcementBar]);

  useEffect(() => {
    try { localStorage.setItem('aetheria_trust_badges', JSON.stringify(trustBadges)); } catch (e) { console.warn(e); }
  }, [trustBadges]);

  useEffect(() => {
    try { localStorage.setItem('aetheria_bundle_offers', JSON.stringify(bundleOffers)); } catch (e) { console.warn(e); }
  }, [bundleOffers]);

  useEffect(() => {
    try { localStorage.setItem('aetheria_stock_counters', JSON.stringify(stockCounters)); } catch (e) { console.warn(e); }
  }, [stockCounters]);

  useEffect(() => {
    try { localStorage.setItem('aetheria_faqs', JSON.stringify(faqs)); } catch (e) { console.warn(e); }
  }, [faqs]);

  useEffect(() => {
    try { localStorage.setItem('aetheria_reviews', JSON.stringify(reviews)); } catch (e) { console.warn(e); }
  }, [reviews]);

  // Load Data from Node.js Backend API & merge smartly with local cache
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [
          prodsData, catsData, ordsData, custsData, setsData,
          annData, tbData, boData, scData, faqsData, revsData
        ] = await Promise.all([
          api.fetchProducts().catch(() => null),
          api.fetchCategories().catch(() => null),
          api.fetchOrders().catch(() => null),
          api.fetchCustomers().catch(() => null),
          api.fetchSettings().catch(() => null),
          api.fetchAnnouncementBar().catch(() => null),
          api.fetchTrustBadges().catch(() => null),
          api.fetchBundleOffers().catch(() => null),
          api.fetchStockCounters().catch(() => null),
          api.fetchFaqs().catch(() => null),
          api.fetchReviews().catch(() => null)
        ]);

        if (prodsData && Array.isArray(prodsData) && prodsData.length > 0) {
          setProducts(prev => {
            const serverMap = new Map(prodsData.map(p => [p.id, p]));
            const localOnly = prev.filter(p => p && p.id && !serverMap.has(p.id));
            // Sync local-only products to backend in background
            localOnly.forEach(p => api.createProduct(p).catch(() => {}));
            return [...prodsData, ...localOnly];
          });
        }
        if (catsData && Array.isArray(catsData) && catsData.length > 0) {
          setCategories(prev => Array.from(new Set([...catsData, ...prev])));
        }
        if (ordsData && Array.isArray(ordsData) && ordsData.length > 0) {
          setOrders(prev => {
            const serverMap = new Map(ordsData.map(o => [o.id, o]));
            const localOnly = prev.filter(o => o && o.id && !serverMap.has(o.id));
            return [...ordsData, ...localOnly];
          });
        }
        if (custsData && Array.isArray(custsData) && custsData.length > 0) setCustomers(custsData);
        if (setsData && typeof setsData === 'object' && Object.keys(setsData).length > 0) setSettings(setsData);
        if (annData && typeof annData === 'object' && Object.keys(annData).length > 0) setAnnouncementBar(annData);
        if (tbData && Array.isArray(tbData) && tbData.length > 0) setTrustBadges(tbData);
        if (boData && Array.isArray(boData) && boData.length > 0) setBundleOffers(boData);
        if (scData && typeof scData === 'object' && Object.keys(scData).length > 0) setStockCounters(scData);
        if (faqsData && Array.isArray(faqsData) && faqsData.length > 0) setFaqs(faqsData);
        if (revsData && Array.isArray(revsData) && revsData.length > 0) setReviews(revsData);
      } catch (err) {
        console.warn('Backend server offline or failed to fetch, keeping cached local data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Marketing Module Handler Functions
  const handleSaveAnnouncementBar = async (data) => {
    setAnnouncementBar(data);
    try { await api.updateAnnouncementBar(data); } catch (e) { console.warn(e); }
  };

  const handleAddTrustBadge = async (badgeData) => {
    const tempBadge = { ...badgeData, id: `tb-${Date.now()}` };
    setTrustBadges(prev => [...prev, tempBadge]);
    try {
      const created = await api.createTrustBadge(badgeData);
      if (created && created.id) setTrustBadges(prev => prev.map(b => b.id === tempBadge.id ? created : b));
    } catch (e) { console.warn(e); }
  };

  const handleUpdateTrustBadge = async (id, badgeData) => {
    setTrustBadges(prev => prev.map(b => b.id === id ? { ...b, ...badgeData } : b));
    try { await api.updateTrustBadge(id, badgeData); } catch (e) { console.warn(e); }
  };

  const handleDeleteTrustBadge = async (id) => {
    setTrustBadges(prev => prev.filter(b => b.id !== id));
    try { await api.deleteTrustBadge(id); } catch (e) { console.warn(e); }
  };

  const handleAddBundleOffer = async (bundleData) => {
    const tempBundle = { ...bundleData, id: `bnd-${Date.now()}` };
    setBundleOffers(prev => [tempBundle, ...prev]);
    try {
      const created = await api.createBundleOffer(bundleData);
      if (created && created.id) setBundleOffers(prev => prev.map(b => b.id === tempBundle.id ? created : b));
    } catch (e) { console.warn(e); }
  };

  const handleUpdateBundleOffer = async (id, bundleData) => {
    setBundleOffers(prev => prev.map(b => b.id === id ? { ...b, ...bundleData } : b));
    try { await api.updateBundleOffer(id, bundleData); } catch (e) { console.warn(e); }
  };

  const handleDeleteBundleOffer = async (id) => {
    setBundleOffers(prev => prev.filter(b => b.id !== id));
    try { await api.deleteBundleOffer(id); } catch (e) { console.warn(e); }
  };

  const handleSaveStockCounters = async (data) => {
    setStockCounters(data);
    try { await api.updateStockCounters(data); } catch (e) { console.warn(e); }
  };

  const handleAddFaq = async (faqData) => {
    const tempFaq = { ...faqData, id: `faq-${Date.now()}` };
    setFaqs(prev => [...prev, tempFaq]);
    try {
      const created = await api.createFaq(faqData);
      if (created && created.id) setFaqs(prev => prev.map(f => f.id === tempFaq.id ? created : f));
    } catch (e) { console.warn(e); }
  };

  const handleUpdateFaq = async (id, faqData) => {
    setFaqs(prev => prev.map(f => f.id === id ? { ...f, ...faqData } : f));
    try { await api.updateFaq(id, faqData); } catch (e) { console.warn(e); }
  };

  const handleDeleteFaq = async (id) => {
    setFaqs(prev => prev.filter(f => f.id !== id));
    try { await api.deleteFaq(id); } catch (e) { console.warn(e); }
  };

  const handleAddReview = async (reviewData) => {
    const tempReview = { ...reviewData, id: `rev-${Date.now()}`, date: new Date().toISOString().split('T')[0] };
    setReviews(prev => [tempReview, ...prev]);
    try {
      const created = await api.createReview(reviewData);
      if (created && created.id) setReviews(prev => prev.map(r => r.id === tempReview.id ? created : r));
    } catch (e) { console.warn(e); }
  };

  const handleUpdateReviewStatus = async (id, status) => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    try { await api.updateReviewStatus(id, status); } catch (e) { console.warn(e); }
  };

  const handleDeleteReview = async (id) => {
    setReviews(prev => prev.filter(r => r.id !== id));
    try { await api.deleteReview(id); } catch (e) { console.warn(e); }
  };


  // Category Handlers with API Integration
  const handleAddCategory = async (newCatName) => {
    const trimmed = newCatName.trim();
    if (!trimmed || categories.includes(trimmed)) return;
    setCategories(prev => [...prev, trimmed]);
    try {
      const updatedCategories = await api.addCategory(trimmed);
      if (updatedCategories && Array.isArray(updatedCategories)) {
        setCategories(updatedCategories);
      }
    } catch (err) {
      console.warn('Failed to sync category to backend, kept in local state:', err);
    }
  };

  const handleDeleteCategory = async (catNameToDelete) => {
    if (window.confirm(`Delete category "${catNameToDelete}"?`)) {
      setCategories(prev => prev.filter(c => c !== catNameToDelete));
      if (selectedCategory === catNameToDelete) setSelectedCategory('All');
      try {
        await api.deleteCategory(catNameToDelete);
      } catch (err) {
        console.warn('Failed to delete category on backend, kept local change:', err);
      }
    }
  };

  // Theme Handling
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('aetheria_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Product Management Modal Triggers
  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  // Product CRUD with Backend Sync & Instant UI Updates
  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product from the catalog?')) {
      setProducts(prev => prev.filter(p => p.id !== productId));
      try {
        await api.deleteProduct(productId);
      } catch (err) {
        console.warn('Failed to delete product from backend, kept in local storage:', err);
      }
    }
  };

  const handleDuplicateProduct = async (product) => {
    const fallbackDuplicated = {
      ...product,
      id: `prod-${Date.now()}`,
      title: `${product.title} (Copy)`,
      sku: `${product.sku}-COPY`,
      slug: `${product.slug}-copy`,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    setProducts(prev => [fallbackDuplicated, ...prev]);

    try {
      const duplicated = await api.duplicateProduct(product.id);
      if (duplicated && duplicated.id) {
        setProducts(prev => prev.map(p => p.id === fallbackDuplicated.id ? duplicated : p));
      }
    } catch (err) {
      console.warn('Failed to duplicate product via API, kept local duplicate:', err);
    }
  };

  const handleSaveProduct = async (formData) => {
    const now = new Date().toISOString().split('T')[0];
    let tempId = editingProduct ? editingProduct.id : `prod-${Date.now()}`;
    const optimisticProduct = {
      ...formData,
      id: tempId,
      updatedAt: now,
      createdAt: editingProduct ? (editingProduct.createdAt || now) : now
    };

    // 1. Instant local state & localStorage save
    if (editingProduct) {
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? optimisticProduct : p));
    } else {
      setProducts(prev => [optimisticProduct, ...prev]);
    }

    // 2. Close modal immediately for smooth instant user response
    setIsModalOpen(false);
    setEditingProduct(null);

    // 3. Sync with backend API in background
    try {
      if (editingProduct) {
        const updated = await api.updateProduct(editingProduct.id, formData);
        if (updated && updated.id) {
          setProducts(prev => prev.map(p => p.id === editingProduct.id ? updated : p));
        }
      } else {
        const created = await api.createProduct(formData);
        if (created && created.id) {
          setProducts(prev => prev.map(p => p.id === tempId ? created : p));
        }
      }
    } catch (err) {
      console.warn('Backend API product save note (saved locally in browser):', err);
    }
  };

  // Order Operations
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    try {
      const updatedOrder = await api.updateOrderStatus(orderId, newStatus);
      if (updatedOrder && updatedOrder.id) {
        setOrders(prev => prev.map(o => o.id === orderId ? updatedOrder : o));
      }
    } catch (err) {
      console.warn('Failed to update order status on backend, kept local change:', err);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm(`Are you sure you want to delete order ${orderId}?`)) {
      setOrders(prev => prev.filter(o => o.id !== orderId));
      try {
        await api.deleteOrder(orderId);
      } catch (err) {
        console.warn('Failed to delete order on backend, kept local change:', err);
      }
    }
  };

  // Settings update handler
  const handleSaveSettings = async (newSettings) => {
    setSettings(newSettings);
    try {
      const saved = await api.updateSettings(newSettings);
      if (saved) setSettings(saved);
    } catch (err) {
      console.warn('Failed to save settings to backend, kept local change:', err);
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Sidebar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeModuleTab={activeModuleTab}
        onSelectModuleTab={(tabId) => setActiveModuleTab(tabId)}
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        products={products}
        onOpenCategoryManager={() => setIsCategoryModalOpen(true)}
        theme={theme}
        toggleTheme={toggleTheme}
        onAddProductClick={handleOpenAddModal}
      />

      {/* Main Content Workspace */}
      <div className="main-wrapper">
        <Header 
          activeTab={activeTab}
          activeModuleTab={activeModuleTab}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onAddProductClick={handleOpenAddModal}
        />


        <main className="main-content">
          {activeTab === 'dashboard' && (
            <DashboardView 
              products={products}
              orders={orders}
              customers={customers}
              settings={settings}
              onEditProduct={handleOpenEditModal}
              onNavigate={setActiveTab}
            />
          )}

          {activeTab === 'catalog' && (
            <CatalogView 
              products={products}
              categories={categories}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              isCategoryModalOpen={isCategoryModalOpen}
              setIsCategoryModalOpen={setIsCategoryModalOpen}
              settings={settings}
              onAddCategory={handleAddCategory}
              onDeleteCategory={handleDeleteCategory}
              onAddProduct={handleOpenAddModal}
              onEditProduct={handleOpenEditModal}
              onDeleteProduct={handleDeleteProduct}
              onDuplicateProduct={handleDuplicateProduct}
            />
          )}

          {activeTab === 'categories' && (
            <CategoriesView 
              categories={categories}
              products={products}
              settings={settings}
              onAddCategory={handleAddCategory}
              onDeleteCategory={handleDeleteCategory}
              onNavigateToProducts={(cat) => {
                setSelectedCategory(cat);
                setActiveTab('catalog');
              }}
              onEditProduct={handleOpenEditModal}
            />
          )}

          {activeTab === 'sales' && (
            <SalesView 
              orders={orders} 
              settings={settings}
              onUpdateOrderStatus={handleUpdateOrderStatus}
              onDeleteOrder={handleDeleteOrder}
            />
          )}

          {activeTab === 'customers' && (
            <CustomersView customers={customers} settings={settings} />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsView products={products} orders={orders} settings={settings} />
          )}

          {activeTab === 'store-modules' && (
            <StoreModulesView 
              initialActiveTab={activeModuleTab}
              products={products}
              settings={settings}
              announcementBar={announcementBar}
              onSaveAnnouncementBar={handleSaveAnnouncementBar}
              trustBadges={trustBadges}
              onAddTrustBadge={handleAddTrustBadge}
              onUpdateTrustBadge={handleUpdateTrustBadge}
              onDeleteTrustBadge={handleDeleteTrustBadge}
              bundleOffers={bundleOffers}
              onAddBundleOffer={handleAddBundleOffer}
              onUpdateBundleOffer={handleUpdateBundleOffer}
              onDeleteBundleOffer={handleDeleteBundleOffer}
              stockCounters={stockCounters}
              onSaveStockCounters={handleSaveStockCounters}
              faqs={faqs}
              onAddFaq={handleAddFaq}
              onUpdateFaq={handleUpdateFaq}
              onDeleteFaq={handleDeleteFaq}
              reviews={reviews}
              onAddReview={handleAddReview}
              onUpdateReviewStatus={handleUpdateReviewStatus}
              onDeleteReview={handleDeleteReview}
            />
          )}


          {activeTab === 'settings' && (
            <SettingsView 
              settings={settings}
              onSaveSettings={handleSaveSettings}
              theme={theme}
              toggleTheme={toggleTheme}
            />
          )}
        </main>
      </div>

      {/* Product Management Modal */}
      {isModalOpen && (
        <ProductFormModal 
          product={editingProduct}
          categories={categories}
          onAddCategory={handleAddCategory}
          allProducts={products}
          settings={settings}
          onSave={handleSaveProduct}
          onClose={() => {
            setIsModalOpen(false);
            setEditingProduct(null);
          }}
        />
      )}
    </div>
  );
}
