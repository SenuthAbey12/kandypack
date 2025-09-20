import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContextNew';
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
      await login(formData.username, formData.password, formData.role, 'employee');
      navigate('/employee');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="employee-login">
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
                 activeTab === 'driver' ? 'Driver ID' : 'Assistant ID'}
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder={
                  activeTab === 'admin' ? 'Enter Admin ID (e.g., ADM001)' :
                  activeTab === 'driver' ? 'Enter Driver ID (e.g., DRV001)' :
                  'Enter Assistant ID (e.g., AST001)'
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
            <a href="/customer/login">Customer Portal →</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeLogin;