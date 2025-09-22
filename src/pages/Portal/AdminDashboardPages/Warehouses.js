import React from 'react';

const Warehouses = ({ warehouses, searchTerm, setSearchTerm, filterStatus, setFilterStatus }) => {
    const filteredWarehouses = warehouses.filter(warehouse => {
        const matchesSearch = warehouse.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              warehouse.location.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || warehouse.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="section-container">
            <div className="section-header">
                <h2 className="section-title">Warehouse Management</h2>
                <div className="table-actions">
                    <button className="btn-primary">
                        ➕ Add New Warehouse
                    </button>
                </div>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon">🏢</div>
                    </div>
                    <div className="stat-body">
                        <h3>{warehouses.length}</h3>
                        <p>Total Warehouses</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon">📦</div>
                    </div>
                    <div className="stat-body">
                        <h3>{warehouses.reduce((sum, w) => sum + w.capacity, 0)}</h3>
                        <p>Total Capacity</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon">📈</div>
                    </div>
                    <div className="stat-body">
                        <h3>{Math.round(warehouses.reduce((sum, w) => sum + w.utilization, 0) / warehouses.length)}%</h3>
                        <p>Avg. Utilization</p>
                    </div>
                </div>
            </div>

            <div className="filter-section">
                <div className="search-filter-bar">
                    <div className="search-box">
                        <input
                            type="text"
                            placeholder="Search by name or location..."
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
                        </select>
                    </div>
                </div>
            </div>

            <div className="data-table">
                <div className="table-header">
                    <h3 className="section-title">All Warehouses ({filteredWarehouses.length})</h3>
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
                                <th>Name</th>
                                <th>Location</th>
                                <th>Capacity</th>
                                <th>Utilization</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredWarehouses.map(warehouse => (
                                <tr key={warehouse.id}>
                                    <td>{warehouse.name}</td>
                                    <td>{warehouse.location}</td>
                                    <td>{warehouse.capacity}</td>
                                    <td>
                                        <div className="performance-indicator">
                                            <div className={`performance-bar ${warehouse.utilization < 70 ? 'low' : warehouse.utilization < 90 ? 'medium' : 'high'}`}>
                                                <div className="performance-fill" style={{ width: `${warehouse.utilization}%` }}></div>
                                            </div>
                                            <span className="performance-percentage">{warehouse.utilization}%</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`status-badge ${warehouse.status === 'active' ? 'delivered' : 'cancelled'}`}>
                                            {warehouse.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <button className="btn-action btn-view" title="View Details">
                                                👁️
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

export default Warehouses;
