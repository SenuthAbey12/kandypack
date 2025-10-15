import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import './AdminDashboard.css';

const AdminStaff = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);

  // Staff data
  const [staff, setStaff] = useState([
    { 
      id: 1, 
      name: 'Saman Kumara', 
      employeeId: 'EMP001',
      department: 'Loading', 
      position: 'Loading Supervisor',
      shift: 'Day Shift', 
      status: 'active', 
      location: 'Warehouse A', 
      performance: 4.8, 
      tasksCompleted: 324,
      phone: '+94771234567',
      email: 'saman@kandypack.lk',
      hireDate: '2022-03-15',
      salary: 85000,
      leaves: { taken: 8, remaining: 14 }
    },
    { 
      id: 2, 
      name: 'Priya Jayasinghe', 
      employeeId: 'EMP002',
      department: 'Administration', 
      position: 'Admin Assistant',
      shift: 'Day Shift', 
      status: 'active', 
      location: 'Main Office', 
      performance: 4.9, 
      tasksCompleted: 189,
      phone: '+94772345678',
      email: 'priya@kandypack.lk',
      hireDate: '2021-11-20',
      salary: 75000,
      leaves: { taken: 12, remaining: 10 }
    },
    { 
      id: 3, 
      name: 'Ruwan Silva', 
      employeeId: 'EMP003',
      department: 'Logistics', 
      position: 'Logistics Coordinator',
      shift: 'Night Shift', 
      status: 'on-leave', 
      location: 'Logistics Center', 
      performance: 4.5, 
      tasksCompleted: 267,
      phone: '+94773456789',
      email: 'ruwan@kandypack.lk',
      hireDate: '2022-07-10',
      salary: 90000,
      leaves: { taken: 5, remaining: 17 }
    },
    { 
      id: 4, 
      name: 'Chaminda Perera', 
      employeeId: 'EMP004',
      department: 'Quality Control', 
      position: 'QC Inspector',
      shift: 'Day Shift', 
      status: 'active', 
      location: 'QC Station', 
      performance: 4.7, 
      tasksCompleted: 445,
      phone: '+94774567890',
      email: 'chaminda@kandypack.lk',
      hireDate: '2020-09-05',
      salary: 80000,
      leaves: { taken: 15, remaining: 7 }
    },
    { 
      id: 5, 
      name: 'Malini Fernando', 
      employeeId: 'EMP005',
      department: 'Customer Service', 
      position: 'Customer Support Agent',
      shift: 'Day Shift', 
      status: 'active', 
      location: 'Call Center', 
      performance: 4.6, 
      tasksCompleted: 523,
      phone: '+94775678901',
      email: 'malini@kandypack.lk',
      hireDate: '2021-05-12',
      salary: 70000,
      leaves: { taken: 10, remaining: 12 }
    },
    { 
      id: 6, 
      name: 'Thilaka Gunasekara', 
      employeeId: 'EMP006',
      department: 'IT Support', 
      position: 'IT Technician',
      shift: 'Day Shift', 
      status: 'active', 
      location: 'IT Department', 
      performance: 4.8, 
      tasksCompleted: 156,
      phone: '+94776789012',
      email: 'thilaka@kandypack.lk',
      hireDate: '2023-01-08',
      salary: 95000,
      leaves: { taken: 3, remaining: 19 }
    },
    { 
      id: 7, 
      name: 'Nuwan Rajapaksa', 
      employeeId: 'EMP007',
      department: 'Security', 
      position: 'Security Guard',
      shift: 'Night Shift', 
      status: 'active', 
      location: 'Main Gate', 
      performance: 4.4, 
      tasksCompleted: 92,
      phone: '+94777890123',
      email: 'nuwan@kandypack.lk',
      hireDate: '2022-12-01',
      salary: 60000,
      leaves: { taken: 6, remaining: 16 }
    },
    { 
      id: 8, 
      name: 'Sanduni Wijeratne', 
      employeeId: 'EMP008',
      department: 'Finance', 
      position: 'Accountant',
      shift: 'Day Shift', 
      status: 'active', 
      location: 'Finance Department', 
      performance: 4.9, 
      tasksCompleted: 234,
      phone: '+94778901234',
      email: 'sanduni@kandypack.lk',
      hireDate: '2021-08-15',
      salary: 105000,
      leaves: { taken: 11, remaining: 11 }
    }
  ]);

  // Department statistics
  const departmentStats = [
    { department: 'Loading', count: 1, active: 1 },
    { department: 'Administration', count: 1, active: 1 },
    { department: 'Logistics', count: 1, active: 0 },
    { department: 'Quality Control', count: 1, active: 1 },
    { department: 'Customer Service', count: 1, active: 1 },
    { department: 'IT Support', count: 1, active: 1 },
    { department: 'Security', count: 1, active: 1 },
    { department: 'Finance', count: 1, active: 1 }
  ];

  // Filter functions
  const filteredStaff = staff.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === 'all' || member.department === selectedDepartment;
    const matchesStatus = selectedStatus === 'all' || member.status === selectedStatus;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return '#10b981';
      case 'on-leave':
        return '#f59e0b';
      case 'inactive':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getPerformanceColor = (rating) => {
    if (rating >= 4.5) return '#10b981';
    if (rating >= 4.0) return '#f59e0b';
    return '#ef4444';
  };

  const handleStaffClick = (staffMember) => {
    setSelectedStaff(staffMember);
    setShowStaffModal(true);
  };

  const renderStaffCard = (staffMember) => (
    <div 
      key={staffMember.id} 
      className="fleet-card"
      onClick={() => handleStaffClick(staffMember)}
    >
      <div className="fleet-card-header">
        <div className="vehicle-info">
          <h3>{staffMember.name}</h3>
          <p className="vehicle-model">{staffMember.employeeId}</p>
        </div>
        <div 
          className="status-badge"
          style={{ backgroundColor: getStatusColor(staffMember.status) }}
        >
          {staffMember.status}
        </div>
      </div>
      
      <div className="fleet-card-details">
        <div className="detail-row">
          <span className="detail-label">Department:</span>
          <span className="detail-value">{staffMember.department}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Position:</span>
          <span className="detail-value">{staffMember.position}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Shift:</span>
          <span className="detail-value">{staffMember.shift}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Location:</span>
          <span className="detail-value">{staffMember.location}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Performance:</span>
          <span 
            className="detail-value"
            style={{ color: getPerformanceColor(staffMember.performance) }}
          >
            ⭐ {staffMember.performance}
          </span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Tasks:</span>
          <span className="detail-value">{staffMember.tasksCompleted}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="admin-content" data-theme={theme}>
      {/* Header */}
      <div className="content-header">
        <div className="header-left">
          <button 
            className="back-button"
            onClick={() => navigate('/employee/admin')}
          >
            ← Back to Dashboard
          </button>
          <div className="page-title">
            <h1>Staff Management</h1>
            <p>Manage employees and workforce operations</p>
          </div>
        </div>
        <div className="header-actions">
          <button 
            className="primary-button"
            onClick={() => setShowAddStaffModal(true)}
          >
            + Add Staff Member
          </button>
        </div>
      </div>

      {/* Department Statistics */}
      <div className="stats-overview">
        <h3>Department Overview</h3>
        <div className="stats-grid">
          {departmentStats.map((dept, index) => (
            <div key={index} className="stat-card">
              <div className="stat-value">{dept.count}</div>
              <div className="stat-label">{dept.department}</div>
              <div className="stat-sublabel">{dept.active} active</div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search staff members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-group">
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Departments</option>
            <option value="Loading">Loading</option>
            <option value="Administration">Administration</option>
            <option value="Logistics">Logistics</option>
            <option value="Quality Control">Quality Control</option>
            <option value="Customer Service">Customer Service</option>
            <option value="IT Support">IT Support</option>
            <option value="Security">Security</option>
            <option value="Finance">Finance</option>
          </select>
          
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="on-leave">On Leave</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Staff Grid */}
      <div className="fleet-grid">
        {filteredStaff.length > 0 ? (
          filteredStaff.map(renderStaffCard)
        ) : (
          <div className="empty-state">
            <p>No staff members found matching your criteria</p>
          </div>
        )}
      </div>

      {/* Staff Detail Modal */}
      {showStaffModal && selectedStaff && (
        <div className="modal-overlay" onClick={() => setShowStaffModal(false)}>
          <div className="modal fleet-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Staff Details - {selectedStaff.name}</h2>
              <button 
                className="modal-close"
                onClick={() => setShowStaffModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-content">
              <div className="vehicle-detail-grid">
                <div className="detail-section">
                  <h4>Personal Information</h4>
                  <div className="detail-list">
                    <div className="detail-item">
                      <span className="detail-label">Name:</span>
                      <span className="detail-value">{selectedStaff.name}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Employee ID:</span>
                      <span className="detail-value">{selectedStaff.employeeId}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Phone:</span>
                      <span className="detail-value">{selectedStaff.phone}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Email:</span>
                      <span className="detail-value">{selectedStaff.email}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Hire Date:</span>
                      <span className="detail-value">{selectedStaff.hireDate}</span>
                    </div>
                  </div>
                </div>
                
                <div className="detail-section">
                  <h4>Work Information</h4>
                  <div className="detail-list">
                    <div className="detail-item">
                      <span className="detail-label">Department:</span>
                      <span className="detail-value">{selectedStaff.department}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Position:</span>
                      <span className="detail-value">{selectedStaff.position}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Shift:</span>
                      <span className="detail-value">{selectedStaff.shift}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Status:</span>
                      <span 
                        className="detail-value"
                        style={{ color: getStatusColor(selectedStaff.status) }}
                      >
                        {selectedStaff.status}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Location:</span>
                      <span className="detail-value">{selectedStaff.location}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Salary:</span>
                      <span className="detail-value">Rs. {selectedStaff.salary.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="detail-section">
                  <h4>Performance & Leave</h4>
                  <div className="detail-list">
                    <div className="detail-item">
                      <span className="detail-label">Performance Rating:</span>
                      <span 
                        className="detail-value"
                        style={{ color: getPerformanceColor(selectedStaff.performance) }}
                      >
                        ⭐ {selectedStaff.performance}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Tasks Completed:</span>
                      <span className="detail-value">{selectedStaff.tasksCompleted}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Leaves Taken:</span>
                      <span className="detail-value">{selectedStaff.leaves.taken} days</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Leaves Remaining:</span>
                      <span className="detail-value">{selectedStaff.leaves.remaining} days</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="secondary-button"
                onClick={() => setShowStaffModal(false)}
              >
                Close
              </button>
              <button className="primary-button">
                Edit Staff
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Staff Modal */}
      {showAddStaffModal && (
        <div className="modal-overlay" onClick={() => setShowAddStaffModal(false)}>
          <div className="modal fleet-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Staff Member</h2>
              <button 
                className="modal-close"
                onClick={() => setShowAddStaffModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-content">
              <form className="staff-form">
                <div className="form-group">
                  <label>Name</label>
                  <input type="text" placeholder="Enter full name" />
                </div>
                <div className="form-group">
                  <label>Employee ID</label>
                  <input type="text" placeholder="Enter employee ID" />
                </div>
                <div className="form-group">
                  <label>Department</label>
                  <select>
                    <option value="">Select Department</option>
                    <option value="Loading">Loading</option>
                    <option value="Administration">Administration</option>
                    <option value="Logistics">Logistics</option>
                    <option value="Quality Control">Quality Control</option>
                    <option value="Customer Service">Customer Service</option>
                    <option value="IT Support">IT Support</option>
                    <option value="Security">Security</option>
                    <option value="Finance">Finance</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Position</label>
                  <input type="text" placeholder="Enter position/title" />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input type="tel" placeholder="Enter phone number" />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" placeholder="Enter email address" />
                </div>
                <div className="form-group">
                  <label>Salary</label>
                  <input type="number" placeholder="Enter salary amount" />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button 
                className="secondary-button"
                onClick={() => setShowAddStaffModal(false)}
              >
                Cancel
              </button>
              <button className="primary-button">
                Add Staff Member
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStaff;