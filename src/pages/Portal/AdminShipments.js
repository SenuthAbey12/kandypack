import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AdminDashboard.css';

const AdminShipments = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // State management
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showCreateShipment, setShowCreateShipment] = useState(false);
  const [shipmentFilter, setShipmentFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Sample shipments data
  const [shipments] = useState([
    {
      id: 'SH-001248',
      customer: 'KandyMart Pvt Ltd',
      origin: 'Colombo Warehouse',
      destination: 'Colombo 03',
      transportMode: 'road',
      status: 'delivered',
      driver: 'John Silva',
      vehicle: 'CAF-1122',
      amount: 12500,
      weight: '850 kg',
      items: 45,
      createdDate: '2024-01-15',
      deliveryDate: '2024-01-16',
      priority: 'standard'
    },
    {
      id: 'SH-001247',
      customer: 'Tech Solutions',
      origin: 'Kandy Distribution Center',
      destination: 'Kandy',
      transportMode: 'road',
      status: 'in-transit',
      driver: 'Mike Fernando',
      vehicle: 'CAF-1123',
      amount: 8900,
      weight: '450 kg',
      items: 23,
      createdDate: '2024-01-15',
      deliveryDate: '2024-01-17',
      priority: 'high'
    },
    {
      id: 'SH-001246',
      customer: 'Green Store',
      origin: 'Colombo Warehouse',
      destination: 'Galle',
      transportMode: 'road',
      status: 'pending',
      driver: null,
      vehicle: null,
      amount: 6750,
      weight: '320 kg',
      items: 18,
      createdDate: '2024-01-16',
      deliveryDate: '2024-01-18',
      priority: 'standard'
    },
    {
      id: 'SH-001245',
      customer: 'Industrial Corp',
      origin: 'Colombo Railway Station',
      destination: 'Jaffna',
      transportMode: 'rail',
      status: 'in-transit',
      driver: 'Railway Operator',
      vehicle: 'TE-002',
      amount: 22100,
      weight: '2500 kg',
      items: 156,
      createdDate: '2024-01-14',
      deliveryDate: '2024-01-17',
      priority: 'high'
    },
    {
      id: 'SH-001244',
      customer: 'Book World',
      origin: 'Galle Port Facility',
      destination: 'Matara',
      transportMode: 'road',
      status: 'delivered',
      driver: 'Sarah Perera',
      vehicle: 'CAF-1124',
      amount: 4800,
      weight: '180 kg',
      items: 67,
      createdDate: '2024-01-13',
      deliveryDate: '2024-01-14',
      priority: 'standard'
    }
  ]);

  // Navigation handler
  const handleNavigation = (tab) => {
    navigate(`/employee/admin/${tab}`);
    setSidebarOpen(false);
  };

  // Get active tab
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

  // Filter shipments
  const getFilteredShipments = () => {
    let filtered = shipments;
    
    if (shipmentFilter !== 'all') {
      filtered = filtered.filter(shipment => shipment.status === shipmentFilter);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(shipment => 
        shipment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shipment.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shipment.destination.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'delivered': return 'status-badge delivered';
      case 'in-transit': return 'status-badge in-transit';
      case 'pending': return 'status-badge pending';
      case 'cancelled': return 'status-badge cancelled';
      default: return 'status-badge';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered': return '✅';
      case 'in-transit': return '🚛';
      case 'pending': return '⏳';
      case 'cancelled': return '❌';
      default: return '📦';
    }
  };

  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case 'high': return 'priority-badge high';
      case 'standard': return 'priority-badge standard';
      case 'low': return 'priority-badge low';
      default: return 'priority-badge';
    }
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
            </button>
            
            <button 
              className={`nav-item ${activeTab === 'routes' ? 'active' : ''}`}
              onClick={() => handleNavigation('routes')}
            >
              <span className="nav-item-icon">🛤️</span>
              <span className="nav-item-text">Routes & Scheduling</span>
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
            </button>
            
            <button 
              className={`nav-item ${activeTab === 'warehouses' ? 'active' : ''}`}
              onClick={() => handleNavigation('warehouses')}
            >
              <span className="nav-item-icon">🏭</span>
              <span className="nav-item-text">Warehouses</span>
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
          <h1 className="header-title">Shipment Management</h1>
          <p className="header-subtitle">
            Track and manage all shipments across rail and road networks
          </p>
        </div>
      </div>
      
      <div className="header-right">
        <button 
          className="btn-primary"
          onClick={() => setShowCreateShipment(true)}
        >
          ➕ Create Shipment
        </button>
      </div>
    </div>
  );

  const renderFilters = () => (
    <div className="filters-section">
      <div className="filter-group">
        <label>Status Filter:</label>
        <select 
          value={shipmentFilter} 
          onChange={(e) => setShipmentFilter(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="in-transit">In Transit</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
      
      <div className="filter-group">
        <label>Search:</label>
        <input
          type="text"
          placeholder="Search by ID, customer, or destination..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="filter-input"
        />
      </div>
    </div>
  );

  const renderShipmentsTable = () => {
    const filteredShipments = getFilteredShipments();

    return (
      <div className="shipments-table-container">
        <table className="shipments-table">
          <thead>
            <tr>
              <th>Shipment ID</th>
              <th>Customer</th>
              <th>Route</th>
              <th>Transport</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Driver/Operator</th>
              <th>Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredShipments.map(shipment => (
              <tr key={shipment.id}>
                <td className="shipment-id">{shipment.id}</td>
                <td>
                  <div className="customer-info">
                    <div className="customer-name">{shipment.customer}</div>
                    <div className="shipment-details">
                      {shipment.items} items • {shipment.weight}
                    </div>
                  </div>
                </td>
                <td>
                  <div className="route-info">
                    <div className="route-path">{shipment.origin} → {shipment.destination}</div>
                    <div className="route-dates">
                      Created: {shipment.createdDate} | ETA: {shipment.deliveryDate}
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`transport-badge ${shipment.transportMode}`}>
                    {shipment.transportMode === 'rail' ? '🚄' : '🚛'} 
                    {shipment.transportMode}
                  </span>
                </td>
                <td>
                  <span className={getStatusBadgeClass(shipment.status)}>
                    {getStatusIcon(shipment.status)} {shipment.status}
                  </span>
                </td>
                <td>
                  <span className={getPriorityBadgeClass(shipment.priority)}>
                    {shipment.priority}
                  </span>
                </td>
                <td>
                  <div className="driver-info">
                    <div className="driver-name">{shipment.driver || 'Unassigned'}</div>
                    <div className="vehicle-id">{shipment.vehicle || 'No vehicle'}</div>
                  </div>
                </td>
                <td className="amount">Rs. {shipment.amount.toLocaleString()}</td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-action view" title="View Details">👁️</button>
                    <button className="btn-action edit" title="Edit">✏️</button>
                    <button className="btn-action track" title="Track">📍</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderCreateShipmentModal = () => {
    if (!showCreateShipment) return null;

    return (
      <div className="modal-overlay" onClick={() => setShowCreateShipment(false)}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h3>Create New Shipment</h3>
            <button className="modal-close" onClick={() => setShowCreateShipment(false)}>×</button>
          </div>
          
          <div className="modal-body">
            <form className="shipment-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Customer</label>
                  <select className="form-control">
                    <option>Select Customer</option>
                    <option>KandyMart Pvt Ltd</option>
                    <option>Tech Solutions</option>
                    <option>Green Store</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Transport Mode</label>
                  <select className="form-control">
                    <option>Road Transport</option>
                    <option>Rail Transport</option>
                    <option>Mixed Transport</option>
                  </select>
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Origin</label>
                  <select className="form-control">
                    <option>Colombo Warehouse</option>
                    <option>Kandy Distribution Center</option>
                    <option>Galle Port Facility</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Destination</label>
                  <input type="text" className="form-control" placeholder="Enter destination address" />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Priority</label>
                  <select className="form-control">
                    <option>Standard</option>
                    <option>High</option>
                    <option>Low</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Expected Delivery Date</label>
                  <input type="date" className="form-control" />
                </div>
              </div>
              
              <div className="form-group">
                <label>Special Instructions</label>
                <textarea className="form-control" rows="3" placeholder="Enter any special handling instructions..."></textarea>
              </div>
            </form>
          </div>
          
          <div className="modal-footer">
            <button className="btn-secondary" onClick={() => setShowCreateShipment(false)}>Cancel</button>
            <button className="btn-primary">Create Shipment</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="dashboard-container">
      {renderSidebar()}
      
      <div className="dashboard-main">
        {renderHeader()}
        
        <div className="dashboard-content">
          {renderFilters()}
          {renderShipmentsTable()}
        </div>
      </div>
      
      {renderCreateShipmentModal()}
    </div>
  );
};

export default AdminShipments;