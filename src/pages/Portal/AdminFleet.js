import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import './AdminDashboard.css';

const AdminFleet = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  
  const [activeTab, setActiveTab] = useState('vehicles');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVehicleType, setSelectedVehicleType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);
  const [showDriverModal, setShowDriverModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState(null);

  // Fleet data
  const [vehicles, setVehicles] = useState([
    { id: 1, vehicleNumber: 'CAB-1234', type: 'Lorry', model: 'Tata 1613', capacity: '10 tons', status: 'active', driver: 'Nimal Silva', location: 'Colombo 03', fuelLevel: 85, mileage: 125000, lastService: '2024-01-15', nextService: '2024-04-15', insurance: '2024-12-30' },
    { id: 2, vehicleNumber: 'CAC-5678', type: 'Van', model: 'Isuzu D-Max', capacity: '2 tons', status: 'active', driver: 'Sunil Perera', location: 'Kandy', fuelLevel: 60, mileage: 89000, lastService: '2024-01-10', nextService: '2024-04-10', insurance: '2024-11-15' },
    { id: 3, vehicleNumber: 'CAE-9101', type: 'Truck', model: 'Volvo FH16', capacity: '25 tons', status: 'maintenance', driver: null, location: 'Service Center', fuelLevel: 95, mileage: 98000, lastService: '2024-01-20', nextService: '2024-04-20', insurance: '2025-02-28' },
    { id: 4, vehicleNumber: 'CAF-1122', type: 'Van', model: 'Toyota Hiace', capacity: '1.5 tons', status: 'available', driver: null, location: 'Depot', fuelLevel: 40, mileage: 67000, lastService: '2024-01-08', nextService: '2024-04-08', insurance: '2024-10-12' },
    { id: 5, vehicleNumber: 'CAH-3344', type: 'Lorry', model: 'Ashok Leyland', capacity: '15 tons', status: 'active', driver: 'Chaminda Perera', location: 'Galle', fuelLevel: 70, mileage: 145000, lastService: '2024-01-18', nextService: '2024-04-18', insurance: '2024-09-20' },
    { id: 6, vehicleNumber: 'TE-001', type: 'Train Engine', model: 'Diesel Electric', capacity: '500 tons', status: 'scheduled', driver: 'Pradeep Jayawardene', location: 'Colombo Fort Station', fuelLevel: 90, mileage: 450000, lastService: '2024-01-22', nextService: '2024-07-22', insurance: '2025-06-30' },
    { id: 7, vehicleNumber: 'TE-002', type: 'Train Engine', model: 'Electric', capacity: '400 tons', status: 'active', driver: 'Anil Gunasekara', location: 'Kandy Station', fuelLevel: 75, mileage: 380000, lastService: '2024-01-19', nextService: '2024-07-19', insurance: '2025-03-15' }
  ]);

  const [drivers, setDrivers] = useState([
    { id: 1, name: 'Nimal Silva', license: 'DL12345', vehicleAssigned: 'CAB-1234', type: 'road', status: 'on-duty', location: 'Colombo 03', rating: 4.9, totalOrders: 245, experience: '8 years', phone: '+94771234567', email: 'nimal@kandypack.lk' },
    { id: 2, name: 'Sunil Perera', license: 'DL67890', vehicleAssigned: 'CAC-5678', type: 'road', status: 'en-route', location: 'Kandy', rating: 4.7, totalOrders: 198, experience: '6 years', phone: '+94772345678', email: 'sunil@kandypack.lk' },
    { id: 3, name: 'Kamal Fernando', license: 'DL11223', vehicleAssigned: null, type: 'road', status: 'available', location: 'Depot', rating: 4.8, totalOrders: 312, experience: '12 years', phone: '+94773456789', email: 'kamal@kandypack.lk' },
    { id: 4, name: 'Ravi Mendis', license: 'DL44556', vehicleAssigned: null, type: 'road', status: 'off-duty', location: 'Home', rating: 4.6, totalOrders: 167, experience: '4 years', phone: '+94774567890', email: 'ravi@kandypack.lk' },
    { id: 5, name: 'Chaminda Perera', license: 'DL77889', vehicleAssigned: 'CAH-3344', type: 'road', status: 'on-duty', location: 'Galle', rating: 4.5, totalOrders: 203, experience: '7 years', phone: '+94775678901', email: 'chaminda@kandypack.lk' },
    { id: 6, name: 'Pradeep Jayawardene', license: 'RL55443', vehicleAssigned: 'TE-001', type: 'rail', status: 'scheduled', location: 'Colombo Fort Station', rating: 4.9, totalOrders: 89, experience: '15 years', phone: '+94776789012', email: 'pradeep@kandypack.lk' },
    { id: 7, name: 'Anil Gunasekara', license: 'RL66778', vehicleAssigned: 'TE-002', type: 'rail', status: 'en-route', location: 'Kandy Station', rating: 4.8, totalOrders: 76, experience: '11 years', phone: '+94777890123', email: 'anil@kandypack.lk' },
    { id: 8, name: 'Dinesh Colombage', license: 'DL99887', vehicleAssigned: null, type: 'road', status: 'available', location: 'Depot', rating: 4.4, totalOrders: 145, experience: '5 years', phone: '+94778901234', email: 'dinesh@kandypack.lk' }
  ]);

  // Filter functions
  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (vehicle.driver && vehicle.driver.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = selectedVehicleType === 'all' || vehicle.type.toLowerCase() === selectedVehicleType;
    const matchesStatus = selectedStatus === 'all' || vehicle.status === selectedStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const filteredDrivers = drivers.filter(driver => {
    const matchesSearch = driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         driver.license.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (driver.vehicleAssigned && driver.vehicleAssigned.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = selectedVehicleType === 'all' || driver.type === selectedVehicleType;
    const matchesStatus = selectedStatus === 'all' || driver.status === selectedStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
      case 'on-duty':
      case 'scheduled':
        return '#10b981';
      case 'available':
        return '#3b82f6';
      case 'en-route':
        return '#f59e0b';
      case 'maintenance':
      case 'off-duty':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getFuelLevelColor = (level) => {
    if (level >= 70) return '#10b981';
    if (level >= 30) return '#f59e0b';
    return '#ef4444';
  };

  const handleVehicleClick = (vehicle) => {
    setSelectedVehicle(vehicle);
  };

  const handleDriverClick = (driver) => {
    setSelectedDriver(driver);
    setShowDriverModal(true);
  };

  const renderVehicleCard = (vehicle) => (
    <div 
      key={vehicle.id} 
      className="fleet-card"
      onClick={() => handleVehicleClick(vehicle)}
    >
      <div className="fleet-card-header">
        <div className="vehicle-info">
          <h3>{vehicle.vehicleNumber}</h3>
          <p className="vehicle-model">{vehicle.model}</p>
        </div>
        <div 
          className="status-badge"
          style={{ backgroundColor: getStatusColor(vehicle.status) }}
        >
          {vehicle.status}
        </div>
      </div>
      
      <div className="fleet-card-details">
        <div className="detail-row">
          <span className="detail-label">Type:</span>
          <span className="detail-value">{vehicle.type}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Capacity:</span>
          <span className="detail-value">{vehicle.capacity}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Driver:</span>
          <span className="detail-value">{vehicle.driver || 'Unassigned'}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Location:</span>
          <span className="detail-value">{vehicle.location}</span>
        </div>
      </div>
      
      <div className="fleet-card-footer">
        <div className="fuel-info">
          <span className="fuel-label">Fuel:</span>
          <div className="fuel-bar">
            <div 
              className="fuel-fill"
              style={{ 
                width: `${vehicle.fuelLevel}%`,
                backgroundColor: getFuelLevelColor(vehicle.fuelLevel)
              }}
            ></div>
          </div>
          <span className="fuel-value">{vehicle.fuelLevel}%</span>
        </div>
      </div>
    </div>
  );

  const renderDriverCard = (driver) => (
    <div 
      key={driver.id} 
      className="fleet-card"
      onClick={() => handleDriverClick(driver)}
    >
      <div className="fleet-card-header">
        <div className="vehicle-info">
          <h3>{driver.name}</h3>
          <p className="vehicle-model">{driver.license}</p>
        </div>
        <div 
          className="status-badge"
          style={{ backgroundColor: getStatusColor(driver.status) }}
        >
          {driver.status}
        </div>
      </div>
      
      <div className="fleet-card-details">
        <div className="detail-row">
          <span className="detail-label">Type:</span>
          <span className="detail-value">{driver.type}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Vehicle:</span>
          <span className="detail-value">{driver.vehicleAssigned || 'Unassigned'}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Rating:</span>
          <span className="detail-value">⭐ {driver.rating}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Experience:</span>
          <span className="detail-value">{driver.experience}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Total Orders:</span>
          <span className="detail-value">{driver.totalOrders}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="admin-content" data-theme={theme}>
      {/* Header */}
      <div className="content-header">
        <div className="header-left">
          <button 
            className="back-button"
            onClick={() => navigate('/employee/admin')}
          >
            ← Back to Dashboard
          </button>
          <div className="page-title">
            <h1>Fleet Management</h1>
            <p>Manage vehicles, drivers, and fleet operations</p>
          </div>
        </div>
        <div className="header-actions">
          <button 
            className="primary-button"
            onClick={() => setShowAddVehicleModal(true)}
          >
            + Add Vehicle
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-container">
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'vehicles' ? 'active' : ''}`}
            onClick={() => setActiveTab('vehicles')}
          >
            Vehicles ({vehicles.length})
          </button>
          <button 
            className={`tab ${activeTab === 'drivers' ? 'active' : ''}`}
            onClick={() => setActiveTab('drivers')}
          >
            Drivers ({drivers.length})
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-box">
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-group">
          <select
            value={selectedVehicleType}
            onChange={(e) => setSelectedVehicleType(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Types</option>
            <option value="road">Road</option>
            <option value="rail">Rail</option>
          </select>
          
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="available">Available</option>
            <option value="maintenance">Maintenance</option>
            <option value="on-duty">On Duty</option>
            <option value="off-duty">Off Duty</option>
          </select>
        </div>
      </div>

      {/* Content */}
      <div className="fleet-grid">
        {activeTab === 'vehicles' ? (
          filteredVehicles.length > 0 ? (
            filteredVehicles.map(renderVehicleCard)
          ) : (
            <div className="empty-state">
              <p>No vehicles found matching your criteria</p>
            </div>
          )
        ) : (
          filteredDrivers.length > 0 ? (
            filteredDrivers.map(renderDriverCard)
          ) : (
            <div className="empty-state">
              <p>No drivers found matching your criteria</p>
            </div>
          )
        )}
      </div>

      {/* Vehicle Detail Modal */}
      {selectedVehicle && (
        <div className="modal-overlay" onClick={() => setSelectedVehicle(null)}>
          <div className="modal fleet-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Vehicle Details - {selectedVehicle.vehicleNumber}</h2>
              <button 
                className="modal-close"
                onClick={() => setSelectedVehicle(null)}
              >
                ×
              </button>
            </div>
            <div className="modal-content">
              <div className="vehicle-detail-grid">
                <div className="detail-section">
                  <h4>Basic Information</h4>
                  <div className="detail-list">
                    <div className="detail-item">
                      <span className="detail-label">Vehicle Number:</span>
                      <span className="detail-value">{selectedVehicle.vehicleNumber}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Type:</span>
                      <span className="detail-value">{selectedVehicle.type}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Model:</span>
                      <span className="detail-value">{selectedVehicle.model}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Capacity:</span>
                      <span className="detail-value">{selectedVehicle.capacity}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Status:</span>
                      <span 
                        className="detail-value"
                        style={{ color: getStatusColor(selectedVehicle.status) }}
                      >
                        {selectedVehicle.status}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="detail-section">
                  <h4>Current Assignment</h4>
                  <div className="detail-list">
                    <div className="detail-item">
                      <span className="detail-label">Driver:</span>
                      <span className="detail-value">{selectedVehicle.driver || 'Unassigned'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Current Location:</span>
                      <span className="detail-value">{selectedVehicle.location}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Fuel Level:</span>
                      <span className="detail-value">{selectedVehicle.fuelLevel}%</span>
                    </div>
                  </div>
                </div>
                
                <div className="detail-section">
                  <h4>Maintenance Information</h4>
                  <div className="detail-list">
                    <div className="detail-item">
                      <span className="detail-label">Mileage:</span>
                      <span className="detail-value">{selectedVehicle.mileage.toLocaleString()} km</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Last Service:</span>
                      <span className="detail-value">{selectedVehicle.lastService}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Next Service:</span>
                      <span className="detail-value">{selectedVehicle.nextService}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Insurance Expiry:</span>
                      <span className="detail-value">{selectedVehicle.insurance}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="secondary-button"
                onClick={() => setSelectedVehicle(null)}
              >
                Close
              </button>
              <button className="primary-button">
                Edit Vehicle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Driver Detail Modal */}
      {showDriverModal && selectedDriver && (
        <div className="modal-overlay" onClick={() => setShowDriverModal(false)}>
          <div className="modal fleet-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Driver Details - {selectedDriver.name}</h2>
              <button 
                className="modal-close"
                onClick={() => setShowDriverModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-content">
              <div className="vehicle-detail-grid">
                <div className="detail-section">
                  <h4>Personal Information</h4>
                  <div className="detail-list">
                    <div className="detail-item">
                      <span className="detail-label">Name:</span>
                      <span className="detail-value">{selectedDriver.name}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">License:</span>
                      <span className="detail-value">{selectedDriver.license}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Phone:</span>
                      <span className="detail-value">{selectedDriver.phone}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Email:</span>
                      <span className="detail-value">{selectedDriver.email}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Experience:</span>
                      <span className="detail-value">{selectedDriver.experience}</span>
                    </div>
                  </div>
                </div>
                
                <div className="detail-section">
                  <h4>Work Information</h4>
                  <div className="detail-list">
                    <div className="detail-item">
                      <span className="detail-label">Type:</span>
                      <span className="detail-value">{selectedDriver.type}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Status:</span>
                      <span 
                        className="detail-value"
                        style={{ color: getStatusColor(selectedDriver.status) }}
                      >
                        {selectedDriver.status}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Vehicle Assigned:</span>
                      <span className="detail-value">{selectedDriver.vehicleAssigned || 'Unassigned'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Current Location:</span>
                      <span className="detail-value">{selectedDriver.location}</span>
                    </div>
                  </div>
                </div>
                
                <div className="detail-section">
                  <h4>Performance</h4>
                  <div className="detail-list">
                    <div className="detail-item">
                      <span className="detail-label">Rating:</span>
                      <span className="detail-value">⭐ {selectedDriver.rating}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Total Orders:</span>
                      <span className="detail-value">{selectedDriver.totalOrders}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="secondary-button"
                onClick={() => setShowDriverModal(false)}
              >
                Close
              </button>
              <button className="primary-button">
                Edit Driver
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Vehicle Modal */}
      {showAddVehicleModal && (
        <div className="modal-overlay" onClick={() => setShowAddVehicleModal(false)}>
          <div className="modal fleet-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Vehicle</h2>
              <button 
                className="modal-close"
                onClick={() => setShowAddVehicleModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-content">
              <form className="vehicle-form" onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const newVehicle = {
                  id: vehicles.length + 1,
                  vehicleNumber: formData.get('vehicleNumber'),
                  type: formData.get('type'),
                  model: formData.get('model'),
                  capacity: formData.get('capacity'),
                  status: 'available',
                  driver: null,
                  location: 'Depot',
                  fuelLevel: 100,
                  mileage: 0,
                  lastService: new Date().toISOString().split('T')[0],
                  nextService: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                  insurance: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
                };
                setVehicles([...vehicles, newVehicle]);
                setShowAddVehicleModal(false);
                e.target.reset();
              }}>
                <div className="form-group">
                  <label>Vehicle Number</label>
                  <input 
                    type="text" 
                    name="vehicleNumber"
                    placeholder="e.g., CAB-1234" 
                    required 
                  />
                </div>
                
                <div className="form-group">
                  <label>Vehicle Type</label>
                  <select name="type" required>
                    <option value="">Select Type</option>
                    <option value="Lorry">Lorry</option>
                    <option value="Van">Van</option>
                    <option value="Truck">Truck</option>
                    <option value="Train Engine">Train Engine</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Model</label>
                  <input 
                    type="text" 
                    name="model"
                    placeholder="e.g., Tata 1613" 
                    required 
                  />
                </div>
                
                <div className="form-group">
                  <label>Capacity</label>
                  <input 
                    type="text" 
                    name="capacity"
                    placeholder="e.g., 10 tons" 
                    required 
                  />
                </div>

                <div className="modal-footer">
                  <button 
                    type="button"
                    className="secondary-button"
                    onClick={() => setShowAddVehicleModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="primary-button">
                    Add Vehicle
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFleet;