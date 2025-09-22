import React from 'react';

const Staff = ({ assistants, searchTerm, setSearchTerm, filterStatus, setFilterStatus }) => {
    const filteredAssistants = assistants.filter(assistant => {
        const matchesSearch = assistant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              assistant.role.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || assistant.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

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
                        <h3>{assistants.length}</h3>
                        <p>Total Staff</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon">✅</div>
                    </div>
                    <div className="stat-body">
                        <h3>{assistants.filter(a => a.status === 'active').length}</h3>
                        <p>Active Staff</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon">📝</div>
                    </div>
                    <div className="stat-body">
                        <h3>{assistants.filter(a => a.status === 'on-leave').length}</h3>
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
                    <h3 className="section-title">All Staff ({filteredAssistants.length})</h3>
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
                            {filteredAssistants.map(assistant => (
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
