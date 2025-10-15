import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import './AdminDashboard.css';

const AdminWarehouses = () => {
  const { user } = useAuth();
  const { theme } = useTheme();

  const [warehouses] = useState([
    { 
      id: 1, 
      name: 'Colombo Main Warehouse', 
      location: 'Colombo 05', 
      capacity: 10000, 
      current: 8750, 
      utilizationRate: 87.5, 
      temperature: 22, 
      humidity: 45,
      sections: ['A1', 'A2', 'B1', 'B2', 'C1'],
      staff: 24,
      operations: 'Loading/Unloading'
    },
    { 
      id: 2, 
      name: 'Kandy Distribution Center', 
      location: 'Kandy', 
      capacity: 7500, 
      current: 6200, 
      utilizationRate: 82.7, 
      temperature: 24, 
      humidity: 50,
      sections: ['K1', 'K2', 'K3'],
      staff: 18,
      operations: 'Sorting'
    },
    { 
      id: 3, 
      name: 'Galle Port Facility', 
      location: 'Galle', 
      capacity: 5000, 
      current: 3800, 
      utilizationRate: 76.0, 
      temperature: 26, 
      humidity: 55,
      sections: ['G1', 'G2'],
      staff: 15,
      operations: 'Inventory'
    }
  ]);

  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [showAddWarehouse, setShowAddWarehouse] = useState(false);

  const renderWarehouseStats = () => (
    <div className="stats-grid" style={{ marginBottom: '24px' }}>
      <div className="stat-card">
        <div className="stat-header">
          <div className="stat-icon">🏭</div>
          <div className="stat-trend up">↗️ +0</div>
        </div>
        <div className="stat-body">
          <h3>{warehouses.length}</h3>
          <p>Total Facilities</p>
        </div>
      </div>
      
      <div className="stat-card">
        <div className="stat-header">
          <div className="stat-icon">📦</div>
          <div className="stat-trend up">↗️ +5%</div>
        </div>
        <div className="stat-body">
          <h3>{warehouses.reduce((sum, w) => sum + w.current, 0).toLocaleString()}</h3>
          <p>Total Items Stored</p>
        </div>
      </div>
      
      <div className="stat-card">
        <div className="stat-header">
          <div className="stat-icon">📈</div>
          <div className="stat-trend up">↗️ 2%</div>
        </div>
        <div className="stat-body">
          <h3>{Math.round(warehouses.reduce((sum, w) => sum + w.utilizationRate, 0) / warehouses.length)}%</h3>
          <p>Avg Utilization</p>
        </div>
      </div>
      
      <div className="stat-card">
        <div className="stat-header">
          <div className="stat-icon">👥</div>
          <div className="stat-trend up">↗️ +3</div>
        </div>
        <div className="stat-body">
          <h3>{warehouses.reduce((sum, w) => sum + w.staff, 0)}</h3>
          <p>Total Staff</p>
        </div>
      </div>
      
      <div className="stat-card">
        <div className="stat-header">
          <div className="stat-icon">🌡️</div>
          <div className="stat-trend neutral">→ Stable</div>
        </div>
        <div className="stat-body">
          <h3>{Math.round(warehouses.reduce((sum, w) => sum + w.temperature, 0) / warehouses.length)}°C</h3>
          <p>Avg Temperature</p>
        </div>
      </div>
    </div>
  );

  const renderWarehouseCard = (warehouse) => (
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

        <div className="metric-row">
          <div className="metric-item">
            <span className="metric-label">Sections</span>
            <span className="metric-value">{warehouse.sections.join(', ')}</span>
          </div>
          <div className="metric-item">
            <span className="metric-label">Staff</span>
            <span className="metric-value">{warehouse.staff} workers</span>
          </div>
        </div>

        <div className="metric-item">
          <span className="metric-label">Current Operations</span>
          <span className="metric-value">{warehouse.operations}</span>
        </div>
      </div>
      
      <div className="warehouse-actions">
        <button className="btn-action btn-view" onClick={() => setSelectedWarehouse(warehouse)}>
          👁️ Details
        </button>
        <button className="btn-action btn-inventory">📋 Inventory</button>
        <button className="btn-action btn-reports">📊 Reports</button>
        <button className="btn-action btn-edit">✏️ Edit</button>
      </div>
    </div>
  );

  const renderAddWarehouseForm = () => (
    <div className="modal-overlay" onClick={() => setShowAddWarehouse(false)}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Add New Warehouse</h3>
          <button className="modal-close" onClick={() => setShowAddWarehouse(false)}>×</button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label>Warehouse Name</label>
            <input type="text" placeholder="Enter warehouse name" />
          </div>
          <div className="form-group">
            <label>Location</label>
            <input type="text" placeholder="Enter location" />
          </div>
          <div className="form-group">
            <label>Capacity (units)</label>
            <input type="number" placeholder="Enter capacity" />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Temperature (°C)</label>
              <input type="number" placeholder="22" />
            </div>
            <div className="form-group">
              <label>Humidity (%)</label>
              <input type="number" placeholder="45" />
            </div>
          </div>
          <div className="form-group">
            <label>Sections</label>
            <input type="text" placeholder="A1, A2, B1 (comma separated)" />
          </div>
          <div className="form-group">
            <label>Staff Count</label>
            <input type="number" placeholder="Enter number of staff" />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-secondary" onClick={() => setShowAddWarehouse(false)}>Cancel</button>
          <button className="btn-primary">Add Warehouse</button>
        </div>
      </div>
    </div>
  );

  const renderWarehouseDetail = () => (
    <div className="modal-overlay" onClick={() => setSelectedWarehouse(null)}>
      <div className="modal-content large" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{selectedWarehouse.name} - Detailed View</h3>
          <button className="modal-close" onClick={() => setSelectedWarehouse(null)}>×</button>
        </div>
        <div className="modal-body">
          <div className="warehouse-detail-grid">
            <div className="detail-section">
              <h4>Storage Information</h4>
              <div className="detail-item">
                <span>Total Capacity:</span>
                <span>{selectedWarehouse.capacity.toLocaleString()} units</span>
              </div>
              <div className="detail-item">
                <span>Current Stock:</span>
                <span>{selectedWarehouse.current.toLocaleString()} units</span>
              </div>
              <div className="detail-item">
                <span>Available Space:</span>
                <span>{(selectedWarehouse.capacity - selectedWarehouse.current).toLocaleString()} units</span>
              </div>
              <div className="detail-item">
                <span>Utilization Rate:</span>
                <span>{selectedWarehouse.utilizationRate}%</span>
              </div>
            </div>

            <div className="detail-section">
              <h4>Environmental Conditions</h4>
              <div className="detail-item">
                <span>Temperature:</span>
                <span>{selectedWarehouse.temperature}°C</span>
              </div>
              <div className="detail-item">
                <span>Humidity:</span>
                <span>{selectedWarehouse.humidity}% RH</span>
              </div>
              <div className="detail-item">
                <span>Climate Status:</span>
                <span className="status-badge delivered">Optimal</span>
              </div>
            </div>

            <div className="detail-section">
              <h4>Operations</h4>
              <div className="detail-item">
                <span>Current Activity:</span>
                <span>{selectedWarehouse.operations}</span>
              </div>
              <div className="detail-item">
                <span>Staff on Duty:</span>
                <span>{selectedWarehouse.staff} workers</span>
              </div>
              <div className="detail-item">
                <span>Sections:</span>
                <span>{selectedWarehouse.sections.join(', ')}</span>
              </div>
            </div>

            <div className="detail-section">
              <h4>Quick Actions</h4>
              <div className="action-grid">
                <button className="btn-secondary">📋 View Inventory</button>
                <button className="btn-secondary">📊 Generate Report</button>
                <button className="btn-secondary">👥 Manage Staff</button>
                <button className="btn-secondary">⚙️ Settings</button>
                <button className="btn-secondary">🚨 Emergency</button>
                <button className="btn-secondary">📞 Contact</button>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-secondary" onClick={() => setSelectedWarehouse(null)}>Close</button>
          <button className="btn-primary">Edit Warehouse</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="dashboard-content">
      <div className="section-header">
        <h2 className="section-title">Warehouse Operations</h2>
        <div className="table-actions">
          <button className="btn-primary" onClick={() => setShowAddWarehouse(true)}>
            ➕ Add Warehouse
          </button>
          <button className="btn-secondary">📊 Analytics</button>
          <button className="btn-secondary">📋 Reports</button>
        </div>
      </div>
      
      {renderWarehouseStats()}
      
      <div className="warehouses-grid">
        {warehouses.map(warehouse => renderWarehouseCard(warehouse))}
      </div>

      {showAddWarehouse && renderAddWarehouseForm()}
      {selectedWarehouse && renderWarehouseDetail()}
    </div>
  );
};

export default AdminWarehouses;