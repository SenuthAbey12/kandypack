import React from 'react';

const Fleet = ({ drivers, searchTerm, setSearchTerm, filterStatus, setFilterStatus, stats }) => {
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
              <div className="stat-icon"></div>
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

export default Fleet;
