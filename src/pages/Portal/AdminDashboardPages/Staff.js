import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Staff = () => {
    const [staff, setStaff] = useState([]);
    const [stats, setStats] = useState({ totalStaff: 0, activeStaff: 0, onLeaveStaff: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        const fetchStaffData = async () => {
            try {
                setLoading(true);
                const res = await axios.get('/api/dashboard/staff');
                setStaff(res.data.staff);
                setStats(res.data.stats);
                setError(null);
            } catch (err) {
                setError('Failed to fetch staff data. Please try again later.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchStaffData();
    }, []);

    const filteredStaff = staff.filter(assistant => {
        const matchesSearch = assistant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              assistant.role.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || assistant.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    if (loading) {
        return <div className="loading-spinner">Loading...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="section-container">
            <div className="section-header">
                <h2 className="section-title">Staff Management</h2>
                <div className="table-actions">
                    <button className="btn-primary">
                        ➕ Add New Staff
                    </button>
                </div>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon">👨‍💼</div>
                    </div>
                    <div className="stat-body">
                        <h3>{stats.totalStaff}</h3>
                        <p>Total Staff</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon">✅</div>
                    </div>
                    <div className="stat-body">
                        <h3>{stats.activeStaff}</h3>
                        <p>Active Staff</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon">📝</div>
                    </div>
                    <div className="stat-body">
                        <h3>{stats.onLeaveStaff}</h3>
                        <p>On Leave</p>
                    </div>
                </div>
            </div>

            <div className="filter-section">
                <div className="search-filter-bar">
                    <div className="search-box">
                        <input
                            type="text"
                            placeholder="Search by name or role..."
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
                            <option value="on-leave">On Leave</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="data-table">
                <div className="table-header">
                    <h3 className="section-title">All Staff ({filteredStaff.length})</h3>
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
                                <th>Role</th>
                                <th>Contact</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStaff.map(assistant => (
                                <tr key={assistant.id}>
                                    <td>{assistant.name}</td>
                                    <td>{assistant.role}</td>
                                    <td>{assistant.contact}</td>
                                    <td>
                                        <span className={`status-badge ${assistant.status === 'active' ? 'delivered' :
                                            assistant.status === 'on-leave' ? 'pending' : 'cancelled'}`}>
                                            {assistant.status.replace('-', ' ')}
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

export default Staff;
