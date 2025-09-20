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
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedItems, setSelectedItems] = useState([]);
  
  const [stats, setStats] = useState({
    totalOrders: 1248,
    totalDrivers: 45,
    totalAssistants: 23,
    totalCustomers: 892,
    pendingOrders: 18,
    completedToday: 67,
    revenue: 45670,
    deliveryRate: 96.5
  });

  const [drivers, setDrivers] = useState([
    { id: 1, name: 'Nimal Silva', license: 'DL12345', vehicle: 'Lorry - CAB-1234', status: 'on-duty', location: 'Colombo 03', rating: 4.9, orders: 45 },
    { id: 2, name: 'Sunil Perera', license: 'DL67890', vehicle: 'Van - CAC-5678', status: 'en-route', location: 'Kandy', rating: 4.7, orders: 38 },
    { id: 3, name: 'Kamal Fernando', license: 'DL11223', vehicle: 'Truck - CAE-9101', status: 'available', location: 'Depot', rating: 4.8, orders: 52 },
    { id: 4, name: 'Ravi Mendis', license: 'DL44556', vehicle: 'Van - CAF-1122', status: 'break', location: 'Rest Area', rating: 4.6, orders: 33 },
    { id: 5, name: 'Chaminda Perera', license: 'DL77889', vehicle: 'Lorry - CAH-3344', status: 'on-duty', location: 'Galle', rating: 4.5, orders: 41 }
  ]);

  const [orders, setOrders] = useState([
    { id: 1248, customer: 'KandyMart Pvt Ltd', pickup: 'Kandy Main', destination: 'Colombo 03', status: 'delivered', driver: 'Nimal Silva', amount: 12500, priority: 'high' },
    { id: 1247, customer: 'Tech Solutions', pickup: 'Colombo Port', destination: 'Kandy', status: 'in-transit', driver: 'Sunil Perera', amount: 8900, priority: 'medium' },
    { id: 1246, customer: 'Green Store', pickup: 'Kandy Industrial', destination: 'Galle', status: 'pending', driver: null, amount: 6750, priority: 'low' },
    { id: 1245, customer: 'Fashion Hub', pickup: 'Colombo 02', destination: 'Negombo', status: 'loading', driver: 'Kamal Fernando', amount: 15200, priority: 'high' },
    { id: 1244, customer: 'Book World', pickup: 'Kandy Center', destination: 'Matara', status: 'delivered', driver: 'Ravi Mendis', amount: 4800, priority: 'medium' },
    { id: 1243, customer: 'Electronics Plus', pickup: 'Colombo 05', destination: 'Jaffna', status: 'pending', driver: null, amount: 22100, priority: 'high' }
  ]);

  const [assistants, setAssistants] = useState([
    { id: 1, name: 'Saman Kumara', department: 'Loading', shift: 'Day Shift', status: 'active', location: 'Warehouse A', performance: 4.8, tasks: 24 },
    { id: 2, name: 'Priya Jayasinghe', department: 'Administration', shift: 'Day Shift', status: 'active', location: 'Main Office', performance: 4.9, tasks: 18 },
    { id: 3, name: 'Ruwan Silva', department: 'Logistics', shift: 'Night Shift', status: 'break', location: 'Rest Area', performance: 4.5, tasks: 31 },
    { id: 4, name: 'Chaminda Perera', department: 'Quality Control', shift: 'Day Shift', status: 'available', location: 'QC Station', performance: 4.7, tasks: 22 },
    { id: 5, name: 'Malini Fernando', department: 'Customer Service', shift: 'Day Shift', status: 'active', location: 'Call Center', performance: 4.6, tasks: 15 }
  ]);

  const [notifications] = useState([
    { id: 1, type: 'warning', message: '5 orders pending driver assignment', timestamp: '2 min ago' },
    { id: 2, type: 'success', message: 'Monthly target achieved!', timestamp: '15 min ago' },
    { id: 3, type: 'info', message: 'New driver application received', timestamp: '1 hour ago' }
  ]);

  const profileRef = useRef(null);

  // Navigation handler
  const handleNavigation = (tab) => {
    setActiveTab(tab);
    navigate(`/employee/admin/${tab}`);
    setSidebarOpen(false); // Close sidebar on mobile after navigation
    // Clear search and filters when switching tabs
    setSearchTerm('');
    setFilterStatus('all');
    setSelectedItems([]);
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
  useEffect(() => {
    const path = location.pathname;
    const match = path.match(/\/employee\/admin\/(overview|drivers|orders|assistants)/);
    if (match && match[1]) {
      setActiveTab(match[1]);
    }
  }, [location.pathname]);

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
          </div>
          
          <div className="nav-section">
            <div className="nav-section-title">Management</div>
            <button 
              className={`nav-item ${activeTab === 'drivers' ? 'active' : ''}`}
              onClick={() => handleNavigation('drivers')}
            >
              <span className="nav-item-icon">🚛</span>
              <span className="nav-item-text">Drivers</span>
              <span className="nav-item-badge">{stats.totalDrivers}</span>
            </button>
            
            <button 
              className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => handleNavigation('orders')}
            >
              <span className="nav-item-icon">📦</span>
              <span className="nav-item-text">Orders</span>
              <span className="nav-item-badge">{stats.pendingOrders}</span>
            </button>
            
            <button 
              className={`nav-item ${activeTab === 'assistants' ? 'active' : ''}`}
              onClick={() => handleNavigation('assistants')}
            >
              <span className="nav-item-icon">🤝</span>
              <span className="nav-item-text">Assistants</span>
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
          <h1 className="header-title">
            {activeTab === 'overview' && 'Dashboard Overview'}
            {activeTab === 'drivers' && 'Driver Management'}
            {activeTab === 'orders' && 'Order Management'}
            {activeTab === 'assistants' && 'Assistant Management'}
          </h1>
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
                   notification.type === 'success' ? '✅' : 'ℹ️'}
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
          <p>Total Orders</p>
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
          <h3>{stats.totalDrivers}</h3>
          <p>Active Drivers</p>
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
          <p>Pending Orders</p>
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
        </div>
      </div>
    </div>
  );

  const renderQuickActions = () => (
    <div className="quick-actions">
      <h2 className="section-title">Quick Actions</h2>
      <div className="actions-grid">
        <button className="action-btn" onClick={() => handleNavigation('drivers')}>
          <span className="action-btn-icon">➕</span>
          Add New Driver
        </button>
        <button className="action-btn" onClick={() => handleNavigation('orders')}>
          <span className="action-btn-icon">📝</span>
          Create Order
        </button>
        <button className="action-btn" onClick={() => handleNavigation('assistants')}>
          <span className="action-btn-icon">👥</span>
          Manage Staff
        </button>
        <button className="action-btn" onClick={() => navigate('/employee/admin/settings')}>
          <span className="action-btn-icon">📊</span>
          View Reports
        </button>
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
          <button className="btn-secondary">
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
            <th>Driver</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="order-id">#1248</td>
            <td>KandyMart Pvt Ltd</td>
            <td>Colombo 03</td>
            <td><span className="status-badge delivered">Delivered</span></td>
            <td>Nimal Silva</td>
            <td>Rs. 12,500</td>
          </tr>
          <tr>
            <td className="order-id">#1247</td>
            <td>Tech Solutions</td>
            <td>Kandy</td>
            <td><span className="status-badge in-transit">In Transit</span></td>
            <td>Sunil Perera</td>
            <td>Rs. 8,900</td>
          </tr>
          <tr>
            <td className="order-id">#1246</td>
            <td>Green Store</td>
            <td>Galle</td>
            <td><span className="status-badge pending">Pending</span></td>
            <td>-</td>
            <td>Rs. 6,750</td>
          </tr>
          <tr>
            <td className="order-id">#1245</td>
            <td>Fashion Hub</td>
            <td>Negombo</td>
            <td><span className="status-badge in-transit">In Transit</span></td>
            <td>Kamal Fernando</td>
            <td>Rs. 15,200</td>
          </tr>
          <tr>
            <td className="order-id">#1244</td>
            <td>Book World</td>
            <td>Matara</td>
            <td><span className="status-badge delivered">Delivered</span></td>
            <td>Ravi Mendis</td>
            <td>Rs. 4,800</td>
          </tr>
        </tbody>
      </table>
    </div>
  );

  const renderOverview = () => (
    <div>
      {renderStatsCards()}
      {renderQuickActions()}
      {renderPerformanceSection()}
      {renderRecentOrders()}
    </div>
  );

  const renderDrivers = () => {
    const filteredDrivers = drivers.filter(driver => {
      const matchesSearch = driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           driver.vehicle.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || driver.status === filterStatus;
      return matchesSearch && matchesStatus;
    });

    return (
      <div>
        <div className="section-header">
          <h2 className="section-title">Driver Management</h2>
          <div className="table-actions">
            <button className="btn-primary">
              ➕ Add Driver
            </button>
            <button className="btn-secondary">
              📊 Performance Report
            </button>
          </div>
        </div>
        
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon">🚛</div>
              <div className="stat-trend up">↗️ +2</div>
            </div>
            <div className="stat-body">
              <h3>{stats.totalDrivers}</h3>
              <p>Total Drivers</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon">✅</div>
              <div className="stat-trend up">↗️ 95%</div>
            </div>
            <div className="stat-body">
              <h3>{drivers.filter(d => d.status === 'on-duty' || d.status === 'en-route').length}</h3>
              <p>Active Drivers</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon">📈</div>
              <div className="stat-trend up">↗️ 98%</div>
            </div>
            <div className="stat-body">
              <h3>98.2%</h3>
              <p>On-time Rate</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon">⭐</div>
              <div className="stat-trend up">↗️ 4.7</div>
            </div>
            <div className="stat-body">
              <h3>{(drivers.reduce((sum, d) => sum + d.rating, 0) / drivers.length).toFixed(1)}</h3>
              <p>Avg Rating</p>
            </div>
          </div>
        </div>

        <div className="filter-section">
          <div className="search-filter-bar">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search drivers or vehicles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <span className="search-icon">🔍</span>
            </div>
            <div className="filter-controls">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Status</option>
                <option value="on-duty">On Duty</option>
                <option value="en-route">En Route</option>
                <option value="available">Available</option>
                <option value="break">On Break</option>
              </select>
            </div>
          </div>
        </div>

        <div className="data-table">
          <div className="table-header">
            <h3 className="section-title">Driver Overview ({filteredDrivers.length})</h3>
            <div className="table-actions">
              <button className="btn-secondary">
                📋 Export List
              </button>
            </div>
          </div>
          
          <div className="table-container">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Driver</th>
                  <th>License</th>
                  <th>Vehicle</th>
                  <th>Status</th>
                  <th>Location</th>
                  <th>Rating</th>
                  <th>Orders</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDrivers.map(driver => (
                  <tr key={driver.id}>
                    <td>
                      <div className="driver-info">
                        <div className="driver-avatar">
                          {driver.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="driver-name">{driver.name}</div>
                          <div className="driver-id">ID: {driver.id.toString().padStart(3, '0')}</div>
                        </div>
                      </div>
                    </td>
                    <td>{driver.license}</td>
                    <td>{driver.vehicle}</td>
                    <td>
                      <span className={`status-badge ${driver.status === 'on-duty' ? 'in-transit' : 
                        driver.status === 'en-route' ? 'in-transit' :
                        driver.status === 'available' ? 'delivered' : 'pending'}`}>
                        {driver.status.replace('-', ' ')}
                      </span>
                    </td>
                    <td>{driver.location}</td>
                    <td>
                      <div className="rating">
                        ⭐ {driver.rating}
                      </div>
                    </td>
                    <td>{driver.orders}</td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn-action btn-view" title="View Details">
                          👁️
                        </button>
                        <button className="btn-action btn-contact" title="Contact">
                          📞
                        </button>
                        <button className="btn-action btn-edit" title="Edit">
                          ✏️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderOrders = () => {
    const filteredOrders = orders.filter(order => {
      const matchesSearch = order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           order.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           order.id.toString().includes(searchTerm);
      const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
      return matchesSearch && matchesStatus;
    });

    return (
      <div>
        <div className="section-header">
          <h2 className="section-title">Order Management</h2>
          <div className="table-actions">
            <button className="btn-primary">
              ➕ New Order
            </button>
            <button className="btn-secondary">
              🔄 Bulk Actions
            </button>
          </div>
        </div>
        
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon">📦</div>
              <div className="stat-trend up">↗️ +24</div>
            </div>
            <div className="stat-body">
              <h3>{stats.totalOrders.toLocaleString()}</h3>
              <p>Total Orders</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon">⏳</div>
              <div className="stat-trend down">↘️ -3</div>
            </div>
            <div className="stat-body">
              <h3>{orders.filter(o => o.status === 'pending').length}</h3>
              <p>Pending Orders</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon">✅</div>
              <div className="stat-trend up">↗️ +12</div>
            </div>
            <div className="stat-body">
              <h3>{orders.filter(o => o.status === 'delivered').length}</h3>
              <p>Completed Orders</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon">�</div>
              <div className="stat-trend up">↗️ 8%</div>
            </div>
            <div className="stat-body">
              <h3>Rs. {orders.reduce((sum, o) => sum + o.amount, 0).toLocaleString()}</h3>
              <p>Total Revenue</p>
            </div>
          </div>
        </div>

        <div className="filter-section">
          <div className="search-filter-bar">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search orders, customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <span className="search-icon">🔍</span>
            </div>
            <div className="filter-controls">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="loading">Loading</option>
                <option value="in-transit">In Transit</option>
                <option value="delivered">Delivered</option>
              </select>
              <button className="btn-secondary">
                📊 Analytics
              </button>
            </div>
          </div>
        </div>

        <div className="data-table">
          <div className="table-header">
            <h3 className="section-title">Order Tracking ({filteredOrders.length})</h3>
            <div className="table-actions">
              <button className="btn-secondary">
                🔄 Refresh
              </button>
              <button className="btn-secondary">
                📋 Export
              </button>
            </div>
          </div>
          
          <div className="table-container">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Route</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Driver</th>
                  <th>Amount</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map(order => (
                  <tr key={order.id}>
                    <td>
                      <div className="order-id">#{order.id}</div>
                    </td>
                    <td>
                      <div className="customer-info">
                        <div className="customer-name">{order.customer}</div>
                      </div>
                    </td>
                    <td>
                      <div className="route-info">
                        <div className="pickup">📍 {order.pickup}</div>
                        <div className="destination">🏁 {order.destination}</div>
                      </div>
                    </td>
                    <td>
                      <span className={`status-badge ${order.status}`}>
                        {order.status.replace('-', ' ')}
                      </span>
                    </td>
                    <td>
                      <span className={`priority-badge ${order.priority}`}>
                        {order.priority}
                      </span>
                    </td>
                    <td>{order.driver || '-'}</td>
                    <td>
                      <div className="amount">Rs. {order.amount.toLocaleString()}</div>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn-action btn-view" title="View Details">
                          👁️
                        </button>
                        <button className="btn-action btn-edit" title="Edit Order">
                          ✏️
                        </button>
                        <button className="btn-action btn-track" title="Track">
                          📍
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderAssistants = () => {
    const filteredAssistants = assistants.filter(assistant => {
      const matchesSearch = assistant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           assistant.department.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || assistant.status === filterStatus;
      return matchesSearch && matchesStatus;
    });

    return (
      <div>
        <div className="section-header">
          <h2 className="section-title">Assistant Management</h2>
          <div className="table-actions">
            <button className="btn-primary">
              ➕ Add Assistant
            </button>
            <button className="btn-secondary">
              📋 Schedules
            </button>
          </div>
        </div>
        
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon">🤝</div>
              <div className="stat-trend up">↗️ +1</div>
            </div>
            <div className="stat-body">
              <h3>{assistants.length}</h3>
              <p>Total Assistants</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon">💼</div>
              <div className="stat-trend up">↗️ {assistants.filter(a => a.status === 'active').length}</div>
            </div>
            <div className="stat-body">
              <h3>{assistants.filter(a => a.status === 'active').length}</h3>
              <p>On Duty</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon">📊</div>
              <div className="stat-trend up">↗️ 94%</div>
            </div>
            <div className="stat-body">
              <h3>{(assistants.reduce((sum, a) => sum + a.performance, 0) / assistants.length * 20).toFixed(1)}%</h3>
              <p>Efficiency Rate</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon">🏆</div>
              <div className="stat-trend up">↗️ 4.6</div>
            </div>
            <div className="stat-body">
              <h3>{(assistants.reduce((sum, a) => sum + a.performance, 0) / assistants.length).toFixed(1)}</h3>
              <p>Avg Performance</p>
            </div>
          </div>
        </div>

        <div className="filter-section">
          <div className="search-filter-bar">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search assistants or departments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <span className="search-icon">🔍</span>
            </div>
            <div className="filter-controls">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="available">Available</option>
                <option value="break">On Break</option>
              </select>
              <button className="btn-secondary">
                📈 Performance
              </button>
            </div>
          </div>
        </div>

        <div className="data-table">
          <div className="table-header">
            <h3 className="section-title">Assistant Overview ({filteredAssistants.length})</h3>
            <div className="table-actions">
              <button className="btn-secondary">
                📊 Department Report
              </button>
            </div>
          </div>
          
          <div className="table-container">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Assistant</th>
                  <th>Department</th>
                  <th>Shift</th>
                  <th>Status</th>
                  <th>Location</th>
                  <th>Performance</th>
                  <th>Tasks</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssistants.map(assistant => (
                  <tr key={assistant.id}>
                    <td>
                      <div className="assistant-info">
                        <div className="assistant-avatar">
                          {assistant.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="assistant-name">{assistant.name}</div>
                          <div className="assistant-id">ID: {assistant.id.toString().padStart(3, '0')}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="department-badge">
                        {assistant.department}
                      </div>
                    </td>
                    <td>{assistant.shift}</td>
                    <td>
                      <span className={`status-badge ${assistant.status === 'active' ? 'in-transit' : 
                        assistant.status === 'available' ? 'delivered' : 'pending'}`}>
                        {assistant.status}
                      </span>
                    </td>
                    <td>{assistant.location}</td>
                    <td>
                      <div className="performance-score">
                        ⭐ {assistant.performance}
                      </div>
                    </td>
                    <td>
                      <div className="task-count">
                        {assistant.tasks} tasks
                      </div>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn-action btn-view" title="View Profile">
                          👁️
                        </button>
                        <button className="btn-action btn-schedule" title="Schedule">
                          📅
                        </button>
                        <button className="btn-action btn-edit" title="Edit">
                          ✏️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading dashboard data...</p>
        </div>
      );
    }

    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'drivers':
        return renderDrivers();
      case 'orders':
        return renderOrders();
      case 'assistants':
        return renderAssistants();
      default:
        return renderOverview();
    }
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