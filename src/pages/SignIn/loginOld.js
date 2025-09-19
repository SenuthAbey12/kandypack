import React from 'react'
import { useNavigate, Link } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Choose Your Login Type</h1>
        <p style={styles.subtitle}>Select the appropriate login option to access your account</p>
      </div>

      {/* Login Options */}
      <div style={styles.content}>
        <div style={styles.cardContainer}>
          {/* Customer Login Card - Main/Highlighted */}
          <div style={{...styles.card, ...styles.customerCard}} onClick={() => navigate('/login/customer')}>
            <div style={styles.cardHeader}>
              <div style={{...styles.cardIcon, ...styles.customerIcon}}>�</div>
              <h3 style={styles.cardTitle}>Customer Login</h3>
              <div style={styles.primaryBadge}>Most Popular</div>
            </div>
            <div style={styles.cardBody}>
              <p style={styles.cardDescription}>
                Access your personal account to browse products, place orders, track shipments, and manage your shopping preferences.
              </p>
              <ul style={styles.featureList}>
                <li>�️ Browse Products</li>
                <li>� Order History</li>
                <li>� Track Shipments</li>
                <li>� Manage Payments</li>
              </ul>
            </div>
            <button style={{...styles.loginButton, ...styles.customerButton}}>
              Access Customer Account →
            </button>
          </div>

          {/* Admin Login Card - Secondary/Smaller */}
          <div style={{...styles.card, ...styles.adminCard}} onClick={() => navigate('/login/admin')}>
            <div style={styles.cardHeader}>
              <div style={{...styles.cardIcon, ...styles.adminIcon}}>👨‍�</div>
              <h3 style={styles.cardTitleSmall}>Admin Access</h3>
            </div>
            <div style={styles.cardBodySmall}>
              <p style={styles.cardDescriptionSmall}>
                Administrative access for business management and system controls.
              </p>
              <ul style={styles.featureListSmall}>
                <li>� Analytics</li>
                <li>� Product Management</li>
                <li>� Customer Support</li>
              </ul>
            </div>
            <button style={{...styles.loginButton, ...styles.adminButton}}>
              Admin Login
            </button>
          </div>
        </div>

        {/* Sign Up Section */}
        <div style={styles.signupSection}>
          <p style={styles.signupText}>
            Don't have an account yet? 
            <Link to="/signup" style={styles.signupLink}> Create New Account</Link>
          </p>
          <p style={styles.adminQuickLink}>
            Admin? <Link to="/login/admin" style={styles.adminLink}>Quick Access</Link>
          </p>
        </div>

        {/* Back to Home */}
        <div style={styles.backSection}>
          <Link to="/" style={styles.backLink}>← Back to Home</Link>
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    textAlign: 'center',
    padding: '60px 20px 40px',
    color: 'white',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    margin: '0 0 16px 0',
    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
  },
  subtitle: {
    fontSize: '1.1rem',
    opacity: 0.9,
    margin: 0,
  },
  content: {
    flex: 1,
    padding: '0 20px 40px',
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%',
  },
  cardContainer: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '30px',
    marginBottom: '40px',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '20px',
    padding: '30px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
  },
  adminCard: {
    background: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)',
    minHeight: '320px',
    transform: 'scale(0.95)',
  },
  customerCard: {
    background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    minHeight: '400px',
    border: '3px solid #48bb78',
    boxShadow: '0 15px 40px rgba(72, 187, 120, 0.3)',
  },
  cardHeader: {
    textAlign: 'center',
    marginBottom: '20px',
    position: 'relative',
  },
  primaryBadge: {
    position: 'absolute',
    top: '-10px',
    right: '-10px',
    backgroundColor: '#48bb78',
    color: 'white',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
  },
  cardIcon: {
    fontSize: '3rem',
    marginBottom: '16px',
    display: 'block',
  },
  adminIcon: {
    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
    fontSize: '2rem',
  },
  customerIcon: {
    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
  },
  cardTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#2d3748',
    margin: 0,
  },
  cardTitleSmall: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#4a5568',
    margin: 0,
  },
  cardBody: {
    flex: 1,
    marginBottom: '24px',
  },
  cardBodySmall: {
    flex: 1,
    marginBottom: '20px',
  },
  cardDescription: {
    color: '#4a5568',
    lineHeight: 1.6,
    marginBottom: '20px',
    fontSize: '15px',
  },
  cardDescriptionSmall: {
    color: '#718096',
    lineHeight: 1.5,
    marginBottom: '16px',
    fontSize: '13px',
  },
  featureList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  featureListSmall: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    fontSize: '13px',
  },
  loginButton: {
    width: '100%',
    padding: '16px 24px',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textAlign: 'center',
  },
  adminButton: {
    background: 'linear-gradient(135deg, #a0aec0 0%, #718096 100%)',
    color: 'white',
    fontSize: '14px',
    padding: '12px 16px',
  },
  customerButton: {
    background: 'linear-gradient(135deg, #48bb78 0%, #38b2ac 100%)',
    color: 'white',
    fontSize: '16px',
    padding: '16px 24px',
  },
  signupSection: {
    textAlign: 'center',
    padding: '24px',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: '12px',
    marginBottom: '20px',
  },
  signupText: {
    color: '#4a5568',
    margin: 0,
    fontSize: '16px',
  },
  signupLink: {
    color: '#667eea',
    textDecoration: 'none',
    fontWeight: '600',
  },
  adminQuickLink: {
    color: '#718096',
    margin: '8px 0 0 0',
    fontSize: '14px',
  },
  adminLink: {
    color: '#a0aec0',
    textDecoration: 'none',
    fontSize: '13px',
  },
  backSection: {
    textAlign: 'center',
  },
  backLink: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '16px',
    opacity: 0.9,
  },
};
