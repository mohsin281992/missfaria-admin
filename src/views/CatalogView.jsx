import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Copy, 
  Grid, 
  List, 
  Star, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  ExternalLink,
  Tag,
  FolderPlus,
  X,
  Layers
} from 'lucide-react';

import { formatCurrency } from '../utils/formatters';

export default function CatalogView({ 
  products, 
  categories, 
  selectedCategory = 'All',
  setSelectedCategory,
  isCategoryModalOpen: propIsCategoryModalOpen,
  setIsCategoryModalOpen: propSetIsCategoryModalOpen,
  settings,
  onAddCategory,
  onDeleteCategory,
  onAddProduct, 
  onEditProduct, 
  onDeleteProduct, 
  onDuplicateProduct 
}) {
  const [search, setSearch] = useState('');
  const [localCategory, setLocalCategory] = useState('All');
  const [stockFilter, setStockFilter] = useState('All');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  
  // Category Management Modal state fallback
  const [localCategoryModalOpen, setLocalCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const activeCategory = selectedCategory !== undefined ? selectedCategory : localCategory;
  const changeCategory = setSelectedCategory || setLocalCategory;

  const isCategoryModalOpen = propIsCategoryModalOpen !== undefined ? propIsCategoryModalOpen : localCategoryModalOpen;
  const setIsCategoryModalOpen = propSetIsCategoryModalOpen || setLocalCategoryModalOpen;

  // Filter Products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(search.toLowerCase()) || 
                          product.sku.toLowerCase().includes(search.toLowerCase()) ||
                          product.brand.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'All' || product.primaryCategory === activeCategory;
    
    let matchesStock = true;
    if (stockFilter === 'inStock') matchesStock = product.stockQuantity > product.lowStockThreshold;
    if (stockFilter === 'lowStock') matchesStock = product.stockQuantity <= product.lowStockThreshold && product.stockQuantity > 0;
    if (stockFilter === 'outOfStock') matchesStock = product.stockQuantity === 0;

    return matchesSearch && matchesCategory && matchesStock;
  });

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedProductIds(filteredProducts.map(p => p.id));
    } else {
      setSelectedProductIds([]);
    }
  };

  const handleSelectOne = (id) => {
    setSelectedProductIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleCreateCategory = (e) => {
    e.preventDefault();
    if (newCategoryName.trim()) {
      onAddCategory(newCategoryName.trim());
      setNewCategoryName('');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Category Indicator & Quick Reset Banner */}
      <div className="glass-card" style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Layers size={18} color="var(--accent-primary)" />
          <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>
            Active Category Filter: <span style={{ color: 'var(--accent-primary)', fontWeight: '700' }}>{activeCategory}</span> ({filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'})
          </span>
          {activeCategory !== 'All' && (
            <button 
              className="btn btn-secondary btn-sm"
              onClick={() => changeCategory('All')}
              style={{ fontSize: '11px', padding: '2px 8px' }}
            >
              Show All Categories
            </button>
          )}
        </div>

        <button 
          onClick={() => setIsCategoryModalOpen(true)}
          className="btn btn-secondary btn-sm"
          style={{ whiteSpace: 'nowrap' }}
        >
          <FolderPlus size={15} /> Manage Categories
        </button>
      </div>

      {/* Control Bar: Search, Filters & Actions */}
      <div className="glass-card" style={{ padding: '20px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: '300px' }}>
          {/* Search Box */}
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              placeholder="Search catalog by title, SKU, or brand..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '36px', height: '40px' }}
            />
          </div>

          {/* Category Quick Selector Dropdown */}
          <select 
            value={activeCategory}
            onChange={(e) => changeCategory(e.target.value)}
            className="form-select"
            style={{ width: '180px', height: '40px' }}
          >
            <option value="All">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* Stock Filter */}
          <select 
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="form-select"
            style={{ width: '160px', height: '40px' }}
          >
            <option value="All">All Stock Levels</option>
            <option value="inStock">In Stock</option>
            <option value="lowStock">Low Stock Alert</option>
            <option value="outOfStock">Out of Stock</option>
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* View Toggle */}
          <div style={{ display: 'flex', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', padding: '4px', border: '1px solid var(--border-color)' }}>
            <button 
              className={`btn-icon ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
              style={{ color: viewMode === 'table' ? 'var(--accent-primary)' : 'var(--text-muted)' }}
              title="Table View"
            >
              <List size={18} />
            </button>
            <button 
              className={`btn-icon ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              style={{ color: viewMode === 'grid' ? 'var(--accent-primary)' : 'var(--text-muted)' }}
              title="Grid View"
            >
              <Grid size={18} />
            </button>
          </div>

          {/* Add Product Button */}
          <button onClick={onAddProduct} className="btn btn-primary">
            <Plus size={18} />
            Add Product
          </button>
        </div>
      </div>

      {/* Selected Items Bulk Action Bar */}
      {selectedProductIds.length > 0 && (
        <div style={{
          padding: '12px 20px',
          background: 'rgba(99, 102, 241, 0.15)',
          border: '1px solid rgba(99, 102, 241, 0.4)',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          justify: 'space-between'
        }}>
          <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--accent-primary)' }}>
            {selectedProductIds.length} {selectedProductIds.length === 1 ? 'product' : 'products'} selected
          </span>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn btn-secondary btn-sm" onClick={() => setSelectedProductIds([])}>
              Deselect All
            </button>
            <button className="btn btn-danger btn-sm" onClick={() => {
              selectedProductIds.forEach(id => onDeleteProduct(id));
              setSelectedProductIds([]);
            }}>
              <Trash2 size={14} /> Bulk Delete
            </button>
          </div>
        </div>
      )}

      {/* View Mode 1: Table View */}
      {viewMode === 'table' ? (
        <div className="table-container glass-card">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}>
                  <input 
                    type="checkbox" 
                    onChange={handleSelectAll}
                    checked={selectedProductIds.length > 0 && selectedProductIds.length === filteredProducts.length}
                  />
                </th>
                <th>Product & SKU</th>
                <th>Category</th>
                <th>Pricing</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Featured</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    No products matched your search or category filter.
                  </td>
                </tr>
              ) : (
                filteredProducts.map(product => {
                  const isLowStock = product.stockQuantity <= product.lowStockThreshold;
                  return (
                    <tr key={product.id}>
                      <td>
                        <input 
                          type="checkbox" 
                          checked={selectedProductIds.includes(product.id)}
                          onChange={() => handleSelectOne(product.id)}
                        />
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                          <img 
                            src={product.mainImage} 
                            alt={product.title} 
                            style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', objectFit: 'cover', border: '1px solid var(--border-color)' }}
                          />
                          <div>
                            <div style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '14px' }}>
                              {product.title}
                            </div>
                            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                              SKU: <span style={{ fontFamily: 'monospace' }}>{product.sku}</span> • {product.brand}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-neutral">
                          {product.primaryCategory}
                        </span>
                      </td>
                      <td>
                        <div style={{ fontWeight: '700', color: 'var(--text-primary)' }}>
                          {formatCurrency(product.salePrice ? product.salePrice : product.basePrice, settings?.currency)}
                        </div>
                        {product.salePrice && product.salePrice < product.basePrice && (
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                            {formatCurrency(product.basePrice, settings?.currency)}
                          </div>
                        )}
                      </td>
                      <td>
                        <span className={`badge ${isLowStock ? 'badge-warning' : 'badge-success'}`}>
                          {product.stockQuantity} units
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${
                          product.publishStatus === 'published' ? 'badge-success' : 'badge-neutral'
                        }`}>
                          {product.publishStatus}
                        </span>
                      </td>
                      <td>
                        {product.featured ? (
                          <span className="badge badge-info" style={{ gap: '4px' }}>
                            <Star size={12} fill="currentColor" /> Featured
                          </span>
                        ) : (
                          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Standard</span>
                        )}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                          <button 
                            className="btn-icon" 
                            title="Edit Product Details"
                            onClick={() => onEditProduct(product)}
                          >
                            <Edit3 size={16} color="var(--accent-primary)" />
                          </button>
                          <button 
                            className="btn-icon" 
                            title="Duplicate Product"
                            onClick={() => onDuplicateProduct(product)}
                          >
                            <Copy size={16} />
                          </button>
                          <button 
                            className="btn-icon" 
                            title="Delete Product"
                            onClick={() => onDeleteProduct(product.id)}
                          >
                            <Trash2 size={16} color="var(--danger)" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      ) : (
        /* View Mode 2: Grid View */
        <div className="grid-3">
          {filteredProducts.map(product => (
            <div key={product.id} className="glass-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ position: 'relative', width: '100%', height: '180px', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                <img 
                  src={product.mainImage} 
                  alt={product.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <span className="badge badge-neutral" style={{ position: 'absolute', top: '10px', left: '10px' }}>
                  {product.primaryCategory}
                </span>
                {product.featured && (
                  <span className="badge badge-info" style={{ position: 'absolute', top: '10px', right: '10px' }}>
                    <Star size={12} fill="currentColor" /> Featured
                  </span>
                )}
              </div>

              <div>
                <h4 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', lineHeight: '1.3' }}>
                  {product.title}
                </h4>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  SKU: {product.sku}
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '10px', borderTop: '1px solid var(--border-color)' }}>
                <div>
                  <span style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)' }}>
                    {formatCurrency(product.salePrice ? product.salePrice : product.basePrice, settings?.currency)}
                  </span>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginLeft: '8px' }}>
                    ({product.stockQuantity} stock)
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button className="btn btn-secondary btn-sm" onClick={() => onEditProduct(product)}>
                    <Edit3 size={14} /> Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Category Management Modal */}
      {isCategoryModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '500px' }}>
            <div style={{
              padding: '18px 24px',
              borderBottom: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justify: 'space-between',
              background: 'var(--bg-secondary)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FolderPlus size={20} color="var(--accent-primary)" />
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)' }}>
                  Manage Catalog Categories
                </h3>
              </div>
              <button className="btn-icon" onClick={() => setIsCategoryModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Form to Add New Category */}
              <form onSubmit={handleCreateCategory} style={{ display: 'flex', gap: '8px' }}>
                <input 
                  type="text" 
                  required
                  placeholder="New Category Name (e.g. Footwear)" 
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="form-input"
                  style={{ flex: 1 }}
                />
                <button type="submit" className="btn btn-primary">
                  <Plus size={16} /> Add
                </button>
              </form>

              {/* List of Active Categories */}
              <div>
                <label className="form-label" style={{ marginBottom: '10px' }}>
                  Active Categories List ({categories.length})
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '240px', overflowY: 'auto' }}>
                  {categories.map(cat => {
                    const count = products.filter(p => p.primaryCategory === cat).length;
                    return (
                      <div 
                        key={cat}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justify: 'space-between',
                          padding: '10px 14px',
                          borderRadius: 'var(--radius-md)',
                          background: 'var(--bg-input)',
                          border: '1px solid var(--border-color)'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Layers size={16} color="var(--accent-primary)" />
                          <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>
                            {cat}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                            {count} {count === 1 ? 'product' : 'products'}
                          </span>
                          <button 
                            type="button"
                            className="btn-icon"
                            title="Delete Category"
                            onClick={() => onDeleteCategory && onDeleteCategory(cat)}
                          >
                            <Trash2 size={14} color="var(--danger)" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div style={{
              padding: '14px 24px',
              borderTop: '1px solid var(--border-color)',
              background: 'var(--bg-secondary)',
              display: 'flex',
              justify: 'flex-end'
            }}>
              <button className="btn btn-primary" onClick={() => setIsCategoryModalOpen(false)}>
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
