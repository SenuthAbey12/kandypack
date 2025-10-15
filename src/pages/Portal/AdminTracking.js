import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import './AdminDashboard.css';

const AdminTracking = () => {
  const { user } = useAuth();
  const { theme } = useTheme();

  const [drivers] = useState([
    { id: 1, name: 'Nimal Silva', vehicle: 'Lorry - CAB-1234', type: 'road', status: 'on-duty', location: 'Colombo 03', lat: 6.9271, lng: 79.8612, fuelLevel: 85, speed: 45, destination: 'Kandy' },
    { id: 2, name: 'Sunil Perera', vehicle: 'Van - CAC-5678', type: 'road', status: 'en-route', location: 'Kandy', lat: 7.2906, lng: 80.6337, fuelLevel: 60, speed: 55, destination: 'Colombo' },
    { id: 3, name: 'Kamal Fernando', vehicle: 'Truck - CAE-9101', type: 'road', status: 'available', location: 'Depot', lat: 6.9319, lng: 79.8478, fuelLevel: 95, speed: 0, destination: 'Standby' },
    { id: 4, name: 'Pradeep Jayawardene', vehicle: 'Train Engine - TE-001', type: 'rail', status: 'en-route', location: 'Kandy Station', lat: 7.2906, lng: 80.6337, fuelLevel: 90, speed: 65, destination: 'Colombo Fort' },
    { id: 5, name: 'Anil Gunasekara', vehicle: 'Train Engine - TE-002', type: 'rail', status: 'scheduled', location: 'Colombo Fort Station', lat: 6.9319, lng: 79.8478, fuelLevel: 75, speed: 0, destination: 'Batticaloa' }
  ]);

  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [mapView, setMapView] = useState('all'); // all, road, rail

  const renderTrackingStats = () => (
    <div className="stats-grid" style={{ marginBottom: '24px' }}>
      <div className="stat-card">
        <div className="stat-header">
          <div className="stat-icon">🚗</div>
          <div className="stat-trend up">↗️ Online</div>
        </div>
        <div className="stat-body">
          <h3>{drivers.filter(d => d.status === 'on-duty' || d.status === 'en-route').length}</h3>
          <p>Active Vehicles</p>
        </div>
      </div>
      
      <div className="stat-card">
        <div className="stat-header">
          <div className="stat-icon">🚛</div>
          <div className="stat-trend up">↗️ Moving</div>
        </div>
        <div className="stat-body">
          <h3>{drivers.filter(d => d.type === 'road' && d.speed > 0).length}</h3>
          <p>Road Vehicles</p>
        </div>
      </div>
      
      <div className="stat-card">
        <div className="stat-header">
          <div className="stat-icon">🚄</div>
          <div className="stat-trend up">↗️ Running</div>
        </div>
        <div className="stat-body">
          <h3>{drivers.filter(d => d.type === 'rail' && d.speed > 0).length}</h3>
          <p>Rail Vehicles</p>
        </div>
      </div>
      
      <div className="stat-card">
        <div className="stat-header">
          <div className="stat-icon">⛽</div>
          <div className="stat-trend down">↘️ Alert</div>
        </div>
        <div className="stat-body">
          <h3>{drivers.filter(d => d.fuelLevel < 30).length}</h3>
          <p>Low Fuel Alerts</p>
        </div>
      </div>
    </div>
  );

  const renderMapContainer = () => (
    <div className="tracking-container">
      <div className="map-placeholder">
        🗺️ Interactive Real-Time Tracking Map
        <div className="map-controls">
          <button 
            className={`map-btn ${mapView === 'all' ? 'active' : ''}`}
            onClick={() => setMapView('all')}
          >
            🌍 All Vehicles
          </button>
          <button 
            className={`map-btn ${mapView === 'road' ? 'active' : ''}`}
            onClick={() => setMapView('road')}
          >
            🚛 Road Vehicles
          </button>
          <button 
            className={`map-btn ${mapView === 'rail' ? 'active' : ''}`}
            onClick={() => setMapView('rail')}
          >
            🚄 Rail
          </button>
          <button className="map-btn">📍 Warehouses</button>
          <button className="map-btn">🚨 Alerts</button>
        </div>
        
        <div className="map-legend" style={{ position: 'absolute', bottom: '20px', left: '20px', background: 'white', padding: '12px', borderRadius: '8px', fontSize: '12px' }}>
          <div><span style={{ color: '#10b981' }}>●</span> On Duty</div>
          <div><span style={{ color: '#3b82f6' }}>●</span> En Route</div>
          <div><span style={{ color: '#64748b' }}>●</span> Available</div>
          <div><span style={{ color: '#f59e0b' }}>●</span> Scheduled</div>
        </div>

        <div className="live-positions" style={{ position: 'absolute', top: '60px', right: '20px', background: 'white', padding: '12px', borderRadius: '8px', fontSize: '12px', maxWidth: '200px' }}>
          <h4 style={{ marginBottom: '8px' }}>Live Positions</h4>
          {drivers.filter(d => mapView === 'all' || d.type === mapView).map(driver => (
            <div key={driver.id} style={{ marginBottom: '4px', cursor: 'pointer' }} onClick={() => setSelectedVehicle(driver)}>
              <span style={{ color: driver.status === 'on-duty' ? '#10b981' : driver.status === 'en-route' ? '#3b82f6' : '#64748b' }}>●</span>
              {driver.vehicle} - {driver.location}
            </div>
          ))}
        </div>
      </div>
      
      <div className="tracking-sidebar">
        <h3>Vehicle Status</h3>
        {drivers.filter(d => mapView === 'all' || d.type === mapView).map(driver => (
          <div 
            key={driver.id} 
            className={`tracking-item ${selectedVehicle?.id === driver.id ? 'selected' : ''}`}
            onClick={() => setSelectedVehicle(driver)}
          >
            <div className="tracking-header">
              <span className="driver-name">{driver.name}</span>
              <span className={`vehicle-type ${driver.type}`}>
                {driver.type === 'rail' ? '🚄' : '🚛'}
              </span>
            </div>
            <div className="vehicle-details">
              <div className="vehicle-name">{driver.vehicle}</div>
              <div className="destination">→ {driver.destination}</div>
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
                <span>Speed</span>
                <span>{driver.speed} km/h</span>
              </div>
              <div className="tracking-stat">
                <span>Fuel</span>
                <span className={`fuel-level ${driver.fuelLevel < 30 ? 'low' : driver.fuelLevel < 60 ? 'medium' : 'high'}`}>
                  {driver.fuelLevel}%
                </span>
              </div>
            </div>
            <div className="tracking-actions">
              <button className="btn-action btn-contact" title="Contact Driver">📞</button>
              <button className="btn-action btn-navigate" title="Navigation">🧭</button>
              <button className="btn-action btn-details" title="Details">ℹ️</button>
              <button className="btn-action btn-alert" title="Send Alert">🚨</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAlerts = () => (
    <div className="alerts-section" style={{ marginTop: '24px' }}>
      <h3 className="section-title">Live Alerts & Notifications</h3>
      <div className="alerts-grid">
        <div className="alert-card warning">
          <div className="alert-icon">⚠️</div>
          <div className="alert-content">
            <div className="alert-title">Low Fuel Alert</div>
            <div className="alert-description">Vehicle CAC-5678 fuel level at 60%</div>
            <div className="alert-time">5 minutes ago</div>
          </div>
          <button className="alert-action">Acknowledge</button>
        </div>
        
        <div className="alert-card info">
          <div className="alert-icon">📍</div>
          <div className="alert-content">
            <div className="alert-title">Route Deviation</div>
            <div className="alert-description">Train TE-002 following alternate route due to maintenance</div>
            <div className="alert-time">15 minutes ago</div>
          </div>
          <button className="alert-action">View</button>
        </div>
        
        <div className="alert-card success">
          <div className="alert-icon">✅</div>
          <div className="alert-content">
            <div className="alert-title">Delivery Completed</div>
            <div className="alert-description">Shipment #1248 delivered successfully to Colombo 03</div>
            <div className="alert-time">30 minutes ago</div>
          </div>
          <button className="alert-action">Details</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="dashboard-content">
      <div className="section-header">
        <h2 className="section-title">Live Vehicle Tracking</h2>
        <div className="table-actions">
          <button className="btn-secondary">🔄 Refresh</button>
          <button className="btn-secondary">🚨 Alert Center</button>
          <button className="btn-secondary">📊 Tracking Report</button>
        </div>
      </div>
      
      {renderTrackingStats()}
      {renderMapContainer()}
      {renderAlerts()}

      {selectedVehicle && (
        <div className="vehicle-detail-popup" style={{ 
          position: 'fixed', 
          top: '20px', 
          right: '20px', 
          background: 'white', 
          padding: '20px', 
          borderRadius: '12px', 
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 1000,
          minWidth: '300px'
        }}>
          <div className="popup-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h4>{selectedVehicle.name}</h4>
            <button onClick={() => setSelectedVehicle(null)} style={{ border: 'none', background: 'none', fontSize: '18px' }}>×</button>
          </div>
          <div className="popup-content">
            <div><strong>Vehicle:</strong> {selectedVehicle.vehicle}</div>
            <div><strong>Type:</strong> {selectedVehicle.type === 'rail' ? '🚄 Rail' : '🚛 Road'}</div>
            <div><strong>Status:</strong> {selectedVehicle.status}</div>
            <div><strong>Location:</strong> {selectedVehicle.location}</div>
            <div><strong>Destination:</strong> {selectedVehicle.destination}</div>
            <div><strong>Speed:</strong> {selectedVehicle.speed} km/h</div>
            <div><strong>Fuel Level:</strong> {selectedVehicle.fuelLevel}%</div>
            <div><strong>Coordinates:</strong> {selectedVehicle.lat}, {selectedVehicle.lng}</div>
          </div>
          <div className="popup-actions" style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
            <button className="btn-primary">📞 Contact</button>
            <button className="btn-secondary">🧭 Navigate</button>
            <button className="btn-secondary">📊 History</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTracking;