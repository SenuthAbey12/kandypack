import React from 'react';

const Tracking = ({ liveTracking, searchTerm, setSearchTerm, filterStatus, setFilterStatus }) => {
    const filteredTracking = liveTracking.filter(item => {
        const matchesSearch = item.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              item.vehicleId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              item.orderId.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="section-container">
            <div className="section-header">
                <h2 className="section-title">Live Vehicle Tracking</h2>
                <div className="table-actions">
                    <button className="btn-secondary">
                        🔄 Refresh Map
                    </button>
                </div>
            </div>

            <div className="live-map-container">
                {/* Placeholder for an interactive map component */}
                <div className="live-map-placeholder">
                    <p>Interactive Map Goes Here</p>
                </div>
            </div>

            <div className="filter-section">
                <div className="search-filter-bar">
                    <div className="search-box">
                        <input
                            type="text"
                            placeholder="Search by driver, vehicle, or order ID..."
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
                            <option value="moving">Moving</option>
                            <option value="stopped">Stopped</option>
                            <option value="idle">Idle</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="data-table">
                <div className="table-header">
                    <h3 className="section-title">Tracked Vehicles ({filteredTracking.length})</h3>
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
                                <th>Driver</th>
                                <th>Vehicle ID</th>
                                <th>Order ID</th>
                                <th>Speed</th>
                                <th>Status</th>
                                <th>Last Update</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTracking.map(item => (
                                <tr key={item.id}>
                                    <td>{item.driver}</td>
                                    <td>{item.vehicleId}</td>
                                    <td>{item.orderId}</td>
                                    <td>{item.speed}</td>
                                    <td>
                                        <span className={`status-badge ${item.status === 'moving' ? 'in-transit' :
                                            item.status === 'stopped' ? 'pending' : 'delivered'}`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td>{item.lastUpdate}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <button className="btn-action btn-view" title="View Details">
                                                👁️
                                            </button>
                                            <button className="btn-action btn-contact" title="Contact Driver">
                                                📞
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

export default Tracking;
