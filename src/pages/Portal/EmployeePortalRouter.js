import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Employee Portal Components
import DriverDashboard from './DriverDashboard';
import AssistantDashboard from './AssistantDashboard';
import EmployeeProfile from './EmployeeProfile';
import EmployeeSettings from './EmployeeSettings';


const EmployeePortalRouter = () => {
  const { isEmployee, isAdmin, isDriver, isAssistant } = useAuth();

  // Redirect non-employees to the employee login to avoid redirect loops
  if (!isEmployee) {
    return <Navigate to="/login/employee" replace />;
  }

  const defaultRoute = (() => {
    if (isAdmin) return '/admin/overview';
    if (isDriver) return '/driver';
    if (isAssistant) return '/assistant';
    return '/login/employee';
  })();

  return (
    <div className="employee-portal">
      <Routes>
        <Route path="/" element={<Navigate to={defaultRoute} replace />} />
        <Route path="/profile" element={<EmployeeProfile />} />
        <Route path="/settings" element={<EmployeeSettings />} />
        
        {/* Driver-specific routes */}
        {isDriver && (
          <>
            <Route path="/driver" element={<DriverDashboard />} />
            <Route path="/driver/routes" element={<DriverDashboard />} />
          </>
        )}
        
        {/* Assistant-specific routes */}
        {isAssistant && (
          <>
            <Route path="/assistant" element={<AssistantDashboard />} />
            <Route path="/assistant/support" element={<AssistantDashboard />} />
          </>
        )}
        
        <Route path="*" element={<Navigate to="/employee" replace />} />
      </Routes>
    </div>
  );
};

export default EmployeePortalRouter;
