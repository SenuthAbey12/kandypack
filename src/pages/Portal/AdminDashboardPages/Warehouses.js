import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Warehouses = () => {
    const [warehouseData, setWarehouseData] = useState({ warehouses: [], stats: {} });
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchWarehouseData = async () => {
            try {
                setLoading(true);
                const res = await axios.get('/api/dashboard/warehouses');
                setWarehouseData(res.data);
                setError(null);
            } catch (err) {
                setError('Failed to fetch warehouse data. Please try again later.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchWarehouseData();
    }, []);

    const { warehouses, stats } = warehouseData;

    const filteredWarehouses = (warehouses || []).filter(warehouse => {
        const lowerSearchTerm = searchTerm.toLowerCase();
        const matchesSearch = (warehouse.name && warehouse.name.toLowerCase().includes(lowerSearchTerm)) ||
                              (warehouse.location && warehouse.location.toLowerCase().includes(lowerSearchTerm));
        const matchesStatus = filterStatus === 'all' || warehouse.status === filterStatus;
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
                        <h3>{stats.totalWarehouses || 0}</h3>
                        <p>Total Warehouses</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon">📦</div>
                    </div>
                    <div className="stat-body">
                        <h3>{stats.totalCapacity || 0}</h3>
                        <p>Total Capacity</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon">📈</div>
                    </div>
                    <div className="stat-body">
                        <h3>{stats.avgUtilization || 0}%</h3>
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
