import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div style={styles.loading}>
        <div>Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return (
      <div style={styles.accessDenied}>
        <div style={styles.errorCard}>
          <div style={styles.errorIcon}>🚫</div>
          <h2 style={styles.errorTitle}>Access Denied</h2>
          <p style={styles.errorMessage}>
            You don't have permission to access this page.<br />
            Required role: <strong>{requiredRole}</strong><br />
            Your role: <strong>{user?.role}</strong>
          </p>
          <button 
            style={styles.backBtn}
            onClick={() => window.history.back()}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return children;
};

const styles = {
  loading: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f1f5f9',
    fontSize: '18px',
    color: '#64748b',
  },
  accessDenied: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f1f5f9',
    padding: '20px',
  },
  errorCard: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '40px',
    textAlign: 'center',
    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
    maxWidth: '400px',
  },
  errorIcon: {
    fontSize: '64px',
    marginBottom: '20px',
  },
  errorTitle: {
    margin: '0 0 16px 0',
    fontSize: '24px',
    fontWeight: '700',
    color: '#dc2626',
  },
  errorMessage: {
    margin: '0 0 24px 0',
    fontSize: '16px',
    color: '#64748b',
    lineHeight: '1.5',
  },
  backBtn: {
    padding: '12px 24px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
};

export default ProtectedRoute;