import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Fleet = () => {
    const [fleetData, setFleetData] = useState({ drivers: [], stats: { totalVehicles: 0, totalDrivers: 0 } });
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFleetData = async () => {
            try {
                setLoading(true);
                const res = await axios.get('/api/dashboard/fleet');
                setFleetData(res.data);
                setError(null);
            } catch (err) {
                setError('Failed to fetch fleet data. Please try again later.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchFleetData();
    }, []);

    const { drivers, stats } = fleetData;

    const filteredDrivers = drivers.filter(driver => {
        const lowerSearchTerm = searchTerm.toLowerCase();
        const matchesSearch = (driver.name && driver.name.toLowerCase().includes(lowerSearchTerm)) ||
                           (driver.vehicle && driver.vehicle.toLowerCase().includes(lowerSearchTerm)) ||
                           (driver.type && driver.type.toLowerCase().includes(lowerSearchTerm));
                           
        const matchesStatus = filterStatus === 'all' || 
                              (filterStatus === 'road' && driver.type === 'road') ||
                              (filterStatus === 'rail' && driver.type === 'rail') ||
                              driver.status === filterStatus;
                              
        return matchesSearch && matchesStatus;
    });

    const onDutyCount = drivers.filter(d => d.status === 'on-duty' || d.status === 'en-route').length;
    const railOperatorsCount = drivers.filter(d => d.type === 'rail').length;
    const avgFuel = drivers.length > 0 ? Math.round(drivers.reduce((sum, d) => sum + (d.fuelLevel || 0), 0) / drivers.length) : 0;

    if (loading) {
        return <div className="loading-spinner"><div></div><div></div><div></div></div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

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
              <div className="stat-trend up">↗️</div>
            </div>
            <div className="stat-body">
              <h3>{stats.totalVehicles}</h3>
              <p>Total Fleet</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon">👨‍💼</div>
              <div className="stat-trend up">↗️</div>
            </div>
            <div className="stat-body">
              <h3>{stats.totalDrivers}</h3>
              <p>Active Drivers</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon">✅</div>
              <div className="stat-trend up">↗️</div>
            </div>
            <div className="stat-body">
              <h3>{onDutyCount}</h3>
              <p>Vehicles On Duty</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon"></div>
              <div className="stat-trend up">↗️</div>
            </div>
            <div className="stat-body">
              <h3>{railOperatorsCount}</h3>
              <p>Rail Operators</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon">⛽</div>
              <div className="stat-trend up">↗️</div>
            </div>
            <div className="stat-body">
              <h3>{avgFuel}%</h3>
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
                      <div className="fuel-bar-container">
                        <div className="fuel-bar" style={{ width: `${driver.fuelLevel}%` }}></div>
                        <span className="fuel-level-text">{driver.fuelLevel}%</span>
                      </div>
                    </td>
                    <td>
                      <div className="rating">
                        {'★'.repeat(Math.round(driver.rating))}
                        {'☆'.repeat(5 - Math.round(driver.rating))}
                        <span className="rating-text">{driver.rating.toFixed(1)}</span>
                      </div>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn-action view">👁️</button>
                        <button className="btn-action edit">✏️</button>
                        <button className="btn-action delete">🗑️</button>
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
}

export default Fleet;
