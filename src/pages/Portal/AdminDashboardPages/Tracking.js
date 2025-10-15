import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Tracking = () => {
    const [trackingData, setTrackingData] = useState({ liveTracking: [] });
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTrackingData = async () => {
            try {
                setLoading(true);
                const res = await axios.get('/api/dashboard/tracking');
                setTrackingData(res.data);
                setError(null);
            } catch (err) {
                setError('Failed to fetch tracking data. Please try again later.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchTrackingData();
        // Optional: Set up an interval to refresh the data periodically
        const intervalId = setInterval(fetchTrackingData, 30000); // Refresh every 30 seconds

        return () => clearInterval(intervalId); // Cleanup interval on component unmount
    }, []);

    const { liveTracking } = trackingData;

    const filteredTracking = (liveTracking || []).filter(item => {
        const lowerSearchTerm = searchTerm.toLowerCase();
        const matchesSearch = (item.driver && item.driver.toLowerCase().includes(lowerSearchTerm)) ||
                              (item.vehicleId && item.vehicleId.toLowerCase().includes(lowerSearchTerm)) ||
                              (item.orderId && item.orderId.toLowerCase().includes(lowerSearchTerm));
        const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    if (loading && !liveTracking.length) { // Show initial loading spinner
        return <div className="loading-spinner"><div></div><div></div><div></div></div>;
    }

    if (error && !liveTracking.length) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="section-container">
            <div className="section-header">
                <h2 className="section-title">Live Vehicle Tracking</h2>
                <div className="table-actions">
                    <button className="btn-secondary" onClick={() => window.location.reload()}>
                        🔄 Refresh Map & Data
                    </button>
                </div>
            </div>

            <div className="live-map-container">
                {/* Placeholder for an interactive map component */}
                <div className="live-map-placeholder">
                    <p>Interactive Map Goes Here</p>
                    <p style={{fontSize: '0.8rem', color: '#aaa'}}>(Map functionality to be implemented)</p>
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
