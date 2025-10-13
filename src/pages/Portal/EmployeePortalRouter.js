import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Employee Portal Components
import Admin from './Admin_Page/Admin.js';
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

  const getDashboardComponent = () => {
    if (isAdmin) return <Admin />;
    if (isDriver) return <DriverDashboard />;
    if (isAssistant) return <AssistantDashboard />;
    return <Navigate to="/login" replace />;
  };

  return (
    <div className="employee-portal">
      <Routes>
        <Route path="/" element={getDashboardComponent()} />
        <Route path="/profile" element={<EmployeeProfile />} />
        <Route path="/settings" element={<EmployeeSettings />} />
        
        {/* Admin-specific routes */}
        {isAdmin && (
          <>
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/*" element={<Admin />} />
          </>
        )}
        
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