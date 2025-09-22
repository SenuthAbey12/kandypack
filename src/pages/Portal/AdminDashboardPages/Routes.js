import React from 'react';

const Routes = ({ routes, searchTerm, setSearchTerm, filterStatus, setFilterStatus }) => {
    const filteredRoutes = routes.filter(route => {
        const matchesSearch = route.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              route.start.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              route.end.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || route.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

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
                        <div className="stat-trend up">↗️ +5</div>
                    </div>
                    <div className="stat-body">
                        <h3>{routes.length}</h3>
                        <p>Total Routes</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon">✅</div>
                        <div className="stat-trend up">↗️ 92%</div>
                    </div>
                    <div className="stat-body">
                        <h3>{routes.filter(r => r.status === 'active').length}</h3>
                        <p>Active Routes</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon">⚠️</div>
                        <div className="stat-trend down">↘️ 1</div>
                    </div>
                    <div className="stat-body">
                        <h3>{routes.filter(r => r.status === 'issue').length}</h3>
                        <p>Routes with Issues</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon">🚚</div>
                        <div className="stat-trend up">↗️ 18</div>
                    </div>
                    <div className="stat-body">
                        <h3>{routes.reduce((sum, r) => sum + r.vehicles, 0)}</h3>
                        <p>Vehicles Assigned</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon">📈</div>
                        <div className="stat-trend up">↗️ 87%</div>
                    </div>
                    <div className="stat-body">
                        <h3>87%</h3>
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
                                        <div className="performance-indicator">
                                            <div className={`performance-bar ${route.performance < 70 ? 'low' : route.performance < 90 ? 'medium' : 'high'}`}>
                                                <div className="performance-fill" style={{ width: `${route.performance}%` }}></div>
                                            </div>
                                            <span className="performance-percentage">{route.performance}%</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <button className="btn-action btn-view" title="View Details">
                                                👁️
                                            </button>
                                            <button className="btn-action btn-edit" title="Edit Route">
                                                ✏️
                                            </button>
                                            <button className="btn-action btn-track" title="Analyze">
                                                📈
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

export default Routes;
