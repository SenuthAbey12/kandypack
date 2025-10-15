import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './EmployeeLogin.css';

const EmployeeLogin = () => {
  const [activeTab, setActiveTab] = useState('admin');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'admin'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setFormData({
      username: '',
      password: '',
      role: tab
    });
    setError('');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Frontend sends username and password for any role
      const payload = {
        username: formData.username,
        password: formData.password,
        role: formData.role,
        portalType: 'employee'
      };

      const user = await login(payload.username, payload.password, payload.role, payload.portalType);

      const roleRedirect = {
        admin: '/admin/overview',
        driver: '/driver',
        assistant: '/assistant',
      }[user.role] || '/employee';

      navigate(roleRedirect, { replace: true });
    } catch (error) {
      setError(error.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="employee-login employee-portal-login">
      <a href="/" className="login-back-home" aria-label="Back to Home">
        <span className="arrow">←</span>
        <span className="label">Back to Home</span>
      </a>
      <div className="login-container">
        <div className="login-header">
          <h1>Employee Portal</h1>
          <p>Access your work dashboard and assignments</p>
        </div>

        {/* Tab Navigation */}
        <div className="login-tabs">
          <button 
            type="button"
            className={`tab-btn ${activeTab === 'admin' ? 'active' : ''}`}
            onClick={() => handleTabChange('admin')}
          >
            👨‍💼 Administrator
          </button>
          <button 
            type="button"
            className={`tab-btn ${activeTab === 'driver' ? 'active' : ''}`}
            onClick={() => handleTabChange('driver')}
          >
            🚛 Driver
          </button>
          <button 
            type="button"
            className={`tab-btn ${activeTab === 'assistant' ? 'active' : ''}`}
            onClick={() => handleTabChange('assistant')}
          >
            🤝 Assistant
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          <div className="tab-info">
            {activeTab === 'admin' && (
              <div className="role-description">
                <h3>Administrator Access</h3>
                <p>System management, user oversight, and business analytics</p>
              </div>
            )}
            {activeTab === 'driver' && (
              <div className="role-description">
                <h3>Driver Portal</h3>
                <p>View assignments, update delivery status, and manage routes</p>
              </div>
            )}
            {activeTab === 'assistant' && (
              <div className="role-description">
                <h3>Assistant Dashboard</h3>
                <p>Support tickets, driver assistance, and inventory management</p>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {error && <div className="error-message">{error}</div>}
            
            <div className="form-group">
              <label htmlFor="username">
                {activeTab === 'admin' ? 'Admin ID' : 
                 activeTab === 'driver' ? 'Driver ID or Email' : 'Assistant ID or Email'}
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder={
                  activeTab === 'admin' ? 'Enter Admin ID (e.g., ADM001)' :
                  activeTab === 'driver' ? 'Enter Driver ID or Email' :
                  'Enter Assistant ID or Email'
                }
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
            </div>

            <button type="submit" className={`login-btn ${activeTab}`} disabled={loading}>
              {loading ? 'Signing In...' : `Sign In as ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`}
            </button>
          </form>
        </div>

        <div className="login-footer">
          <a href="/forgot-password">Forgot Password?</a>
          <span> | </span>
          <a href="/help">Need Help?</a>
          <div className="portal-switch">
            <a href="/login">← Customer Portal</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeLogin;
