import React from 'react';

// --- Reusable Component for Key Metric Cards ---
const KpiCard = ({ title, value, icon }) => {
  return (
    <div style={styles.kpiCard}>
      <div style={styles.kpiIcon}>{icon}</div>
      <div style={styles.kpiInfo}>
        <p style={styles.kpiValue}>{value}</p>
        <p style={styles.kpiTitle}>{title}</p>
      </div>
    </div>
  );
};

// --- The Main Dashboard Component ---
const Dashboard = () => {
  return (
    <div style={styles.dashboard}>
      <header style={styles.header}>
        <h1 style={styles.headerTitle}>Kandypack Logistics Dashboard</h1>
      </header>
      <main style={styles.mainContent}>
        {/* --- Top Row: Key Metrics --- */}
        <div style={styles.kpiGrid}>
          <KpiCard title="Pending Orders" value="12" icon="📦" />
          <KpiCard title="Trucks on Route" value="4" icon="🚚" />
          <KpiCard title="Deliveries Today" value="8" icon="🗓️" />
          <KpiCard title="Issues Reported" value="1" icon="⚠️" />
        </div>

        {/* --- You can add more dashboard widgets here later --- */}
        <div style={styles.placeholder}>
          <h2>More dashboard widgets coming soon...</h2>
          <p>This is where charts for Order Funnel and Fleet Status will go.</p>
        </div>
      </main>
    </div>
  );
};

// --- Main App Component ---
function App() {
  return (
    <div style={styles.app}>
      <Dashboard />
    </div>
  );
}

// --- CSS Styles ---
const styles = {
  app: {
    fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    backgroundColor: '#f4f7fa',
    minHeight: '100vh',
    color: '#333',
  },
  dashboard: {
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    backgroundColor: '#ffffff',
    padding: '15px 30px',
    borderBottom: '1px solid #dee2e6',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  },
  headerTitle: {
    margin: 0,
    fontSize: '24px',
    color: '#212529',
  },
  mainContent: {
    padding: '30px',
  },
  kpiGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '25px',
  },
  kpiCard: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    padding: '25px',
    display: 'flex',
    alignItems: 'center',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  },
  kpiIcon: {
    fontSize: '40px',
    marginRight: '20px',
    backgroundColor: '#e9ecef',
    height: '60px',
    width: '60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
  },
  kpiInfo: {
    display: 'flex',
    flexDirection: 'column',
  },
  kpiValue: {
    margin: 0,
    fontSize: '32px',
    fontWeight: '600',
    color: '#212529',
  },
  kpiTitle: {
    margin: 0,
    color: '#6c757d',
    fontSize: '14px',
  },
  placeholder: {
    marginTop: '40px',
    padding: '40px',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    textAlign: 'center',
    color: '#6c757d',
  },
};

export default App;
