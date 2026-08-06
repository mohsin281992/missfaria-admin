import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  CheckCircle, 
  Clock, 
  Truck, 
  RefreshCw, 
  X, 
  Package, 
  User, 
  CreditCard, 
  Printer, 
  Trash2,
  Edit3
} from 'lucide-react';

import { formatCurrency } from '../utils/formatters';

export default function SalesView({ orders, settings, onUpdateOrderStatus, onDeleteOrder }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.id.toLowerCase().includes(search.toLowerCase()) || 
                          o.customer.toLowerCase().includes(search.toLowerCase()) ||
                          o.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Search & Export Header */}
      <div className="glass-card" style={{ padding: '20px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: '280px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              placeholder="Search orders by order ID, customer name, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '36px', height: '40px' }}
            />
          </div>

          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-select"
            style={{ width: '160px', height: '40px' }}
          >
            <option value="All">All Statuses</option>
            <option value="Completed">Completed</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Pending">Pending</option>
            <option value="Refunded">Refunded</option>
          </select>
        </div>

        <button className="btn btn-secondary" onClick={() => alert('Exporting sales orders as CSV...')}>
          <Download size={16} /> Export CSV
        </button>
      </div>

      {/* Orders Data Table */}
      <div className="table-container glass-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Items</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                  No sales orders found matching your search.
                </td>
              </tr>
            ) : (
              filteredOrders.map(order => (
                <tr key={order.id}>
                  <td style={{ fontWeight: '700', fontFamily: 'monospace' }}>{order.id}</td>
                  <td>
                    <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{order.customer}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{order.email}</div>
                  </td>
                  <td style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{order.date}</td>
                  <td style={{ fontWeight: '600' }}>{order.items} {order.items === 1 ? 'item' : 'items'}</td>
                  <td style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{formatCurrency(order.total, settings?.currency)}</td>
                  <td style={{ fontSize: '13px' }}>{order.paymentMethod}</td>
                  <td>
                    <select
                      value={order.status}
                      onChange={(e) => onUpdateOrderStatus && onUpdateOrderStatus(order.id, e.target.value)}
                      className="form-select"
                      style={{
                        padding: '4px 8px',
                        fontSize: '12px',
                        fontWeight: '600',
                        width: '130px',
                        height: '32px',
                        borderRadius: 'var(--radius-sm)',
                        borderColor: order.status === 'Completed' ? 'var(--success)' :
                                     order.status === 'Processing' ? 'var(--info)' :
                                     order.status === 'Shipped' ? 'var(--accent-primary)' : 'var(--warning)',
                        color: order.status === 'Completed' ? 'var(--success)' :
                               order.status === 'Processing' ? 'var(--info)' :
                               order.status === 'Shipped' ? 'var(--accent-primary)' : 'var(--warning)'
                      }}
                    >
                      <option value="Completed">Completed</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Pending">Pending</option>
                      <option value="Refunded">Refunded</option>
                    </select>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                      <button 
                        className="btn btn-secondary btn-sm" 
                        title="View Order Details & Invoice"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <Eye size={15} color="var(--accent-primary)" /> View
                      </button>
                      <button 
                        className="btn-icon" 
                        title="Delete Order"
                        onClick={() => onDeleteOrder && onDeleteOrder(order.id)}
                      >
                        <Trash2 size={15} color="var(--danger)" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Interactive Order Details Modal */}
      {selectedOrder && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '650px' }}>
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
                  Order Details: {selectedOrder.id}
                </h3>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Placed on {selectedOrder.date}
                </p>
              </div>
              <button className="btn-icon" onClick={() => setSelectedOrder(null)}>
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Customer & Payment Info */}
              <div className="grid-2">
                <div style={{ padding: '14px', borderRadius: 'var(--radius-md)', background: 'var(--bg-input)', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--accent-primary)', fontWeight: '600', fontSize: '13px' }}>
                    <User size={16} /> Customer Information
                  </div>
                  <div style={{ fontWeight: '700', fontSize: '14px', color: 'var(--text-primary)' }}>{selectedOrder.customer}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{selectedOrder.email}</div>
                </div>

                <div style={{ padding: '14px', borderRadius: 'var(--radius-md)', background: 'var(--bg-input)', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--success)', fontWeight: '600', fontSize: '13px' }}>
                    <CreditCard size={16} /> Payment & Status
                  </div>
                  <div style={{ fontWeight: '700', fontSize: '14px', color: 'var(--text-primary)' }}>{selectedOrder.paymentMethod}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Status: <span className="badge badge-success" style={{ fontSize: '10px' }}>{selectedOrder.status}</span>
                  </div>
                </div>
              </div>

              {/* Status Update Control */}
              <div className="form-group">
                <label className="form-label">Update Order Fulfillment Status</label>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <select 
                    value={selectedOrder.status}
                    onChange={(e) => {
                      const newStatus = e.target.value;
                      setSelectedOrder({ ...selectedOrder, status: newStatus });
                      if (onUpdateOrderStatus) onUpdateOrderStatus(selectedOrder.id, newStatus);
                    }}
                    className="form-select"
                  >
                    <option value="Completed">Completed (Fulfilled)</option>
                    <option value="Processing">Processing (Preparing)</option>
                    <option value="Shipped">Shipped (In Transit)</option>
                    <option value="Pending">Pending (Awaiting Payment)</option>
                    <option value="Refunded">Refunded (Cancelled)</option>
                  </select>
                </div>
              </div>

              {/* Order Items Breakdown */}
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '10px' }}>
                  Purchased Items ({selectedOrder.items})
                </h4>
                <div style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '12px 16px', background: 'var(--bg-input)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Package size={20} color="var(--accent-primary)" />
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>Standard Catalog Order Items Package</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Quantity: {selectedOrder.items} units</div>
                    </div>
                  </div>
                  <div style={{ fontWeight: '700', fontSize: '15px', color: 'var(--text-primary)' }}>
                    {formatCurrency(selectedOrder.total, settings?.currency)}
                  </div>
                </div>
              </div>
            </div>

            <div style={{
              padding: '16px 24px',
              borderTop: '1px solid var(--border-color)',
              background: 'var(--bg-secondary)',
              display: 'flex',
              justify: 'space-between',
              alignItems: 'center'
            }}>
              <button className="btn btn-secondary" onClick={() => window.print()}>
                <Printer size={16} /> Print Invoice
              </button>
              <button className="btn btn-primary" onClick={() => setSelectedOrder(null)}>
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
