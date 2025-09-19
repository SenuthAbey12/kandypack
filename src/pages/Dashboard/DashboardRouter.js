import React from 'react';
import AdminDashboard from './AdminDashboard';
import CustomerDashboard from './CustomerDashboard';
import { useAuth } from '../../context/AuthContext';

// --- Authentication Context (In real app, this would come from context/state management) ---
const DashboardRouter = () => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Loading dashboard...</p>
      </div>
    );
  }
  const role = user?.role || 'customer';
  return role === 'admin' ? <AdminDashboard /> : <CustomerDashboard />;
};

const styles = {
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f1f5f9',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #e2e8f0',
    borderTop: '4px solid #3b82f6',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    marginTop: '16px',
    fontSize: '16px',
    color: '#64748b',
  },
  // removed demo switcher styles
};

// Add CSS animation for spinner
const styleSheet = document.createElement('style');
styleSheet.type = 'text/css';
styleSheet.innerText = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);

export default DashboardRouter;