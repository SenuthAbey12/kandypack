import React from 'react';

const Inventory = ({ inventory, searchTerm, setSearchTerm, filterStatus, setFilterStatus }) => {
    const filteredInventory = inventory.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              item.sku.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="section-container">
            <div className="section-header">
                <h2 className="section-title">Inventory Management</h2>
                <div className="table-actions">
                    <button className="btn-primary">
                        ➕ Add New Item
                    </button>
                </div>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon">📦</div>
                    </div>
                    <div className="stat-body">
                        <h3>{inventory.length}</h3>
                        <p>Total Items</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon">⚠️</div>
                    </div>
                    <div className="stat-body">
                        <h3>{inventory.filter(i => i.status === 'low-stock').length}</h3>
                        <p>Low Stock</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon">❌</div>
                    </div>
                    <div className="stat-body">
                        <h3>{inventory.filter(i => i.status === 'out-of-stock').length}</h3>
                        <p>Out of Stock</p>
                    </div>
                </div>
            </div>

            <div className="filter-section">
                <div className="search-filter-bar">
                    <div className="search-box">
                        <input
                            type="text"
                            placeholder="Search by name or SKU..."
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
                            <option value="in-stock">In Stock</option>
                            <option value="low-stock">Low Stock</option>
                            <option value="out-of-stock">Out of Stock</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="data-table">
                <div className="table-header">
                    <h3 className="section-title">All Inventory ({filteredInventory.length})</h3>
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
                                <th>Item Name</th>
                                <th>SKU</th>
                                <th>Category</th>
                                <th>Stock</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredInventory.map(item => (
                                <tr key={item.id}>
                                    <td>{item.name}</td>
                                    <td>{item.sku}</td>
                                    <td>{item.category}</td>
                                    <td>{item.stock}</td>
                                    <td>
                                        <span className={`status-badge ${item.status === 'in-stock' ? 'delivered' :
                                            item.status === 'low-stock' ? 'pending' : 'cancelled'}`}>
                                            {item.status.replace('-', ' ')}
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

export default Inventory;
