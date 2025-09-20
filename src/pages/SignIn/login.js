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
    overflow: 'hidden',
    width: '100vw',
  },
  header: {
    textAlign: 'center',
    padding: 'clamp(2rem, 8vh, 3.75rem) clamp(1rem, 5vw, 1.25rem) clamp(1.5rem, 6vh, 2.5rem)',
    color: 'white',
  },
  title: {
    fontSize: 'clamp(1.5rem, 6vw, 2.5rem)',
    fontWeight: 'bold',
    margin: '0 0 clamp(0.75rem, 3vh, 1rem) 0',
    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
    lineHeight: '1.2',
  },
  subtitle: {
    fontSize: 'clamp(0.9rem, 3vw, 1.1rem)',
    opacity: 0.9,
    margin: 0,
    lineHeight: '1.5',
  },
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '0 clamp(1rem, 5vw, 1.25rem) clamp(1.5rem, 6vh, 2.5rem)',
  },
  cardContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(18rem, 80vw, 25rem), 1fr))',
    gap: 'clamp(1.25rem, 4vw, 1.875rem)',
    maxWidth: 'min(56.25rem, 95vw)',
    width: '100%',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 'clamp(0.75rem, 3vw, 1.25rem)',
    padding: 'clamp(1.25rem, 6vw, 1.875rem)',
    boxShadow: '0 clamp(0.75rem, 2vw, 1.25rem) clamp(1.5rem, 4vw, 2.5rem) rgba(0,0,0,0.1)',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textAlign: 'center',
    border: '2px solid transparent',
    minHeight: 'clamp(20rem, 40vh, 28rem)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    ':hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 clamp(1rem, 3vw, 1.5625rem) clamp(2rem, 5vw, 3.125rem) rgba(0,0,0,0.15)',
    },
    '@media (max-width: 480px)': {
      padding: 'clamp(1rem, 5vw, 1.5rem)',
      minHeight: 'auto',
    },
  },
  adminCard: {
    borderImage: 'linear-gradient(135deg, #667eea, #764ba2) 1',
  },
  customerCard: {
    borderImage: 'linear-gradient(135deg, #4facfe, #00f2fe) 1',
  },
  cardHeader: {
    marginBottom: 'clamp(1rem, 4vw, 1.25rem)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  cardIcon: {
    width: 'clamp(3rem, 15vw, 5rem)',
    height: 'clamp(3rem, 15vw, 5rem)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 'clamp(1.5rem, 6vw, 2.5rem)',
    marginBottom: 'clamp(0.75rem, 3vw, 0.9375rem)',
    boxShadow: '0 clamp(0.375rem, 2vw, 0.625rem) clamp(0.75rem, 3vw, 1.25rem) rgba(0,0,0,0.1)',
  },
  adminIcon: {
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
  },
  customerIcon: {
    background: 'linear-gradient(135deg, #4facfe, #00f2fe)',
  },
  cardTitle: {
    fontSize: 'clamp(1.1rem, 4vw, 1.5rem)',
    fontWeight: 'bold',
    color: '#1e293b',
    margin: 0,
    textAlign: 'center',
    lineHeight: '1.3',
  },
  cardBody: {
    marginBottom: 'clamp(1rem, 4vw, 1.5625rem)',
    textAlign: 'left',
    flex: 1,
  },
  cardDescription: {
    color: '#64748b',
    lineHeight: '1.6',
    marginBottom: 'clamp(0.75rem, 3vw, 1.25rem)',
    fontSize: 'clamp(0.8rem, 2.5vw, 0.95rem)',
  },
  featureList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    fontSize: 'clamp(0.75rem, 2.5vw, 0.875rem)',
    lineHeight: '1.6',
  },
  loginButton: {
    width: '100%',
    padding: 'clamp(0.75rem, 3vw, 0.9375rem) clamp(1rem, 4vw, 1.25rem)',
    border: 'none',
    borderRadius: 'clamp(0.5rem, 2vw, 0.75rem)',
    fontSize: 'clamp(0.875rem, 3vw, 1rem)',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    color: 'white',
    textAlign: 'center',
    minHeight: 'clamp(2.5rem, 8vw, 3rem)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    ':hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 clamp(0.375rem, 2vw, 0.5rem) clamp(0.75rem, 3vw, 1.25rem) rgba(0,0,0,0.2)',
    },
    ':active': {
      transform: 'translateY(0)',
    },
  },
  adminButton: {
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
  },
  customerButton: {
    background: 'linear-gradient(135deg, #4facfe, #00f2fe)',
  },
  signupSection: {
    marginTop: 'clamp(1.5rem, 6vh, 2.5rem)',
    textAlign: 'center',
  },
  signupText: {
    color: 'white',
    fontSize: 'clamp(0.875rem, 3vw, 1rem)',
    margin: 0,
    lineHeight: '1.5',
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
    marginTop: 'clamp(1rem, 4vh, 1.25rem)',
    textAlign: 'center',
  },
  backLink: {
    color: 'rgba(255,255,255,0.8)',
    textDecoration: 'none',
    fontSize: 'clamp(0.8rem, 2.5vw, 0.9rem)',
    ':hover': {
      color: 'white',
      textDecoration: 'underline',
    },
  },
};

// Enhanced responsive CSS styles for comprehensive screen size support
const loginPageStyles = `
  /* Mobile First: Base styles for 320px+ */
  @media screen and (min-width: 320px) {
    .login-container {
      padding: 1rem;
    }
    .login-card-container {
      grid-template-columns: 1fr;
      gap: 1rem;
    }
    .login-card {
      min-height: auto;
      padding: 1rem;
    }
  }

  /* Small Mobile: 375px+ */
  @media screen and (min-width: 375px) {
    .login-header {
      padding: 2rem 1.25rem 1.5rem;
    }
    .login-card {
      padding: 1.25rem;
    }
  }

  /* Large Mobile: 425px+ */
  @media screen and (min-width: 425px) {
    .login-card {
      padding: 1.5rem;
    }
    .login-card-container {
      gap: 1.25rem;
    }
  }

  /* Small Tablet: 768px+ */
  @media screen and (min-width: 768px) {
    .login-container {
      padding: 1.25rem;
    }
    .login-header {
      padding: 3rem 1.25rem 2rem;
    }
    .login-card-container {
      grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));
      gap: 1.5rem;
    }
    .login-card {
      padding: 1.75rem;
      min-height: 22rem;
    }
  }

  /* Large Tablet: 1024px+ */
  @media screen and (min-width: 1024px) {
    .login-card-container {
      grid-template-columns: repeat(2, 1fr);
      gap: 2rem;
      max-width: 50rem;
    }
    .login-card {
      padding: 2rem;
      min-height: 25rem;
    }
  }

  /* Small Desktop: 1440px+ */
  @media screen and (min-width: 1440px) {
    .login-header {
      padding: 4rem 1.25rem 2.5rem;
    }
    .login-card-container {
      max-width: 56.25rem;
      gap: 2.5rem;
    }
    .login-card {
      padding: 2.5rem;
      min-height: 28rem;
    }
  }

  /* Large Desktop: 1920px+ */
  @media screen and (min-width: 1920px) {
    .login-container {
      padding: 2rem;
    }
    .login-header {
      padding: 5rem 2rem 3rem;
    }
    .login-card-container {
      max-width: 70rem;
      gap: 3rem;
    }
    .login-card {
      padding: 3rem;
      min-height: 32rem;
    }
  }

  /* Touch devices optimization */
  @media (hover: none) and (pointer: coarse) {
    .login-card {
      cursor: default;
      transition: none;
    }
    .login-card:hover {
      transform: none;
      box-shadow: 0 1.25rem 2.5rem rgba(0,0,0,0.1);
    }
    .login-button {
      min-height: 3rem;
      font-size: 1rem;
    }
    .login-button:hover {
      transform: none;
    }
    .login-button:active {
      transform: scale(0.98);
    }
  }

  /* Landscape orientation for mobile */
  @media screen and (max-height: 500px) and (orientation: landscape) {
    .login-header {
      padding: 1rem 1.25rem;
    }
    .login-content {
      padding: 0 1.25rem 1rem;
    }
    .login-card {
      min-height: auto;
      padding: 1rem;
    }
  }

  /* Reduced motion preferences */
  @media (prefers-reduced-motion: reduce) {
    .login-card {
      transition: none;
    }
    .login-card:hover {
      transform: none;
    }
    .login-button {
      transition: none;
    }
    .login-button:hover {
      transform: none;
    }
  }
`;

// Apply responsive styles to document head
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = loginPageStyles;
  if (!document.head.querySelector('style[data-login-responsive]')) {
    styleElement.setAttribute('data-login-responsive', 'true');
    document.head.appendChild(styleElement);
  }
}