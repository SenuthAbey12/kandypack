import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Railway = () => {
    const [railwayData, setRailwayData] = useState({ operators: [], stats: {} });
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRailwayData = async () => {
            try {
                setLoading(true);
                const res = await axios.get('/api/dashboard/railway');
                setRailwayData(res.data);
                setError(null);
            } catch (err) {
                setError('Failed to fetch railway data. Please try again later.');
                // If the server provides fallback data on error, use it
                if (err.response && err.response.data) {
                    setRailwayData(err.response.data);
                }
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchRailwayData();
    }, []);

    const { operators, stats } = railwayData;

    const filteredOperators = (operators || []).filter(operator => {
        const lowerSearchTerm = searchTerm.toLowerCase();
        const matchesSearch = (operator.name && operator.name.toLowerCase().includes(lowerSearchTerm)) ||
                              (operator.vehicle && operator.vehicle.toLowerCase().includes(lowerSearchTerm));
        
        const matchesStatus = filterStatus === 'all' || operator.status === filterStatus;
        
        return matchesSearch && matchesStatus;
    });

    const enginesOnDuty = (operators || []).filter(d => d.status === 'on-duty' || d.status === 'en-route' || d.status === 'scheduled').length;
    const avgFuel = (operators && operators.length > 0) 
        ? Math.round(operators.reduce((sum, d) => sum + (d.fuelLevel || 0), 0) / operators.length) 
        : 0;

    if (loading) {
        return <div className="loading-spinner"><div></div><div></div><div></div></div>;
    }

    if (error && !railwayData.operators) {
        return <div className="error-message">{error}</div>;
    }

    return (
      <div>
        {error && <div className="error-message" style={{ marginBottom: '1rem' }}>{error}</div>}
        <div className="section-header">
          <h2 className="section-title">Railway Operations</h2>
          <div className="table-actions">
            <button className="btn-primary">
              ➕ Add Engine
            </button>
            <button className="btn-secondary">
              📊 Railway Analytics
            </button>
          </div>
        </div>
        
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon">🚄</div>
              <div className="stat-trend up">↗️</div>
            </div>
            <div className="stat-body">
              <h3>{stats.totalEngines || 0}</h3>
              <p>Total Engines</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon">👨‍💼</div>
              <div className="stat-trend up">↗️</div>
            </div>
            <div className="stat-body">
              <h3>{stats.totalOperators || 0}</h3>
              <p>Active Operators</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon">✅</div>
              <div className="stat-trend up">↗️</div>
            </div>
            <div className="stat-body">
              <h3>{enginesOnDuty}</h3>
              <p>Engines On Duty</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon">📦</div>
              <div className="stat-trend up">↗️</div>
            </div>
            <div className="stat-body">
              <h3>{stats.railShipments || 0}</h3>
              <p>Total Rail Shipments</p>
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
                placeholder="Search operators or engines..."
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
                <option value="scheduled">Scheduled</option>
                <option value="en-route">En Route</option>
                <option value="available">Available</option>
              </select>
            </div>
          </div>
        </div>

        <div className="data-table">
          <div className="table-header">
            <h3 className="section-title">Railway Fleet Overview ({filteredOperators.length})</h3>
            <div className="table-actions">
              <button className="btn-secondary">
                📋 Export Data
              </button>
            </div>
          </div>
          
          <div className="table-container">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Operator</th>
                  <th>License</th>
                  <th>Engine</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Location</th>
                  <th>Fuel Level</th>
                  <th>Rating</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOperators.map(operator => (
                  <tr key={operator.id}>
                    <td>
                      <div className="driver-info">
                        <div className="driver-avatar">
                          {operator.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="driver-name">{operator.name}</div>
                          <div className="driver-id">ID: {operator.id.toString().padStart(3, '0')}</div>
                        </div>
                      </div>
                    </td>
                    <td>{operator.license}</td>
                    <td>
                      <div className="vehicle-info">
                        <div className="vehicle-name">{operator.vehicle}</div>
                        <div className="maintenance-info">
                          Last service: {operator.lastMaintenance}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`transport-badge ${operator.type}`}>
                        {'🚄'} {operator.type.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${operator.status === 'en-route' ? 'in-transit' : 
                        operator.status === 'available' ? 'delivered' : 
                        operator.status === 'scheduled' ? 'pending' : 'pending'}`}>
                        {operator.status.replace('-', ' ')}
                      </span>
                    </td>
                    <td>{operator.location}</td>
                    <td>
                      <div className="fuel-bar-container">
                        <div className="fuel-bar" style={{ width: `${operator.fuelLevel}%` }}></div>
                        <span className="fuel-level-text">{operator.fuelLevel}%</span>
                      </div>
                    </td>
                    <td>
                      <div className="rating">
                        {'★'.repeat(Math.round(operator.rating))}
                        {'☆'.repeat(5 - Math.round(operator.rating))}
                        <span className="rating-text">{operator.rating.toFixed(1)}</span>
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

export default Railway;
