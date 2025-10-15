import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Shipments = () => {
    const [shipmentsData, setShipmentsData] = useState({ shipments: [] });
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'descending' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchShipmentsData = async () => {
            try {
                setLoading(true);
                const res = await axios.get('/api/dashboard/shipments');
                setShipmentsData(res.data);
                setError(null);
            } catch (err) {
                setError('Failed to fetch shipments data. Please try again later.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchShipmentsData();
    }, []);

    const { shipments } = shipmentsData;

    const sortedAndFilteredOrders = (shipments || [])
        .filter(order => {
            const lowerSearchTerm = searchTerm.toLowerCase();
            const matchesSearch = (order.customer && order.customer.toLowerCase().includes(lowerSearchTerm)) ||
                                  (order.orderId && order.orderId.toLowerCase().includes(lowerSearchTerm));
            const matchesStatus = filterStatus === 'all' || (order.status && order.status.toLowerCase() === filterStatus.toLowerCase());
            return matchesSearch && matchesStatus;
        })
        .sort((a, b) => {
            if (!sortConfig.key) return 0;
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === 'ascending' ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === 'ascending' ? 1 : -1;
            }
            return 0;
        });

    const handleSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const getSortIndicator = (key) => {
        if (sortConfig.key === key) {
            return sortConfig.direction === 'ascending' ? '▲' : '▼';
        }
        return '';
    };

    if (loading) {
        return <div className="loading-spinner"><div></div><div></div><div></div></div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="section-container">
            <div className="section-header">
                <h2 className="section-title">Shipment Management</h2>
                <div className="table-actions">
                    <button className="btn-primary">
                        ➕ Create New Shipment
                    </button>
                </div>
            </div>

            <div className="filter-section">
                <div className="search-filter-bar">
                    <div className="search-box">
                        <input
                            type="text"
                            placeholder="Search by customer or order ID..."
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
                            <option value="pending">Pending</option>
                            <option value="in transit">In Transit</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="data-table">
                <div className="table-header">
                    <h3 className="section-title">All Shipments ({sortedAndFilteredOrders.length})</h3>
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
                                <th onClick={() => handleSort('orderId')}>Order ID {getSortIndicator('orderId')}</th>
                                <th onClick={() => handleSort('customer')}>Customer {getSortIndicator('customer')}</th>
                                <th onClick={() => handleSort('date')}>Date {getSortIndicator('date')}</th>
                                <th onClick={() => handleSort('amount')}>Amount {getSortIndicator('amount')}</th>
                                <th onClick={() => handleSort('status')}>Status {getSortIndicator('status')}</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedAndFilteredOrders.map(order => (
                                <tr key={order.orderId}>
                                    <td>{order.orderId}</td>
                                    <td>{order.customer}</td>
                                    <td>{order.date}</td>
                                    <td>{order.amount}</td>
                                    <td>
                                        <span className={`status-badge ${order.status.toLowerCase().replace(' ', '-')}`}>
                                            {order.status}
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

export default Shipments;
