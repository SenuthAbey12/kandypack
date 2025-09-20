import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';

// --- Reusable Component for Key Metric Cards ---
const KpiCard = ({ title, value, icon, trend, color = "#2563eb" }) => {
  return (
    <div style={{...styles.kpiCard, borderLeft: `4px solid ${color}`}}>
      <div style={styles.kpiIcon}>{icon}</div>
      <div style={styles.kpiInfo}>
        <p style={styles.kpiValue}>{value}</p>
        <p style={styles.kpiTitle}>{title}</p>
        {trend && (
          <p style={{...styles.kpiTrend, color: trend > 0 ? '#10b981' : '#ef4444'}}>
            {trend > 0 ? '↗' : '↘'} {Math.abs(trend)}%
          </p>
        )}
      </div>
    </div>
  );
};

// --- Quick Action Button Component ---
const QuickAction = ({ title, icon, onClick, variant = "primary" }) => {
  return (
    <button 
      style={{...styles.quickActionBtn, ...(variant === 'secondary' ? styles.secondaryBtn : {})}}
      onClick={onClick}
    >
      <span style={styles.actionIcon}>{icon}</span>
      {title}
    </button>
  );
};

// --- Status Widget Component ---
const StatusWidget = ({ title, items }) => {
  return (
    <div style={styles.statusWidget}>
      <h4 style={styles.widgetTitle}>{title}</h4>
      <div style={styles.statusList}>
        {items.map((item, index) => (
          <div key={index} style={styles.statusItem}>
            <div style={{...styles.statusDot, backgroundColor: item.color}}></div>
            <span style={styles.statusText}>{item.text}</span>
            <span style={styles.statusValue}>{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Admin Dashboard Component ---
const AdminDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { products, orders, notifications, updateProduct, deleteProduct, addProduct } = useStore();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleQuickAction = (action) => {
    alert(`${action} feature will be implemented soon!`);
  };

  const systemHealth = [
    { text: "Server Status", value: "Online", color: "#10b981" },
    { text: "Database", value: "Healthy", color: "#10b981" },
    { text: "API Response", value: "120ms", color: "#3b82f6" },
    { text: "Active Sessions", value: "47", color: "#8b5cf6" }
  ];

  const businessActivity = [
    { text: "New Customer Registrations", value: "8", color: "#10b981" },
    { text: "Active Customers (24h)", value: "142", color: "#3b82f6" },
    { text: "Customer Inquiries", value: "5", color: "#f59e0b" },
    { text: "Payment Issues", value: "2", color: "#ef4444" }
  ];

  const recentActivity = [
    { text: "User john.doe created order #1245", value: "2m ago", color: "#10b981" },
    { text: "System backup completed", value: "1h ago", color: "#3b82f6" },
    { text: "High CPU usage alert resolved", value: "3h ago", color: "#f59e0b" }
  ];

  return (
    <div style={styles.dashboard}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.headerTitle}>KandyPack Admin Dashboard</h1>
          <p style={styles.headerSubtitle}>
            {currentTime.toLocaleDateString()} • {currentTime.toLocaleTimeString()} • Business Management Portal
          </p>
        </div>
        <div style={styles.headerActions}>
          <QuickAction title="Inventory Management" icon="📦" onClick={() => handleQuickAction('Inventory Management')} />
          <QuickAction title="Customer Management" icon="👥" onClick={() => handleQuickAction('Customer Management')} />
          <QuickAction title="Sales Reports" icon="📊" onClick={() => handleQuickAction('Sales Reports')} variant="secondary" />
        </div>
      </header>
      
      <main style={styles.mainContent}>
        {/* --- Admin KPIs --- */}
        <div style={styles.kpiGrid}>
          <KpiCard title="Business Customers" value="487" icon="👥" trend={8} color="#3b82f6" />
          <KpiCard title="Service Uptime" value="99.8%" icon="⚡" trend={0.2} color="#10b981" />
          <KpiCard title="Orders Today" value="156" icon="📦" trend={15} color="#8b5cf6" />
          <KpiCard title="Revenue Today" value="$12,450" icon="💰" trend={22} color="#f59e0b" />
          <KpiCard title="Active Orders" value="47" icon="🔗" trend={-3} color="#06b6d4" />
          <KpiCard title="Inventory Alerts" value="2" icon="🚨" trend={-50} color="#ef4444" />
        </div>

        {/* --- Admin Control Widgets --- */}
        <div style={styles.widgetGrid}>
          <StatusWidget title="System Health" items={systemHealth} />
          <StatusWidget title="Business Activity" items={businessActivity} />
          
          <div style={styles.performanceWidget}>
            <h4 style={styles.widgetTitle}>System Performance</h4>
            <div style={styles.performanceMetrics}>
              <div style={styles.metric}>
                <span style={styles.metricLabel}>CPU Usage</span>
                <span style={styles.metricValue}>34%</span>
              </div>
              <div style={styles.metric}>
                <span style={styles.metricLabel}>Memory Usage</span>
                <span style={styles.metricValue}>2.8GB / 8GB</span>
              </div>
              <div style={styles.metric}>
                <span style={styles.metricLabel}>Storage Used</span>
                <span style={styles.metricValue}>245GB / 500GB</span>
              </div>
              <div style={styles.metric}>
                <span style={styles.metricLabel}>Network I/O</span>
                <span style={styles.metricValue}>1.2 MB/s</span>
              </div>
            </div>
          </div>

          <StatusWidget title="Recent Activity" items={recentActivity} />
          <StatusWidget title="Notifications" items={notifications.slice(0,4).map(n => ({ text: n.text, value: n.type, color: '#3b82f6' }))} />
        </div>

        {/* --- Admin Control Panels --- */}
        <div style={styles.chartsGrid}>
          <div style={styles.controlPanel}>
            <h3>Customer Management</h3>
            <div style={styles.controlActions}>
              <button style={styles.controlBtn}>View All Customers</button>
              <button style={styles.controlBtn}>Customer Support</button>
              <button style={styles.controlBtn}>Manage Accounts</button>
              <button style={styles.controlBtn}>Access Logs</button>
            </div>
          </div>
          
          <div style={styles.controlPanel}>
            <h3>Business Operations</h3>
            <div style={styles.controlActions}>
              <button style={styles.controlBtn}>Inventory Backup</button>
              <button style={styles.controlBtn}>System Maintenance</button>
              <button style={styles.controlBtn}>Clear Cache</button>
              <button style={styles.controlBtn}>Export Data</button>
            </div>
          </div>
          
          <div style={styles.controlPanel}>
            <h3>Sales & Analytics</h3>
            <div style={styles.controlActions}>
              <button style={styles.controlBtn}>Sales Analytics</button>
              <button style={styles.controlBtn}>Business Reports</button>
              <button style={styles.controlBtn}>Customer Metrics</button>
              <button style={styles.controlBtn}>Export Reports</button>
            </div>
          </div>

          <div style={styles.controlPanel}>
            <h3>Packaging Inventory (Quick Manage)</h3>
            <div style={{ display: 'grid', gap: 8 }}>
              {products.slice(0,5).map(p => (
                <div key={p.id} style={{ display: 'grid', gridTemplateColumns: '1fr auto auto auto', gap: 8, alignItems: 'center' }}>
                  <div>{p.title} — ${p.price.toFixed(2)}</div>
                  <button style={styles.controlBtn} onClick={() => updateProduct(p.id, { price: +(p.price + 1).toFixed(2) })}>Price +1</button>
                  <button style={styles.controlBtn} onClick={() => updateProduct(p.id, { stock: p.stock + 10 })}>Stock +10</button>
                  <button style={{...styles.controlBtn, color:'#ef4444'}} onClick={() => deleteProduct(p.id)}>Delete</button>
                </div>
              ))}
              <button style={styles.controlBtn} onClick={() => addProduct({ title: 'New Packaging Item', price: 5, category: 'Specialty Packaging', stock: 10 })}>Add New Item</button>
            </div>
          </div>

          <div style={styles.controlPanel}>
            <h3>Customer Orders</h3>
            <div style={{ display: 'grid', gap: 8 }}>
              {orders.slice(0,6).map(o => (
                <div key={o.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>{o.id} • {o.status}</div>
                  <div>${o.total.toFixed(2)}</div>
                </div>
              ))}
              {orders.length === 0 && <div className="text-muted">No orders yet.</div>}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const styles = {
  dashboard: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: '#f1f5f9',
    width: '100vw',
    overflow: 'hidden',
  },
  header: {
    backgroundColor: '#1e293b',
    padding: 'clamp(1rem, 4vw, 1.875rem) clamp(1.25rem, 6vw, 1.875rem)',
    borderBottom: '1px solid #334155',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 'clamp(0.75rem, 3vw, 1rem)',
  },
  headerTitle: {
    margin: 0,
    fontSize: 'clamp(1.25rem, 5vw, 1.75rem)',
    fontWeight: '700',
    color: '#f8fafc',
    lineHeight: '1.2',
  },
  headerSubtitle: {
    margin: 'clamp(0.25rem, 1vh, 0.25rem) 0 0 0',
    fontSize: 'clamp(0.8rem, 2.5vw, 0.875rem)',
    color: '#94a3b8',
    lineHeight: '1.4',
  },
  headerActions: {
    display: 'flex',
    gap: 'clamp(0.5rem, 2vw, 0.75rem)',
    flexWrap: 'wrap',
  },
  quickActionBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 'clamp(0.375rem, 2vw, 0.5rem)',
    padding: 'clamp(0.5rem, 2.5vw, 0.625rem) clamp(0.75rem, 3vw, 1rem)',
    backgroundColor: '#dc2626',
    color: 'white',
    border: 'none',
    borderRadius: 'clamp(0.375rem, 2vw, 0.5rem)',
    fontSize: 'clamp(0.8rem, 2.5vw, 0.875rem)',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s',
    minHeight: 'clamp(2rem, 6vw, 2.5rem)',
    whiteSpace: 'nowrap',
    ':hover': {
      backgroundColor: '#b91c1c',
      transform: 'translateY(-1px)',
    },
  },
  secondaryBtn: {
    backgroundColor: '#475569',
    color: '#f8fafc',
    ':hover': {
      backgroundColor: '#334155',
    },
  },
  actionIcon: {
    fontSize: 'clamp(0.875rem, 3vw, 1rem)',
  },
  mainContent: {
    padding: 'clamp(1rem, 5vw, 1.875rem)',
    flex: 1,
    overflow: 'auto',
  },
  kpiGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(14rem, 80vw, 15.625rem), 1fr))',
    gap: 'clamp(0.75rem, 3vw, 1.25rem)',
    marginBottom: 'clamp(1.25rem, 5vh, 1.875rem)',
  },
  kpiCard: {
    backgroundColor: '#ffffff',
    borderRadius: 'clamp(0.5rem, 2vw, 0.75rem)',
    padding: 'clamp(1rem, 4vw, 1.5rem)',
    display: 'flex',
    alignItems: 'center',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    gap: 'clamp(0.75rem, 3vw, 1.25rem)',
    minHeight: 'clamp(4rem, 15vh, 6rem)',
    ':hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    },
  },
  kpiIcon: {
    fontSize: 'clamp(1.5rem, 6vw, 3rem)',
    backgroundColor: '#f1f5f9',
    height: 'clamp(3rem, 12vw, 5rem)',
    width: 'clamp(3rem, 12vw, 5rem)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 'clamp(0.5rem, 2vw, 0.75rem)',
    flexShrink: 0,
  },
  kpiInfo: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    minWidth: 0,
  },
  kpiValue: {
    margin: 0,
    fontSize: 'clamp(1.25rem, 5vw, 2.25rem)',
    fontWeight: '700',
    color: '#1e293b',
    lineHeight: 1,
    wordBreak: 'break-word',
  },
  kpiTitle: {
    margin: 'clamp(0.25rem, 1vh, 0.5rem) 0 clamp(0.125rem, 0.5vh, 0.25rem) 0',
    color: '#64748b',
    fontSize: 'clamp(0.8rem, 2.5vw, 0.875rem)',
    fontWeight: '500',
    lineHeight: '1.3',
  },
  kpiTrend: {
    margin: 0,
    fontSize: 'clamp(0.7rem, 2vw, 0.75rem)',
    fontWeight: '600',
  },
  widgetGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(16rem, 85vw, 18.75rem), 1fr))',
    gap: 'clamp(0.75rem, 3vw, 1.25rem)',
    marginBottom: 'clamp(1.25rem, 5vh, 1.875rem)',
  },
  statusWidget: {
    backgroundColor: '#ffffff',
    borderRadius: 'clamp(0.5rem, 2vw, 0.75rem)',
    padding: 'clamp(1rem, 4vw, 1.25rem)',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  performanceWidget: {
    backgroundColor: '#ffffff',
    borderRadius: 'clamp(0.5rem, 2vw, 0.75rem)',
    padding: 'clamp(1rem, 4vw, 1.25rem)',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  widgetTitle: {
    margin: '0 0 clamp(0.75rem, 3vh, 1rem) 0',
    fontSize: 'clamp(1rem, 3.5vw, 1.125rem)',
    fontWeight: '600',
    color: '#1e293b',
    lineHeight: '1.3',
  },
  statusList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'clamp(0.5rem, 2vh, 0.75rem)',
  },
  statusItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 'clamp(0.5rem, 2vw, 0.75rem)',
    flexWrap: 'wrap',
    minHeight: 'clamp(1.5rem, 5vh, 2rem)',
  },
  statusDot: {
    width: 'clamp(0.375rem, 1.5vw, 0.5rem)',
    height: 'clamp(0.375rem, 1.5vw, 0.5rem)',
    borderRadius: '50%',
    flexShrink: 0,
  },
  statusText: {
    flex: 1,
    fontSize: 'clamp(0.8rem, 2.5vw, 0.875rem)',
    color: '#475569',
    lineHeight: '1.4',
    minWidth: '8rem',
  },
  statusValue: {
    fontSize: 'clamp(0.8rem, 2.5vw, 0.875rem)',
    fontWeight: '600',
    color: '#1e293b',
    whiteSpace: 'nowrap',
  },
  performanceMetrics: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'clamp(0.75rem, 3vh, 1rem)',
  },
  metric: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 'clamp(0.5rem, 2vh, 0.75rem) 0',
    borderBottom: '1px solid #e2e8f0',
    gap: 'clamp(0.5rem, 2vw, 1rem)',
  },
  metricLabel: {
    fontSize: 'clamp(0.8rem, 2.5vw, 0.875rem)',
    color: '#475569',
    lineHeight: '1.4',
  },
  metricValue: {
    fontSize: 'clamp(0.875rem, 3vw, 1rem)',
    fontWeight: '600',
    color: '#1e293b',
    whiteSpace: 'nowrap',
  },
  chartsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(18rem, 90vw, 21.875rem), 1fr))',
    gap: 'clamp(0.75rem, 3vw, 1.25rem)',
  },
  controlPanel: {
    backgroundColor: '#ffffff',
    borderRadius: 'clamp(0.5rem, 2vw, 0.75rem)',
    padding: 'clamp(1rem, 4vw, 1.5rem)',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  controlActions: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(8rem, 40vw, 10rem), 1fr))',
    gap: 'clamp(0.5rem, 2vw, 0.75rem)',
    marginTop: 'clamp(0.75rem, 3vh, 1rem)',
  },
  controlBtn: {
    padding: 'clamp(0.5rem, 2.5vw, 0.75rem) clamp(0.75rem, 3vw, 1rem)',
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: 'clamp(0.375rem, 2vw, 0.5rem)',
    fontSize: 'clamp(0.8rem, 2.5vw, 0.875rem)',
    color: '#374151',
    cursor: 'pointer',
    transition: 'all 0.2s',
    minHeight: 'clamp(2rem, 6vw, 2.5rem)',
    whiteSpace: 'nowrap',
    textAlign: 'center',
    ':hover': {
      backgroundColor: '#f1f5f9',
      borderColor: '#cbd5e1',
      transform: 'translateY(-1px)',
    },
  },
};

// Enhanced responsive CSS styles for comprehensive screen size support
const adminDashboardStyles = `
  /* Mobile First: Base styles for 320px+ */
  @media screen and (min-width: 320px) {
    .admin-dashboard {
      padding: 0;
    }
    .admin-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
      padding: 1rem;
    }
    .admin-header-actions {
      flex-direction: column;
      width: 100%;
      gap: 0.5rem;
    }
    .admin-kpi-grid {
      grid-template-columns: 1fr;
      gap: 0.75rem;
    }
    .admin-widget-grid {
      grid-template-columns: 1fr;
      gap: 0.75rem;
    }
    .admin-charts-grid {
      grid-template-columns: 1fr;
      gap: 0.75rem;
    }
    .admin-control-actions {
      grid-template-columns: 1fr;
    }
  }

  /* Small Mobile: 375px+ */
  @media screen and (min-width: 375px) {
    .admin-header {
      padding: 1.25rem;
    }
    .admin-main-content {
      padding: 1rem;
    }
    .admin-control-actions {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  /* Large Mobile: 425px+ */
  @media screen and (min-width: 425px) {
    .admin-header-actions {
      flex-direction: row;
      flex-wrap: wrap;
    }
    .admin-kpi-grid {
      gap: 1rem;
    }
    .admin-widget-grid {
      gap: 1rem;
    }
  }

  /* Small Tablet: 600px+ */
  @media screen and (min-width: 600px) {
    .admin-header {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }
    .admin-header-actions {
      width: auto;
    }
    .admin-kpi-grid {
      grid-template-columns: repeat(2, 1fr);
    }
    .admin-widget-grid {
      grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
    }
  }

  /* Medium Tablet: 768px+ */
  @media screen and (min-width: 768px) {
    .admin-header {
      padding: 1.5rem 1.25rem;
    }
    .admin-main-content {
      padding: 1.25rem;
    }
    .admin-kpi-grid {
      grid-template-columns: repeat(3, 1fr);
      gap: 1.25rem;
    }
    .admin-widget-grid {
      gap: 1.25rem;
    }
    .admin-charts-grid {
      grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));
      gap: 1.25rem;
    }
  }

  /* Large Tablet: 1024px+ */
  @media screen and (min-width: 1024px) {
    .admin-header {
      padding: 1.75rem 1.5rem;
    }
    .admin-main-content {
      padding: 1.5rem;
    }
    .admin-kpi-grid {
      grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
      gap: 1.5rem;
    }
    .admin-widget-grid {
      grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));
      gap: 1.5rem;
    }
    .admin-charts-grid {
      grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));
      gap: 1.5rem;
    }
  }

  /* Small Desktop: 1280px+ */
  @media screen and (min-width: 1280px) {
    .admin-header {
      padding: 1.875rem;
    }
    .admin-main-content {
      padding: 1.75rem;
    }
    .admin-kpi-grid {
      grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
    }
    .admin-widget-grid {
      grid-template-columns: repeat(auto-fit, minmax(19rem, 1fr));
    }
  }

  /* Large Desktop: 1440px+ */
  @media screen and (min-width: 1440px) {
    .admin-header {
      padding: 2rem;
    }
    .admin-main-content {
      padding: 2rem;
    }
    .admin-kpi-grid {
      grid-template-columns: repeat(auto-fit, minmax(17rem, 1fr));
    }
  }

  /* Ultra-wide: 1920px+ */
  @media screen and (min-width: 1920px) {
    .admin-main-content {
      padding: 2.5rem;
    }
    .admin-kpi-grid {
      grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));
      gap: 2rem;
    }
    .admin-widget-grid {
      gap: 2rem;
    }
    .admin-charts-grid {
      gap: 2rem;
    }
  }

  /* Touch devices optimization */
  @media (hover: none) and (pointer: coarse) {
    .admin-quick-action-btn {
      min-height: 3rem;
      padding: 0.75rem 1rem;
    }
    .admin-quick-action-btn:hover {
      transform: none;
      background-color: #dc2626;
    }
    .admin-quick-action-btn:active {
      transform: scale(0.98);
      background-color: #b91c1c;
    }
    .admin-control-btn {
      min-height: 2.5rem;
      padding: 0.75rem 1rem;
    }
    .admin-control-btn:hover {
      transform: none;
    }
    .admin-control-btn:active {
      transform: scale(0.98);
    }
    .admin-kpi-card:hover {
      transform: none;
    }
  }

  /* Landscape orientation for mobile */
  @media screen and (max-height: 500px) and (orientation: landscape) {
    .admin-header {
      padding: 0.75rem 1rem;
    }
    .admin-main-content {
      padding: 0.75rem;
    }
    .admin-kpi-grid {
      grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
      gap: 0.75rem;
    }
    .admin-kpi-card {
      padding: 0.75rem;
      min-height: 3rem;
    }
    .admin-kpi-icon {
      width: 2.5rem;
      height: 2.5rem;
      font-size: 1.25rem;
    }
    .admin-kpi-value {
      font-size: 1.25rem;
    }
  }

  /* High DPI displays */
  @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
    .admin-kpi-card {
      box-shadow: 0 2px 6px rgba(0,0,0,0.08);
    }
    .admin-status-widget {
      box-shadow: 0 2px 6px rgba(0,0,0,0.08);
    }
    .admin-control-panel {
      box-shadow: 0 2px 6px rgba(0,0,0,0.08);
    }
  }

  /* Reduced motion preferences */
  @media (prefers-reduced-motion: reduce) {
    .admin-quick-action-btn {
      transition: none;
    }
    .admin-quick-action-btn:hover {
      transform: none;
    }
    .admin-control-btn {
      transition: none;
    }
    .admin-control-btn:hover {
      transform: none;
    }
    .admin-kpi-card {
      transition: none;
    }
    .admin-kpi-card:hover {
      transform: none;
    }
  }

  /* Print styles */
  @media print {
    .admin-dashboard {
      background: white;
    }
    .admin-header {
      background: white;
      color: black;
      border-bottom: 2px solid #000;
      box-shadow: none;
    }
    .admin-header-actions {
      display: none;
    }
    .admin-kpi-card {
      border: 1px solid #e2e8f0;
      box-shadow: none;
    }
  }
`;

// Apply responsive styles to document head
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = adminDashboardStyles;
  if (!document.head.querySelector('style[data-admin-dashboard-responsive]')) {
    styleElement.setAttribute('data-admin-dashboard-responsive', 'true');
    document.head.appendChild(styleElement);
  }
}

export default AdminDashboard;