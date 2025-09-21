import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  
  // State management
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  const [stats, setStats] = useState({
    totalOrders: 1248,
    totalDrivers: 45,
    totalAssistants: 23,
    totalCustomers: 892,
    pendingOrders: 18,
    completedToday: 67,
    revenue: 45670,
    deliveryRate: 96.5,
    // Enhanced supply chain metrics
    totalVehicles: 78,
    activeRoutes: 24,
    warehouseUtilization: 87.5,
    fuelEfficiency: 12.8,
    railShipments: 156,
    roadShipments: 1092,
    averageDeliveryTime: 2.4,
    customerSatisfaction: 94.8,
    inventoryTurnover: 8.2,
    costPerMile: 2.45
  });

  const [notifications] = useState([
    { id: 1, type: 'warning', message: '5 orders pending driver assignment', timestamp: '2 min ago' },
    { id: 2, type: 'success', message: 'Monthly target achieved!', timestamp: '15 min ago' },
    { id: 3, type: 'info', message: 'New driver application received', timestamp: '1 hour ago' },
    { id: 4, type: 'warning', message: 'Low fuel alert: Vehicle CAF-1122', timestamp: '30 min ago' },
    { id: 5, type: 'critical', message: 'Train TE-002 delayed by 45 minutes', timestamp: '1 hour ago' },
    { id: 6, type: 'info', message: 'Warehouse A reaching 90% capacity', timestamp: '2 hours ago' }
  ]);

  // New state for enhanced supply chain features
  const [warehouses] = useState([
    { id: 1, name: 'Colombo Main Warehouse', location: 'Colombo 05', capacity: 10000, current: 8750, utilizationRate: 87.5, temperature: 22, humidity: 45 },
    { id: 2, name: 'Kandy Distribution Center', location: 'Kandy', capacity: 7500, current: 6200, utilizationRate: 82.7, temperature: 24, humidity: 50 },
    { id: 3, name: 'Galle Port Facility', location: 'Galle', capacity: 5000, current: 3800, utilizationRate: 76.0, temperature: 26, humidity: 55 }
  ]);

  const [routes] = useState([
    { id: 1, name: 'Colombo-Kandy Express', type: 'road', distance: 115, avgTime: '2.5 hours', traffic: 'moderate', weather: 'clear', efficiency: 94 },
    { id: 2, name: 'Kandy-Galle Coastal', type: 'road', distance: 145, avgTime: '3.2 hours', traffic: 'heavy', weather: 'rainy', efficiency: 78 },
    { id: 3, name: 'Main Line Railway', type: 'rail', distance: 290, avgTime: '8 hours', traffic: 'none', weather: 'clear', efficiency: 96 },
    { id: 4, name: 'Coast Line Railway', type: 'rail', distance: 160, avgTime: '4.5 hours', traffic: 'none', weather: 'clear', efficiency: 92 }
  ]);

  const [orders] = useState([
    { id: '1248', customer: 'KandyMart Pvt Ltd', destination: 'Colombo 03', status: 'Delivered', transport: 'Road', amount: 12500 },
    { id: '1247', customer: 'Tech Solutions', destination: 'Kandy', status: 'In Transit', transport: 'Road', amount: 8900 },
    { id: '1246', customer: 'Green Store', destination: 'Galle', status: 'Pending', transport: 'Road', amount: 6750 },
    { id: '1245', customer: 'Industrial Corp', destination: 'Jaffna', status: 'In Transit', transport: 'Rail', amount: 22100 },
    { id: '1244', customer: 'Book World', destination: 'Matara', status: 'Delivered', transport: 'Road', amount: 4800 },
    { id: '1243', customer: 'Electronics Plus', destination: 'Trincomalee', status: 'Loading', transport: 'Rail', amount: 18700 },
    { id: '1242', customer: 'Fashion Hub', destination: 'Negombo', status: 'Delivered', transport: 'Road', amount: 15200 },
    { id: '1241', customer: 'Agro Products Ltd', destination: 'Batticaloa', status: 'In Transit', transport: 'Rail', amount: 9800 }
  ]);

  const profileRef = useRef(null);

  // Export orders to CSV
  const exportOrdersToCSV = () => {
    try {
      const headers = ['Order ID', 'Customer', 'Destination', 'Status', 'Transport', 'Amount (Rs.)'];
      const csvContent = [
        headers.join(','),
        ...orders.map(order => [
          `#${order.id}`,
          `"${order.customer}"`,
          `"${order.destination}"`,
          order.status,
          order.transport,
          order.amount.toLocaleString()
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `kandypack_orders_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Show success feedback
      alert('Orders exported successfully! Check your downloads folder.');
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    }
  };

  // Navigation handler
  const handleNavigation = (tab) => {
    navigate(`/employee/admin/${tab}`);
    setSidebarOpen(false); // Close sidebar on mobile after navigation
  };

  // Profile menu toggle
  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Set active tab based on route
  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes('analytics')) return 'analytics';
    if (path.includes('drivers')) return 'drivers';
    if (path.includes('routes')) return 'routes';
    if (path.includes('tracking')) return 'tracking';
    if (path.includes('orders')) return 'orders';
    if (path.includes('warehouses')) return 'warehouses';
    if (path.includes('inventory')) return 'inventory';
    if (path.includes('assistants')) return 'assistants';
    return 'overview';
  };

  const activeTab = getActiveTab();

  const renderSidebar = () => (
    <>
      <div className={`sidebar-overlay ${sidebarOpen ? 'show' : ''}`} onClick={() => setSidebarOpen(false)} />
      <div className={`dashboard-sidebar ${sidebarOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">KP</div>
          <div className="sidebar-brand">
            <h1>KandyPack</h1>
            <p>Supply Chain</p>
          </div>
        </div>
        
        <nav className="sidebar-nav">
          <div className="nav-section">
            <div className="nav-section-title">Dashboard</div>
            <button 
              className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => handleNavigation('overview')}
            >
              <span className="nav-item-icon">📊</span>
              <span className="nav-item-text">Overview</span>
            </button>
            <button 
              className={`nav-item ${activeTab === 'analytics' ? 'active' : ''}`}
              onClick={() => handleNavigation('analytics')}
            >
              <span className="nav-item-icon">📈</span>
              <span className="nav-item-text">Analytics</span>
            </button>
          </div>
          
          <div className="nav-section">
            <div className="nav-section-title">Fleet Management</div>
            <button 
              className={`nav-item ${activeTab === 'drivers' ? 'active' : ''}`}
              onClick={() => handleNavigation('drivers')}
            >
              <span className="nav-item-icon">🚛</span>
              <span className="nav-item-text">Fleet & Drivers</span>
              <span className="nav-item-badge">{stats.totalDrivers}</span>
            </button>
            
            <button 
              className={`nav-item ${activeTab === 'routes' ? 'active' : ''}`}
              onClick={() => handleNavigation('routes')}
            >
              <span className="nav-item-icon">🛤️</span>
              <span className="nav-item-text">Routes & Scheduling</span>
              <span className="nav-item-badge">{stats.activeRoutes}</span>
            </button>
            
            <button 
              className={`nav-item ${activeTab === 'tracking' ? 'active' : ''}`}
              onClick={() => handleNavigation('tracking')}
            >
              <span className="nav-item-icon">📍</span>
              <span className="nav-item-text">Live Tracking</span>
            </button>
          </div>
          
          <div className="nav-section">
            <div className="nav-section-title">Operations</div>
            <button 
              className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => handleNavigation('orders')}
            >
              <span className="nav-item-icon">📦</span>
              <span className="nav-item-text">Shipments</span>
              <span className="nav-item-badge">{stats.pendingOrders}</span>
            </button>
            
            <button 
              className={`nav-item ${activeTab === 'warehouses' ? 'active' : ''}`}
              onClick={() => handleNavigation('warehouses')}
            >
              <span className="nav-item-icon">🏭</span>
              <span className="nav-item-text">Warehouses</span>
              <span className="nav-item-badge">3</span>
            </button>
            
            <button 
              className={`nav-item ${activeTab === 'inventory' ? 'active' : ''}`}
              onClick={() => handleNavigation('inventory')}
            >
              <span className="nav-item-icon">📋</span>
              <span className="nav-item-text">Inventory</span>
            </button>
            
            <button 
              className={`nav-item ${activeTab === 'assistants' ? 'active' : ''}`}
              onClick={() => handleNavigation('assistants')}
            >
              <span className="nav-item-icon">🤝</span>
              <span className="nav-item-text">Staff</span>
              <span className="nav-item-badge">{stats.totalAssistants}</span>
            </button>
          </div>
          
          <div className="nav-section">
            <div className="nav-section-title">System</div>
            <button className="nav-item" onClick={() => navigate('/employee/admin/settings')}>
              <span className="nav-item-icon">⚙️</span>
              <span className="nav-item-text">Settings</span>
            </button>
            
            <button className="nav-item" onClick={() => navigate('/employee/admin/support')}>
              <span className="nav-item-icon">💬</span>
              <span className="nav-item-text">Support</span>
            </button>
          </div>
        </nav>
      </div>
    </>
  );

  const renderHeader = () => (
    <div className="dashboard-header">
      <div className="header-left">
        <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
          ☰
        </button>
        <div>
          <h1 className="header-title">Supply Chain Dashboard</h1>
          <p className="header-subtitle">
            Welcome back, {user?.name || 'Admin'}! Here's what's happening today.
          </p>
        </div>
      </div>
      
      <div className="header-right">
        <button 
          className="header-action-btn theme-toggle-btn"
          onClick={toggleTheme}
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
        
        <button 
          className="header-action-btn"
          onClick={() => setShowNotifications(!showNotifications)}
        >
          🔔
          {notifications.length > 0 && (
            <span className="notification-badge">{notifications.length}</span>
          )}
        </button>
        
        {showNotifications && (
          <div className="notification-panel show">
            <div className="notification-header">
              Notifications ({notifications.length})
            </div>
            {notifications.map(notification => (
              <div key={notification.id} className="notification-item">
                <div className={`activity-icon ${notification.type}`}>
                  {notification.type === 'warning' ? '⚠️' : 
                   notification.type === 'success' ? '✅' : 
                   notification.type === 'critical' ? '🚨' : 'ℹ️'}
                </div>
                <div className="notification-content">
                  <div className="notification-message">{notification.message}</div>
                  <div className="notification-time">{notification.timestamp}</div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="admin-profile" ref={profileRef} onClick={toggleProfileMenu}>
          <div className="profile-avatar">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
          </div>
          <div className="profile-info">
            <div className="profile-name">{user?.name || 'Admin User'}</div>
            <div className="profile-role">Administrator</div>
          </div>
          <span className="dropdown-arrow">▼</span>
          
          {showProfileMenu && (
            <div className="profile-dropdown-menu show">
              <button className="dropdown-item" onClick={() => navigate('/employee/admin/settings')}>
                <span className="dropdown-item-icon">👤</span>
                Profile Settings
              </button>
              <button className="dropdown-item" onClick={() => navigate('/employee/admin/support')}>
                <span className="dropdown-item-icon">💬</span>
                Help & Support
              </button>
              <button className="dropdown-item" onClick={logout}>
                <span className="dropdown-item-icon">🚪</span>
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderStatsCards = () => (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-header">
          <div className="stat-icon">📊</div>
          <div className="stat-trend up">
            ↗️ +12%
          </div>
        </div>
        <div className="stat-body">
          <h3>{stats.totalOrders.toLocaleString()}</h3>
          <p>Total Shipments</p>
        </div>
      </div>
      
      <div className="stat-card">
        <div className="stat-header">
          <div className="stat-icon">🚛</div>
          <div className="stat-trend up">
            ↗️ +3
          </div>
        </div>
        <div className="stat-body">
          <h3>{stats.totalVehicles}</h3>
          <p>Fleet Vehicles</p>
          <small>{stats.totalDrivers} drivers active</small>
        </div>
      </div>
      
      <div className="stat-card">
        <div className="stat-header">
          <div className="stat-icon">📦</div>
          <div className="stat-trend down">
            ↘️ -5
          </div>
        </div>
        <div className="stat-body">
          <h3>{stats.pendingOrders}</h3>
          <p>Pending Shipments</p>
          <small>{stats.completedToday} completed today</small>
        </div>
      </div>
      
      <div className="stat-card">
        <div className="stat-header">
          <div className="stat-icon">💰</div>
          <div className="stat-trend up">
            ↗️ +8%
          </div>
        </div>
        <div className="stat-body">
          <h3>${stats.revenue.toLocaleString()}</h3>
          <p>Monthly Revenue</p>
          <small>${stats.costPerMile}/mile avg cost</small>
        </div>
      </div>
      
      <div className="stat-card">
        <div className="stat-header">
          <div className="stat-icon">🏭</div>
          <div className="stat-trend up">
            ↗️ +2%
          </div>
        </div>
        <div className="stat-body">
          <h3>{stats.warehouseUtilization}%</h3>
          <p>Warehouse Utilization</p>
          <small>3 facilities operational</small>
        </div>
      </div>
      
      <div className="stat-card">
        <div className="stat-header">
          <div className="stat-icon">⛽</div>
          <div className="stat-trend up">
            ↗️ +5%
          </div>
        </div>
        <div className="stat-body">
          <h3>{stats.fuelEfficiency}</h3>
          <p>Fuel Efficiency (km/L)</p>
          <small>Fleet average</small>
        </div>
      </div>
      
      <div className="stat-card">
        <div className="stat-header">
          <div className="stat-icon">🚄</div>
          <div className="stat-trend up">
            ↗️ +15%
          </div>
        </div>
        <div className="stat-body">
          <h3>{stats.railShipments}</h3>
          <p>Rail Shipments</p>
          <small>{stats.roadShipments} road shipments</small>
        </div>
      </div>
      
      <div className="stat-card">
        <div className="stat-header">
          <div className="stat-icon">⭐</div>
          <div className="stat-trend up">
            ↗️ +1.2%
          </div>
        </div>
        <div className="stat-body">
          <h3>{stats.customerSatisfaction}%</h3>
          <p>Customer Satisfaction</p>
          <small>{stats.averageDeliveryTime} days avg delivery</small>
        </div>
      </div>
    </div>
  );

  const renderQuickActions = () => (
    <div className="quick-actions">
      <h2 className="section-title">Quick Actions</h2>
      <div className="actions-grid">
        <button className="action-btn" onClick={() => handleNavigation('orders')}>
          <span className="action-btn-icon">📦</span>
          Create Shipment
        </button>
        <button className="action-btn" onClick={() => handleNavigation('drivers')}>
          <span className="action-btn-icon">🚛</span>
          Dispatch Vehicle
        </button>
        <button className="action-btn" onClick={() => handleNavigation('tracking')}>
          <span className="action-btn-icon">📍</span>
          Track Shipments
        </button>
        <button className="action-btn" onClick={() => handleNavigation('routes')}>
          <span className="action-btn-icon">🛤️</span>
          Optimize Routes
        </button>
        <button className="action-btn" onClick={() => handleNavigation('inventory')}>
          <span className="action-btn-icon">📋</span>
          Check Inventory
        </button>
        <button className="action-btn" onClick={() => handleNavigation('analytics')}>
          <span className="action-btn-icon">📊</span>
          View Analytics
        </button>
      </div>
    </div>
  );

  const renderSupplyChainOverview = () => (
    <div className="supply-chain-overview">
      <div className="overview-section">
        <div className="section-header">
          <h3 className="section-title">Transportation Mix</h3>
          <div className="transport-stats">
            <div className="transport-item">
              <span className="transport-icon">🚛</span>
              <span className="transport-label">Road</span>
              <span className="transport-value">{stats.roadShipments}</span>
            </div>
            <div className="transport-item">
              <span className="transport-icon">🚄</span>
              <span className="transport-label">Rail</span>
              <span className="transport-value">{stats.railShipments}</span>
            </div>
          </div>
        </div>
        
        <div className="chart-placeholder">
          📊 Transportation mode distribution chart
        </div>
      </div>
      
      <div className="overview-section">
        <h3 className="section-title">Active Routes Status</h3>
        <div className="routes-status">
          {routes.slice(0, 4).map(route => (
            <div key={route.id} className="route-status-item">
              <div className="route-info">
                <span className="route-name">{route.name}</span>
                <span className={`route-type ${route.type}`}>
                  {route.type === 'rail' ? '🚄' : '🚛'} {route.type}
                </span>
              </div>
              <div className="route-metrics">
                <span className="route-distance">{route.distance}km</span>
                <span className={`route-efficiency ${route.efficiency > 90 ? 'good' : route.efficiency > 80 ? 'average' : 'poor'}`}>
                  {route.efficiency}% efficient
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderWarehouseStatus = () => (
    <div className="warehouse-status">
      <div className="section-header">
        <h3 className="section-title">Warehouse Status</h3>
        <button className="btn-secondary" onClick={() => handleNavigation('warehouses')}>
          🏭 Manage All
        </button>
      </div>
      
      <div className="warehouse-grid">
        {warehouses.map(warehouse => (
          <div key={warehouse.id} className="warehouse-card">
            <div className="warehouse-header">
              <h4>{warehouse.name}</h4>
              <span className="warehouse-location">📍 {warehouse.location}</span>
            </div>
            <div className="warehouse-metrics">
              <div className="metric">
                <span className="metric-label">Utilization</span>
                <div className="utilization-bar">
                  <div 
                    className="utilization-fill" 
                    style={{ width: `${warehouse.utilizationRate}%` }}
                  ></div>
                </div>
                <span className="metric-value">{warehouse.utilizationRate}%</span>
              </div>
              <div className="metric">
                <span className="metric-label">Capacity</span>
                <span className="metric-value">{warehouse.current.toLocaleString()}/{warehouse.capacity.toLocaleString()}</span>
              </div>
              <div className="metric">
                <span className="metric-label">Environment</span>
                <span className="metric-value">{warehouse.temperature}°C, {warehouse.humidity}% RH</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPerformanceSection = () => (
    <div className="performance-section">
      <div className="performance-chart">
        <div className="chart-header">
          <h3 className="chart-title">Performance Overview</h3>
          <div className="chart-filter">
            <button className="filter-btn active">Today</button>
            <button className="filter-btn">Week</button>
            <button className="filter-btn">Month</button>
          </div>
        </div>
        <div className="chart-placeholder">
          📊 Performance chart will be displayed here
        </div>
      </div>
      
      <div className="activity-feed">
        <h3 className="section-title">Recent Activity</h3>
        <div className="activity-item">
          <div className="activity-icon success">✓</div>
          <div className="activity-content">
            <div className="activity-title">Order #1248 delivered</div>
            <div className="activity-description">Successfully delivered to customer location</div>
            <div className="activity-time">2 minutes ago</div>
          </div>
        </div>
        
        <div className="activity-item">
          <div className="activity-icon warning">⚠</div>
          <div className="activity-content">
            <div className="activity-title">Driver assignment needed</div>
            <div className="activity-description">5 orders pending driver assignment</div>
            <div className="activity-time">15 minutes ago</div>
          </div>
        </div>
        
        <div className="activity-item">
          <div className="activity-icon info">📝</div>
          <div className="activity-content">
            <div className="activity-title">New order received</div>
            <div className="activity-description">Order #1249 created by KandyMart</div>
            <div className="activity-time">1 hour ago</div>
          </div>
        </div>
        
        <div className="activity-item">
          <div className="activity-icon success">👤</div>
          <div className="activity-content">
            <div className="activity-title">New driver registered</div>
            <div className="activity-description">John Doe completed verification</div>
            <div className="activity-time">3 hours ago</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderRecentOrders = () => (
    <div className="recent-orders">
      <div className="table-header">
        <h3 className="section-title">Recent Orders</h3>
        <div className="table-actions">
          <button className="btn-secondary" onClick={() => handleNavigation('orders')}>
            📋 View All
          </button>
          <button className="btn-secondary" onClick={exportOrdersToCSV}>
            ⬇️ Export
          </button>
        </div>
      </div>
      
      <table className="orders-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Destination</th>
            <th>Status</th>
            <th>Transport</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {orders.slice(0, 5).map((order) => (
            <tr key={order.id}>
              <td className="order-id">#{order.id}</td>
              <td>{order.customer}</td>
              <td>{order.destination}</td>
              <td>
                <span className={`status-badge ${order.status.toLowerCase().replace(' ', '-')}`}>
                  {order.status}
                </span>
              </td>
              <td>
                <span className={`transport-badge ${order.transport.toLowerCase()}`}>
                  {order.transport === 'Road' ? '🚛' : '🚄'} {order.transport}
                </span>
              </td>
              <td>Rs. {order.amount.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderOverview = () => (
    <div>
      {renderStatsCards()}
      {renderQuickActions()}
      {renderSupplyChainOverview()}
      {renderWarehouseStatus()}
      {renderPerformanceSection()}
      {renderRecentOrders()}
    </div>
  );

  const renderContent = () => {
    return renderOverview();
  };

  return (
    <div className="dashboard-container">
      {renderSidebar()}
      
      <div className="dashboard-main">
        {renderHeader()}
        
        <div className="dashboard-content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;