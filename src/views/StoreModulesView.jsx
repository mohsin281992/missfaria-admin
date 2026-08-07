import React, { useState, useEffect } from 'react';
import { 
  Megaphone, 
  ShieldCheck, 
  PackagePlus, 
  Timer, 
  HelpCircle, 
  Star, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  Eye, 
  Check, 
  X, 
  ExternalLink, 
  Lock, 
  Truck, 
  Headphones, 
  Sparkles, 
  AlertCircle, 
  Percent, 
  Clock, 
  Tag, 
  MessageSquare, 
  Flame,
  ChevronDown,
  ChevronUp,
  RefreshCw
} from 'lucide-react';

import { formatCurrency } from '../utils/formatters';

export default function StoreModulesView({
  products = [],
  settings = {},
  announcementBar,
  onSaveAnnouncementBar,
  trustBadges = [],
  onAddTrustBadge,
  onUpdateTrustBadge,
  onDeleteTrustBadge,
  bundleOffers = [],
  onAddBundleOffer,
  onUpdateBundleOffer,
  onDeleteBundleOffer,
  stockCounters,
  onSaveStockCounters,
  faqs = [],
  onAddFaq,
  onUpdateFaq,
  onDeleteFaq,
  reviews = [],
  onAddReview,
  onUpdateReviewStatus,
  onDeleteReview
}) {
  const [activeTab, setActiveTab] = useState('announcement');

  // Announcement Bar Form Local State
  const [annFormData, setAnnFormData] = useState(announcementBar || {});
  useEffect(() => {
    if (announcementBar) setAnnFormData(announcementBar);
  }, [announcementBar]);

  // Stock Counter Form Local State
  const [scFormData, setScFormData] = useState(stockCounters || {});
  useEffect(() => {
    if (stockCounters) setScFormData(stockCounters);
  }, [stockCounters]);

  // Modals Local State
  const [isBadgeModalOpen, setIsBadgeModalOpen] = useState(false);
  const [editingBadge, setEditingBadge] = useState(null);

  const [isBundleModalOpen, setIsBundleModalOpen] = useState(false);
  const [editingBundle, setEditingBundle] = useState(null);

  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  // Live Timer state for Countdown Preview
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTime = () => {
      const targetDate = new Date(scFormData.flashSaleEnd || '2026-08-31T23:59:59');
      const diff = targetDate.getTime() - new Date().getTime();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / 1000 / 60) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    };
    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [scFormData.flashSaleEnd]);

  // Save Announcement Bar
  const handleAnnSubmit = (e) => {
    e.preventDefault();
    onSaveAnnouncementBar(annFormData);
    alert('Announcement Bar settings saved & synced to Supabase!');
  };

  // Save Stock Counters
  const handleScSubmit = (e) => {
    e.preventDefault();
    onSaveStockCounters(scFormData);
    alert('Stock Counter & Urgency settings saved & synced to Supabase!');
  };

  return (
    <div className="view-container" style={{ padding: '24px 32px', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* Header Banner */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifySpace: 'between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '28px',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(6, 182, 212, 0.08) 100%)',
        padding: '24px 28px',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid rgba(99, 102, 241, 0.25)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 20px rgba(99, 102, 241, 0.35)'
          }}>
            <Sparkles size={28} color="#ffffff" />
          </div>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
              Storefront & Marketing Modules
            </h1>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
              Manage dynamic announcement bars, trust badges, bundle deals, stock scarcity counters, FAQs & customer reviews.
            </p>
          </div>
        </div>
      </div>

      {/* Module Navigation Tabs */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        borderBottom: '2px solid var(--border-color)',
        marginBottom: '24px',
        overflowX: 'auto',
        paddingBottom: '2px'
      }}>
        {[
          { id: 'announcement', label: '1 & 2. Announcement Bar', icon: Megaphone, count: annFormData.enabled ? 'Active' : 'Off' },
          { id: 'trust-badges', label: '3. Trusted Badges', icon: ShieldCheck, count: `${trustBadges.length} Active` },
          { id: 'bundles', label: '4. Bundle Offers', icon: PackagePlus, count: `${bundleOffers.length} Deals` },
          { id: 'stock-counters', label: '5. Stock & Timers', icon: Timer, count: scFormData.enableCountdown ? 'Live' : 'Off' },
          { id: 'faqs', label: '6. FAQ Manager', icon: HelpCircle, count: `${faqs.length} Q&A` },
          { id: 'reviews', label: '7. Customer Reviews', icon: Star, count: `${reviews.length} Reviews` }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 20px',
                fontSize: '14px',
                fontWeight: isActive ? '700' : '500',
                color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                background: isActive ? 'var(--bg-secondary)' : 'transparent',
                border: 'none',
                borderBottom: isActive ? '3px solid var(--accent-primary)' : '3px solid transparent',
                borderRadius: '8px 8px 0 0',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap'
              }}
            >
              <Icon size={18} color={isActive ? 'var(--accent-primary)' : 'currentColor'} />
              <span>{tab.label}</span>
              <span className="badge badge-neutral" style={{ fontSize: '10px', padding: '2px 6px' }}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* TAB 1 & 2: ANNOUNCEMENT BAR */}
      {activeTab === 'announcement' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          
          {/* Form Controls */}
          <div className="card" style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Megaphone size={20} color="var(--accent-primary)" />
              Announcement Bar Configuration
            </h2>

            <form onSubmit={handleAnnSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'var(--bg-primary)', borderRadius: 'var(--radius-md)' }}>
                <div>
                  <div style={{ fontWeight: '600', fontSize: '14px' }}>Enable Announcement Bar</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Show scrolling ticker at top of website</div>
                </div>
                <label className="switch" style={{ cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={annFormData.enabled ?? true}
                    onChange={(e) => setAnnFormData({ ...annFormData, enabled: e.target.checked })}
                  />
                  <span className="slider round"></span>
                </label>
              </div>

              {/* Requirement 1: Ticker Text */}
              <div>
                <label className="form-label" style={{ fontWeight: '600', marginBottom: '6px', display: 'block' }}>
                  1. Scrolling Ticker Text (Crawls Right to Left)
                </label>
                <textarea 
                  className="form-control" 
                  rows={3}
                  value={annFormData.tickerText || ''}
                  onChange={(e) => setAnnFormData({ ...annFormData, tickerText: e.target.value })}
                  placeholder="Enter text to crawl across the top bar..."
                />
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                  This text automatically scrolls continuously from right to left in a ticker marquee animation.
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div>
                  <label className="form-label">Scroll Speed</label>
                  <select 
                    className="form-control"
                    value={annFormData.scrollSpeed || 'normal'}
                    onChange={(e) => setAnnFormData({ ...annFormData, scrollSpeed: e.target.value })}
                  >
                    <option value="slow">Slow (25s)</option>
                    <option value="normal">Normal (15s)</option>
                    <option value="fast">Fast (8s)</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Background Color</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input 
                      type="color" 
                      style={{ width: '40px', height: '38px', padding: 0, border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                      value={annFormData.bgColor || '#4f46e5'}
                      onChange={(e) => setAnnFormData({ ...annFormData, bgColor: e.target.value })}
                    />
                    <input 
                      type="text" 
                      className="form-control" 
                      value={annFormData.bgColor || '#4f46e5'}
                      onChange={(e) => setAnnFormData({ ...annFormData, bgColor: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label">Text Color</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input 
                      type="color" 
                      style={{ width: '40px', height: '38px', padding: 0, border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                      value={annFormData.textColor || '#ffffff'}
                      onChange={(e) => setAnnFormData({ ...annFormData, textColor: e.target.value })}
                    />
                    <input 
                      type="text" 
                      className="form-control" 
                      value={annFormData.textColor || '#ffffff'}
                      onChange={(e) => setAnnFormData({ ...annFormData, textColor: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '8px 0' }} />

              {/* Requirement 2: Right-Side Details */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <label className="form-label" style={{ fontWeight: '600', margin: 0 }}>
                    2. Right-Side Content Details Module
                  </label>
                  <label className="switch" style={{ cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={annFormData.enableRightDetails ?? true}
                      onChange={(e) => setAnnFormData({ ...annFormData, enableRightDetails: e.target.checked })}
                    />
                    <span className="slider round"></span>
                  </label>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label className="form-label">Right-Side Info Text (e.g. Phone Helpline)</label>
                    <input 
                      type="text" 
                      className="form-control"
                      value={annFormData.rightDetailText || ''}
                      onChange={(e) => setAnnFormData({ ...annFormData, rightDetailText: e.target.value })}
                      placeholder="📞 Helpline: +1 (800) 555-0199"
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label className="form-label">Promo Badge Tag</label>
                      <input 
                        type="text" 
                        className="form-control"
                        value={annFormData.rightBadgeText || ''}
                        onChange={(e) => setAnnFormData({ ...annFormData, rightBadgeText: e.target.value })}
                        placeholder="LIMITED OFFER"
                      />
                    </div>
                    <div>
                      <label className="form-label">Action Button Text</label>
                      <input 
                        type="text" 
                        className="form-control"
                        value={annFormData.rightLinkText || ''}
                        onChange={(e) => setAnnFormData({ ...annFormData, rightLinkText: e.target.value })}
                        placeholder="Shop Flash Sale"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="form-label">Action Link Target URL</label>
                    <input 
                      type="text" 
                      className="form-control"
                      value={annFormData.rightLinkUrl || ''}
                      onChange={(e) => setAnnFormData({ ...annFormData, rightLinkUrl: e.target.value })}
                      placeholder="/catalog"
                    />
                  </div>
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ marginTop: '12px', justifyContent: 'center' }}>
                <Save size={18} />
                Save & Publish Announcement Bar
              </button>
            </form>
          </div>

          {/* Interactive Real-Time Preview */}
          <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Eye size={20} color="#10b981" />
              Live Interactive Preview
            </h2>

            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
              Below is the exact real-time preview of how the Announcement Bar appears on your storefront header:
            </p>

            {/* Simulated Website Header */}
            <div style={{
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              overflow: 'hidden',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
            }}>
              
              {/* THE ANNOUNCEMENT BAR COMPONENT */}
              {annFormData.enabled ? (
                <div style={{
                  backgroundColor: annFormData.bgColor || '#4f46e5',
                  color: annFormData.textColor || '#ffffff',
                  fontSize: `${annFormData.fontSize || 13}px`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 16px',
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                  {/* Left Side: Scrolling Ticker Marquee Animation */}
                  <div style={{
                    flex: 1,
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    marginRight: '16px',
                    position: 'relative'
                  }}>
                    <div style={{
                      display: 'inline-block',
                      paddingLeft: '100%',
                      animation: `marqueeTicker ${
                        annFormData.scrollSpeed === 'fast' ? '8s' : annFormData.scrollSpeed === 'slow' ? '25s' : '15s'
                      } linear infinite`,
                      fontWeight: '500'
                    }}>
                      {annFormData.tickerText}
                    </div>
                  </div>

                  {/* Right Side: Details Content */}
                  {annFormData.enableRightDetails && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                      background: 'rgba(0,0,0,0.15)',
                      padding: '4px 12px',
                      borderRadius: '20px'
                    }}>
                      {annFormData.rightDetailText && (
                        <span style={{ fontSize: '12px', opacity: 0.95 }}>
                          {annFormData.rightDetailText}
                        </span>
                      )}
                      {annFormData.rightBadgeText && (
                        <span style={{
                          background: '#f59e0b',
                          color: '#000',
                          fontSize: '10px',
                          fontWeight: '800',
                          padding: '2px 6px',
                          borderRadius: '4px'
                        }}>
                          {annFormData.rightBadgeText}
                        </span>
                      )}
                      {annFormData.rightLinkText && (
                        <a 
                          href={annFormData.rightLinkUrl || '#'}
                          onClick={(e) => e.preventDefault()}
                          style={{
                            color: annFormData.textColor || '#ffffff',
                            fontWeight: '700',
                            textDecoration: 'underline',
                            fontSize: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          {annFormData.rightLinkText}
                          <ExternalLink size={12} />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ padding: '16px', textAlign: 'center', background: 'var(--bg-primary)', color: 'var(--text-muted)' }}>
                  Announcement Bar is currently Disabled
                </div>
              )}

              {/* Simulated Navigation Bar */}
              <div style={{ padding: '14px 20px', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontWeight: '800', fontSize: '16px' }}>{settings.storeName || 'Miss Faria Store'}</div>
                <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                  <span>Catalog</span>
                  <span>Categories</span>
                  <span>Bundles</span>
                  <span>Contact</span>
                </div>
              </div>
            </div>

            {/* CSS Keyframe Animation for Marquee */}
            <style>{`
              @keyframes marqueeTicker {
                0% { transform: translate3d(0, 0, 0); }
                100% { transform: translate3d(-100%, 0, 0); }
              }
            `}</style>

            <div style={{ background: 'var(--bg-primary)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px dashed var(--border-color)' }}>
              <div style={{ fontWeight: '600', fontSize: '13px', color: 'var(--accent-primary)', marginBottom: '4px' }}>
                💡 Key Features Active:
              </div>
              <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                <li><strong>Crawling Text:</strong> Smooth right-to-left continuous marquee loop with custom speed.</li>
                <li><strong>Right-Side Details:</strong> Dedicated right-aligned phone helpline, promo badge, and call-to-action link.</li>
                <li><strong>Instant Sync:</strong> All changes save straight to Supabase.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: TRUSTED BADGES */}
      {activeTab === 'trust-badges' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: '700', margin: 0 }}>
                3. Trusted Badges & Security Seals
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                Manage checkout trust badges, money-back guarantees, and customer security seals.
              </p>
            </div>
            <button 
              onClick={() => {
                setEditingBadge(null);
                setIsBadgeModalOpen(true);
              }}
              className="btn btn-primary"
            >
              <Plus size={16} /> Add New Trust Badge
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {trustBadges.map((badge) => {
              const IconComp = badge.icon === 'Truck' ? Truck : badge.icon === 'Lock' ? Lock : badge.icon === 'Headphones' ? Headphones : ShieldCheck;
              return (
                <div 
                  key={badge.id}
                  className="card"
                  style={{
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '16px',
                    border: badge.active ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid var(--border-color)',
                    opacity: badge.active ? 1 : 0.6
                  }}
                >
                  <div style={{ display: 'flex', itemsAlign: 'flex-start', gap: '14px' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      background: badge.bgColor || 'rgba(99, 102, 241, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <IconComp size={24} color={badge.iconColor || '#6366f1'} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '700', fontSize: '15px', color: 'var(--text-primary)' }}>
                        {badge.title}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {badge.subtitle}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
                    <span className={`badge ${badge.active ? 'badge-success' : 'badge-neutral'}`}>
                      {badge.active ? 'Active on Store' : 'Hidden'}
                    </span>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        onClick={() => {
                          setEditingBadge(badge);
                          setIsBadgeModalOpen(true);
                        }}
                        className="btn btn-secondary" 
                        style={{ padding: '6px 10px', fontSize: '12px' }}
                      >
                        <Edit3 size={14} /> Edit
                      </button>
                      <button 
                        onClick={() => onDeleteTrustBadge(badge.id)}
                        className="btn btn-secondary" 
                        style={{ padding: '6px 10px', fontSize: '12px', color: '#ef4444' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: BUNDLE OFFERS */}
      {activeTab === 'bundles' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: '700', margin: 0 }}>
                4. Bundle Offers & Combo Deals
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                Combine products into discounted bundles to increase Average Order Value (AOV).
              </p>
            </div>
            <button 
              onClick={() => {
                setEditingBundle(null);
                setIsBundleModalOpen(true);
              }}
              className="btn btn-primary"
            >
              <Plus size={16} /> Create Bundle Offer
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '20px' }}>
            {bundleOffers.map((bundle) => {
              const bundleProducts = products.filter(p => (bundle.productIds || []).includes(p.id));
              const originalTotalPrice = bundleProducts.reduce((sum, p) => sum + (p.salePrice || p.basePrice || 0), 0);

              let finalBundlePrice = bundle.bundlePrice || originalTotalPrice;
              if (bundle.discountType === 'percentage') {
                finalBundlePrice = originalTotalPrice * (1 - (bundle.discountValue || 0) / 100);
              } else if (bundle.discountType === 'fixed') {
                finalBundlePrice = Math.max(0, originalTotalPrice - (bundle.discountValue || 0));
              }

              return (
                <div key={bundle.id} className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <span className="badge badge-warning" style={{ fontSize: '10px', fontWeight: '800', marginBottom: '6px' }}>
                        {bundle.badge || 'SPECIAL BUNDLE'}
                      </span>
                      <h3 style={{ fontSize: '16px', fontWeight: '700', margin: '4px 0 0 0' }}>
                        {bundle.title}
                      </h3>
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                        {bundle.description}
                      </p>
                    </div>
                    <span className={`badge ${bundle.active ? 'badge-success' : 'badge-neutral'}`}>
                      {bundle.active ? 'Active' : 'Disabled'}
                    </span>
                  </div>

                  {/* Products in bundle */}
                  <div style={{ background: 'var(--bg-primary)', padding: '12px', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      Included Products ({bundleProducts.length}):
                    </div>
                    {bundleProducts.map(p => (
                      <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img src={p.mainImage} alt={p.title} style={{ width: '32px', height: '32px', borderRadius: '4px', objectFit: 'cover' }} />
                        <div style={{ flex: 1, fontSize: '13px', fontWeight: '500', truncate: true }}>
                          {p.title}
                        </div>
                        <div style={{ fontSize: '12px', fontWeight: '600' }}>
                          {formatCurrency(p.salePrice || p.basePrice || 0, settings.currency)}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pricing Calculation */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
                    <div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Bundle Special Price:</div>
                      <div style={{ fontSize: '18px', fontWeight: '800', color: '#10b981', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {formatCurrency(finalBundlePrice, settings.currency)}
                        <span style={{ fontSize: '12px', textDecoration: 'line-through', color: 'var(--text-muted)', fontWeight: '400' }}>
                          {formatCurrency(originalTotalPrice, settings.currency)}
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        onClick={() => {
                          setEditingBundle(bundle);
                          setIsBundleModalOpen(true);
                        }}
                        className="btn btn-secondary" 
                        style={{ padding: '6px 10px', fontSize: '12px' }}
                      >
                        <Edit3 size={14} /> Edit
                      </button>
                      <button 
                        onClick={() => onDeleteBundleOffer(bundle.id)}
                        className="btn btn-secondary" 
                        style={{ padding: '6px 10px', fontSize: '12px', color: '#ef4444' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 5: STOCK COUNTERS & TIMERS */}
      {activeTab === 'stock-counters' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div className="card" style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Timer size={20} color="var(--accent-primary)" />
              Limited Stock & Flash Sale Counter Settings
            </h2>

            <form onSubmit={handleScSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'var(--bg-primary)', borderRadius: 'var(--radius-md)' }}>
                <div>
                  <div style={{ fontWeight: '600', fontSize: '14px' }}>Enable Flash Sale Countdown Timer</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Displays live ticking clock on deal banners</div>
                </div>
                <label className="switch" style={{ cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={scFormData.enableCountdown ?? true}
                    onChange={(e) => setScFormData({ ...scFormData, enableCountdown: e.target.checked })}
                  />
                  <span className="slider round"></span>
                </label>
              </div>

              <div>
                <label className="form-label">Flash Sale Title</label>
                <input 
                  type="text" 
                  className="form-control"
                  value={scFormData.flashSaleTitle || ''}
                  onChange={(e) => setScFormData({ ...scFormData, flashSaleTitle: e.target.value })}
                />
              </div>

              <div>
                <label className="form-label">Flash Sale End Date & Time</label>
                <input 
                  type="datetime-local" 
                  className="form-control"
                  value={scFormData.flashSaleEnd ? scFormData.flashSaleEnd.slice(0, 16) : ''}
                  onChange={(e) => setScFormData({ ...scFormData, flashSaleEnd: e.target.value })}
                />
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '8px 0' }} />

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'var(--bg-primary)', borderRadius: 'var(--radius-md)' }}>
                <div>
                  <div style={{ fontWeight: '600', fontSize: '14px' }}>Enable Low Stock Urgency Counter</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Shows remaining stock progress bar on product pages</div>
                </div>
                <label className="switch" style={{ cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={scFormData.enableScarcityCounter ?? true}
                    onChange={(e) => setScFormData({ ...scFormData, enableScarcityCounter: e.target.checked })}
                  />
                  <span className="slider round"></span>
                </label>
              </div>

              <div>
                <label className="form-label">Low Stock Scarcity Threshold Trigger</label>
                <input 
                  type="number" 
                  className="form-control"
                  value={scFormData.lowStockThreshold || 10}
                  onChange={(e) => setScFormData({ ...scFormData, lowStockThreshold: parseInt(e.target.value) || 10 })}
                />
              </div>

              <div>
                <label className="form-label">Urgency Message Template</label>
                <input 
                  type="text" 
                  className="form-control"
                  value={scFormData.urgencyTextTemplate || ''}
                  onChange={(e) => setScFormData({ ...scFormData, urgencyTextTemplate: e.target.value })}
                  placeholder="🔥 Hurry! Only {stock} units remaining!"
                />
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                  Use <code>&#123;stock&#125;</code> as placeholder for remaining quantity.
                </span>
              </div>

              <button type="submit" className="btn btn-primary" style={{ marginTop: '8px', justifyContent: 'center' }}>
                <Save size={18} /> Save Counter Settings
              </button>
            </form>
          </div>

          {/* Live Preview for Counters */}
          <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Eye size={20} color="#10b981" />
              Live Product Page Widget Preview
            </h2>

            {/* Countdown Widget Preview */}
            {scFormData.enableCountdown && (
              <div style={{
                background: 'linear-gradient(135deg, #1e1b4b 0%, #311b92 100%)',
                color: '#fff',
                padding: '20px',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
                boxShadow: '0 8px 20px rgba(0,0,0,0.2)'
              }}>
                <div style={{ fontSize: '14px', fontWeight: '700', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Flame size={18} color="#f59e0b" />
                  {scFormData.flashSaleTitle || '⚡ Summer Flash Sale Ends Soon!'}
                </div>

                {/* Ticking Clock */}
                <div style={{ display: 'flex', gap: '12px' }}>
                  {[
                    { label: 'DAYS', val: timeLeft.days },
                    { label: 'HOURS', val: timeLeft.hours },
                    { label: 'MINS', val: timeLeft.minutes },
                    { label: 'SECS', val: timeLeft.seconds }
                  ].map((unit, idx) => (
                    <div key={idx} style={{ textAlign: 'center' }}>
                      <div style={{
                        background: 'rgba(255,255,255,0.15)',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        fontSize: '20px',
                        fontWeight: '800',
                        fontFamily: 'monospace',
                        minWidth: '50px'
                      }}>
                        {String(unit.val).padStart(2, '0')}
                      </div>
                      <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.7)', marginTop: '4px', fontWeight: '600' }}>
                        {unit.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Stock Scarcity Bar Preview */}
            {scFormData.enableScarcityCounter && (
              <div style={{
                background: 'var(--bg-primary)',
                padding: '20px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Flame size={16} />
                  {(scFormData.urgencyTextTemplate || '🔥 Hurry! Only {stock} units left!').replace('{stock}', '3')}
                </div>

                <div style={{ height: '10px', width: '100%', background: 'var(--border-color)', borderRadius: '5px', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: '30%',
                    background: scFormData.progressBarColor || '#ef4444',
                    borderRadius: '5px',
                    transition: 'width 0.4s ease'
                  }}></div>
                </div>

                <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                  <span>3 Items Left</span>
                  <span>10 Initial Stock</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 6: FAQ MANAGER */}
      {activeTab === 'faqs' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: '700', margin: 0 }}>
                6. Frequently Asked Questions (FAQ) Module
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                Manage store FAQs to resolve buyer doubts before checkout.
              </p>
            </div>
            <button 
              onClick={() => {
                setEditingFaq(null);
                setIsFaqModalOpen(true);
              }}
              className="btn btn-primary"
            >
              <Plus size={16} /> Add New FAQ
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {faqs.map((faq) => (
              <div key={faq.id} className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className="badge badge-primary" style={{ fontSize: '11px' }}>
                      {faq.category || 'General'}
                    </span>
                    <h3 style={{ fontSize: '15px', fontWeight: '700', margin: 0 }}>
                      {faq.question}
                    </h3>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      onClick={() => {
                        setEditingFaq(faq);
                        setIsFaqModalOpen(true);
                      }}
                      className="btn btn-secondary" 
                      style={{ padding: '4px 8px', fontSize: '12px' }}
                    >
                      <Edit3 size={14} /> Edit
                    </button>
                    <button 
                      onClick={() => onDeleteFaq(faq.id)}
                      className="btn btn-secondary" 
                      style={{ padding: '4px 8px', fontSize: '12px', color: '#ef4444' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.6' }}>
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: CUSTOMER REVIEWS */}
      {activeTab === 'reviews' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: '700', margin: 0 }}>
                7. Customer Reviews & Ratings Moderation
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                Approve, reject, and manage product reviews and star ratings.
              </p>
            </div>
            <button 
              onClick={() => setIsReviewModalOpen(true)}
              className="btn btn-primary"
            >
              <Plus size={16} /> Add Manual Review
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {reviews.map((rev) => (
              <div key={rev.id} className="card" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <img src={rev.avatar} alt={rev.reviewerName} style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }} />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontWeight: '700', fontSize: '14px' }}>{rev.reviewerName}</span>
                      {rev.verified && (
                        <span className="badge badge-success" style={{ fontSize: '10px' }}>
                          Verified Buyer
                        </span>
                      )}
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{rev.date}</span>
                    </div>

                    <div style={{ display: 'flex', gap: '2px', margin: '4px 0' }}>
                      {[1,2,3,4,5].map(star => (
                        <Star 
                          key={star} 
                          size={14} 
                          fill={star <= rev.rating ? '#f59e0b' : 'none'} 
                          color={star <= rev.rating ? '#f59e0b' : 'var(--text-muted)'} 
                        />
                      ))}
                    </div>

                    <div style={{ fontWeight: '600', fontSize: '14px', marginTop: '2px' }}>
                      {rev.title}
                    </div>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
                      {rev.comment}
                    </p>
                    <div style={{ fontSize: '11px', color: 'var(--accent-primary)', marginTop: '4px', fontWeight: '500' }}>
                      Product: {rev.productTitle}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
                  <span className={`badge ${rev.status === 'Approved' ? 'badge-success' : rev.status === 'Rejected' ? 'badge-danger' : 'badge-warning'}`}>
                    {rev.status}
                  </span>

                  <div style={{ display: 'flex', gap: '6px' }}>
                    {rev.status !== 'Approved' && (
                      <button 
                        onClick={() => onUpdateReviewStatus(rev.id, 'Approved')}
                        className="btn btn-secondary"
                        style={{ padding: '6px 10px', fontSize: '12px', color: '#10b981' }}
                      >
                        Approve
                      </button>
                    )}
                    {rev.status !== 'Rejected' && (
                      <button 
                        onClick={() => onUpdateReviewStatus(rev.id, 'Rejected')}
                        className="btn btn-secondary"
                        style={{ padding: '6px 10px', fontSize: '12px', color: '#ef4444' }}
                      >
                        Reject
                      </button>
                    )}
                    <button 
                      onClick={() => onDeleteReview(rev.id)}
                      className="btn btn-secondary"
                      style={{ padding: '6px 10px', fontSize: '12px' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TRUST BADGE MODAL */}
      {isBadgeModalOpen && (
        <BadgeFormModal 
          badge={editingBadge}
          onSave={(formData) => {
            if (editingBadge) {
              onUpdateTrustBadge(editingBadge.id, formData);
            } else {
              onAddTrustBadge(formData);
            }
            setIsBadgeModalOpen(false);
          }}
          onClose={() => setIsBadgeModalOpen(false)}
        />
      )}

      {/* BUNDLE OFFER MODAL */}
      {isBundleModalOpen && (
        <BundleFormModal 
          bundle={editingBundle}
          products={products}
          settings={settings}
          onSave={(formData) => {
            if (editingBundle) {
              onUpdateBundleOffer(editingBundle.id, formData);
            } else {
              onAddBundleOffer(formData);
            }
            setIsBundleModalOpen(false);
          }}
          onClose={() => setIsBundleModalOpen(false)}
        />
      )}

      {/* FAQ MODAL */}
      {isFaqModalOpen && (
        <FaqFormModal 
          faq={editingFaq}
          onSave={(formData) => {
            if (editingFaq) {
              onUpdateFaq(editingFaq.id, formData);
            } else {
              onAddFaq(formData);
            }
            setIsFaqModalOpen(false);
          }}
          onClose={() => setIsFaqModalOpen(false)}
        />
      )}

      {/* MANUAL REVIEW MODAL */}
      {isReviewModalOpen && (
        <ReviewFormModal 
          products={products}
          onSave={(formData) => {
            onAddReview(formData);
            setIsReviewModalOpen(false);
          }}
          onClose={() => setIsReviewModalOpen(false)}
        />
      )}
    </div>
  );
}

// Modal Component 1: Trust Badge Form
function BadgeFormModal({ badge, onSave, onClose }) {
  const [formData, setFormData] = useState({
    title: badge ? badge.title : '',
    subtitle: badge ? badge.subtitle : '',
    icon: badge ? badge.icon : 'ShieldCheck',
    iconColor: badge ? badge.iconColor : '#6366f1',
    bgColor: badge ? badge.bgColor : 'rgba(99, 102, 241, 0.12)',
    active: badge ? badge.active : true
  });

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ width: '450px' }}>
        <div className="modal-header">
          <h3>{badge ? 'Edit Trust Badge' : 'Add New Trust Badge'}</h3>
          <button className="btn-close" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label className="form-label">Badge Title</label>
            <input 
              type="text" 
              className="form-control" 
              value={formData.title} 
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Free Express Shipping"
              required
            />
          </div>

          <div>
            <label className="form-label">Subtitle Description</label>
            <input 
              type="text" 
              className="form-control" 
              value={formData.subtitle} 
              onChange={e => setFormData({ ...formData, subtitle: e.target.value })}
              placeholder="e.g. On all orders above $100"
            />
          </div>

          <div>
            <label className="form-label">Select Icon</label>
            <select 
              className="form-control"
              value={formData.icon}
              onChange={e => setFormData({ ...formData, icon: e.target.value })}
            >
              <option value="ShieldCheck">ShieldCheck (Security / Money Back)</option>
              <option value="Truck">Truck (Shipping / Delivery)</option>
              <option value="Lock">Lock (SSL / Payments)</option>
              <option value="Headphones">Headphones (24/7 Support)</option>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label className="form-label">Icon Color</label>
              <input 
                type="color" 
                style={{ width: '100%', height: '38px', cursor: 'pointer' }}
                value={formData.iconColor}
                onChange={e => setFormData({ ...formData, iconColor: e.target.value })}
              />
            </div>
            <div>
              <label className="form-label">Active</label>
              <select 
                className="form-control"
                value={formData.active ? 'true' : 'false'}
                onChange={e => setFormData({ ...formData, active: e.target.value === 'true' })}
              >
                <option value="true">Active</option>
                <option value="false">Hidden</option>
              </select>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={() => onSave(formData)}>Save Badge</button>
        </div>
      </div>
    </div>
  );
}

// Modal Component 2: Bundle Offer Form
function BundleFormModal({ bundle, products, settings, onSave, onClose }) {
  const [formData, setFormData] = useState({
    title: bundle ? bundle.title : '',
    description: bundle ? bundle.description : '',
    productIds: bundle ? (bundle.productIds || []) : [],
    discountType: bundle ? bundle.discountType : 'percentage',
    discountValue: bundle ? bundle.discountValue : 15,
    bundlePrice: bundle ? bundle.bundlePrice : 0,
    badge: bundle ? bundle.badge : 'BEST VALUE',
    active: bundle ? bundle.active : true
  });

  const toggleProductSelect = (id) => {
    setFormData(prev => {
      const exists = prev.productIds.includes(id);
      return {
        ...prev,
        productIds: exists ? prev.productIds.filter(pid => pid !== id) : [...prev.productIds, id]
      };
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ width: '550px' }}>
        <div className="modal-header">
          <h3>{bundle ? 'Edit Bundle Offer' : 'Create Product Bundle Deal'}</h3>
          <button className="btn-close" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label className="form-label">Bundle Title</label>
            <input 
              type="text" 
              className="form-control" 
              value={formData.title} 
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Ultimate Audio & Fitness Starter Pack"
              required
            />
          </div>

          <div>
            <label className="form-label">Description</label>
            <input 
              type="text" 
              className="form-control" 
              value={formData.description} 
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              placeholder="Short catchy explanation of savings..."
            />
          </div>

          <div>
            <label className="form-label">Select Products Included in Bundle</label>
            <div style={{ maxHeight: '150px', overflowY: 'auto', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '8px' }}>
              {products.map(p => (
                <label key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 0', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={formData.productIds.includes(p.id)}
                    onChange={() => toggleProductSelect(p.id)}
                  />
                  <span style={{ fontSize: '13px' }}>{p.title} ({formatCurrency(p.salePrice || p.basePrice || 0, settings.currency)})</span>
                </label>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label className="form-label">Discount Type</label>
              <select 
                className="form-control"
                value={formData.discountType}
                onChange={e => setFormData({ ...formData, discountType: e.target.value })}
              >
                <option value="percentage">Percentage Off (%)</option>
                <option value="fixed">Fixed Amount Off ($)</option>
              </select>
            </div>

            <div>
              <label className="form-label">Discount Value</label>
              <input 
                type="number" 
                className="form-control" 
                value={formData.discountValue}
                onChange={e => setFormData({ ...formData, discountValue: parseFloat(e.target.value) || 0 })}
              />
            </div>
          </div>

          <div>
            <label className="form-label">Badge Tag (e.g. POPULAR BUNDLE)</label>
            <input 
              type="text" 
              className="form-control" 
              value={formData.badge} 
              onChange={e => setFormData({ ...formData, badge: e.target.value })}
            />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={() => onSave(formData)}>Save Bundle</button>
        </div>
      </div>
    </div>
  );
}

// Modal Component 3: FAQ Form
function FaqFormModal({ faq, onSave, onClose }) {
  const [formData, setFormData] = useState({
    question: faq ? faq.question : '',
    answer: faq ? faq.answer : '',
    category: faq ? faq.category : 'General',
    active: faq ? faq.active : true
  });

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ width: '480px' }}>
        <div className="modal-header">
          <h3>{faq ? 'Edit FAQ Item' : 'Add FAQ Question'}</h3>
          <button className="btn-close" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label className="form-label">Category</label>
            <input 
              type="text" 
              className="form-control" 
              value={formData.category}
              onChange={e => setFormData({ ...formData, category: e.target.value })}
              placeholder="Shipping & Delivery, Returns, Warranty..."
            />
          </div>

          <div>
            <label className="form-label">Question</label>
            <input 
              type="text" 
              className="form-control" 
              value={formData.question}
              onChange={e => setFormData({ ...formData, question: e.target.value })}
              placeholder="e.g. How long does shipping take?"
              required
            />
          </div>

          <div>
            <label className="form-label">Answer</label>
            <textarea 
              className="form-control" 
              rows={4}
              value={formData.answer}
              onChange={e => setFormData({ ...formData, answer: e.target.value })}
              placeholder="Clear detailed answer for customers..."
              required
            />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={() => onSave(formData)}>Save FAQ</button>
        </div>
      </div>
    </div>
  );
}

// Modal Component 4: Review Form
function ReviewFormModal({ products, onSave, onClose }) {
  const [formData, setFormData] = useState({
    productId: products[0]?.id || 'prod-1',
    productTitle: products[0]?.title || 'Product',
    reviewerName: '',
    reviewerEmail: '',
    rating: 5,
    title: '',
    comment: '',
    verified: true,
    status: 'Approved'
  });

  const handleProductSelect = (id) => {
    const selected = products.find(p => p.id === id);
    setFormData({
      ...formData,
      productId: id,
      productTitle: selected ? selected.title : 'Product'
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ width: '480px' }}>
        <div className="modal-header">
          <h3>Add Manual Customer Review</h3>
          <button className="btn-close" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label className="form-label">Associated Product</label>
            <select 
              className="form-control"
              value={formData.productId}
              onChange={e => handleProductSelect(e.target.value)}
            >
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label className="form-label">Reviewer Name</label>
              <input 
                type="text" 
                className="form-control" 
                value={formData.reviewerName}
                onChange={e => setFormData({ ...formData, reviewerName: e.target.value })}
                placeholder="Marcus Vance"
                required
              />
            </div>
            <div>
              <label className="form-label">Rating (1 to 5 Stars)</label>
              <select 
                className="form-control"
                value={formData.rating}
                onChange={e => setFormData({ ...formData, rating: parseInt(e.target.value) })}
              >
                <option value={5}>5 Stars ⭐⭐⭐⭐⭐</option>
                <option value={4}>4 Stars ⭐⭐⭐⭐</option>
                <option value={3}>3 Stars ⭐⭐⭐</option>
                <option value={2}>2 Stars ⭐⭐</option>
                <option value={1}>1 Star ⭐</option>
              </select>
            </div>
          </div>

          <div>
            <label className="form-label">Review Title</label>
            <input 
              type="text" 
              className="form-control" 
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Outstanding quality & quick delivery!"
              required
            />
          </div>

          <div>
            <label className="form-label">Review Comment Body</label>
            <textarea 
              className="form-control" 
              rows={3}
              value={formData.comment}
              onChange={e => setFormData({ ...formData, comment: e.target.value })}
              placeholder="Detailed review feedback..."
              required
            />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={() => onSave(formData)}>Add Review</button>
        </div>
      </div>
    </div>
  );
}
