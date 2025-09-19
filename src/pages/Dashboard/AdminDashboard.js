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
  },
  header: {
    backgroundColor: '#1e293b',
    padding: '20px 30px',
    borderBottom: '1px solid #334155',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    margin: 0,
    fontSize: '28px',
    fontWeight: '700',
    color: '#f8fafc',
  },
  headerSubtitle: {
    margin: '4px 0 0 0',
    fontSize: '14px',
    color: '#94a3b8',
  },
  headerActions: {
    display: 'flex',
    gap: '12px',
  },
  quickActionBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    backgroundColor: '#dc2626',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  secondaryBtn: {
    backgroundColor: '#475569',
    color: '#f8fafc',
  },
  actionIcon: {
    fontSize: '16px',
  },
  mainContent: {
    padding: '30px',
    flex: 1,
  },
  kpiGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  },
  kpiCard: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '24px',
    display: 'flex',
    alignItems: 'center',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  kpiIcon: {
    fontSize: '48px',
    marginRight: '20px',
    backgroundColor: '#f1f5f9',
    height: '80px',
    width: '80px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '12px',
  },
  kpiInfo: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  kpiValue: {
    margin: 0,
    fontSize: '36px',
    fontWeight: '700',
    color: '#1e293b',
    lineHeight: 1,
  },
  kpiTitle: {
    margin: '8px 0 4px 0',
    color: '#64748b',
    fontSize: '14px',
    fontWeight: '500',
  },
  kpiTrend: {
    margin: 0,
    fontSize: '12px',
    fontWeight: '600',
  },
  widgetGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  },
  statusWidget: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  performanceWidget: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  widgetTitle: {
    margin: '0 0 16px 0',
    fontSize: '18px',
    fontWeight: '600',
    color: '#1e293b',
  },
  statusList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  statusItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  statusDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
  },
  statusText: {
    flex: 1,
    fontSize: '14px',
    color: '#475569',
  },
  statusValue: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1e293b',
  },
  performanceMetrics: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  metric: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 0',
    borderBottom: '1px solid #e2e8f0',
  },
  metricLabel: {
    fontSize: '14px',
    color: '#475569',
  },
  metricValue: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1e293b',
  },
  chartsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '20px',
  },
  controlPanel: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  controlActions: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
    marginTop: '16px',
  },
  controlBtn: {
    padding: '12px 16px',
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#374151',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
};

export default AdminDashboard;