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
import ProductFormModal from './components/ProductFormModal';

import { 
  initialProducts, 
  initialOrders, 
  initialCustomers, 
  categoryList, 
  defaultSettings 
} from './data/mockData';

import * as api from './services/api';

export default function App() {
  const [products, setProducts] = useState(initialProducts);
  const [orders, setOrders] = useState(initialOrders);
  const [customers, setCustomers] = useState(initialCustomers);
  const [settings, setSettings] = useState(defaultSettings);
  const [categories, setCategories] = useState(categoryList);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  const [activeTab, setActiveTab] = useState('catalog');
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('aetheria_theme');
    return savedTheme || 'light';
  });
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Load Data from Node.js Backend API
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [prodsData, catsData, ordsData, custsData, setsData] = await Promise.all([
          api.fetchProducts().catch(() => initialProducts),
          api.fetchCategories().catch(() => categoryList),
          api.fetchOrders().catch(() => initialOrders),
          api.fetchCustomers().catch(() => initialCustomers),
          api.fetchSettings().catch(() => defaultSettings)
        ]);

        if (prodsData && Array.isArray(prodsData)) setProducts(prodsData);
        if (catsData && Array.isArray(catsData)) setCategories(catsData);
        if (ordsData && Array.isArray(ordsData)) setOrders(ordsData);
        if (custsData && Array.isArray(custsData)) setCustomers(custsData);
        if (setsData && typeof setsData === 'object') setSettings(setsData);
      } catch (err) {
        console.warn('Backend server offline or failed to fetch, using initial mock data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Category Handlers with API Integration
  const handleAddCategory = async (newCatName) => {
    const trimmed = newCatName.trim();
    if (!trimmed || categories.includes(trimmed)) return;
    try {
      const updatedCategories = await api.addCategory(trimmed);
      setCategories(updatedCategories);
    } catch (err) {
      console.error('Failed to add category to backend:', err);
      setCategories(prev => [...prev, trimmed]);
    }
  };

  const handleDeleteCategory = async (catNameToDelete) => {
    if (window.confirm(`Delete category "${catNameToDelete}"?`)) {
      try {
        const updatedCategories = await api.deleteCategory(catNameToDelete);
        setCategories(updatedCategories);
        if (selectedCategory === catNameToDelete) setSelectedCategory('All');
      } catch (err) {
        console.error('Failed to delete category on backend:', err);
        setCategories(prev => prev.filter(c => c !== catNameToDelete));
        if (selectedCategory === catNameToDelete) setSelectedCategory('All');
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

  // Product CRUD with Backend Sync
  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product from the catalog?')) {
      try {
        await api.deleteProduct(productId);
        setProducts(prev => prev.filter(p => p.id !== productId));
      } catch (err) {
        console.error('Failed to delete product from backend:', err);
        setProducts(prev => prev.filter(p => p.id !== productId));
      }
    }
  };

  const handleDuplicateProduct = async (product) => {
    try {
      const duplicated = await api.duplicateProduct(product.id);
      setProducts(prev => [duplicated, ...prev]);
    } catch (err) {
      console.error('Failed to duplicate product via API:', err);
      const fallbackDuplicated = {
        ...product,
        id: `prod-${Date.now()}`,
        title: `${product.title} (Copy)`,
        sku: `${product.sku}-COPY`,
        slug: `${product.slug}-copy`,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setProducts(prev => [fallbackDuplicated, ...prev]);
    }
  };

  const handleSaveProduct = async (formData) => {
    try {
      if (editingProduct) {
        const updated = await api.updateProduct(editingProduct.id, formData);
        setProducts(prev => prev.map(p => p.id === editingProduct.id ? updated : p));
      } else {
        const created = await api.createProduct(formData);
        setProducts(prev => [created, ...prev]);
      }
    } catch (err) {
      console.error('Failed to save product to backend:', err);
      if (editingProduct) {
        setProducts(prev => prev.map(p => p.id === editingProduct.id ? { ...formData, updatedAt: new Date().toISOString().split('T')[0] } : p));
      } else {
        const newProduct = {
          ...formData,
          id: `prod-${Date.now()}`,
          createdAt: new Date().toISOString().split('T')[0],
          updatedAt: new Date().toISOString().split('T')[0]
        };
        setProducts(prev => [newProduct, ...prev]);
      }
    }
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  // Order Operations
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const updatedOrder = await api.updateOrderStatus(orderId, newStatus);
      setOrders(prev => prev.map(o => o.id === orderId ? updatedOrder : o));
    } catch (err) {
      console.error('Failed to update order status on backend:', err);
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm(`Are you sure you want to delete order ${orderId}?`)) {
      try {
        await api.deleteOrder(orderId);
        setOrders(prev => prev.filter(o => o.id !== orderId));
      } catch (err) {
        console.error('Failed to delete order on backend:', err);
        setOrders(prev => prev.filter(o => o.id !== orderId));
      }
    }
  };

  // Settings update handler
  const handleSaveSettings = async (newSettings) => {
    try {
      const saved = await api.updateSettings(newSettings);
      setSettings(saved);
    } catch (err) {
      console.error('Failed to save settings to backend:', err);
      setSettings(newSettings);
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Sidebar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
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
