import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContextNew';
import './DriverDashboard.css';

const DriverDashboard = () => {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [currentRoute, setCurrentRoute] = useState(null);
  const [deliveryStatus, setDeliveryStatus] = useState('waiting');

  useEffect(() => {
    // Fetch driver assignments from backend
    fetchDriverAssignments();
  }, []);

  const fetchDriverAssignments = async () => {
    try {
      // This will be connected to your backend API
      const sampleAssignments = [
        {
          id: 'DEL001',
          customerName: 'John Smith',
          address: '123 Main St, Colombo',
          orderValue: 'Rs. 25,000',
          priority: 'high',
          estimatedTime: '2 hours',
          status: 'pending'
        },
        {
          id: 'DEL002',
          customerName: 'Jane Doe',
          address: '456 Galle Rd, Mount Lavinia',
          orderValue: 'Rs. 15,000',
          priority: 'medium',
          estimatedTime: '1.5 hours',
          status: 'in-progress'
        }
      ];
      setAssignments(sampleAssignments);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    }
  };

  const updateDeliveryStatus = (assignmentId, newStatus) => {
    setAssignments(prev => 
      prev.map(assignment => 
        assignment.id === assignmentId 
          ? { ...assignment, status: newStatus }
          : assignment
      )
    );
  };

  const startDelivery = (assignment) => {
    setCurrentRoute(assignment);
    updateDeliveryStatus(assignment.id, 'in-progress');
  };

  return (
    <div className="driver-dashboard">
      <div className="dashboard-header">
        <h1>Driver Dashboard</h1>
        <div className="driver-info">
          <span>Welcome, {user?.name}</span>
          <div className="status-indicator">
            <span className={`status ${deliveryStatus}`}>{deliveryStatus}</span>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Current Route Card */}
        <div className="dashboard-card current-route">
          <h2>Current Route</h2>
          {currentRoute ? (
            <div className="route-details">
              <h3>{currentRoute.customerName}</h3>
              <p>{currentRoute.address}</p>
              <div className="route-actions">
                <button 
                  className="btn-primary"
                  onClick={() => updateDeliveryStatus(currentRoute.id, 'completed')}
                >
                  Mark Delivered
                </button>
                <button className="btn-secondary">Get Directions</button>
              </div>
            </div>
          ) : (
            <p>No active route</p>
          )}
        </div>

        {/* Today's Assignments */}
        <div className="dashboard-card assignments">
          <h2>Today's Assignments</h2>
          <div className="assignments-list">
            {assignments.map(assignment => (
              <div key={assignment.id} className="assignment-item">
                <div className="assignment-header">
                  <span className="assignment-id">{assignment.id}</span>
                  <span className={`priority ${assignment.priority}`}>
                    {assignment.priority}
                  </span>
                </div>
                <h4>{assignment.customerName}</h4>
                <p>{assignment.address}</p>
                <div className="assignment-details">
                  <span>Value: {assignment.orderValue}</span>
                  <span>ETA: {assignment.estimatedTime}</span>
                </div>
                <div className="assignment-actions">
                  {assignment.status === 'pending' && (
                    <button 
                      className="btn-start"
                      onClick={() => startDelivery(assignment)}
                    >
                      Start Delivery
                    </button>
                  )}
                  {assignment.status === 'in-progress' && (
                    <span className="status-badge in-progress">In Progress</span>
                  )}
                  {assignment.status === 'completed' && (
                    <span className="status-badge completed">Completed</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Stats */}
        <div className="dashboard-card stats">
          <h2>Performance Stats</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-number">12</span>
              <span className="stat-label">Deliveries Today</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">98%</span>
              <span className="stat-label">On-time Rate</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">4.8</span>
              <span className="stat-label">Customer Rating</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="dashboard-card quick-actions">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <button className="action-btn">Report Issue</button>
            <button className="action-btn">Vehicle Inspection</button>
            <button className="action-btn">Break Time</button>
            <button className="action-btn">Emergency Contact</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;