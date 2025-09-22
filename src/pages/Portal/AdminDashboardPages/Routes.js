import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Routes = () => {
    const [routesData, setRoutesData] = useState({ routes: [], stats: {} });
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRoutesData = async () => {
            try {
                setLoading(true);
                const res = await axios.get('/api/dashboard/routes');
                setRoutesData(res.data);
                setError(null);
            } catch (err) {
                setError('Failed to fetch routes data. Please try again later.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchRoutesData();
    }, []);

    const { routes, stats } = routesData;

    const filteredRoutes = (routes || []).filter(route => {
        const lowerSearchTerm = searchTerm.toLowerCase();
        const matchesSearch = (route.name && route.name.toLowerCase().includes(lowerSearchTerm)) ||
                              (route.start && route.start.toLowerCase().includes(lowerSearchTerm)) ||
                              (route.end && route.end.toLowerCase().includes(lowerSearchTerm));
        const matchesStatus = filterStatus === 'all' || route.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    if (loading) {
        return <div className="loading-spinner"><div></div><div></div><div></div></div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="section-container">
            <div className="section-header">
                <h2 className="section-title">Route Management</h2>
                <div className="table-actions">
                    <button className="btn-primary">
                        ➕ Create New Route
                    </button>
                    <button className="btn-secondary">
                        🗺️ Optimize All Routes
                    </button>
                </div>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon">📍</div>
                        <div className="stat-trend up"></div>
                    </div>
                    <div className="stat-body">
                        <h3>{stats.totalRoutes || 0}</h3>
                        <p>Total Routes</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon">✅</div>
                        <div className="stat-trend up"></div>
                    </div>
                    <div className="stat-body">
                        <h3>{stats.activeRoutes || 0}</h3>
                        <p>Active Routes</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon">⚠️</div>
                        <div className="stat-trend down"></div>
                    </div>
                    <div className="stat-body">
                        <h3>{stats.routesWithIssues || 0}</h3>
                        <p>Routes with Issues</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon">🚚</div>
                        <div className="stat-trend up"></div>
                    </div>
                    <div className="stat-body">
                        <h3>{stats.vehiclesAssigned || 0}</h3>
                        <p>Vehicles Assigned</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon">📈</div>
                        <div className="stat-trend up"></div>
                    </div>
                    <div className="stat-body">
                        <h3>{stats.onTimePerformance || 0}%</h3>
                        <p>On-Time Performance</p>
                    </div>
                </div>
            </div>

            <div className="filter-section">
                <div className="search-filter-bar">
                    <div className="search-box">
                        <input
                            type="text"
                            placeholder="Search by route name or location..."
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
                            <option value="inactive">Inactive</option>
                            <option value="issue">With Issues</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="data-table">
                <div className="table-header">
                    <h3 className="section-title">All Routes ({filteredRoutes.length})</h3>
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
                                <th>Route Name</th>
                                <th>Start</th>
                                <th>End</th>
                                <th>Distance</th>
                                <th>Vehicles</th>
                                <th>Status</th>
                                <th>Performance</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRoutes.map(route => (
                                <tr key={route.id}>
                                    <td>
                                        <div className="route-name">{route.name}</div>
                                        <div className="route-id">ID: {route.id}</div>
                                    </td>
                                    <td>{route.start}</td>
                                    <td>{route.end}</td>
                                    <td>{route.distance}</td>
                                    <td>{route.vehicles}</td>
                                    <td>
                                        <span className={`status-badge ${route.status === 'active' ? 'delivered' :
                                            route.status === 'inactive' ? 'cancelled' : 'pending'}`}>
                                            {route.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="performance-bar-container">
                                            <div className="performance-bar" style={{ width: `${route.performance}%`, backgroundColor: route.performance > 90 ? '#28a745' : route.performance > 80 ? '#ffc107' : '#dc3545' }}></div>
                                            <span className="performance-text">{route.performance}%</span>
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

export default Routes;
