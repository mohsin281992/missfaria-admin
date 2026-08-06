import React from 'react';
import { BarChart3, TrendingUp, DollarSign, Award, ArrowUpRight } from 'lucide-react';
import { getCurrencySymbol } from '../utils/formatters';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

export default function AnalyticsView({ products, orders, settings }) {
  const symbol = getCurrencySymbol(settings?.currency);

  const barData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
    datasets: [
      {
        label: `Gross Sales (${symbol})`,
        data: [12400, 14800, 19200, 22100, 26400, 31000, 34500, 38900],
        backgroundColor: '#6366f1',
        borderRadius: 6
      },
      {
        label: `Net Profit (${symbol})`,
        data: [4960, 5920, 7680, 8840, 10560, 12400, 13800, 15560],
        backgroundColor: '#10b981',
        borderRadius: 6
      }
    ]
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { color: '#9ca3af' } },
      tooltip: { backgroundColor: '#1f2937' }
    },
    scales: {
      x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#9ca3af' } },
      y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#9ca3af' } }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="glass-card" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px' }}>
          Monthly Financial Growth Breakdown
        </h3>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '20px' }}>
          Comparing Gross Revenue vs Net Operating Profit margin over 8 months
        </p>
        <div style={{ height: '320px' }}>
          <Bar data={barData} options={barOptions} />
        </div>
      </div>
    </div>
  );
}
