import React, { useState } from 'react';
import { 
  Layers, 
  Tag, 
  Plus, 
  Trash2, 
  Package, 
  ExternalLink, 
  Sparkles, 
  FolderPlus,
  Search,
  CheckCircle2,
  Grid,
  List
} from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export default function CategoriesView({ 
  categories = [], 
  products = [], 
  settings, 
  onAddCategory, 
  onDeleteCategory,
  onNavigateToProducts,
  onEditProduct
}) {
  const [newCatName, setNewCatName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (newCatName.trim()) {
      onAddCategory(newCatName.trim());
      setNewCatName('');
    }
  };

  const filteredCategories = categories.filter(cat => 
    cat.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Statistics calculation
  const totalCategories = categories.length;
  const totalProducts = products.length;

  // Find category with most products
  const categoryCounts = categories.map(cat => ({
    name: cat,
    count: products.filter(p => p.primaryCategory === cat).length
  }));
  categoryCounts.sort((a, b) => b.count - a.count);
  const topCategory = categoryCounts[0] ? categoryCounts[0].name : 'N/A';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Top Banner & Quick Add Category */}
      <div style={{
        background: 'var(--card-bg)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        padding: '24px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '20px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <div style={{
              padding: '8px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(99, 102, 241, 0.15)',
              color: 'var(--accent-primary)'
            }}>
              <Tag size={22} />
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text-primary)' }}>
              Categories Directory
            </h2>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Organize your product catalog into categories for faster browsing and store management.
          </p>
        </div>

        {/* Add Category Input Form */}
        <form onSubmit={handleAddSubmit} style={{ display: 'flex', gap: '10px', flex: '1', maxWidth: '420px', minWidth: '280px' }}>
          <input 
            type="text" 
            placeholder="New Category Name (e.g. Footwear)" 
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            className="form-input" 
            style={{ flex: 1, height: '42px' }}
          />
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={!newCatName.trim()}
            style={{ height: '42px', whiteSpace: 'nowrap' }}
          >
            <Plus size={18} />
            Add Category
          </button>
        </form>
      </div>

      {/* Metrics Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px'
      }}>
        <div style={{
          background: 'var(--card-bg)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: '18px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(99, 102, 241, 0.12)',
            color: 'var(--accent-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Layers size={22} />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>Total Categories</div>
            <div style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-primary)' }}>{totalCategories}</div>
          </div>
        </div>

        <div style={{
          background: 'var(--card-bg)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: '18px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(16, 185, 129, 0.12)',
            color: '#10b981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Package size={22} />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>Total Items Assigned</div>
            <div style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-primary)' }}>{totalProducts}</div>
          </div>
        </div>

        <div style={{
          background: 'var(--card-bg)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: '18px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(245, 158, 11, 0.12)',
            color: '#f59e0b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Sparkles size={22} />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>Largest Category</div>
            <div style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', textTransform: 'capitalize' }}>
              {topCategory}
            </div>
          </div>
        </div>
      </div>

      {/* Control Bar & Search */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justify: 'space-between',
        gap: '16px',
        flexWrap: 'wrap'
      }}>
        <div style={{ position: 'relative', minWidth: '260px', flex: '1', maxWidth: '380px' }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '36px', height: '40px' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button 
            className={`btn btn-secondary btn-sm ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
            style={{ opacity: viewMode === 'grid' ? 1 : 0.6 }}
          >
            <Grid size={16} /> Grid
          </button>
          <button 
            className={`btn btn-secondary btn-sm ${viewMode === 'table' ? 'active' : ''}`}
            onClick={() => setViewMode('table')}
            style={{ opacity: viewMode === 'table' ? 1 : 0.6 }}
          >
            <List size={16} /> Table
          </button>
        </div>
      </div>

      {/* Grid Mode */}
      {viewMode === 'grid' ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '20px'
        }}>
          {filteredCategories.map((cat) => {
            const catProducts = products.filter(p => p.primaryCategory === cat);
            const previewImages = catProducts.slice(0, 3).map(p => p.mainImage);

            return (
              <div 
                key={cat}
                style={{
                  background: 'var(--card-bg)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justify: 'space-between',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: 'var(--radius-md)',
                        background: 'rgba(99, 102, 241, 0.1)',
                        color: 'var(--accent-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justify: 'center'
                      }}>
                        <Tag size={18} />
                      </div>
                      <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)' }}>
                        {cat}
                      </h3>
                    </div>

                    <span className="badge badge-info" style={{ fontSize: '11px' }}>
                      {catProducts.length} {catProducts.length === 1 ? 'Product' : 'Products'}
                    </span>
                  </div>

                  {/* Product Previews */}
                  <div style={{ display: 'flex', gap: '8px', margin: '14px 0' }}>
                    {previewImages.length > 0 ? (
                      previewImages.map((imgSrc, idx) => (
                        <img 
                          key={idx} 
                          src={imgSrc} 
                          alt="preview"
                          style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: 'var(--radius-sm)',
                            objectFit: 'cover',
                            border: '1px solid var(--border-color)'
                          }}
                          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'; }}
                        />
                      ))
                    ) : (
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic', padding: '12px 0' }}>
                        No products added yet
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'space-between',
                  paddingTop: '16px',
                  borderTop: '1px solid var(--border-color)',
                  marginTop: '12px'
                }}>
                  <button 
                    onClick={() => onNavigateToProducts(cat)}
                    className="btn btn-secondary btn-sm"
                    style={{ gap: '6px' }}
                  >
                    <span>View Products</span>
                    <ExternalLink size={14} />
                  </button>

                  <button 
                    onClick={() => onDeleteCategory(cat)}
                    className="btn-icon"
                    title="Delete Category"
                    style={{ color: 'var(--danger)', padding: '6px' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table Mode */
        <div style={{
          background: 'var(--card-bg)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden'
        }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Category Name</th>
                <th>Total Products</th>
                <th>Sample Products</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.map((cat) => {
                const catProducts = products.filter(p => p.primaryCategory === cat);

                return (
                  <tr key={cat}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Tag size={16} color="var(--accent-primary)" />
                        <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{cat}</span>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-neutral">
                        {catProducts.length} Items
                      </span>
                    </td>
                    <td>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                        {catProducts.slice(0, 2).map(p => p.title).join(', ') || 'None'}
                        {catProducts.length > 2 ? ` +${catProducts.length - 2} more` : ''}
                      </div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '8px' }}>
                        <button 
                          onClick={() => onNavigateToProducts(cat)}
                          className="btn btn-secondary btn-sm"
                        >
                          Show Products
                        </button>
                        <button 
                          onClick={() => onDeleteCategory(cat)}
                          className="btn-icon"
                          style={{ color: 'var(--danger)' }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
