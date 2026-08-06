import React, { useState, useEffect } from 'react';
import { 
  X, 
  Save, 
  Sparkles, 
  RefreshCw, 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  Video, 
  Search, 
  Globe, 
  Check, 
  Tag, 
  Layers, 
  Truck, 
  DollarSign, 
  ShieldCheck, 
  Box,
  Eye,
  Info,
  Upload,
  Star,
  Palette,
  Ruler
} from 'lucide-react';
import { uploadImageFile } from '../services/api';
import { formatCurrency, getCurrencySymbol } from '../utils/formatters';

export default function ProductFormModal({ 
  product, 
  categories, 
  allProducts,
  settings,
  onSave, 
  onClose 
}) {
  const symbol = getCurrencySymbol(settings?.currency);
  const isEditing = !!product;

  const [activeTab, setActiveTab] = useState('core');

  // Form State
  const [formData, setFormData] = useState({
    // Core Info
    title: '',
    sku: '',
    slug: '',
    description: '',
    shortDescription: '',
    brand: '',

    // Pricing & Inventory
    basePrice: 0,
    salePrice: 0,
    costPrice: 0,
    stockQuantity: 0,
    lowStockThreshold: 10,
    backorderSetting: 'allow',

    // Physical Attributes & Variations
    weight: 0,
    dimensions: { length: 0, width: 0, height: 0 },
    unitType: 'metric',
    attributes: [
      { name: 'Color', options: ['Black', 'White', 'Silver'] },
      { name: 'Size', options: ['Standard'] }
    ],
    variations: [],

    // Media & Assets
    mainImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    galleryImages: [],
    videoUrls: [''],
    altText: '',

    // Categorization & Relations
    primaryCategory: categories[0] || 'Electronics',
    subCategories: [],
    tags: [],
    relatedProducts: [],
    upSellProducts: [],

    // SEO Data
    metaTitle: '',
    metaDescription: '',
    metaKeywords: [],

    // Shipping & Logistics
    shippingClass: 'Standard Parcel',
    packageWeight: 0,
    packageDimensions: { length: 0, width: 0, height: 0 },
    freeShipping: false,

    // Status & Visibility
    publishStatus: 'published',
    visibility: 'public',
    featured: false
  });

  const [newTag, setNewTag] = useState('');
  const [newSubCat, setNewSubCat] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState('');

  const handleImageFileSelect = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    try {
      setIsUploading(true);
      const newUrls = [];
      for (const file of files) {
        const data = await uploadImageFile(file);
        if (data && data.url) {
          newUrls.push(data.url);
        }
      }
      if (newUrls.length > 0) {
        setFormData(prev => {
          const currentGallery = Array.isArray(prev.galleryImages) ? prev.galleryImages : [];
          const updatedGallery = [...currentGallery, ...newUrls];
          const updatedMain = (!prev.mainImage || prev.mainImage.trim() === '' || prev.mainImage.includes('unsplash')) ? newUrls[0] : prev.mainImage;
          return {
            ...prev,
            galleryImages: updatedGallery,
            mainImage: updatedMain
          };
        });
      }
    } catch (err) {
      alert('Failed to upload image(s): ' + err.message);
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleAddImageUrl = () => {
    const trimmed = imageUrlInput.trim();
    if (!trimmed) return;
    setFormData(prev => {
      const currentGallery = Array.isArray(prev.galleryImages) ? prev.galleryImages : [];
      const updatedGallery = [...currentGallery, trimmed];
      const updatedMain = (!prev.mainImage || prev.mainImage.trim() === '') ? trimmed : prev.mainImage;
      return {
        ...prev,
        galleryImages: updatedGallery,
        mainImage: updatedMain
      };
    });
    setImageUrlInput('');
  };

  const handleSetMainImage = (url) => {
    setFormData(prev => ({
      ...prev,
      mainImage: url
    }));
  };

  const handleRemoveImage = (indexToRemove) => {
    setFormData(prev => {
      const currentGallery = Array.isArray(prev.galleryImages) ? prev.galleryImages : [];
      const removedUrl = currentGallery[indexToRemove];
      const updatedGallery = currentGallery.filter((_, idx) => idx !== indexToRemove);
      let updatedMain = prev.mainImage;
      if (prev.mainImage === removedUrl) {
        updatedMain = updatedGallery[0] || '';
      }
      return {
        ...prev,
        galleryImages: updatedGallery,
        mainImage: updatedMain
      };
    });
  };

  const [colorInput, setColorInput] = useState('');
  const [sizeInput, setSizeInput] = useState('');

  // Extract or initialize color & size options from attributes
  const colorAttr = formData.attributes?.find(a => a.name === 'Color') || { name: 'Color', options: ['Black', 'White', 'Red', 'Blue'] };
  const sizeAttr = formData.attributes?.find(a => a.name === 'Size') || { name: 'Size', options: ['S', 'M', 'L', 'XL'] };

  const updateAttribute = (attrName, options) => {
    setFormData(prev => {
      const currentAttrs = prev.attributes || [];
      const attrExists = currentAttrs.some(a => a.name === attrName);
      let newAttrs;
      if (attrExists) {
        newAttrs = currentAttrs.map(a => a.name === attrName ? { ...a, options } : a);
      } else {
        newAttrs = [...currentAttrs, { name: attrName, options }];
      }
      return { ...prev, attributes: newAttrs };
    });
  };

  const handleAddColor = (colName) => {
    const trimmed = colName.trim();
    if (!trimmed || colorAttr.options.includes(trimmed)) return;
    const updatedOptions = [...colorAttr.options, trimmed];
    updateAttribute('Color', updatedOptions);
  };

  const handleRemoveColor = (colName) => {
    const updatedOptions = colorAttr.options.filter(c => c !== colName);
    updateAttribute('Color', updatedOptions);
  };

  const handleAddSize = (szName) => {
    const trimmed = szName.trim();
    if (!trimmed || sizeAttr.options.includes(trimmed)) return;
    const updatedOptions = [...sizeAttr.options, trimmed];
    updateAttribute('Size', updatedOptions);
  };

  const handleRemoveSize = (szName) => {
    const updatedOptions = sizeAttr.options.filter(s => s !== szName);
    updateAttribute('Size', updatedOptions);
  };

  useEffect(() => {
    if (product) {
      const initialGallery = (product.galleryImages && product.galleryImages.length > 0)
        ? product.galleryImages
        : (product.mainImage ? [product.mainImage] : []);

      setFormData({
        ...product,
        mainImage: product.mainImage || initialGallery[0] || '',
        galleryImages: initialGallery,
        dimensions: product.dimensions || { length: 0, width: 0, height: 0 },
        packageDimensions: product.packageDimensions || { length: 0, width: 0, height: 0 },
        attributes: product.attributes || [],
        variations: product.variations || [],
        videoUrls: product.videoUrls && product.videoUrls.length > 0 ? product.videoUrls : [''],
        tags: product.tags || [],
        subCategories: product.subCategories || [],
        relatedProducts: product.relatedProducts || [],
        upSellProducts: product.upSellProducts || [],
        metaKeywords: product.metaKeywords || []
      });
    }
  }, [product]);

  // Derived Financial Calculations
  const base = parseFloat(formData.basePrice) || 0;
  const cost = parseFloat(formData.costPrice) || 0;
  const sale = parseFloat(formData.salePrice) || 0;
  const currentSellPrice = sale > 0 ? sale : base;
  
  const profitAmount = currentSellPrice - cost;
  const profitMargin = currentSellPrice > 0 ? ((profitAmount / currentSellPrice) * 100).toFixed(1) : 0;
  const markupPercent = cost > 0 ? (((currentSellPrice - cost) / cost) * 100).toFixed(1) : 0;

  // SKU Auto Generator
  const generateSKU = () => {
    const brandPrefix = (formData.brand || 'PRD').substring(0, 3).toUpperCase();
    const titlePrefix = (formData.title || 'ITEM').replace(/[^a-zA-Z]/g, '').substring(0, 3).toUpperCase();
    const randomNum = Math.floor(100 + Math.random() * 900);
    const sku = `${brandPrefix}-${titlePrefix}-${randomNum}`;
    setFormData(prev => ({ ...prev, sku }));
  };

  // URL Slug Auto Generator
  const generateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setFormData(prev => ({ ...prev, slug }));
  };

  // Synchronize Meta Title & Meta Description defaults
  useEffect(() => {
    if (!formData.metaTitle && formData.title) {
      setFormData(prev => ({ ...prev, metaTitle: `${prev.title} | Buy Online` }));
    }
    if (!formData.metaDescription && formData.shortDescription) {
      setFormData(prev => ({ ...prev, metaDescription: prev.shortDescription }));
    }
  }, [formData.title, formData.shortDescription]);

  // Generate Variation Matrix
  const generateVariationMatrix = () => {
    const colors = colorAttr.options || [];
    const sizes = sizeAttr.options || [];
    
    if (colors.length === 0 && sizes.length === 0) {
      alert('Please add at least one Color or Size option to generate variations.');
      return;
    }

    const newVariations = [];
    const baseSku = formData.sku || 'PRD';

    if (colors.length > 0 && sizes.length > 0) {
      colors.forEach(col => {
        sizes.forEach(sz => {
          newVariations.push({
            id: `var-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            combinationName: `${col} / ${sz}`,
            color: col,
            size: sz,
            sku: `${baseSku}-${col.substring(0, 3).toUpperCase()}-${sz.toUpperCase()}`,
            price: currentSellPrice,
            stock: formData.stockQuantity || 10
          });
        });
      });
    } else if (colors.length > 0) {
      colors.forEach(col => {
        newVariations.push({
          id: `var-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          combinationName: col,
          color: col,
          size: '',
          sku: `${baseSku}-${col.substring(0, 3).toUpperCase()}`,
          price: currentSellPrice,
          stock: formData.stockQuantity || 10
        });
      });
    } else if (sizes.length > 0) {
      sizes.forEach(sz => {
        newVariations.push({
          id: `var-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          combinationName: sz,
          color: '',
          size: sz,
          sku: `${baseSku}-${sz.toUpperCase()}`,
          price: currentSellPrice,
          stock: formData.stockQuantity || 10
        });
      });
    }

    setFormData(prev => ({ ...prev, variations: newVariations }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const tabs = [
    { id: 'core', label: '1. Core Info' },
    { id: 'pricing', label: '2. Inventory & Pricing' },
    { id: 'variations', label: '3. Physical & Variations' },
    { id: 'media', label: '4. Media & Assets' },
    { id: 'categorization', label: '5. Categories & Relations' },
    { id: 'seo', label: '6. SEO Data' },
    { id: 'shipping', label: '7. Shipping & Logistics' },
    { id: 'status', label: '8. Status & Visibility' }
  ];

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justify: 'space-between',
          background: 'var(--bg-secondary)'
        }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)' }}>
              {isEditing ? `Edit Product: ${product.title}` : 'Add New Catalog Product'}
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Fill in all product specifications across the 8 management sections below
            </p>
          </div>
          <button className="btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Multi-Section Tabs */}
        <div style={{
          display: 'flex',
          overflowX: 'auto',
          background: 'var(--bg-primary)',
          borderBottom: '1px solid var(--border-color)',
          padding: '0 12px'
        }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '12px 16px',
                fontSize: '13px',
                fontWeight: activeTab === tab.id ? '600' : '500',
                color: activeTab === tab.id ? 'var(--accent-primary)' : 'var(--text-muted)',
                background: 'transparent',
                border: 'none',
                borderBottom: activeTab === tab.id ? '2px solid var(--accent-primary)' : '2px solid transparent',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all var(--transition-fast)'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
          <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
            
            {/* SECTION 1: CORE INFORMATION */}
            {activeTab === 'core' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Title / Product Name *</label>
                    <input 
                      type="text" 
                      required
                      value={formData.title} 
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g. Ultra Wireless ANC Headphones"
                      className="form-input" 
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Brand / Manufacturer</label>
                    <input 
                      type="text" 
                      value={formData.brand} 
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      placeholder="e.g. AuraSound"
                      className="form-input" 
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Product Category (Compulsory) *</label>
                  <select 
                    value={formData.primaryCategory}
                    onChange={(e) => setFormData({ ...formData, primaryCategory: e.target.value })}
                    className="form-select"
                    required
                  >
                    <option value="" disabled>-- Select Product Category (Required) --</option>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <label className="form-label">SKU (Stock Keeping Unit) *</label>
                      <button 
                        type="button" 
                        onClick={generateSKU} 
                        style={{ fontSize: '11px', color: 'var(--accent-primary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '600' }}
                      >
                        Auto Generate
                      </button>
                    </div>
                    <input 
                      type="text" 
                      required
                      value={formData.sku} 
                      onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                      placeholder="e.g. AUR-NC-900"
                      className="form-input" 
                      style={{ fontFamily: 'monospace' }}
                    />
                  </div>

                  <div className="form-group">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <label className="form-label">URL Slug</label>
                      <button 
                        type="button" 
                        onClick={generateSlug} 
                        style={{ fontSize: '11px', color: 'var(--accent-primary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '600' }}
                      >
                        From Title
                      </button>
                    </div>
                    <input 
                      type="text" 
                      value={formData.slug} 
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="aurapro-wireless-noise-canceling"
                      className="form-input" 
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Short Description (Preview Summary)</label>
                  <input 
                    type="text" 
                    value={formData.shortDescription} 
                    onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                    placeholder="Quick 1-2 sentence overview for product card previews"
                    className="form-input" 
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Full Detailed Description</label>
                  <textarea 
                    rows={4}
                    value={formData.description} 
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Comprehensive product details, materials, specs, features..."
                    className="form-textarea" 
                  />
                </div>
              </div>
            )}

            {/* SECTION 2: INVENTORY & PRICING */}
            {activeTab === 'pricing' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="grid-3">
                  <div className="form-group">
                    <label className="form-label">Base Price ({symbol}) *</label>
                    <input 
                      type="number" 
                      step="0.01"
                      required
                      value={formData.basePrice} 
                      onChange={(e) => setFormData({ ...formData, basePrice: parseFloat(e.target.value) || 0 })}
                      className="form-input" 
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Sale / Promo Price ({symbol})</label>
                    <input 
                      type="number" 
                      step="0.01"
                      value={formData.salePrice} 
                      onChange={(e) => setFormData({ ...formData, salePrice: parseFloat(e.target.value) || 0 })}
                      placeholder="Optional discount price"
                      className="form-input" 
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Cost Price ({symbol}) (Internal)</label>
                    <input 
                      type="number" 
                      step="0.01"
                      value={formData.costPrice} 
                      onChange={(e) => setFormData({ ...formData, costPrice: parseFloat(e.target.value) || 0 })}
                      placeholder="Manufacturing / Purchase cost"
                      className="form-input" 
                    />
                  </div>
                </div>

                {/* Profit Margin Calculation Widget */}
                <div style={{
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(99, 102, 241, 0.1)',
                  border: '1px solid rgba(99, 102, 241, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'space-around'
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Selling Price</span>
                    <h4 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)' }}>
                      {formatCurrency(currentSellPrice, settings?.currency)}
                    </h4>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Profit Per Unit</span>
                    <h4 style={{ fontSize: '18px', fontWeight: '700', color: profitAmount >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                      {formatCurrency(profitAmount, settings?.currency)}
                    </h4>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Profit Margin</span>
                    <h4 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--accent-primary)' }}>
                      {profitMargin}%
                    </h4>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Markup</span>
                    <h4 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--info)' }}>
                      {markupPercent}%
                    </h4>
                  </div>
                </div>

                <div className="grid-3">
                  <div className="form-group">
                    <label className="form-label">Stock Quantity (Units)</label>
                    <input 
                      type="number" 
                      value={formData.stockQuantity} 
                      onChange={(e) => setFormData({ ...formData, stockQuantity: parseInt(e.target.value) || 0 })}
                      className="form-input" 
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Low Stock Threshold</label>
                    <input 
                      type="number" 
                      value={formData.lowStockThreshold} 
                      onChange={(e) => setFormData({ ...formData, lowStockThreshold: parseInt(e.target.value) || 0 })}
                      placeholder="Alert level"
                      className="form-input" 
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Backorder Settings</label>
                    <select 
                      value={formData.backorderSetting}
                      onChange={(e) => setFormData({ ...formData, backorderSetting: e.target.value })}
                      className="form-select"
                    >
                      <option value="allow">Allow Backorders</option>
                      <option value="notify">Allow, but Notify Customer</option>
                      <option value="disallow">Do Not Allow Out-of-Stock Purchases</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 3: PHYSICAL ATTRIBUTES & VARIATIONS */}
            {activeTab === 'variations' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                
                {/* Physical Specifications */}
                <div style={{
                  background: 'var(--card-bg)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '20px'
                }}>
                  <h4 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '14px' }}>
                    Physical Specifications & Dimensions
                  </h4>
                  <div className="grid-3">
                    <div className="form-group">
                      <label className="form-label">Unit System</label>
                      <select 
                        value={formData.unitType}
                        onChange={(e) => setFormData({ ...formData, unitType: e.target.value })}
                        className="form-select"
                      >
                        <option value="metric">Metric (kg / cm)</option>
                        <option value="imperial">Imperial (lbs / in)</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Weight ({formData.unitType === 'metric' ? 'kg' : 'lbs'})</label>
                      <input 
                        type="number" 
                        step="0.01"
                        value={formData.weight} 
                        onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) || 0 })}
                        className="form-input" 
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Dimensions (L x W x H in {formData.unitType === 'metric' ? 'cm' : 'in'})</label>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <input 
                          type="number" 
                          placeholder="L"
                          value={formData.dimensions.length} 
                          onChange={(e) => setFormData({ ...formData, dimensions: { ...formData.dimensions, length: parseFloat(e.target.value) || 0 } })}
                          className="form-input" 
                        />
                        <input 
                          type="number" 
                          placeholder="W"
                          value={formData.dimensions.width} 
                          onChange={(e) => setFormData({ ...formData, dimensions: { ...formData.dimensions, width: parseFloat(e.target.value) || 0 } })}
                          className="form-input" 
                        />
                        <input 
                          type="number" 
                          placeholder="H"
                          value={formData.dimensions.height} 
                          onChange={(e) => setFormData({ ...formData, dimensions: { ...formData.dimensions, height: parseFloat(e.target.value) || 0 } })}
                          className="form-input" 
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Color & Size Attributes Manager */}
                <div style={{
                  background: 'var(--card-bg)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '20px'
                }}>
                  <div style={{ marginBottom: '16px' }}>
                    <h4 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>
                      Color & Size Product Attributes
                    </h4>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      Configure available colors and sizes for this product, then generate the variations matrix below.
                    </p>
                  </div>

                  <div className="grid-2">
                    {/* Color Attribute Setup */}
                    <div style={{
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-md)',
                      padding: '16px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                        <Palette size={18} color="var(--accent-primary)" />
                        <h5 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>Color Options</h5>
                      </div>

                      {/* Color Pills List */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
                        {colorAttr.options.map(col => (
                          <span 
                            key={col}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '4px 10px',
                              borderRadius: '20px',
                              background: 'rgba(99, 102, 241, 0.15)',
                              color: 'var(--accent-primary)',
                              fontSize: '12px',
                              fontWeight: '600'
                            }}
                          >
                            <span>{col}</span>
                            <button 
                              type="button"
                              onClick={() => handleRemoveColor(col)}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)', padding: 0 }}
                            >
                              <X size={12} />
                            </button>
                          </span>
                        ))}
                      </div>

                      {/* Quick Color Add Input */}
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <input 
                          type="text"
                          placeholder="Add Color (e.g. Red, Navy)"
                          value={colorInput}
                          onChange={(e) => setColorInput(e.target.value)}
                          className="form-input"
                          style={{ fontSize: '12px', height: '34px' }}
                        />
                        <button 
                          type="button"
                          onClick={() => {
                            if (colorInput.trim()) {
                              handleAddColor(colorInput.trim());
                              setColorInput('');
                            }
                          }}
                          className="btn btn-secondary btn-sm"
                          disabled={!colorInput.trim()}
                        >
                          <Plus size={14} /> Add Color
                        </button>
                      </div>
                    </div>

                    {/* Size Attribute Setup */}
                    <div style={{
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-md)',
                      padding: '16px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                        <Ruler size={18} color="var(--accent-primary)" />
                        <h5 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>Size Options</h5>
                      </div>

                      {/* Size Pills List */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
                        {sizeAttr.options.map(sz => (
                          <span 
                            key={sz}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '4px 10px',
                              borderRadius: '20px',
                              background: 'rgba(16, 185, 129, 0.15)',
                              color: '#10b981',
                              fontSize: '12px',
                              fontWeight: '600'
                            }}
                          >
                            <span>{sz}</span>
                            <button 
                              type="button"
                              onClick={() => handleRemoveSize(sz)}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)', padding: 0 }}
                            >
                              <X size={12} />
                            </button>
                          </span>
                        ))}
                      </div>

                      {/* Quick Size Add Input */}
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <input 
                          type="text"
                          placeholder="Add Size (e.g. XL, 42)"
                          value={sizeInput}
                          onChange={(e) => setSizeInput(e.target.value)}
                          className="form-input"
                          style={{ fontSize: '12px', height: '34px' }}
                        />
                        <button 
                          type="button"
                          onClick={() => {
                            if (sizeInput.trim()) {
                              handleAddSize(sizeInput.trim());
                              setSizeInput('');
                            }
                          }}
                          className="btn btn-secondary btn-sm"
                          disabled={!sizeInput.trim()}
                        >
                          <Plus size={14} /> Add Size
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Variations Matrix & Grid */}
                <div style={{
                  background: 'var(--card-bg)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '20px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
                    <div>
                      <h4 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)' }}>
                        Variation Combinations & Stock ({formData.variations.length} Variants)
                      </h4>
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        Individual SKU, Price, and Inventory stock levels for each Color & Size combination.
                      </p>
                    </div>

                    <button type="button" className="btn btn-primary btn-sm" onClick={generateVariationMatrix}>
                      <Sparkles size={14} /> Generate Color & Size Combinations
                    </button>
                  </div>

                  {formData.variations.length === 0 ? (
                    <div style={{ padding: '32px', textAlign: 'center', background: 'var(--bg-secondary)', border: '2px dashed var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--text-muted)', fontSize: '13px' }}>
                      <Sparkles size={24} style={{ marginBottom: '8px', opacity: 0.5 }} />
                      <p>No variations generated yet. Click <strong>Generate Color & Size Combinations</strong> above to build the variant matrix.</p>
                    </div>
                  ) : (
                    <div className="table-container">
                      <table className="data-table" style={{ fontSize: '12px' }}>
                        <thead>
                          <tr>
                            <th>Variant Combination</th>
                            <th>Color</th>
                            <th>Size</th>
                            <th>Variant SKU</th>
                            <th>Price ({symbol})</th>
                            <th>Stock Quantity</th>
                            <th style={{ textAlign: 'right' }}>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {formData.variations.map((v, i) => (
                            <tr key={v.id || i}>
                              <td style={{ fontWeight: '700', color: 'var(--text-primary)' }}>
                                {v.combinationName || `${v.color || ''} ${v.size ? `/ ${v.size}` : ''}`}
                              </td>
                              <td>
                                {v.color ? (
                                  <span className="badge badge-info" style={{ fontSize: '11px' }}>{v.color}</span>
                                ) : '-'}
                              </td>
                              <td>
                                {v.size ? (
                                  <span className="badge badge-neutral" style={{ fontSize: '11px' }}>{v.size}</span>
                                ) : '-'}
                              </td>
                              <td>
                                <input 
                                  type="text" 
                                  value={v.sku || ''} 
                                  onChange={(e) => {
                                    const updated = [...formData.variations];
                                    updated[i].sku = e.target.value;
                                    setFormData({ ...formData, variations: updated });
                                  }}
                                  className="form-input" 
                                  style={{ padding: '4px 8px', height: '32px', fontSize: '12px', fontFamily: 'monospace' }}
                                />
                              </td>
                              <td>
                                <input 
                                  type="number" 
                                  step="0.01"
                                  value={v.price} 
                                  onChange={(e) => {
                                    const updated = [...formData.variations];
                                    updated[i].price = parseFloat(e.target.value) || 0;
                                    setFormData({ ...formData, variations: updated });
                                  }}
                                  className="form-input" 
                                  style={{ padding: '4px 8px', height: '32px', fontSize: '12px', width: '100px' }}
                                />
                              </td>
                              <td>
                                <input 
                                  type="number" 
                                  value={v.stock} 
                                  onChange={(e) => {
                                    const updated = [...formData.variations];
                                    updated[i].stock = parseInt(e.target.value) || 0;
                                    setFormData({ ...formData, variations: updated });
                                  }}
                                  className="form-input" 
                                  style={{ padding: '4px 8px', height: '32px', fontSize: '12px', width: '90px' }}
                                />
                              </td>
                              <td style={{ textAlign: 'right' }}>
                                <button 
                                  type="button" 
                                  onClick={() => {
                                    const updated = formData.variations.filter((_, idx) => idx !== i);
                                    setFormData({ ...formData, variations: updated });
                                  }}
                                  className="btn-icon"
                                  title="Delete Variation"
                                  style={{ color: 'var(--danger)', padding: '4px' }}
                                >
                                  <Trash2 size={16} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* SECTION 4: MEDIA & ASSETS */}
            {activeTab === 'media' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                
                {/* Upload & Add Pictures Bar */}
                <div style={{
                  background: 'var(--card-bg)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '20px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
                    <div>
                      <h4 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>
                        Product Photos & Gallery ({formData.galleryImages?.length || 0} Images)
                      </h4>
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        Upload multiple images. Click <strong>⭐ Set Main Pic</strong> on any image to choose your primary product picture.
                      </p>
                    </div>

                    {/* Upload Multiple Files Button */}
                    <label className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                      <Upload size={16} />
                      <span>{isUploading ? 'Uploading Pictures...' : 'Upload Photos (Multiple)'}</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        multiple
                        onChange={handleImageFileSelect} 
                        style={{ display: 'none' }}
                        disabled={isUploading}
                      />
                    </label>
                  </div>

                  {/* Add Image via URL */}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input 
                      type="text" 
                      value={imageUrlInput} 
                      onChange={(e) => setImageUrlInput(e.target.value)}
                      placeholder="Paste Image URL (https://... or /uploads/...)"
                      className="form-input" 
                      style={{ flex: 1 }}
                    />
                    <button 
                      type="button" 
                      onClick={handleAddImageUrl}
                      className="btn btn-secondary"
                      disabled={!imageUrlInput.trim()}
                    >
                      <Plus size={16} />
                      Add URL Photo
                    </button>
                  </div>
                </div>

                {/* Uploaded Product Photos Grid */}
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '12px' }}>
                    All Product Pictures:
                  </div>

                  {(!formData.galleryImages || formData.galleryImages.length === 0) ? (
                    <div style={{
                      padding: '32px',
                      textAlign: 'center',
                      background: 'var(--card-bg)',
                      border: '2px dashed var(--border-color)',
                      borderRadius: 'var(--radius-lg)',
                      color: 'var(--text-muted)'
                    }}>
                      <ImageIcon size={32} style={{ marginBottom: '8px', opacity: 0.5 }} />
                      <p style={{ fontSize: '13px' }}>No product pictures uploaded yet. Click <strong>Upload Photos (Multiple)</strong> above to add pictures.</p>
                    </div>
                  ) : (
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                      gap: '16px'
                    }}>
                      {formData.galleryImages.map((imgUrl, index) => {
                        const isMain = formData.mainImage === imgUrl;

                        return (
                          <div 
                            key={index}
                            style={{
                              background: 'var(--card-bg)',
                              border: isMain ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
                              borderRadius: 'var(--radius-md)',
                              overflow: 'hidden',
                              display: 'flex',
                              flexDirection: 'column',
                              position: 'relative',
                              boxShadow: isMain ? '0 0 12px rgba(99, 102, 241, 0.25)' : 'none',
                              transition: 'all var(--transition-fast)'
                            }}
                          >
                            {/* Main Pic Badge */}
                            {isMain && (
                              <div style={{
                                position: 'absolute',
                                top: '8px',
                                left: '8px',
                                background: 'var(--accent-primary)',
                                color: '#ffffff',
                                fontSize: '10px',
                                fontWeight: '700',
                                padding: '3px 8px',
                                borderRadius: 'var(--radius-sm)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                zIndex: 2,
                                boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
                              }}>
                                <Star size={12} fill="#ffffff" /> Main Pic
                              </div>
                            )}

                            {/* Image Thumbnail */}
                            <div style={{ width: '100%', height: '140px', background: '#000', overflow: 'hidden', position: 'relative' }}>
                              <img 
                                src={imgUrl} 
                                alt={`Product Photo ${index + 1}`}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'; }}
                              />
                            </div>

                            {/* Photo Actions Footer */}
                            <div style={{ padding: '8px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px', background: 'var(--bg-secondary)' }}>
                              {isMain ? (
                                <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  <Check size={14} /> Selected
                                </span>
                              ) : (
                                <button 
                                  type="button"
                                  onClick={() => handleSetMainImage(imgUrl)}
                                  className="btn btn-secondary btn-sm"
                                  style={{ fontSize: '11px', padding: '4px 8px', gap: '4px' }}
                                >
                                  <Star size={12} /> Set Main Pic
                                </button>
                              )}

                              <button 
                                type="button"
                                onClick={() => handleRemoveImage(index)}
                                className="btn-icon"
                                title="Remove photo"
                                style={{ color: 'var(--danger)', padding: '4px' }}
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Additional Media Info */}
                <div className="grid-2" style={{ marginTop: '8px' }}>
                  <div className="form-group">
                    <label className="form-label">Image Accessibility Alt Text</label>
                    <input 
                      type="text" 
                      value={formData.altText} 
                      onChange={(e) => setFormData({ ...formData, altText: e.target.value })}
                      placeholder="Descriptive text for screen readers"
                      className="form-input" 
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Video Demonstration URL</label>
                    <input 
                      type="url" 
                      value={formData.videoUrls[0] || ''} 
                      onChange={(e) => setFormData({ ...formData, videoUrls: [e.target.value] })}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="form-input" 
                    />
                  </div>
                </div>

              </div>
            )}

            {/* SECTION 5: CATEGORIZATION & RELATIONS */}
            {activeTab === 'categorization' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Product Category (Compulsory) *</label>
                    <select 
                      value={formData.primaryCategory}
                      onChange={(e) => setFormData({ ...formData, primaryCategory: e.target.value })}
                      className="form-select"
                      required
                    >
                      <option value="" disabled>-- Select Product Category (Required) --</option>
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Search Keywords / Tags</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input 
                        type="text" 
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="Add tag (e.g. Wireless, Premium)"
                        className="form-input"
                      />
                      <button 
                        type="button" 
                        className="btn btn-secondary"
                        onClick={() => {
                          if (newTag.trim()) {
                            setFormData({ ...formData, tags: [...formData.tags, newTag.trim()] });
                            setNewTag('');
                          }
                        }}
                      >
                        Add
                      </button>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '10px' }}>
                      {formData.tags.map((t, idx) => (
                        <span key={idx} className="badge badge-neutral" style={{ gap: '6px' }}>
                          {t}
                          <X size={12} style={{ cursor: 'pointer' }} onClick={() => setFormData({ ...formData, tags: formData.tags.filter((_, i) => i !== idx) })} />
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Sub-categories Manager */}
                <div className="form-group">
                  <label className="form-label">Sub-Categories / Specific Sub-Groups</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {['Audio', 'Headphones', 'Wearables', 'Smartwatches', 'Outerwear', 'Computer Peripherals', 'Keyboards', 'Office Furniture', 'Gaming', 'Fitness'].map(sub => {
                      const isSubSelected = formData.subCategories.includes(sub);
                      return (
                        <button
                          key={sub}
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              subCategories: isSubSelected 
                                ? prev.subCategories.filter(s => s !== sub)
                                : [...prev.subCategories, sub]
                            }));
                          }}
                          className={`badge ${isSubSelected ? 'badge-info' : 'badge-neutral'}`}
                          style={{ padding: '6px 12px', fontSize: '12px', cursor: 'pointer', border: 'none' }}
                        >
                          {isSubSelected ? '✓ ' : '+ '}{sub}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 6: SEO DATA */}
            {activeTab === 'seo' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <label className="form-label">Meta Title (Headline)</label>
                    <span style={{ fontSize: '11px', color: formData.metaTitle.length > 60 ? 'var(--warning)' : 'var(--text-muted)' }}>
                      {formData.metaTitle.length} / 60 characters
                    </span>
                  </div>
                  <input 
                    type="text" 
                    value={formData.metaTitle} 
                    onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                    className="form-input" 
                  />
                </div>

                <div className="form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <label className="form-label">Meta Description (Snippet)</label>
                    <span style={{ fontSize: '11px', color: formData.metaDescription.length > 160 ? 'var(--warning)' : 'var(--text-muted)' }}>
                      {formData.metaDescription.length} / 160 characters
                    </span>
                  </div>
                  <textarea 
                    rows={3}
                    value={formData.metaDescription} 
                    onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                    className="form-textarea" 
                  />
                </div>

                {/* Google Search Live Preview Widget */}
                <div style={{
                  padding: '20px',
                  background: '#ffffff',
                  borderRadius: 'var(--radius-md)',
                  color: '#202124',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                  <div style={{ fontSize: '12px', color: '#70757a', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Globe size={14} color="#70757a" />
                    https://aetheria-store.com/products/{formData.slug || 'product-slug'}
                  </div>
                  <h4 style={{ fontSize: '18px', color: '#1a0dab', fontWeight: '400', lineHeight: '1.3', marginBottom: '4px' }}>
                    {formData.metaTitle || 'Product Meta Title Preview'}
                  </h4>
                  <p style={{ fontSize: '13px', color: '#4d5156', lineHeight: '1.4' }}>
                    {formData.metaDescription || 'Product meta description snippet preview will appear here as you type in search engine results...'}
                  </p>
                </div>
              </div>
            )}

            {/* SECTION 7: SHIPPING & LOGISTICS */}
            {activeTab === 'shipping' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Shipping Class</label>
                    <select 
                      value={formData.shippingClass}
                      onChange={(e) => setFormData({ ...formData, shippingClass: e.target.value })}
                      className="form-select"
                    >
                      <option value="Standard Parcel">Standard Parcel</option>
                      <option value="Express Eligible">Express Parcel</option>
                      <option value="Heavy Goods">Heavy / Freight Goods</option>
                      <option value="Digital">Digital / No Shipping Required</option>
                    </select>
                  </div>

                  <div className="form-group" style={{ display: 'flex', alignItems: 'center', height: '100%', paddingTop: '20px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                      <input 
                        type="checkbox" 
                        checked={formData.freeShipping} 
                        onChange={(e) => setFormData({ ...formData, freeShipping: e.target.checked })} 
                        style={{ width: '18px', height: '18px' }}
                      />
                      <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>
                        Eligible for Free Shipping
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 8: STATUS & VISIBILITY */}
            {activeTab === 'status' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="grid-3">
                  <div className="form-group">
                    <label className="form-label">Publish Status</label>
                    <select 
                      value={formData.publishStatus}
                      onChange={(e) => setFormData({ ...formData, publishStatus: e.target.value })}
                      className="form-select"
                    >
                      <option value="published">Published (Live)</option>
                      <option value="draft">Draft (Private)</option>
                      <option value="pending">Pending Review</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Storefront Visibility</label>
                    <select 
                      value={formData.visibility}
                      onChange={(e) => setFormData({ ...formData, visibility: e.target.value })}
                      className="form-select"
                    >
                      <option value="public">Public (Search & Catalog)</option>
                      <option value="hidden">Hidden (Direct Link Only)</option>
                      <option value="password">Password Protected</option>
                    </select>
                  </div>

                  <div className="form-group" style={{ display: 'flex', alignItems: 'center', paddingTop: '24px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                      <input 
                        type="checkbox" 
                        checked={formData.featured} 
                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })} 
                        style={{ width: '18px', height: '18px' }}
                      />
                      <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>
                        Feature Flag (Homepage Spotlight)
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Modal Footer Controls */}
          <div style={{
            padding: '16px 24px',
            borderTop: '1px solid var(--border-color)',
            background: 'var(--bg-secondary)',
            display: 'flex',
            alignItems: 'center',
            justify: 'space-between'
          }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="submit" className="btn btn-primary">
                <Save size={18} />
                {isEditing ? 'Update Product' : 'Save & Publish Product'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
