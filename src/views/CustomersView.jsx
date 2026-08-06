import React, { useState } from 'react';
import { Users, Search, Mail, Phone, Calendar, Shield, Award } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export default function CustomersView({ customers, settings }) {
  const [search, setSearch] = useState('');

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.tier.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ position: 'relative', width: '320px' }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text" 
            placeholder="Search customers by name, email, tier..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '36px', height: '40px' }}
          />
        </div>
        <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '500' }}>
          Total Customers: {customers.length} registered accounts
        </span>
      </div>

      <div className="table-container glass-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Customer Name</th>
              <th>Tier Level</th>
              <th>Orders</th>
              <th>Lifetime Spent</th>
              <th>Joined Date</th>
              <th>Account Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map(cust => (
              <tr key={cust.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '14px' }}>
                      {cust.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{cust.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{cust.email}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`badge ${
                    cust.tier.includes('Platinum') ? 'badge-info' :
                    cust.tier.includes('Gold') ? 'badge-warning' : 'badge-neutral'
                  }`}>
                    <Award size={12} style={{ marginRight: '4px' }} />
                    {cust.tier}
                  </span>
                </td>
                <td style={{ fontWeight: '600' }}>{cust.ordersCount} orders</td>
                <td style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{formatCurrency(cust.totalSpent, settings?.currency)}</td>
                <td style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{cust.joined}</td>
                <td>
                  <span className="badge badge-success">{cust.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
