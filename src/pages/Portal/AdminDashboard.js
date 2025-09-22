import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import './AdminDashboard.css';
import ContentRenderer from './ContentRenderer';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  
  // State management
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [performancePeriod, setPerformancePeriod] = useState('today');
  const [analyticsTimeframe, setAnalyticsTimeframe] = useState('month');
  const [analyticsView, setAnalyticsView] = useState('overview');
  
  const mockStats = {
    totalDrivers: 45,
    totalAssistants: 23,
    railShipments: 156,
    activeRoutes: 24,
    pendingOrders: 18,
  };

  const getPerformanceData = () => {
    const baseData = {
      today: {
        revenue: 12400,
        orders: 67,
        efficiency: 94.5,
        growth: '+8.2%',
        description: 'Today\'s performance metrics'
      },
      week: {
        revenue: 89500,
        orders: 456,
        efficiency: 91.8,
        growth: '+12.5%',
        description: 'This week\'s performance overview'
      },
      month: {
        revenue: 356700,
        orders: 1847,
        efficiency: 93.2,
        growth: '+15.8%',
        description: 'Monthly performance summary'
      }
    };
    return baseData[performancePeriod] || baseData.today;
  };

  const getAnalyticsData = () => {
    const analyticsData = {
      week: {
        deliveryRate: 94.2,
        fleetUtilization: 82.5,
        costPerMile: 2.35,
        inventoryTurnover: 6.8,
        efficiency: 89.5,
        trends: {
          delivery: '+3.2%',
          fleet: '+5.8%',
          cost: '-2.1%',
          inventory: '+8.5%'
        }
      },
      month: {
        deliveryRate: 96.5,
        fleetUtilization: 78.5,
        costPerMile: 2.45,
        inventoryTurnover: 8.2,
        efficiency: 93.2,
        trends: {
          delivery: '+5.8%',
          fleet: '+2.3%',
          cost: '+1.2%',
          inventory: '+12.4%'
        }
      },
      quarter: {
        deliveryRate: 95.8,
        fleetUtilization: 85.2,
        costPerMile: 2.28,
        inventoryTurnover: 9.1,
        efficiency: 91.7,
        trends: {
          delivery: '+8.5%',
          fleet: '+7.2%',
          cost: '-5.3%',
          inventory: '+18.7%'
        }
      }
    };
    return analyticsData[analyticsTimeframe] || analyticsData.month;
  };

  const getRouteEfficiencyData = () => {
    return [
      { route: 'Colombo-Kandy', efficiency: 94, trend: '+2.5%', status: 'excellent' },
      { route: 'Kandy-Galle', efficiency: 78, trend: '-1.2%', status: 'good' },
      { route: 'Main Railway', efficiency: 96, trend: '+4.1%', status: 'excellent' },
      { route: 'Coast Railway', efficiency: 92, trend: '+1.8%', status: 'excellent' },
      { route: 'Colombo-Jaffna', efficiency: 85, trend: '+0.5%', status: 'good' }
    ];
  };

  const [notifications] = useState([
    { id: 1, type: 'warning', message: '5 orders pending driver assignment', timestamp: '2 min ago' },
    { id: 2, type: 'success', message: 'Monthly target achieved!', timestamp: '15 min ago' },
    { id: 3, type: 'info', message: 'New driver application received', timestamp: '1 hour ago' },
    { id: 4, type: 'warning', message: 'Low fuel alert: Vehicle CAF-1122', timestamp: '30 min ago' },
    { id: 5, type: 'critical', message: 'Train TE-002 delayed by 45 minutes', timestamp: '1 hour ago' },
    { id: 6, type: 'info', message: 'Warehouse A reaching 90% capacity', timestamp: '2 hours ago' }
  ]);

  const profileRef = useRef(null);

  // Navigation handler
  const handleNavigation = (tab) => {
    navigate(`/employee/admin/${tab}`);
    setSidebarOpen(false); // Close sidebar on mobile after navigation
  };

  // Profile menu toggle
  const toggleProfileMenu = () => {
    setShowProfileMenu((prev) => !prev);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, []);

  // Set active tab based on route
  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes('analytics')) return 'analytics';
    if (path.includes('drivers')) return 'drivers';
    if (path.includes('railway')) return 'railway';
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
              <span className="nav-item-badge">{mockStats.totalDrivers}</span>
            </button>
            
            <button 
              className={`nav-item ${activeTab === 'railway' ? 'active' : ''}`}
              onClick={() => handleNavigation('railway')}
            >
              <span className="nav-item-icon">🚂</span>
              <span className="nav-item-text">Railway Operations</span>
              <span className="nav-item-badge">{mockStats.railShipments}</span>
            </button>
            
            <button 
              className={`nav-item ${activeTab === 'routes' ? 'active' : ''}`}
              onClick={() => handleNavigation('routes')}
            >
              <span className="nav-item-icon">🛤️</span>
              <span className="nav-item-text">Routes & Scheduling</span>
              <span className="nav-item-badge">{mockStats.activeRoutes}</span>
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
              <span className="nav-item-badge">{mockStats.pendingOrders}</span>
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
              <span className="nav-item-badge">{mockStats.totalAssistants}</span>
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
        <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Toggle navigation">
          <div className="hamburger-icon">
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
          </div>
        </button>
        <div className="header-title-container">
          <h1 className="header-title">
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
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
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          data-theme-state={theme}
        >
          <div className="theme-toggle-track">
            <div className="theme-toggle-thumb">
              <span className="theme-icon light-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="4"/>
                  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 6.34L4.93 4.93M19.07 19.07l17.66 17.66"/>
                </svg>
              </span>
              <span className="theme-icon dark-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              </span>
            </div>
          </div>
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
        
        <div className={`admin-profile ${showProfileMenu ? 'active' : ''}`} ref={profileRef}>
          <button type="button" className="profile-trigger" onClick={toggleProfileMenu} aria-haspopup="menu" aria-expanded={showProfileMenu}>
            <div className="profile-avatar">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="profile-info">
              <div className="profile-name">{user?.name || 'Admin User'}</div>
              <div className="profile-role">Administrator</div>
            </div>
            <span className="dropdown-arrow">▼</span>
          </button>

          {showProfileMenu && (
            <div className="profile-dropdown-menu show" onClick={(e) => e.stopPropagation()} role="menu">
              <div className="dropdown-item">
                <span className="dropdown-item-icon">👤</span>
                Profile Settings
              </div>
              
              <div className="dropdown-item">
                <span className="dropdown-item-icon">⚙️</span>
                Preferences
              </div>
              
              <div className="dropdown-item">
                <span className="dropdown-item-icon">🔔</span>
                Notifications
              </div>
              
              <hr className="dropdown-divider" />
              
              <div className="dropdown-item logout" onClick={logout}>
                <span className="dropdown-item-icon">🚪</span>
                Sign Out
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className={`dashboard-container ${theme}`}>
      {renderSidebar()}
      <div className="dashboard-main">
        {renderHeader()}
        <main className="dashboard-content">
          <ContentRenderer 
            handleNavigation={handleNavigation}
            getPerformanceData={getPerformanceData}
            performancePeriod={performancePeriod}
            setPerformancePeriod={setPerformancePeriod}
            getAnalyticsData={getAnalyticsData}
            getRouteEfficiencyData={getRouteEfficiencyData}
            analyticsTimeframe={analyticsTimeframe}
            setAnalyticsTimeframe={setAnalyticsTimeframe}
            analyticsView={analyticsView}
            setAnalyticsView={setAnalyticsView}
          />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;