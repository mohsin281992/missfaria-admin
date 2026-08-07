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
  Tag,
  Megaphone,
  ShieldCheck,
  PackagePlus,
  Timer,
  HelpCircle,
  Star
} from 'lucide-react';

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  onSelectModuleTab,
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
  const [isModulesExpanded, setIsModulesExpanded] = useState(true);

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

  const handleModuleTabClick = (tabId) => {
    setActiveTab('store-modules');
    if (onSelectModuleTab) {
      onSelectModuleTab(tabId);
    }
  };

  const storeModulesList = [
    { id: 'announcement', label: '1 & 2. Announcement Bar', icon: Megaphone },
    { id: 'trust-badges', label: '3. Trusted Badges', icon: ShieldCheck },
    { id: 'bundles', label: '4. Bundle Offers', icon: PackagePlus },
    { id: 'stock-counters', label: '5. Stock & Timers', icon: Timer },
    { id: 'faqs', label: '6. FAQ Manager', icon: HelpCircle },
    { id: 'reviews', label: '7. Customer Reviews', icon: Star }
  ];


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
      zIndex: 10000,
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

      {/* Navigation Links */}
      <nav style={{ flex: 1, padding: '16px 12px 12px 12px', display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto' }}>
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

              {/* Collapsible Submenu under Catalog */}
              {isCatalogItem && isCatalogExpanded && (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  margin: '4px 0 8px 18px',
                  paddingLeft: '14px',
                  borderLeft: '2px solid rgba(99, 102, 241, 0.3)'
                }}>
                  {/* 1. Products Link */}
                  <button
                    onClick={() => {
                      setActiveTab('catalog');
                      if (setSelectedCategory) setSelectedCategory('All');
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justify: 'space-between',
                      padding: '9px 12px',
                      borderRadius: 'var(--radius-md)',
                      background: (activeTab === 'catalog') ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                      color: (activeTab === 'catalog') ? 'var(--accent-primary)' : 'var(--text-secondary)',
                      fontSize: '13px',
                      fontWeight: (activeTab === 'catalog') ? '600' : '500',
                      border: '1px solid',
                      borderColor: (activeTab === 'catalog') ? 'rgba(99, 102, 241, 0.3)' : 'transparent',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Package size={16} color={(activeTab === 'catalog') ? 'var(--accent-primary)' : 'currentColor'} />
                      <span>Products</span>
                    </div>
                    <span className="badge badge-neutral" style={{ fontSize: '10px', padding: '2px 6px' }}>
                      {products.length}
                    </span>
                  </button>

                  {/* 2. Categories Link */}
                  <button
                    onClick={() => {
                      setActiveTab('categories');
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justify: 'space-between',
                      padding: '9px 12px',
                      borderRadius: 'var(--radius-md)',
                      background: (activeTab === 'categories') ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                      color: (activeTab === 'categories') ? 'var(--accent-primary)' : 'var(--text-secondary)',
                      fontSize: '13px',
                      fontWeight: (activeTab === 'categories') ? '600' : '500',
                      border: '1px solid',
                      borderColor: (activeTab === 'categories') ? 'rgba(99, 102, 241, 0.3)' : 'transparent',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Tag size={16} color={(activeTab === 'categories') ? 'var(--accent-primary)' : 'currentColor'} />
                      <span>Categories</span>
                    </div>
                    <span className="badge badge-neutral" style={{ fontSize: '10px', padding: '2px 6px' }}>
                      {categories.length}
                    </span>
                  </button>

                  {/* 3. Store Modules & Marketing Section (Below Categories inside Catalog) */}
                  <div style={{ marginTop: '4px' }}>
                    <button
                      onClick={() => {
                        setActiveTab('store-modules');
                        setIsModulesExpanded(!isModulesExpanded);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justify: 'space-between',
                        width: '100%',
                        padding: '9px 12px',
                        borderRadius: 'var(--radius-md)',
                        background: (activeTab === 'store-modules') ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                        color: (activeTab === 'store-modules') ? 'var(--accent-primary)' : 'var(--text-secondary)',
                        fontSize: '13px',
                        fontWeight: (activeTab === 'store-modules') ? '600' : '500',
                        border: '1px solid',
                        borderColor: (activeTab === 'store-modules') ? 'rgba(99, 102, 241, 0.3)' : 'transparent',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all var(--transition-fast)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Sparkles size={16} color={(activeTab === 'store-modules') ? 'var(--accent-primary)' : 'currentColor'} />
                        <span>Store Modules & Marketing</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span className="badge badge-neutral" style={{ fontSize: '10px', padding: '2px 6px' }}>
                          7 Modules
                        </span>
                        {isModulesExpanded ? (
                          <ChevronDown size={14} color="var(--text-muted)" />
                        ) : (
                          <ChevronRight size={14} color="var(--text-muted)" />
                        )}
                      </div>
                    </button>

                    {/* Sub-items for 7 Storefront Modules */}
                    {isModulesExpanded && (
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '3px',
                        marginTop: '4px',
                        marginLeft: '12px',
                        paddingLeft: '10px',
                        borderLeft: '1px dashed rgba(99, 102, 241, 0.3)'
                      }}>
                        {storeModulesList.map((m) => {
                          const MIcon = m.icon;
                          return (
                            <button
                              key={m.id}
                              onClick={() => handleModuleTabClick(m.id)}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '7px 10px',
                                borderRadius: '6px',
                                background: 'transparent',
                                color: 'var(--text-muted)',
                                fontSize: '12px',
                                fontWeight: '500',
                                border: 'none',
                                cursor: 'pointer',
                                textAlign: 'left',
                                transition: 'all 0.15s ease'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.color = 'var(--accent-primary)';
                                e.currentTarget.style.background = 'rgba(99, 102, 241, 0.08)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.color = 'var(--text-muted)';
                                e.currentTarget.style.background = 'transparent';
                              }}
                            >
                              <MIcon size={14} color="var(--accent-primary)" />
                              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {m.label}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
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
