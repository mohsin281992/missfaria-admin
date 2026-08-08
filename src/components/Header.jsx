import React from 'react';
import { Search, Bell, Sparkles, Plus, ExternalLink } from 'lucide-react';

export default function Header({ 
  activeTab, 
  activeModuleTab,
  searchQuery, 
  setSearchQuery, 
  onAddProductClick 
}) {
  const titles = {
    dashboard: 'Store Overview & Analytics',
    catalog: 'Product Catalog Management',
    categories: 'Category Management & Directory',
    sales: 'Orders & Sales Management',
    customers: 'Customer Directory',
    analytics: 'Performance & Revenue Reports',
    settings: 'Store Configuration & Preferences'
  };

  const moduleTitles = {
    'announcement': 'Announcement Bar',
    'trust-badges': 'Trusted Badges & Security Seals',
    'bundles': 'Bundle Offers & Deals',
    'stock-counters': 'Stock Scarcity & Countdown Timers',
    'faqs': 'FAQ Manager',
    'reviews': 'Customer Reviews & Moderation'
  };

  const headerTitle = activeTab === 'store-modules' 
    ? (moduleTitles[activeModuleTab] || 'Store Modules')
    : (titles[activeTab] || 'Dashboard');

  return (
    <header style={{
      height: 'var(--header-height)',
      background: 'var(--glass-bg)',
      backdropFilter: 'var(--glass-blur)',
      borderBottom: '1px solid var(--border-color)',
      padding: '0 32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 90
    }}>
      <div>
        <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)' }}>
          {headerTitle}
        </h2>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          Real-time store management and customization panel
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Global Search Input */}
        <div style={{ position: 'relative', width: '280px' }}>
          <Search 
            size={16} 
            color="var(--text-muted)" 
            style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} 
          />
          <input 
            type="text"
            placeholder="Search products, SKUs, orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '36px', height: '38px', fontSize: '13px' }}
          />
        </div>

        {/* Notifications Button */}
        <button 
          className="btn-icon"
          title="Notifications"
          style={{ position: 'relative', padding: '10px' }}
        >
          <Bell size={19} />
          <span style={{
            position: 'absolute',
            top: '6px',
            right: '6px',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: 'var(--danger)'
          }} />
        </button>
      </div>
    </header>
  );
}
