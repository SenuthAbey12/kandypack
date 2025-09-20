import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContextNew';
import './CustomerDashboard.css';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [recentOrders, setRecentOrders] = useState([]);
  const [orderStats, setOrderStats] = useState({});

  useEffect(() => {
    fetchRecentOrders();
    fetchOrderStats();
  }, []);

  const fetchRecentOrders = async () => {
    try {
      const sampleOrders = [
        {
          id: 'ORD001',
          date: '2025-01-15',
          status: 'delivered',
          total: 'Rs. 25,000',
          items: 3,
          trackingNumber: 'KP123456789'
        },
        {
          id: 'ORD002',
          date: '2025-01-18',
          status: 'in-transit',
          total: 'Rs. 15,000',
          items: 2,
          trackingNumber: 'KP987654321'
        },
        {
          id: 'ORD003',
          date: '2025-01-20',
          status: 'processing',
          total: 'Rs. 8,500',
          items: 1,
          trackingNumber: 'KP456789123'
        }
      ];
      setRecentOrders(sampleOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const fetchOrderStats = async () => {
    try {
      const stats = {
        totalOrders: 24,
        deliveredOrders: 20,
        totalSpent: 'Rs. 485,000',
        savedAmount: 'Rs. 25,000'
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

  return (
    <div className="customer-dashboard">
      <div className="dashboard-header">
        <h1>My Dashboard</h1>
        <div className="customer-info">
          <span>Welcome back, {user?.name}!</span>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Order Statistics */}
        <div className="dashboard-card stats-card">
          <h2>Order Statistics</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-number">{orderStats.totalOrders}</span>
              <span className="stat-label">Total Orders</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{orderStats.deliveredOrders}</span>
              <span className="stat-label">Delivered</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{orderStats.totalSpent}</span>
              <span className="stat-label">Total Spent</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{orderStats.savedAmount}</span>
              <span className="stat-label">Saved with KandyPack</span>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="dashboard-card orders-card">
          <h2>Recent Orders</h2>
          <div className="orders-list">
            {recentOrders.map(order => (
              <div key={order.id} className="order-item">
                <div className="order-header">
                  <span className="order-id">{order.id}</span>
                  <span 
                    className="order-status"
                    style={{ backgroundColor: getStatusColor(order.status) }}
                  >
                    {order.status}
                  </span>
                </div>
                <div className="order-details">
                  <div className="order-info">
                    <span>Date: {order.date}</span>
                    <span>Items: {order.items}</span>
                    <span>Total: {order.total}</span>
                  </div>
                  <div className="order-actions">
                    <button className="btn-track">Track Order</button>
                    {order.status === 'delivered' && (
                      <button className="btn-reorder">Reorder</button>
                    )}
                  </div>
                </div>
                <div className="tracking-number">
                  Tracking: {order.trackingNumber}
                </div>
              </div>
            ))}
          </div>
          <button className="btn-view-all">View All Orders</button>
        </div>

        {/* Quick Actions */}
        <div className="dashboard-card actions-card">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <button className="action-btn place-order">
              <i className="icon-plus"></i>
              <span>Place New Order</span>
            </button>
            <button className="action-btn track-order">
              <i className="icon-track"></i>
              <span>Track Orders</span>
            </button>
            <button className="action-btn support">
              <i className="icon-support"></i>
              <span>Customer Support</span>
            </button>
            <button className="action-btn returns">
              <i className="icon-return"></i>
              <span>Returns & Refunds</span>
            </button>
          </div>
        </div>

        {/* Account Information */}
        <div className="dashboard-card account-card">
          <h2>Account Information</h2>
          <div className="account-details">
            <div className="detail-item">
              <label>Name:</label>
              <span>{user?.name}</span>
            </div>
            <div className="detail-item">
              <label>Email:</label>
              <span>{user?.email}</span>
            </div>
            <div className="detail-item">
              <label>Phone:</label>
              <span>{user?.phone || 'Not provided'}</span>
            </div>
            <div className="detail-item">
              <label>Member Since:</label>
              <span>January 2024</span>
            </div>
          </div>
          <button className="btn-edit-profile">Edit Profile</button>
        </div>

        {/* Notifications */}
        <div className="dashboard-card notifications-card">
          <h2>Notifications</h2>
          <div className="notifications-list">
            <div className="notification-item">
              <div className="notification-icon delivered"></div>
              <div className="notification-content">
                <span className="notification-text">
                  Your order ORD001 has been delivered
                </span>
                <span className="notification-time">2 hours ago</span>
              </div>
            </div>
            <div className="notification-item">
              <div className="notification-icon transit"></div>
              <div className="notification-content">
                <span className="notification-text">
                  Order ORD002 is out for delivery
                </span>
                <span className="notification-time">5 hours ago</span>
              </div>
            </div>
            <div className="notification-item">
              <div className="notification-icon promotion"></div>
              <div className="notification-content">
                <span className="notification-text">
                  New promotion: 15% off on bulk orders
                </span>
                <span className="notification-time">1 day ago</span>
              </div>
            </div>
          </div>
        </div>

        {/* Shipping Addresses */}
        <div className="dashboard-card addresses-card">
          <h2>Saved Addresses</h2>
          <div className="addresses-list">
            <div className="address-item primary">
              <div className="address-label">Primary Address</div>
              <div className="address-content">
                123 Main Street<br/>
                Colombo 05<br/>
                Sri Lanka
              </div>
            </div>
            <div className="address-item">
              <div className="address-label">Work Address</div>
              <div className="address-content">
                456 Business Avenue<br/>
                Colombo 03<br/>
                Sri Lanka
              </div>
            </div>
          </div>
          <button className="btn-manage-addresses">Manage Addresses</button>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;