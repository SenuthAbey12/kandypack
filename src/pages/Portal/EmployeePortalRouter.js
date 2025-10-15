import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Employee Portal Components
import AdminDashboardOverview from './AdminDashboardOverview';
import AdminAnalytics from './AdminAnalytics';
import AdminRoutes from './AdminRoutes';
import AdminTracking from './AdminTracking';
import AdminWarehouses from './AdminWarehouses';
import AdminInventory from './AdminInventory';
import AdminShipments from './AdminShipments';
import RailwayOperations from './RailwayOperations';
import AdminFleet from './AdminFleet';
import AdminStaff from './AdminStaff';
import AdminSettings from './AdminSettings';
import AdminSupport from './AdminSupport';
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
    if (isAdmin) return <AdminDashboardOverview />;
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
            <Route path="/admin" element={<AdminDashboardOverview />} />
            <Route path="/admin/overview" element={<AdminDashboardOverview />} />
            <Route path="/admin/analytics" element={<AdminAnalytics />} />
            <Route path="/admin/drivers" element={<AdminFleet />} />
            <Route path="/admin/railway" element={<RailwayOperations />} />
            <Route path="/admin/routes" element={<AdminRoutes />} />
            <Route path="/admin/tracking" element={<AdminTracking />} />
            <Route path="/admin/orders" element={<AdminShipments />} />
            <Route path="/admin/warehouses" element={<AdminWarehouses />} />
            <Route path="/admin/inventory" element={<AdminInventory />} />
            <Route path="/admin/assistants" element={<AdminStaff />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            <Route path="/admin/support" element={<AdminSupport />} />
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