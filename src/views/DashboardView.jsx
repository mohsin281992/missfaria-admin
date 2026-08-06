import React from 'react';
import { 
  DollarSign, 
  Package, 
  ShoppingCart, 
  Users, 
  AlertTriangle, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

import { formatCurrency } from '../utils/formatters';

export default function DashboardView({ 
  products, 
  orders, 
  customers, 
  settings,
  onEditProduct, 
  onNavigate 
}) {
  // KPI Metrics Calculations
  const totalRevenue = orders.reduce((sum, ord) => sum + ord.total, 0);
  const totalProducts = products.length;
  const lowStockProducts = products.filter(p => p.stockQuantity <= p.lowStockThreshold);
  const activeCustomers = customers.length;

  // Chart 1: Revenue & Orders Trend
  const lineChartData = {
    labels: ['Jul 1', 'Jul 8', 'Jul 15', 'Jul 22', 'Jul 29', 'Aug 5'],
    datasets: [
      {
        fill: true,
        label: 'Revenue ($)',
        data: [1240, 2100, 1850, 3200, 2900, 4150],
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.15)',
        tension: 0.4,
        pointBackgroundColor: '#6366f1',
        pointBorderColor: '#ffffff',
        pointRadius: 4
      }
    ]
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1f2937',
        titleColor: '#f9fafb',
        bodyColor: '#9ca3af',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        padding: 12
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#9ca3af' }
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#9ca3af' }
      }
    }
  };

  // Chart 2: Category Distribution
  const categoryCounts = products.reduce((acc, p) => {
    acc[p.primaryCategory] = (acc[p.primaryCategory] || 0) + 1;
    return acc;
  }, {});

  const doughnutData = {
    labels: Object.keys(categoryCounts),
    datasets: [
      {
        data: Object.values(categoryCounts),
        backgroundColor: ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ec4899'],
        borderWidth: 2,
        borderColor: 'var(--bg-secondary)'
      }
    ]
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Executive KPI Cards Grid */}
      <div className="grid-4">
        {/* Card 1: Revenue */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <div>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '500' }}>Total Revenue</span>
              <h3 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-primary)', marginTop: '4px' }}>
                {formatCurrency(totalRevenue, settings?.currency)}
              </h3>
            </div>
            <div style={{ padding: '10px', borderRadius: 'var(--radius-md)', background: 'rgba(99, 102, 241, 0.15)', color: '#6366f1' }}>
              <DollarSign size={22} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--success)' }}>
            <ArrowUpRight size={16} />
            <span style={{ fontWeight: '700' }}>+18.4%</span>
            <span style={{ color: 'var(--text-muted)' }}>vs last month</span>
          </div>
        </div>

        {/* Card 2: Active Products */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <div>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '500' }}>Catalog Products</span>
              <h3 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-primary)', marginTop: '4px' }}>
                {totalProducts} Items
              </h3>
            </div>
            <div style={{ padding: '10px', borderRadius: 'var(--radius-md)', background: 'rgba(6, 182, 212, 0.15)', color: '#06b6d4' }}>
              <Package size={22} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--success)' }}>
            <ArrowUpRight size={16} />
            <span style={{ fontWeight: '700' }}>+2 New</span>
            <span style={{ color: 'var(--text-muted)' }}>added this week</span>
          </div>
        </div>

        {/* Card 3: Total Orders */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <div>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '500' }}>Total Sales Orders</span>
              <h3 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-primary)', marginTop: '4px' }}>
                {orders.length}
              </h3>
            </div>
            <div style={{ padding: '10px', borderRadius: 'var(--radius-md)', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
              <ShoppingCart size={22} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--success)' }}>
            <ArrowUpRight size={16} />
            <span style={{ fontWeight: '700' }}>+12.1%</span>
            <span style={{ color: 'var(--text-muted)' }}>conversion rate</span>
          </div>
        </div>

        {/* Card 4: Low Stock Alerts */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <div>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '500' }}>Low Stock Alerts</span>
              <h3 style={{ fontSize: '24px', fontWeight: '800', color: lowStockProducts.length > 0 ? 'var(--warning)' : 'var(--text-primary)', marginTop: '4px' }}>
                {lowStockProducts.length} Items
              </h3>
            </div>
            <div style={{ padding: '10px', borderRadius: 'var(--radius-md)', background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
              <AlertTriangle size={22} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--warning)' }}>
            <span style={{ fontWeight: '600' }}>Action Required</span>
          </div>
        </div>
      </div>

      {/* Analytics Charts Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h4 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)' }}>Sales Revenue Performance</h4>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Weekly sales revenue growth trend ($)</p>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => onNavigate('analytics')}>
              Full Analytics
            </button>
          </div>
          <div style={{ height: '260px', width: '100%' }}>
            <Line data={lineChartData} options={lineChartOptions} />
          </div>
        </div>

        <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ marginBottom: '16px' }}>
            <h4 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)' }}>Category Distribution</h4>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Catalog breakdown by primary department</p>
          </div>
          <div style={{ height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Doughnut data={doughnutData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: '#9ca3af', font: { size: 11 } } } } }} />
          </div>
        </div>
      </div>

      {/* Low Stock Warning Feed & Recent Orders Table */}
      <div className="grid-2">
        {/* Low Stock Alert Feed */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={18} color="var(--warning)" />
              <h4 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)' }}>Low Inventory Watchlist</h4>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => onNavigate('catalog')}>
              Manage Catalog
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {lowStockProducts.length === 0 ? (
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>All catalog items are adequately stocked.</p>
            ) : (
              lowStockProducts.map(product => (
                <div 
                  key={product.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'space-between',
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img 
                      src={product.mainImage} 
                      alt={product.title} 
                      style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>
                        {product.title}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        SKU: {product.sku} • Threshold: {product.lowStockThreshold} units
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span className="badge badge-warning">
                      {product.stockQuantity} Left
                    </span>
                    <button className="btn btn-secondary btn-sm" onClick={() => onEditProduct(product)}>
                      Restock
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Orders List */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h4 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)' }}>Recent Sales Orders</h4>
            <button className="btn btn-secondary btn-sm" onClick={() => onNavigate('sales')}>
              View All Orders
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {orders.slice(0, 4).map(order => (
              <div 
                key={order.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'space-between',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-color)'
                }}
              >
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>
                    {order.id} — {order.customer}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    {order.date} • {order.items} {order.items === 1 ? 'item' : 'items'}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>
                    {formatCurrency(order.total, settings?.currency)}
                  </div>
                  <span className={`badge ${
                    order.status === 'Completed' ? 'badge-success' :
                    order.status === 'Processing' ? 'badge-info' :
                    order.status === 'Shipped' ? 'badge-neutral' : 'badge-warning'
                  }`} style={{ fontSize: '10px', padding: '2px 8px' }}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
