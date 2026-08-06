import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  BarChart3, 
  Sun, 
  Moon,
  Sparkles,
  ChevronRight,
  ChevronDown,
  Plus,
  Layers,
  FolderPlus,
  Tag
} from 'lucide-react';

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  categories = [],
  selectedCategory = 'All',
  setSelectedCategory,
  products = [],
  onOpenCategoryManager,
  theme, 
  toggleTheme, 
  onAddProductClick 
}) {
  const [isCatalogExpanded, setIsCatalogExpanded] = useState(true);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'catalog', label: 'Catalog', icon: Package, badge: `${products.length} Items`, isExpandable: true },
    { id: 'sales', label: 'Sales', icon: ShoppingCart, badge: '6 Orders' },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleCatalogClick = () => {
    if (activeTab === 'catalog') {
      setIsCatalogExpanded(!isCatalogExpanded);
    } else {
      setActiveTab('catalog');
      setIsCatalogExpanded(true);
    }
  };

  return (
    <aside style={{
      position: 'fixed',
      top: 0,
      left: 0,
      bottom: 0,
      width: 'var(--sidebar-width)',
      background: 'var(--bg-secondary)',
      borderRight: '1px solid var(--border-color)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 100,
      transition: 'all var(--transition-normal)'
    }}>
      {/* Brand Header */}
      <div style={{
        padding: '24px 20px',
        display: 'flex',
        alignItems: 'center',
        justify: 'space-between',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
            display: 'flex',
            alignItems: 'center',
            justify: 'center',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)'
          }}>
            <Sparkles size={22} color="#ffffff" />
          </div>
          <div>
            <h1 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', lineHeight: '1.2' }}>
              Miss Faria Admin
            </h1>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '500' }}>
              Enterprise Portal
            </span>
          </div>
        </div>
      </div>

      {/* Quick Action Button */}
      <div style={{ padding: '16px 20px' }}>
        <button 
          onClick={onAddProductClick}
          className="btn btn-primary"
          style={{ width: '100%', justifyContent: 'center' }}
        >
          <Plus size={18} />
          New Product
        </button>
      </div>

      {/* Navigation Links */}
      <nav style={{ flex: 1, padding: '12px', display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto' }}>
        <div style={{ padding: '0 12px 8px 12px', fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          Navigation Menu
        </div>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const isCatalogItem = item.id === 'catalog';

          return (
            <React.Fragment key={item.id}>
              <button
                onClick={isCatalogItem ? handleCatalogClick : () => setActiveTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'space-between',
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-md)',
                  background: isActive ? 'linear-gradient(90deg, rgba(99, 102, 241, 0.15) 0%, transparent 100%)' : 'transparent',
                  color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  border: '1px solid',
                  borderColor: isActive ? 'rgba(99, 102, 241, 0.3)' : 'transparent',
                  fontWeight: isActive ? '600' : '500',
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                  textAlign: 'left'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Icon size={19} color={isActive ? 'var(--accent-primary)' : 'currentColor'} />
                  <span>{item.label}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {item.badge && (
                    <span className="badge badge-neutral" style={{ fontSize: '10px', padding: '2px 6px' }}>
                      {item.badge}
                    </span>
                  )}
                  {isCatalogItem ? (
                    isCatalogExpanded ? (
                      <ChevronDown size={16} color={isActive ? 'var(--accent-primary)' : 'var(--text-muted)'} />
                    ) : (
                      <ChevronRight size={16} color={isActive ? 'var(--accent-primary)' : 'var(--text-muted)'} />
                    )
                  ) : (
                    isActive && <ChevronRight size={16} color="var(--accent-primary)" />
                  )}
                </div>
              </button>

              {/* Collapsible Submenu for Categories */}
              {isCatalogItem && isCatalogExpanded && (
                <div style={{
                  marginLeft: '20px',
                  paddingLeft: '12px',
                  borderLeft: '2px solid rgba(99, 102, 241, 0.3)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '3px',
                  margin: '4px 0 8px 24px'
                }}>
                  <div style={{ fontSize: '10px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '4px 8px' }}>
                    Categories Submenu
                  </div>

                  {/* All Categories Link */}
                  <button
                    onClick={() => {
                      setActiveTab('catalog');
                      if (setSelectedCategory) setSelectedCategory('All');
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justify: 'space-between',
                      padding: '8px 10px',
                      borderRadius: 'var(--radius-sm)',
                      background: (activeTab === 'catalog' && selectedCategory === 'All') ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                      color: (activeTab === 'catalog' && selectedCategory === 'All') ? 'var(--accent-primary)' : 'var(--text-secondary)',
                      fontSize: '13px',
                      fontWeight: (activeTab === 'catalog' && selectedCategory === 'All') ? '600' : '400',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Layers size={14} color={(activeTab === 'catalog' && selectedCategory === 'All') ? 'var(--accent-primary)' : 'currentColor'} />
                      <span>All Categories</span>
                    </div>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      {products.length}
                    </span>
                  </button>

                  {/* Category List */}
                  {categories.map((cat) => {
                    const count = products.filter(p => p.primaryCategory === cat).length;
                    const isSelected = activeTab === 'catalog' && selectedCategory === cat;

                    return (
                      <button
                        key={cat}
                        onClick={() => {
                          setActiveTab('catalog');
                          if (setSelectedCategory) setSelectedCategory(cat);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justify: 'space-between',
                          padding: '8px 10px',
                          borderRadius: 'var(--radius-sm)',
                          background: isSelected ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                          color: isSelected ? 'var(--accent-primary)' : 'var(--text-secondary)',
                          fontSize: '13px',
                          fontWeight: isSelected ? '600' : '400',
                          border: 'none',
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'all var(--transition-fast)'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                          <Tag size={13} color={isSelected ? 'var(--accent-primary)' : 'currentColor'} />
                          <span style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{cat}</span>
                        </div>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                          {count}
                        </span>
                      </button>
                    );
                  })}

                  {/* Add / Manage Category Button */}
                  <button
                    onClick={() => {
                      setActiveTab('catalog');
                      if (onOpenCategoryManager) onOpenCategoryManager();
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 10px',
                      marginTop: '4px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'rgba(255, 255, 255, 0.04)',
                      color: 'var(--accent-primary)',
                      fontSize: '12px',
                      fontWeight: '600',
                      border: '1px stroke var(--border-color)',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <FolderPlus size={14} />
                    <span>+ Manage Categories</span>
                  </button>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </nav>

      {/* Theme Toggle & User Info Footer */}
      <div style={{
        padding: '16px 20px',
        borderTop: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        <button 
          onClick={toggleTheme}
          className="btn btn-secondary"
          style={{ width: '100%', justifyContent: 'space-between', fontSize: '13px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {theme === 'dark' ? <Moon size={16} color="#f59e0b" /> : <Sun size={16} color="#f59e0b" />}
            <span>{theme === 'dark' ? 'Dark Theme' : 'Light Theme'}</span>
          </div>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Switch</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingTop: '4px' }}>
          <img 
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" 
            alt="Admin Profile"
            style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)', truncate: true }}>
              Alex Devlin
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Head of Operations
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
