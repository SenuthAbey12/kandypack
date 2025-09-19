import React from 'react'
import { useNavigate, Link } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Supply Chain Distribution Access</h1>
        <p style={styles.subtitle}>Select your role in the rail & road logistics network</p>
      </div>

      {/* Login Options */}
      <div style={styles.content}>
        <div style={styles.cardContainer}>
          {/* Admin Login Card */}
          <div style={{...styles.card, ...styles.adminCard}} onClick={() => navigate('/login/admin')}>
            <div style={styles.cardHeader}>
              <div style={{...styles.cardIcon, ...styles.adminIcon}}>⚙️</div>
              <h3 style={styles.cardTitle}>Operations Control</h3>
            </div>
            <div style={styles.cardBody}>
              <p style={styles.cardDescription}>
                Access the operations dashboard to manage rail & road logistics, track distribution networks, handle supply chain operations, and oversee transportation systems.
              </p>
              <ul style={styles.featureList}>
                <li>📊 Network Analytics</li>
                <li>🚛 Fleet Management</li>
                <li>🗺️ Route Optimization</li>
                <li>📈 Distribution Tracking</li>
              </ul>
            </div>
            <button style={{...styles.loginButton, ...styles.adminButton}}>
              Access Admin Dashboard →
            </button>
          </div>

          {/* Customer Login Card */}
          <div style={{...styles.card, ...styles.customerCard}} onClick={() => navigate('/login/customer')}>
            <div style={styles.cardHeader}>
              <div style={{...styles.cardIcon, ...styles.customerIcon}}>🏭</div>
              <h3 style={styles.cardTitle}>Supply Chain Partner</h3>
            </div>
            <div style={styles.cardBody}>
              <p style={styles.cardDescription}>
                Access your supply chain portal to manage logistics requirements, track shipments across rail & road networks, and optimize distribution operations.
              </p>
              <ul style={styles.featureList}>
                <li>🚂 Distribution Planning</li>
                <li>📋 Shipment History</li>
                <li>🌐 Multi-Modal Tracking</li>
                <li>📊 Logistics Analytics</li>
              </ul>
            </div>
            <button style={{...styles.loginButton, ...styles.customerButton}}>
              Access Distribution Portal →
            </button>
          </div>
        </div>

        {/* Sign Up Section */}
        <div style={styles.signupSection}>
          <p style={styles.signupText}>
            Don't have an account yet? 
            <Link to="/signup" style={styles.signupLink}> Create New Account</Link>
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
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
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
    '@media (max-width: 768px)': {
      fontSize: '2rem',
    },
  },
  subtitle: {
    fontSize: '1.1rem',
    opacity: 0.9,
    margin: 0,
    '@media (max-width: 768px)': {
      fontSize: '1rem',
    },
  },
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '0 20px 40px',
  },
  cardContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '30px',
    maxWidth: '900px',
    width: '100%',
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
      gap: '20px',
    },
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '20px',
    padding: '30px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textAlign: 'center',
    border: '2px solid transparent',
    ':hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
    },
  },
  adminCard: {
    borderImage: 'linear-gradient(135deg, #667eea, #764ba2) 1',
  },
  customerCard: {
    borderImage: 'linear-gradient(135deg, #4facfe, #00f2fe) 1',
  },
  cardHeader: {
    marginBottom: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  cardIcon: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2.5rem',
    marginBottom: '15px',
    boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
  },
  adminIcon: {
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
  },
  customerIcon: {
    background: 'linear-gradient(135deg, #4facfe, #00f2fe)',
  },
  cardTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#1e293b',
    margin: 0,
    textAlign: 'center',
  },
  cardBody: {
    marginBottom: '25px',
    textAlign: 'left',
  },
  cardDescription: {
    color: '#64748b',
    lineHeight: '1.6',
    marginBottom: '20px',
    fontSize: '0.95rem',
  },
  featureList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  loginButton: {
    width: '100%',
    padding: '15px 20px',
    border: 'none',
    borderRadius: '12px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    color: 'white',
    textAlign: 'center',
    ':hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
    },
  },
  adminButton: {
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
  },
  customerButton: {
    background: 'linear-gradient(135deg, #4facfe, #00f2fe)',
  },
  signupSection: {
    marginTop: '40px',
    textAlign: 'center',
  },
  signupText: {
    color: 'white',
    fontSize: '1rem',
    margin: 0,
  },
  signupLink: {
    color: '#fbbf24',
    textDecoration: 'none',
    fontWeight: '600',
    ':hover': {
      textDecoration: 'underline',
    },
  },
  backSection: {
    marginTop: '20px',
    textAlign: 'center',
  },
  backLink: {
    color: 'rgba(255,255,255,0.8)',
    textDecoration: 'none',
    fontSize: '0.9rem',
    ':hover': {
      color: 'white',
      textDecoration: 'underline',
    },
  },
};