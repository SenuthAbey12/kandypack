import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    address: '',
    city: '',
    mobileNo: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Validation
    if (!formData.name || !formData.email || !formData.username || !formData.password) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {
      // Simulate successful signup
      setSuccess('Account created successfully! Redirecting...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError('Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.iconContainer}>
            <span style={styles.icon}>🎉</span>
          </div>
          <h1 style={styles.title}>Join KandyPack Business Network</h1>
          <p style={styles.subtitle}>Create your business account for packaging supplies</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.row}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                style={styles.input}
                disabled={loading}
              />
            </div>
          </div>

          <div style={styles.row}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                style={styles.input}
                disabled={loading}
              />
            </div>
          </div>

          <div style={styles.row}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Username *</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Choose a username"
                style={styles.input}
                disabled={loading}
              />
            </div>
          </div>

          <div style={styles.row}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Business address"
                style={styles.input}
                disabled={loading}
              />
            </div>
          </div>

          <div style={styles.row}>
            <div style={{...styles.inputGroup, flex: 1}}>
              <label style={styles.label}>City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Business city"
                style={styles.input}
                disabled={loading}
              />
            </div>
            <div style={{...styles.inputGroup, flex: 1, marginLeft: '12px'}}>
              <label style={styles.label}>Mobile No</label>
              <input
                type="tel"
                name="mobileNo"
                value={formData.mobileNo}
                onChange={handleChange}
                placeholder="Business contact number"
                style={styles.input}
                disabled={loading}
              />
            </div>
          </div>

          <div style={styles.row}>
            <div style={{...styles.inputGroup, flex: 1}}>
              <label style={styles.label}>Password *</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create password"
                style={styles.input}
                disabled={loading}
              />
            </div>
            <div style={{...styles.inputGroup, flex: 1, marginLeft: '12px'}}>
              <label style={styles.label}>Confirm Password *</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
                style={styles.input}
                disabled={loading}
              />
            </div>
          </div>

          {error && (
            <div style={styles.errorContainer}>
              <span style={styles.errorIcon}>⚠️</span>
              <span style={styles.errorText}>{error}</span>
            </div>
          )}

          {success && (
            <div style={styles.successContainer}>
              <span style={styles.successIcon}>✅</span>
              <span style={styles.successText}>{success}</span>
            </div>
          )}

          <button 
            type="submit" 
            style={{
              ...styles.submitButton,
              ...(loading ? styles.submitButtonDisabled : {})
            }}
            disabled={loading}
          >
            {loading ? (
              <>
                <span style={styles.spinner}></span>
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Footer Links */}
        <div style={styles.footer}>
          <p style={styles.footerText}>
            Already have an account? 
            <Link to="/login" style={styles.link}> Sign In</Link>
          </p>
          <Link to="/" style={styles.backLink}>← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: '20px',
    padding: '40px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '600px',
    textAlign: 'center',
  },
  header: {
    marginBottom: '30px',
  },
  iconContainer: {
    marginBottom: '16px',
  },
  icon: {
    fontSize: '3rem',
    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
  },
  title: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    color: '#2d3748',
    margin: '0 0 8px 0',
  },
  subtitle: {
    color: '#718096',
    margin: 0,
  },
  form: {
    textAlign: 'left',
  },
  row: {
    display: 'flex',
    marginBottom: '20px',
  },
  inputGroup: {
    flex: 1,
  },
  label: {
    display: 'block',
    marginBottom: '6px',
    color: '#4a5568',
    fontWeight: '500',
    fontSize: '14px',
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '16px',
    transition: 'border-color 0.2s ease',
    outline: 'none',
    boxSizing: 'border-box',
  },
  errorContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#fed7d7',
    color: '#c53030',
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '20px',
    fontSize: '14px',
  },
  successContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#c6f6d5',
    color: '#276749',
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '20px',
    fontSize: '14px',
  },
  errorIcon: {
    fontSize: '16px',
  },
  successIcon: {
    fontSize: '16px',
  },
  errorText: {
    margin: 0,
  },
  successText: {
    margin: 0,
  },
  submitButton: {
    width: '100%',
    padding: '14px 24px',
    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    marginBottom: '24px',
  },
  submitButtonDisabled: {
    opacity: 0.7,
    cursor: 'not-allowed',
  },
  spinner: {
    width: '16px',
    height: '16px',
    border: '2px solid transparent',
    borderTop: '2px solid white',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  footer: {
    textAlign: 'center',
  },
  footerText: {
    color: '#718096',
    fontSize: '14px',
    margin: '0 0 8px 0',
  },
  link: {
    color: '#f5576c',
    textDecoration: 'none',
    fontWeight: '500',
  },
  backLink: {
    color: '#f5576c',
    textDecoration: 'none',
    fontSize: '14px',
    marginTop: '16px',
    display: 'inline-block',
  },
};
