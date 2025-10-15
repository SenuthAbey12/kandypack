import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import './AdminDashboard.css';

const AdminRoutes = () => {
  const { user } = useAuth();
  const { theme } = useTheme();

  const [routes] = useState([
    { id: 1, name: 'Colombo-Kandy Express', type: 'road', distance: 115, avgTime: '2.5 hours', traffic: 'moderate', weather: 'clear', efficiency: 94, vehicles: 12, status: 'active' },
    { id: 2, name: 'Kandy-Galle Coastal', type: 'road', distance: 145, avgTime: '3.2 hours', traffic: 'heavy', weather: 'rainy', efficiency: 78, vehicles: 8, status: 'active' },
    { id: 3, name: 'Main Line Railway', type: 'rail', distance: 290, avgTime: '8 hours', traffic: 'none', weather: 'clear', efficiency: 96, vehicles: 4, status: 'active' },
    { id: 4, name: 'Coast Line Railway', type: 'rail', distance: 160, avgTime: '4.5 hours', traffic: 'none', weather: 'clear', efficiency: 92, vehicles: 3, status: 'active' },
    { id: 5, name: 'Colombo-Negombo Highway', type: 'road', distance: 45, avgTime: '1.2 hours', traffic: 'light', weather: 'clear', efficiency: 89, vehicles: 15, status: 'active' },
    { id: 6, name: 'Northern Rail Line', type: 'rail', distance: 220, avgTime: '6.5 hours', traffic: 'none', weather: 'clear', efficiency: 88, vehicles: 2, status: 'maintenance' }
  ]);

  const [selectedRoute, setSelectedRoute] = useState(null);

  const renderRouteCard = (route) => (
    <div key={route.id} className="route-card">
      <div className="route-header">
        <h4>{route.name}</h4>
        <div style={{ display: 'flex', gap: '8px' }}>
          <span className={`route-type-badge ${route.type}`}>
            {route.type === 'rail' ? '🚄' : '🚛'} {route.type.toUpperCase()}
          </span>
          <span className={`status-badge ${route.status === 'active' ? 'delivered' : 'warning'}`}>
            {route.status}
          </span>
        </div>
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
        <div className="route-stat">
          <span>Active Vehicles</span>
          <span>{route.vehicles}</span>
        </div>
      </div>
      <div className="route-actions">
        <button className="btn-action btn-edit" onClick={() => setSelectedRoute(route)}>
          ✏️ Edit
        </button>
        <button className="btn-action btn-optimize">🎯 Optimize</button>
        <button className="btn-action btn-view">👁️ Details</button>
        <button className="btn-action btn-schedule">📅 Schedule</button>
      </div>
    </div>
  );

  const renderRouteStats = () => (
    <div className="stats-grid" style={{ marginBottom: '24px' }}>
      <div className="stat-card">
        <div className="stat-header">
          <div className="stat-icon">🛤️</div>
          <div className="stat-trend up">↗️ +1</div>
        </div>
        <div className="stat-body">
          <h3>{routes.length}</h3>
          <p>Total Routes</p>
        </div>
      </div>
      
      <div className="stat-card">
        <div className="stat-header">
          <div className="stat-icon">🚛</div>
          <div className="stat-trend up">↗️ +3</div>
        </div>
        <div className="stat-body">
          <h3>{routes.filter(r => r.type === 'road').length}</h3>
          <p>Road Routes</p>
        </div>
      </div>
      
      <div className="stat-card">
        <div className="stat-header">
          <div className="stat-icon">🚄</div>
          <div className="stat-trend up">↗️ +1</div>
        </div>
        <div className="stat-body">
          <h3>{routes.filter(r => r.type === 'rail').length}</h3>
          <p>Rail Routes</p>
        </div>
      </div>
      
      <div className="stat-card">
        <div className="stat-header">
          <div className="stat-icon">📈</div>
          <div className="stat-trend up">↗️ 92%</div>
        </div>
        <div className="stat-body">
          <h3>{Math.round(routes.reduce((sum, r) => sum + r.efficiency, 0) / routes.length)}%</h3>
          <p>Avg Efficiency</p>
        </div>
      </div>
      
      <div className="stat-card">
        <div className="stat-header">
          <div className="stat-icon">🚗</div>
          <div className="stat-trend up">↗️ +5</div>
        </div>
        <div className="stat-body">
          <h3>{routes.reduce((sum, r) => sum + r.vehicles, 0)}</h3>
          <p>Active Vehicles</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="dashboard-content">
      <div className="section-header">
        <h2 className="section-title">Routes & Scheduling</h2>
        <div className="table-actions">
          <button className="btn-primary">➕ Add Route</button>
          <button className="btn-secondary">🔄 Optimize All</button>
          <button className="btn-secondary">📊 Route Analytics</button>
        </div>
      </div>
      
      {renderRouteStats()}
      
      <div className="routes-grid">
        {routes.map(route => renderRouteCard(route))}
      </div>

      {selectedRoute && (
        <div className="modal-overlay" onClick={() => setSelectedRoute(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit Route: {selectedRoute.name}</h3>
              <button className="modal-close" onClick={() => setSelectedRoute(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Route Name</label>
                <input type="text" defaultValue={selectedRoute.name} />
              </div>
              <div className="form-group">
                <label>Distance (km)</label>
                <input type="number" defaultValue={selectedRoute.distance} />
              </div>
              <div className="form-group">
                <label>Type</label>
                <select defaultValue={selectedRoute.type}>
                  <option value="road">Road</option>
                  <option value="rail">Rail</option>
                </select>
              </div>
              <div className="form-group">
                <label>Status</label>
                <select defaultValue={selectedRoute.status}>
                  <option value="active">Active</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setSelectedRoute(null)}>Cancel</button>
              <button className="btn-primary">Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRoutes;