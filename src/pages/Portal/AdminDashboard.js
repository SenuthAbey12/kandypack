import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import './AdminDashboard.css';

import Overview from './AdminDashboardPages/Overview';
import Analytics from './AdminDashboardPages/Analytics';
import Fleet from './AdminDashboardPages/Fleet';
import Railway from './AdminDashboardPages/Railway';
import Routes from './AdminDashboardPages/Routes';
import Tracking from './AdminDashboardPages/Tracking';
import Shipments from './AdminDashboardPages/Shipments';
import Warehouses from './AdminDashboardPages/Warehouses';
import Inventory from './AdminDashboardPages/Inventory';
import Staff from './AdminDashboardPages/Staff';

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
  
  // Filter and search states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // Analytics states
  const [analyticsTimeframe, setAnalyticsTimeframe] = useState('month');
  const [analyticsView, setAnalyticsView] = useState('overview');
  
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

  // Performance data that changes based on time period
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

  // Analytics data that changes based on timeframe and filters
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

  // Route efficiency data
  const getRouteEfficiencyData = () => {
    return [
      { route: 'Colombo-Kandy', efficiency: 94, trend: '+2.5%', status: 'excellent' },
      { route: 'Kandy-Galle', efficiency: 78, trend: '-1.2%', status: 'good' },
      { route: 'Main Railway', efficiency: 96, trend: '+4.1%', status: 'excellent' },
      { route: 'Coast Railway', efficiency: 92, trend: '+1.8%', status: 'excellent' },
      { route: 'Colombo-Jaffna', efficiency: 85, trend: '+0.5%', status: 'good' }
    ];
  };

  const [drivers, setDrivers] = useState([
    { id: 1, name: 'Nimal Silva', license: 'DL12345', vehicle: 'Lorry - CAB-1234', type: 'road', status: 'on-duty', location: 'Colombo 03', rating: 4.9, orders: 45, fuelLevel: 85, lastMaintenance: '2024-01-15' },
    { id: 2, name: 'Sunil Perera', license: 'DL67890', vehicle: 'Van - CAC-5678', type: 'road', status: 'en-route', location: 'Kandy', rating: 4.7, orders: 38, fuelLevel: 60, lastMaintenance: '2024-01-10' },
    { id: 3, name: 'Kamal Fernando', license: 'DL11223', vehicle: 'Truck - CAE-9101', type: 'road', status: 'available', location: 'Depot', rating: 4.8, orders: 52, fuelLevel: 95, lastMaintenance: '2024-01-20' },
    { id: 4, name: 'Ravi Mendis', license: 'DL44556', vehicle: 'Van - CAF-1122', type: 'road', status: 'break', location: 'Rest Area', rating: 4.6, orders: 33, fuelLevel: 40, lastMaintenance: '2024-01-08' },
    { id: 5, name: 'Chaminda Perera', license: 'DL77889', vehicle: 'Lorry - CAH-3344', type: 'road', status: 'on-duty', location: 'Galle', rating: 4.5, orders: 41, fuelLevel: 70, lastMaintenance: '2024-01-18' },
    { id: 6, name: 'Pradeep Jayawardene', license: 'RL55443', vehicle: 'Train Engine - TE-001', type: 'rail', status: 'scheduled', location: 'Colombo Fort Station', rating: 4.9, orders: 25, fuelLevel: 90, lastMaintenance: '2024-01-22' },
    { id: 7, name: 'Anil Gunasekara', license: 'RL66778', vehicle: 'Train Engine - TE-002', type: 'rail', status: 'en-route', location: 'Kandy Station', rating: 4.8, orders: 18, fuelLevel: 75, lastMaintenance: '2024-01-19' }
  ]);

  const [orders, setOrders] = useState([
    { orderId: 'KP1248TR', customer: 'KandyMart Pvt Ltd', date: '2024-07-22', amount: 'Rs. 12,500', status: 'Delivered' },
    { orderId: 'KP1247TR', customer: 'Tech Solutions', date: '2024-07-22', amount: 'Rs. 8,900', status: 'In Transit' },
    { orderId: 'KP1246TR', customer: 'Green Store', date: '2024-07-21', amount: 'Rs. 6,750', status: 'Pending' },
  ]);

  const [assistants, setAssistants] = useState([
    { id: 1, name: 'Saman Kumara', role: 'Loader', contact: '077-1234567', status: 'active' },
    { id: 2, name: 'Priya Jayasinghe', role: 'Admin Assistant', contact: '071-7654321', status: 'active' },
    { id: 3, name: 'Ruwan Silva', role: 'Logistics Coordinator', contact: '076-1122334', status: 'on-leave' },
  ]);

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
    { id: 1, name: 'Colombo Main', location: 'Colombo', capacity: 10000, utilization: 87.5, status: 'active' },
    { id: 2, name: 'Kandy Hub', location: 'Kandy', capacity: 7500, utilization: 82.7, status: 'active' },
    { id: 3, name: 'Galle Depot', location: 'Galle', capacity: 5000, utilization: 76.0, status: 'inactive' },
  ]);

  const [routes] = useState([
    { id: 'R001', name: 'Colombo-Kandy', start: 'Colombo', end: 'Kandy', distance: '115 km', vehicles: 5, status: 'active', performance: 94 },
    { id: 'R002', name: 'Kandy-Galle', start: 'Kandy', end: 'Galle', distance: '220 km', vehicles: 3, status: 'active', performance: 85 },
    { id: 'R003', name: 'Colombo-Jaffna', start: 'Colombo', end: 'Jaffna', distance: '400 km', vehicles: 2, status: 'issue', performance: 72 },
  ]);

  const [inventory] = useState([
    { id: 1, name: 'Standard Boxes', sku: 'BOX-ST-01', category: 'Packaging', stock: 1500, status: 'in-stock' },
    { id: 2, name: 'Bubble Wrap', sku: 'WRAP-BU-01', category: 'Packaging', stock: 200, status: 'low-stock' },
    { id: 3, name: 'Pallets', sku: 'PAL-WD-01', category: 'Equipment', stock: 50, status: 'in-stock' },
    { id: 4, name: 'Tape', sku: 'TAPE-HV-01', category: 'Supplies', stock: 0, status: 'out-of-stock' },
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
              <span className="nav-item-badge">{stats.totalDrivers}</span>
            </button>
            
            <button 
              className={`nav-item ${activeTab === 'railway' ? 'active' : ''}`}
              onClick={() => handleNavigation('railway')}
            >
              <span className="nav-item-icon">🚂</span>
              <span className="nav-item-text">Railway Operations</span>
              <span className="nav-item-badge">{stats.railShipments}</span>
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

  const ContentRenderer = () => {
    const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'descending' });

    const sortedOrders = [...orders].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
    });

    const handleSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const liveTracking = [
        { id: 1, driver: 'Sunil Perera', vehicleId: 'CAC-5678', orderId: 'KP1247TR', speed: '60 km/h', status: 'moving', lastUpdate: '1 min ago' },
        { id: 2, driver: 'Kamal Fernando', vehicleId: 'CAE-9101', orderId: 'KP1245TR', speed: '0 km/h', status: 'stopped', lastUpdate: '5 min ago' },
    ];

    switch (activeTab) {
      case 'overview':
        return <Overview stats={stats} handleNavigation={handleNavigation} routes={routes} warehouses={warehouses} getPerformanceData={getPerformanceData} performancePeriod={performancePeriod} setPerformancePeriod={setPerformancePeriod} orders={orders} />;
      case 'analytics':
        return <Analytics getAnalyticsData={getAnalyticsData} getRouteEfficiencyData={getRouteEfficiencyData} analyticsTimeframe={analyticsTimeframe} setAnalyticsTimeframe={setAnalyticsTimeframe} analyticsView={analyticsView} setAnalyticsView={setAnalyticsView} />;
      case 'drivers':
        return <Fleet drivers={drivers} searchTerm={searchTerm} setSearchTerm={setSearchTerm} filterStatus={filterStatus} setFilterStatus={setFilterStatus} stats={stats} />;
      case 'railway':
        return <Railway drivers={drivers} searchTerm={searchTerm} setSearchTerm={setSearchTerm} filterStatus={filterStatus} setFilterStatus={setFilterStatus} stats={stats} />;
      case 'routes':
        return <Routes routes={routes} searchTerm={searchTerm} setSearchTerm={setSearchTerm} filterStatus={filterStatus} setFilterStatus={setFilterStatus} />;
      case 'tracking':
        return <Tracking liveTracking={liveTracking} searchTerm={searchTerm} setSearchTerm={setSearchTerm} filterStatus={filterStatus} setFilterStatus={setFilterStatus} />;
      case 'orders':
        return <Shipments orders={sortedOrders} searchTerm={searchTerm} setSearchTerm={setSearchTerm} filterStatus={filterStatus} setFilterStatus={setFilterStatus} handleSort={handleSort} sortConfig={sortConfig} />;
      case 'warehouses':
        return <Warehouses warehouses={warehouses} searchTerm={searchTerm} setSearchTerm={setSearchTerm} filterStatus={filterStatus} setFilterStatus={setFilterStatus} />;
      case 'inventory':
        return <Inventory inventory={inventory} searchTerm={searchTerm} setSearchTerm={setSearchTerm} filterStatus={filterStatus} setFilterStatus={setFilterStatus} />;
      case 'assistants':
        return <Staff assistants={assistants} searchTerm={searchTerm} setSearchTerm={setSearchTerm} filterStatus={filterStatus} setFilterStatus={setFilterStatus} />;
      default:
        return <Overview stats={stats} handleNavigation={handleNavigation} routes={routes} warehouses={warehouses} getPerformanceData={getPerformanceData} performancePeriod={performancePeriod} setPerformancePeriod={setPerformancePeriod} orders={orders} />;
    }
  };

  return (
    <div className={`dashboard-container ${theme}`}>
      {renderSidebar()}
      <div className="dashboard-main">
        {renderHeader()}
        <main className="dashboard-content">
          <ContentRenderer />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;