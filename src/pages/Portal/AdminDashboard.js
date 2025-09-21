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
  const [performancePeriod, setPerformancePeriod] = useState('today');
  
  // Filter and search states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // Analytics states
  const [analyticsTimeframe, setAnalyticsTimeframe] = useState('month');
  const [analyticsView, setAnalyticsView] = useState('overview');
  const [selectedMetric, setSelectedMetric] = useState('all');
  
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
    { id: 1248, customer: 'KandyMart Pvt Ltd', pickup: 'Kandy Main', destination: 'Colombo 03', status: 'delivered', driver: 'Nimal Silva', amount: 12500, priority: 'high', transport: 'road', weight: 2.5, estimatedTime: '3.5 hours', trackingCode: 'KP1248TR' },
    { id: 1247, customer: 'Tech Solutions', pickup: 'Colombo Port', destination: 'Kandy', status: 'in-transit', driver: 'Sunil Perera', amount: 8900, priority: 'medium', transport: 'road', weight: 1.8, estimatedTime: '2.8 hours', trackingCode: 'KP1247TR' },
    { id: 1246, customer: 'Green Store', pickup: 'Kandy Industrial', destination: 'Galle', status: 'pending', driver: null, amount: 6750, priority: 'low', transport: 'road', weight: 3.2, estimatedTime: '4.2 hours', trackingCode: 'KP1246TR' },
    { id: 1245, customer: 'Fashion Hub', pickup: 'Colombo 02', destination: 'Negombo', status: 'loading', driver: 'Kamal Fernando', amount: 15200, priority: 'high', transport: 'road', weight: 1.5, estimatedTime: '1.8 hours', trackingCode: 'KP1245TR' },
    { id: 1244, customer: 'Book World', pickup: 'Kandy Center', destination: 'Matara', status: 'delivered', driver: 'Ravi Mendis', amount: 4800, priority: 'medium', transport: 'road', weight: 0.8, estimatedTime: '5.5 hours', trackingCode: 'KP1244TR' },
    { id: 1243, customer: 'Electronics Plus', pickup: 'Colombo 05', destination: 'Jaffna', status: 'pending', driver: null, amount: 22100, priority: 'high', transport: 'rail', weight: 8.5, estimatedTime: '12 hours', trackingCode: 'KP1243RL' },
    { id: 1242, customer: 'Industrial Supplies Co.', pickup: 'Colombo Fort', destination: 'Batticaloa', status: 'in-transit', driver: 'Pradeep Jayawardene', amount: 18700, priority: 'medium', transport: 'rail', weight: 15.2, estimatedTime: '8 hours', trackingCode: 'KP1242RL' },
    { id: 1241, customer: 'Agro Products Ltd', pickup: 'Kandy Station', destination: 'Trincomalee', status: 'loading', driver: 'Anil Gunasekara', amount: 9800, priority: 'high', transport: 'rail', weight: 12.8, estimatedTime: '6.5 hours', trackingCode: 'KP1241RL' }
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

  const [inventory] = useState([
    { id: 1, product: 'Electronics', category: 'Consumer Goods', stock: 1250, reorderLevel: 200, location: 'Warehouse A-B2', lastUpdated: '2024-01-22' },
    { id: 2, product: 'Fashion Items', category: 'Apparel', stock: 3400, reorderLevel: 500, location: 'Warehouse A-C1', lastUpdated: '2024-01-22' },
    { id: 3, product: 'Home & Garden', category: 'Household', stock: 890, reorderLevel: 150, location: 'Warehouse B-A3', lastUpdated: '2024-01-21' },
    { id: 4, product: 'Industrial Parts', category: 'Industrial', stock: 145, reorderLevel: 100, location: 'Warehouse C-D1', lastUpdated: '2024-01-22' }
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
            {activeTab === 'overview' && 'Supply Chain Dashboard'}
            {activeTab === 'analytics' && 'Analytics & Insights'}
            {activeTab === 'drivers' && 'Fleet & Driver Management'}
            {activeTab === 'routes' && 'Routes & Scheduling'}
            {activeTab === 'tracking' && 'Live Vehicle Tracking'}
            {activeTab === 'orders' && 'Shipment Management'}
            {activeTab === 'warehouses' && 'Warehouse Operations'}
            {activeTab === 'inventory' && 'Inventory Management'}
            {activeTab === 'assistants' && 'Staff Management'}
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
          <span className="action-btn-icon">�</span>
          Dispatch Vehicle
        </button>
        <button className="action-btn" onClick={() => handleNavigation('tracking')}>
          <span className="action-btn-icon">📍</span>
          Track Shipments
        </button>
        <button className="action-btn" onClick={() => handleNavigation('routes')}>
          <span className="action-btn-icon">�️</span>
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
              <span className="warehouse-location">� {warehouse.location}</span>
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

  const renderPerformanceSection = () => {
    const perfData = getPerformanceData();
    
    return (
      <div className="performance-section">
        <div className="performance-chart">
          <div className="chart-header">
            <h3 className="chart-title">Performance Overview</h3>
            <div className="chart-filter">
              <button 
                className={`filter-btn ${performancePeriod === 'today' ? 'active' : ''}`}
                onClick={() => setPerformancePeriod('today')}
              >
                Today
              </button>
              <button 
                className={`filter-btn ${performancePeriod === 'week' ? 'active' : ''}`}
                onClick={() => setPerformancePeriod('week')}
              >
                Week
              </button>
              <button 
                className={`filter-btn ${performancePeriod === 'month' ? 'active' : ''}`}
                onClick={() => setPerformancePeriod('month')}
              >
                Month
              </button>
            </div>
          </div>
          <div className="chart-content">
            <div className="performance-metrics">
              <div className="metric-card">
                <div className="metric-label">Revenue</div>
                <div className="metric-value">${perfData.revenue.toLocaleString()}</div>
                <div className="metric-change positive">{perfData.growth}</div>
              </div>
              <div className="metric-card">
                <div className="metric-label">Orders</div>
                <div className="metric-value">{perfData.orders}</div>
                <div className="metric-change positive">{perfData.growth}</div>
              </div>
              <div className="metric-card">
                <div className="metric-label">Efficiency</div>
                <div className="metric-value">{perfData.efficiency}%</div>
                <div className="metric-change positive">{perfData.growth}</div>
              </div>
            </div>
            <div className="chart-placeholder">
              📊 {perfData.description}
            </div>
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
      {renderSupplyChainOverview()}
      {renderWarehouseStatus()}
      {renderPerformanceSection()}
      {renderRecentOrders()}
    </div>
  );

  const renderAnalytics = () => {
    const analyticsData = getAnalyticsData();
    const routeData = getRouteEfficiencyData();
    
    return (
      <div className="analytics-container">
        <div className="section-header">
          <h2 className="section-title">Supply Chain Analytics</h2>
          <div className="analytics-controls">
            <div className="control-group">
              <label>Timeframe:</label>
              <select 
                value={analyticsTimeframe} 
                onChange={(e) => setAnalyticsTimeframe(e.target.value)}
                className="analytics-select"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
              </select>
            </div>
            <div className="control-group">
              <label>View:</label>
              <select 
                value={analyticsView} 
                onChange={(e) => setAnalyticsView(e.target.value)}
                className="analytics-select"
              >
                <option value="overview">Overview</option>
                <option value="detailed">Detailed</option>
                <option value="trends">Trends</option>
              </select>
            </div>
            <div className="table-actions">
              <button className="btn-secondary">📊 Export Report</button>
              <button className="btn-secondary">⚙️ Configure</button>
            </div>
          </div>
        </div>
        
        <div className="analytics-grid">
          <div className="analytics-card performance-metrics">
            <div className="card-header">
              <h3>Performance Metrics</h3>
              <span className="timeframe-badge">{analyticsTimeframe}</span>
            </div>
            <div className="metrics-grid">
              <div className="metric-item">
                <div className="metric-info">
                  <span className="metric-label">On-time Delivery</span>
                  <span className="metric-trend positive">{analyticsData.trends.delivery}</span>
                </div>
                <div className="metric-value-wrapper">
                  <span className="metric-value excellent">{analyticsData.deliveryRate}%</span>
                  <div className="metric-bar">
                    <div className="metric-progress" style={{width: `${analyticsData.deliveryRate}%`}}></div>
                  </div>
                </div>
              </div>
              
              <div className="metric-item">
                <div className="metric-info">
                  <span className="metric-label">Fleet Utilization</span>
                  <span className="metric-trend positive">{analyticsData.trends.fleet}</span>
                </div>
                <div className="metric-value-wrapper">
                  <span className="metric-value good">{analyticsData.fleetUtilization}%</span>
                  <div className="metric-bar">
                    <div className="metric-progress" style={{width: `${analyticsData.fleetUtilization}%`}}></div>
                  </div>
                </div>
              </div>
              
              <div className="metric-item">
                <div className="metric-info">
                  <span className="metric-label">Cost per Mile</span>
                  <span className="metric-trend negative">{analyticsData.trends.cost}</span>
                </div>
                <div className="metric-value-wrapper">
                  <span className="metric-value">${analyticsData.costPerMile}</span>
                  <div className="cost-indicator">
                    <span className="cost-status">Optimized</span>
                  </div>
                </div>
              </div>
              
              <div className="metric-item">
                <div className="metric-info">
                  <span className="metric-label">Inventory Turnover</span>
                  <span className="metric-trend positive">{analyticsData.trends.inventory}</span>
                </div>
                <div className="metric-value-wrapper">
                  <span className="metric-value excellent">{analyticsData.inventoryTurnover}x</span>
                  <div className="metric-bar">
                    <div className="metric-progress" style={{width: `${(analyticsData.inventoryTurnover / 12) * 100}%`}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="analytics-card route-efficiency">
            <div className="card-header">
              <h3>Route Efficiency</h3>
              <button className="card-action-btn">View All</button>
            </div>
            <div className="route-list">
              {routeData.map((route, index) => (
                <div key={index} className="route-efficiency-item">
                  <div className="route-info">
                    <span className="route-name">{route.route}</span>
                    <span className={`efficiency-badge ${route.status}`}>
                      {route.efficiency}%
                    </span>
                  </div>
                  <div className="route-details">
                    <div className="efficiency-bar">
                      <div 
                        className={`efficiency-progress ${route.status}`}
                        style={{width: `${route.efficiency}%`}}
                      ></div>
                    </div>
                    <span className={`trend-indicator ${route.trend.startsWith('+') ? 'positive' : 'negative'}`}>
                      {route.trend}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="analytics-card cost-analysis">
            <div className="card-header">
              <h3>Transportation Cost Analysis</h3>
              <div className="chart-view-toggle">
                <button className="view-btn active">Pie</button>
                <button className="view-btn">Bar</button>
              </div>
            </div>
            <div className="cost-breakdown">
              <div className="cost-chart">
                <div className="cost-pie">
                  <div className="pie-segment fuel" style={{'--percentage': '45%'}}>
                    <span className="segment-label">Fuel 45%</span>
                  </div>
                  <div className="pie-segment maintenance" style={{'--percentage': '25%'}}>
                    <span className="segment-label">Maintenance 25%</span>
                  </div>
                  <div className="pie-segment labor" style={{'--percentage': '20%'}}>
                    <span className="segment-label">Labor 20%</span>
                  </div>
                  <div className="pie-segment other" style={{'--percentage': '10%'}}>
                    <span className="segment-label">Other 10%</span>
                  </div>
                </div>
              </div>
              <div className="cost-legend">
                <div className="legend-item">
                  <div className="legend-color fuel"></div>
                  <span>Fuel Costs</span>
                  <span className="cost-amount">$45,200</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color maintenance"></div>
                  <span>Maintenance</span>
                  <span className="cost-amount">$25,100</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color labor"></div>
                  <span>Labor</span>
                  <span className="cost-amount">$20,050</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color other"></div>
                  <span>Other</span>
                  <span className="cost-amount">$10,025</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="analytics-card predictive-insights">
            <div className="card-header">
              <h3>Predictive Insights</h3>
              <span className="insights-count">5 Active</span>
            </div>
            <div className="insights-list">
              <div className="insight-item high-priority">
                <div className="insight-header">
                  <span className="insight-icon">⚠️</span>
                  <span className="priority-label">High Priority</span>
                  <span className="insight-time">2h</span>
                </div>
                <p>High traffic expected on Colombo-Kandy route tomorrow. Consider alternative routes.</p>
                <div className="insight-action">
                  <button className="action-btn">Optimize Route</button>
                </div>
              </div>
              
              <div className="insight-item medium-priority">
                <div className="insight-header">
                  <span className="insight-icon">📈</span>
                  <span className="priority-label">Medium Priority</span>
                  <span className="insight-time">4h</span>
                </div>
                <p>15% increase in demand predicted for next week. Prepare additional capacity.</p>
                <div className="insight-action">
                  <button className="action-btn">Plan Capacity</button>
                </div>
              </div>
              
              <div className="insight-item low-priority">
                <div className="insight-header">
                  <span className="insight-icon">💡</span>
                  <span className="priority-label">Optimization</span>
                  <span className="insight-time">1d</span>
                </div>
                <p>Route optimization could save 12% in fuel costs. Review suggested changes.</p>
                <div className="insight-action">
                  <button className="action-btn">Review Changes</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderRoutes = () => (
    <div>
      <div className="section-header">
        <h2 className="section-title">Routes & Scheduling</h2>
        <div className="table-actions">
          <button className="btn-primary">➕ Add Route</button>
          <button className="btn-secondary">🔄 Optimize All</button>
        </div>
      </div>
      
      <div className="routes-grid">
        {routes.map(route => (
          <div key={route.id} className="route-card">
            <div className="route-header">
              <h4>{route.name}</h4>
              <span className={`route-type-badge ${route.type}`}>
                {route.type === 'rail' ? '🚄' : '🚛'} {route.type.toUpperCase()}
              </span>
            </div>
            <div className="route-details">
              <div className="route-stat">
                <span>Distance</span>
                <span>{route.distance} km</span>
              </div>
              <div className="route-stat">
                <span>Avg Time</span>
                <span>{route.avgTime}</span>
              </div>
              <div className="route-stat">
                <span>Traffic</span>
                <span className={`traffic-${route.traffic}`}>{route.traffic}</span>
              </div>
              <div className="route-stat">
                <span>Weather</span>
                <span className={`weather-${route.weather}`}>{route.weather}</span>
              </div>
              <div className="route-stat">
                <span>Efficiency</span>
                <span className={`efficiency ${route.efficiency > 90 ? 'good' : route.efficiency > 80 ? 'average' : 'poor'}`}>
                  {route.efficiency}%
                </span>
              </div>
            </div>
            <div className="route-actions">
              <button className="btn-action btn-edit">✏️ Edit</button>
              <button className="btn-action btn-optimize">🎯 Optimize</button>
              <button className="btn-action btn-view">👁️ Details</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTracking = () => (
    <div>
      <div className="section-header">
        <h2 className="section-title">Live Vehicle Tracking</h2>
        <div className="table-actions">
          <button className="btn-secondary">🔄 Refresh</button>
          <button className="btn-secondary">🚨 Alerts</button>
        </div>
      </div>
      
      <div className="tracking-container">
        <div className="map-placeholder">
          🗺️ Interactive map showing real-time vehicle locations
          <div className="map-controls">
            <button className="map-btn">🚛 Road Vehicles</button>
            <button className="map-btn">🚄 Rail</button>
            <button className="map-btn">📍 Waypoints</button>
            <button className="map-btn">🏭 Warehouses</button>
          </div>
        </div>
        
        <div className="tracking-sidebar">
          <h3>Active Vehicles</h3>
          {drivers.filter(d => d.status === 'on-duty' || d.status === 'en-route').map(driver => (
            <div key={driver.id} className="tracking-item">
              <div className="tracking-header">
                <span className="driver-name">{driver.name}</span>
                <span className={`vehicle-type ${driver.type}`}>
                  {driver.type === 'rail' ? '🚄' : '🚛'}
                </span>
              </div>
              <div className="tracking-details">
                <div className="tracking-stat">
                  <span>Location</span>
                  <span>{driver.location}</span>
                </div>
                <div className="tracking-stat">
                  <span>Status</span>
                  <span className={`status-badge ${driver.status}`}>{driver.status}</span>
                </div>
                <div className="tracking-stat">
                  <span>Fuel</span>
                  <span className={`fuel-level ${driver.fuelLevel < 30 ? 'low' : driver.fuelLevel < 60 ? 'medium' : 'high'}`}>
                    {driver.fuelLevel}%
                  </span>
                </div>
              </div>
              <div className="tracking-actions">
                <button className="btn-action btn-contact">📞</button>
                <button className="btn-action btn-navigate">🧭</button>
                <button className="btn-action btn-details">ℹ️</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderWarehouses = () => (
    <div>
      <div className="section-header">
        <h2 className="section-title">Warehouse Operations</h2>
        <div className="table-actions">
          <button className="btn-primary">➕ Add Warehouse</button>
          <button className="btn-secondary">📊 Analytics</button>
        </div>
      </div>
      
      <div className="warehouses-grid">
        {warehouses.map(warehouse => (
          <div key={warehouse.id} className="warehouse-detail-card">
            <div className="warehouse-header">
              <h3>{warehouse.name}</h3>
              <span className="warehouse-id">WH-{warehouse.id.toString().padStart(3, '0')}</span>
            </div>
            <div className="warehouse-location">
              📍 {warehouse.location}
            </div>
            
            <div className="warehouse-metrics-detailed">
              <div className="metric-item">
                <span className="metric-label">Capacity Utilization</span>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${warehouse.utilizationRate}%` }}></div>
                </div>
                <span className="metric-value">{warehouse.utilizationRate}%</span>
              </div>
              
              <div className="metric-row">
                <div className="metric-item">
                  <span className="metric-label">Current Stock</span>
                  <span className="metric-value">{warehouse.current.toLocaleString()} units</span>
                </div>
                <div className="metric-item">
                  <span className="metric-label">Max Capacity</span>
                  <span className="metric-value">{warehouse.capacity.toLocaleString()} units</span>
                </div>
              </div>
              
              <div className="metric-row">
                <div className="metric-item">
                  <span className="metric-label">Temperature</span>
                  <span className="metric-value">{warehouse.temperature}°C</span>
                </div>
                <div className="metric-item">
                  <span className="metric-label">Humidity</span>
                  <span className="metric-value">{warehouse.humidity}% RH</span>
                </div>
              </div>
            </div>
            
            <div className="warehouse-actions">
              <button className="btn-action btn-view">👁️ Details</button>
              <button className="btn-action btn-inventory">📋 Inventory</button>
              <button className="btn-action btn-reports">📊 Reports</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderInventory = () => (
    <div>
      <div className="section-header">
        <h2 className="section-title">Inventory Management</h2>
        <div className="table-actions">
          <button className="btn-primary">➕ Add Product</button>
          <button className="btn-secondary">🔄 Bulk Update</button>
        </div>
      </div>
      
      <div className="inventory-stats">
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon">📦</div>
          </div>
          <div className="stat-body">
            <h3>{inventory.reduce((sum, item) => sum + item.stock, 0).toLocaleString()}</h3>
            <p>Total Items</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon">⚠️</div>
          </div>
          <div className="stat-body">
            <h3>{inventory.filter(item => item.stock <= item.reorderLevel).length}</h3>
            <p>Low Stock Alerts</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon">🔄</div>
          </div>
          <div className="stat-body">
            <h3>{stats.inventoryTurnover}x</h3>
            <p>Inventory Turnover</p>
          </div>
        </div>
      </div>
      
      <div className="inventory-table">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Current Stock</th>
              <th>Reorder Level</th>
              <th>Location</th>
              <th>Status</th>
              <th>Last Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map(item => (
              <tr key={item.id}>
                <td>
                  <div className="product-info">
                    <strong>{item.product}</strong>
                  </div>
                </td>
                <td>{item.category}</td>
                <td>
                  <span className={`stock-level ${item.stock <= item.reorderLevel ? 'low' : 'normal'}`}>
                    {item.stock.toLocaleString()}
                  </span>
                </td>
                <td>{item.reorderLevel}</td>
                <td>{item.location}</td>
                <td>
                  <span className={`status-badge ${item.stock <= item.reorderLevel ? 'warning' : 'success'}`}>
                    {item.stock <= item.reorderLevel ? 'Low Stock' : 'In Stock'}
                  </span>
                </td>
                <td>{item.lastUpdated}</td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-action btn-edit" title="Edit">✏️</button>
                    <button className="btn-action btn-reorder" title="Reorder">🔄</button>
                    <button className="btn-action btn-move" title="Move">📦</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderDrivers = () => {
    const filteredDrivers = drivers.filter(driver => {
      const matchesSearch = driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           driver.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           driver.type.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || driver.status === filterStatus;
      return matchesSearch && matchesStatus;
    });

    return (
      <div>
        <div className="section-header">
          <h2 className="section-title">Fleet & Driver Management</h2>
          <div className="table-actions">
            <button className="btn-primary">
              ➕ Add Vehicle
            </button>
            <button className="btn-secondary">
              📊 Fleet Analytics
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
              <h3>{stats.totalVehicles}</h3>
              <p>Total Fleet</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon">👨‍💼</div>
              <div className="stat-trend up">↗️ +1</div>
            </div>
            <div className="stat-body">
              <h3>{stats.totalDrivers}</h3>
              <p>Active Drivers</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon">✅</div>
              <div className="stat-trend up">↗️ 95%</div>
            </div>
            <div className="stat-body">
              <h3>{drivers.filter(d => d.status === 'on-duty' || d.status === 'en-route').length}</h3>
              <p>Vehicles On Duty</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon">�</div>
              <div className="stat-trend up">↗️ 2</div>
            </div>
            <div className="stat-body">
              <h3>{drivers.filter(d => d.type === 'rail').length}</h3>
              <p>Rail Operators</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon">⛽</div>
              <div className="stat-trend up">↗️ 85%</div>
            </div>
            <div className="stat-body">
              <h3>{Math.round(drivers.reduce((sum, d) => sum + d.fuelLevel, 0) / drivers.length)}%</h3>
              <p>Avg Fuel Level</p>
            </div>
          </div>
        </div>

        <div className="filter-section">
          <div className="search-filter-bar">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search drivers, vehicles, or type..."
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
                <option value="all">All Types & Status</option>
                <option value="road">Road Vehicles</option>
                <option value="rail">Rail Vehicles</option>
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
            <h3 className="section-title">Fleet Overview ({filteredDrivers.length})</h3>
            <div className="table-actions">
              <button className="btn-secondary">
                📋 Export Fleet Data
              </button>
            </div>
          </div>
          
          <div className="table-container">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Driver/Operator</th>
                  <th>License</th>
                  <th>Vehicle/Engine</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Location</th>
                  <th>Fuel Level</th>
                  <th>Rating</th>
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
                    <td>
                      <div className="vehicle-info">
                        <div className="vehicle-name">{driver.vehicle}</div>
                        <div className="maintenance-info">
                          Last service: {driver.lastMaintenance}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`transport-badge ${driver.type}`}>
                        {driver.type === 'rail' ? '🚄' : '🚛'} {driver.type.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${driver.status === 'on-duty' ? 'in-transit' : 
                        driver.status === 'en-route' ? 'in-transit' :
                        driver.status === 'available' ? 'delivered' : 
                        driver.status === 'scheduled' ? 'pending' : 'pending'}`}>
                        {driver.status.replace('-', ' ')}
                      </span>
                    </td>
                    <td>{driver.location}</td>
                    <td>
                      <div className="fuel-indicator">
                        <div className={`fuel-bar ${driver.fuelLevel < 30 ? 'low' : driver.fuelLevel < 60 ? 'medium' : 'high'}`}>
                          <div className="fuel-fill" style={{ width: `${driver.fuelLevel}%` }}></div>
                        </div>
                        <span className="fuel-percentage">{driver.fuelLevel}%</span>
                      </div>
                    </td>
                    <td>
                      <div className="rating">
                        ⭐ {driver.rating}
                      </div>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn-action btn-view" title="View Details">
                          👁️
                        </button>
                        <button className="btn-action btn-contact" title="Contact">
                          📞
                        </button>
                        <button className="btn-action btn-track" title="Track">
                          📍
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
                           order.trackingCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           order.transport.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           order.id.toString().includes(searchTerm);
      const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
      return matchesSearch && matchesStatus;
    });

    return (
      <div>
        <div className="section-header">
          <h2 className="section-title">Shipment Management</h2>
          <div className="table-actions">
            <button className="btn-primary">
              ➕ New Shipment
            </button>
            <button className="btn-secondary">
              🔄 Batch Processing
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
              <div className="stat-icon">💰</div>
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
                placeholder="Search shipments, tracking codes, customers..."
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
            <h3 className="section-title">Shipment Tracking ({filteredOrders.length})</h3>
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
                  <th>Shipment ID</th>
                  <th>Customer</th>
                  <th>Route</th>
                  <th>Transport</th>
                  <th>Status</th>
                  <th>Weight</th>
                  <th>Driver/Operator</th>
                  <th>Tracking</th>
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
                        <small>{order.estimatedTime}</small>
                      </div>
                    </td>
                    <td>
                      <span className={`transport-badge ${order.transport}`}>
                        {order.transport === 'rail' ? '🚄' : '🚛'} {order.transport.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${order.status}`}>
                        {order.status.replace('-', ' ')}
                      </span>
                    </td>
                    <td>
                      <div className="weight-info">
                        {order.weight}t
                      </div>
                    </td>
                    <td>{order.driver || 'Unassigned'}</td>
                    <td>
                      <div className="tracking-code">
                        <code>{order.trackingCode}</code>
                      </div>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn-action btn-view" title="View Details">
                          👁️
                        </button>
                        <button className="btn-action btn-edit" title="Edit Shipment">
                          ✏️
                        </button>
                        <button className="btn-action btn-track" title="Track Live">
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
    switch(activeTab) {
      case 'analytics':
        return renderAnalytics();
      case 'drivers':
        return renderDrivers();
      case 'routes':
        return renderRoutes();
      case 'tracking':
        return renderTracking();
      case 'orders':
        return renderOrders();
      case 'warehouses':
        return renderWarehouses();
      case 'inventory':
        return renderInventory();
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