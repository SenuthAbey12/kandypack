import React from 'react';
import { useAuth } from '../../context/AuthContextNew';

const AdminDashboard = () => {
  const { user } = useAuth();
  
  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <p>Welcome, {user?.name}. Full admin functionality will be implemented here.</p>
      <div className="admin-features">
        <h3>Admin Features:</h3>
        <ul>
          <li>User Management</li>
          <li>Order Oversight</li>
          <li>Driver & Assistant Management</li>
          <li>System Reports</li>
          <li>Business Analytics</li>
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;