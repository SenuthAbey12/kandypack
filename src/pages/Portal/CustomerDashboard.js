import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import ProfileDropdown from '../../Components/ProfileDropdown';
import './CustomerDashboard.css';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [recentOrders, setRecentOrders] = useState([]);
  const [orderStats, setOrderStats] = useState({});
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRecentOrders();
    fetchOrderStats();
  }, []);

  const fetchRecentOrders = async () => {
    setLoading(true);
    try {
      const sampleOrders = [
        {
          id: 'ORD001',
          date: '2025-01-15',
          status: 'delivered',
          total: 'Rs. 25,000',
          items: 3,
          trackingNumber: 'KP123456789',
          estimatedDelivery: '2025-01-17',
          driver: 'Saman Perera',
          address: '123 Main St, Colombo'
        },
        {
          id: 'ORD002',
          date: '2025-01-18',
          status: 'in-transit',
          total: 'Rs. 15,000',
          items: 2,
          trackingNumber: 'KP987654321',
          estimatedDelivery: '2025-01-21',
          driver: 'Kamal Silva',
          address: '456 Oak Ave, Kandy'
        },
        {
          id: 'ORD003',
          date: '2025-01-20',
          status: 'processing',
          total: 'Rs. 8,500',
          items: 1,
          trackingNumber: 'KP456789123',
          estimatedDelivery: '2025-01-23',
          driver: 'Not assigned',
          address: '789 Pine Rd, Galle'
        }
      ];
      setRecentOrders(sampleOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderStats = async () => {
    try {
      const stats = {
        totalOrders: 24,
        deliveredOrders: 20,
        totalSpent: 'Rs. 485,000',
        savedAmount: 'Rs. 25,000',
        pendingOrders: 3,
        activePackages: 2
      };
      setOrderStats(stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return '#27ae60';
      case 'in-transit': return '#3498db';
      case 'processing': return '#f39c12';
      case 'cancelled': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered': return '✅';
      case 'in-transit': return '🚛';
      case 'processing': return '⏳';
      case 'cancelled': return '❌';
      default: return '📦';
    }
  };

  const handleTrackOrder = (order) => {
    setSelectedOrder(order);
    setShowTrackingModal(true);
  };

  const filteredOrders = recentOrders.filter(order => {
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="customer-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <div className="welcome-section">
            <h1>My Dashboard</h1>
            <p>Welcome back, {user?.name}! Here's what's happening with your orders.</p>
          </div>
          <ProfileDropdown />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <button className="action-btn primary">
          <i>🛒</i>
          <span>New Order</span>
        </button>
        <button className="action-btn">
          <i>📦</i>
          <span>Track Package</span>
        </button>
        <button className="action-btn">
          <i>📞</i>
          <span>Contact Support</span>
        </button>
        <button className="action-btn">
          <i>⭐</i>
          <span>Rate Delivery</span>
        </button>
      </div>

      <div className="dashboard-grid">
        {/* Enhanced Order Statistics */}
        <div className="dashboard-card stats-card">
          <div className="card-header">
            <h2>Order Statistics</h2>
            <div className="refresh-btn" onClick={fetchOrderStats}>🔄</div>
          </div>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-number">{orderStats.totalOrders}</span>
              <span className="stat-label">Total Orders</span>
              <span className="stat-icon">📊</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{orderStats.deliveredOrders}</span>
              <span className="stat-label">Delivered</span>
              <span className="stat-icon">✅</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{orderStats.pendingOrders}</span>
              <span className="stat-label">Pending</span>
              <span className="stat-icon">⏳</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{orderStats.activePackages}</span>
              <span className="stat-label">Active Packages</span>
              <span className="stat-icon">🚛</span>
            </div>
          </div>
          <div className="stats-summary">
            <div className="summary-item">
              <span className="summary-label">Total Spent:</span>
              <span className="summary-value">{orderStats.totalSpent}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Saved Amount:</span>
              <span className="summary-value green">{orderStats.savedAmount}</span>
            </div>
          </div>
        </div>

        {/* Enhanced Recent Orders */}
        <div className="dashboard-card orders-card">
          <div className="card-header">
            <h2>Recent Orders</h2>
            <div className="orders-controls">
              <div className="search-box">
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <i className="search-icon">🔍</i>
              </div>
              <select 
                value={filterStatus} 
                onChange={(e) => setFilterStatus(e.target.value)}
                className="status-filter"
              >
                <option value="all">All Status</option>
                <option value="delivered">Delivered</option>
                <option value="in-transit">In Transit</option>
                <option value="processing">Processing</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
          
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading orders...</p>
            </div>
          ) : (
            <div className="orders-list">
              {filteredOrders.map(order => (
                <div key={order.id} className="order-item">
                  <div className="order-header">
                    <div className="order-info">
                      <span className="order-id">{order.id}</span>
                      <span className="order-date">{order.date}</span>
                    </div>
                    <div className="order-status" style={{ color: getStatusColor(order.status) }}>
                      <span className="status-icon">{getStatusIcon(order.status)}</span>
                      <span className="status-text">{order.status}</span>
                    </div>
                  </div>
                  
                  <div className="order-details">
                    <div className="detail-row">
                      <span className="detail-label">Total:</span>
                      <span className="detail-value">{order.total}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Items:</span>
                      <span className="detail-value">{order.items}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Tracking:</span>
                      <span className="detail-value tracking-number">{order.trackingNumber}</span>
                    </div>
                  </div>
                  
                  <div className="order-actions">
                    <button 
                      className="action-btn-small primary"
                      onClick={() => handleTrackOrder(order)}
                    >
                      Track Order
                    </button>
                    <button className="action-btn-small">View Details</button>
                    {order.status === 'delivered' && (
                      <button className="action-btn-small">Rate & Review</button>
                    )}
                  </div>
                </div>
              ))}
              
              {filteredOrders.length === 0 && (
                <div className="no-orders">
                  <i className="no-orders-icon">📦</i>
                  <h3>No orders found</h3>
                  <p>Try adjusting your search or filter criteria.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Tracking Modal */}
      {showTrackingModal && selectedOrder && (
        <TrackingModal 
          order={selectedOrder}
          onClose={() => setShowTrackingModal(false)}
        />
      )}
    </div>
  );
};

// Tracking Modal Component
const TrackingModal = ({ order, onClose }) => {
  const trackingSteps = [
    { step: 'Order Placed', completed: true, date: order.date },
    { step: 'Payment Confirmed', completed: true, date: order.date },
    { step: 'Processing', completed: order.status !== 'cancelled', date: order.date },
    { step: 'In Transit', completed: ['in-transit', 'delivered'].includes(order.status), date: order.status === 'in-transit' || order.status === 'delivered' ? '2025-01-19' : null },
    { step: 'Delivered', completed: order.status === 'delivered', date: order.status === 'delivered' ? order.estimatedDelivery : null }
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content tracking-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Track Order {order.id}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="tracking-content">
          <div className="order-summary">
            <div className="summary-row">
              <span>Tracking Number:</span>
              <span className="tracking-number">{order.trackingNumber}</span>
            </div>
            <div className="summary-row">
              <span>Driver:</span>
              <span>{order.driver}</span>
            </div>
            <div className="summary-row">
              <span>Delivery Address:</span>
              <span>{order.address}</span>
            </div>
            <div className="summary-row">
              <span>Expected Delivery:</span>
              <span>{order.estimatedDelivery}</span>
            </div>
          </div>

          <div className="tracking-timeline">
            {trackingSteps.map((step, index) => (
              <div key={index} className={`timeline-step ${step.completed ? 'completed' : ''}`}>
                <div className="step-marker">
                  {step.completed ? '✓' : index + 1}
                </div>
                <div className="step-content">
                  <div className="step-title">{step.step}</div>
                  {step.date && <div className="step-date">{step.date}</div>}
                </div>
              </div>
            ))}
          </div>

          {order.status === 'in-transit' && (
            <div className="live-tracking">
              <h3>Live Tracking</h3>
              <div className="tracking-map">
                <div className="map-placeholder">
                  🗺️ Interactive Map Coming Soon
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;