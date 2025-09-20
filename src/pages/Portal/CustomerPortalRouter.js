import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Customer Portal Components
import CustomerDashboard from './CustomerDashboard';
import CustomerOrders from './CustomerOrders';
import CustomerProfile from './CustomerProfile';
import CustomerSupport from './CustomerSupport';

const CustomerPortalRouter = () => {
  const { isCustomer } = useAuth();

  // Redirect non-customers to the customer login to avoid redirect loops
  if (!isCustomer) {
    return <Navigate to="/login/customer" replace />;
  }

  return (
    <div className="customer-portal">
      <Routes>
        <Route path="/" element={<CustomerDashboard />} />
        <Route path="/orders" element={<CustomerOrders />} />
        <Route path="/profile" element={<CustomerProfile />} />
        <Route path="/support" element={<CustomerSupport />} />
        <Route path="*" element={<Navigate to="/customer" replace />} />
      </Routes>
    </div>
  );
};

export default CustomerPortalRouter;