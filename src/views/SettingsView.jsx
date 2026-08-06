import React, { useState } from 'react';
import { Settings, Save, Store, Shield, DollarSign, Bell, Truck, Sun, Moon } from 'lucide-react';
import { worldCurrencies } from '../data/mockData';

export default function SettingsView({ settings, onSaveSettings, theme, toggleTheme }) {
  const [formData, setFormData] = useState({ ...settings });
  const [savedMessage, setSavedMessage] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveSettings(formData);
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '800px' }}>
      {savedMessage && (
        <div style={{
          padding: '14px 20px',
          borderRadius: 'var(--radius-md)',
          background: 'var(--success-bg)',
          color: 'var(--success)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          fontWeight: '600',
          fontSize: '14px'
        }}>
          Store configuration settings saved successfully!
        </div>
      )}

      {/* General Information */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <Store size={20} color="var(--accent-primary)" />
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)' }}>General Store Profile</h3>
        </div>

        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">Store Marketplace Name</label>
            <input 
              type="text" 
              value={formData.storeName} 
              onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
              className="form-input" 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Contact Admin Email</label>
            <input 
              type="email" 
              value={formData.contactEmail} 
              onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
              className="form-input" 
            />
          </div>
        </div>
      </div>

      {/* Inventory & Stock Defaults */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <Bell size={20} color="var(--warning)" />
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)' }}>Inventory & Alert Defaults</h3>
        </div>

        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">Global Low Stock Alert Threshold</label>
            <input 
              type="number" 
              value={formData.lowStockGlobalThreshold} 
              onChange={(e) => setFormData({ ...formData, lowStockGlobalThreshold: parseInt(e.target.value) || 5 })}
              className="form-input" 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Store Base Currency ({worldCurrencies.length} Currencies Available)</label>
            <select 
              value={formData.currency}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              className="form-select"
            >
              {worldCurrencies.map(c => (
                <option key={c.code} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Appearance & Theme */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)' }}>Interface Appearance</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Toggle admin interface color palette</p>
          </div>
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={toggleTheme}
          >
            {theme === 'dark' ? <Moon size={16} color="#f59e0b" /> : <Sun size={16} color="#f59e0b" />}
            {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
          </button>
        </div>
      </div>

      <div>
        <button type="submit" className="btn btn-primary">
          <Save size={18} /> Save Settings
        </button>
      </div>
    </form>
  );
}
