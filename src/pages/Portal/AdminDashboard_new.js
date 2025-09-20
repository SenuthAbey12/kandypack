import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import './AdminDashboard_new.css';

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

  const renderOverview = () => (
    <div>
      {renderStatsCards()}
      {renderQuickActions()}
    </div>
  );

  const renderDrivers = () => (
    <div>
      <h2 className="section-title">Driver Management</h2>
      <div className="stat-card">
        <p>Driver management interface coming soon...</p>
        <p>Total Drivers: {stats.totalDrivers}</p>
      </div>
    </div>
  );

  const renderOrders = () => (
    <div>
      <h2 className="section-title">Order Management</h2>
      <div className="stat-card">
        <p>Order management interface coming soon...</p>
        <p>Pending Orders: {stats.pendingOrders}</p>
        <p>Completed Today: {stats.completedToday}</p>
      </div>
    </div>
  );

  const renderAssistants = () => (
    <div>
      <h2 className="section-title">Assistant Management</h2>
      <div className="stat-card">
        <p>Assistant management interface coming soon...</p>
        <p>Total Assistants: {stats.totalAssistants}</p>
      </div>
    </div>
  );

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