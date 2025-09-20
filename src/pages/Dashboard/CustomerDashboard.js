import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  ClipboardList,
  Settings as SettingsIcon,
  Sliders,
  ShieldCheck,
  Phone,
  LogOut,
  Package as PackageIcon,
  Train,
  Truck,
  CreditCard,
  Building2,
  MapPin,
  MessageCircle,
  Box,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';

// --- Profile Menu Component ---
const ProfileMenu = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('.profile-menu')) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const menuItems = [
    { icon: <User size={16} />, label: 'Profile Details', action: () => navigate('/account/profile') },
    { icon: <ClipboardList size={16} />, label: 'Order History', action: () => navigate('/account/orders') },
    { icon: <SettingsIcon size={16} />, label: 'Settings', action: () => navigate('/account/settings') },
    { icon: <Sliders size={16} />, label: 'Preferences', action: () => navigate('/account/settings') },
    { icon: <ShieldCheck size={16} />, label: 'Security', action: () => navigate('/account/password') },
    { icon: <Phone size={16} />, label: 'Support', action: () => navigate('/support/chat') },
    { icon: <LogOut size={16} />, label: 'Logout', action: onLogout, isLogout: true }
  ];

  const handleItemClick = (item) => {
    setIsOpen(false);
    item.action();
  };

  return (
    <div className="profile-menu" style={styles.profileMenu}>
      <button 
        style={{
          ...styles.profileTrigger,
          borderRadius: '12px',
          transition: 'background-color 0.2s'
        }}
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = '#334155';
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = 'transparent';
        }}
      >
        <div style={styles.avatarContainer}>
          <div style={styles.avatar}>
            {user?.username?.charAt(0).toUpperCase() || 'C'}
          </div>
          <div style={styles.userInfo}>
            <span style={styles.userName}>{user?.username || 'Customer'}</span>
            <span style={styles.userRole}>Customer</span>
          </div>
          <span style={styles.dropdownArrow}>{isOpen ? '▲' : '▼'}</span>
        </div>
      </button>

      {isOpen && (
        <div style={styles.profileDropdown}>
          <div style={styles.dropdownHeader}>
            <div style={styles.avatarLarge}>
              {user?.username?.charAt(0).toUpperCase() || 'C'}
            </div>
            <div>
              <div style={styles.dropdownUserName}>{user?.username || 'Customer'}</div>
              <div style={styles.dropdownUserEmail}>customer@kandypack.com</div>
            </div>
          </div>
          
          <div style={styles.dropdownDivider}></div>
          
          {menuItems.map((item, index) => (
            <button
              key={index}
              style={{
                ...styles.dropdownItem,
                ...(item.isLogout ? styles.logoutItem : {})
              }}
              onClick={() => handleItemClick(item)}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = item.isLogout ? '#fef2f2' : '#f1f5f9';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
              }}
            >
              <span style={styles.itemIcon}>{item.icon}</span>
              <span style={styles.itemLabel}>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

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

// --- Customer Dashboard Component ---
const CustomerDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { orders, notifications } = useStore();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Add responsive styles for Dashboard
  useEffect(() => {
    if (!document.querySelector('#dashboard-responsive-styles')) {
      const style = document.createElement('style');
      style.id = 'dashboard-responsive-styles';
      style.textContent = `
        @media (max-width: 768px) {
          .dashboard-container {
            padding: 1rem !important;
          }
          
          .dashboard-header {
            flex-direction: column !important;
            gap: 1rem !important;
            text-align: center !important;
          }
          
          .dashboard-kpi-grid {
            grid-template-columns: 1fr !important;
            gap: 1rem !important;
          }
          
          .dashboard-main-content {
            grid-template-columns: 1fr !important;
            gap: 1.5rem !important;
          }
          
          .dashboard-quick-actions {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        
        @media (max-width: 480px) {
          .dashboard-quick-actions {
            grid-template-columns: 1fr !important;
          }
          
          .dashboard-header h1 {
            font-size: 1.5rem !important;
          }
          
          .dashboard-kpi-card {
            padding: 1rem !important;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleQuickAction = (action) => {
    switch(action) {
      case 'New Shipment':
        navigate('/products');
        break;
      case 'Track Logistics':
        navigate('/support/track-order');
        break;
      case 'Distribution Support':
        navigate('/support/chat');
        break;
      default:
        navigate('/');
    }
  };

  const handleCategoryQuickOrder = (category) => {
    // Navigate to products page with category filter
    // This will be handled by the Products page to set the initial category
    navigate(`/products?category=${encodeURIComponent(category)}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const myOrders = orders.slice(0,4).map(o => ({
    text: `${o.id} - ${o.status}`,
    value: new Date(o.placedAt).toLocaleString(),
    color: '#3b82f6'
  }));

  const shipmentTracking = [
    { text: "Package picked up", value: "✓ Complete", color: "#10b981" },
    { text: "In transit to hub", value: "✓ Complete", color: "#10b981" },
    { text: "Out for delivery", value: "🚚 Current", color: "#3b82f6" },
    { text: "Delivered", value: "⏳ Pending", color: "#94a3b8" }
  ];

  const accountActivity = [
    { text: "New order placed", value: "2 hours ago", color: "#10b981" },
    { text: "Payment processed", value: "2 hours ago", color: "#3b82f6" },
    { text: "Profile updated", value: "1 day ago", color: "#8b5cf6" },
    { text: "Password changed", value: "1 week ago", color: "#f59e0b" }
  ];

  return (
    <div style={styles.dashboard}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.headerTitle}>Supply Chain Portal</h1>
          <p style={styles.headerSubtitle}>
            {currentTime.toLocaleDateString()} • {currentTime.toLocaleTimeString()} • Rail & Road Distribution Hub
          </p>
        </div>
        
        <div style={styles.headerCenter}>
          <QuickAction title="New Shipment" icon={<PackageIcon size={16} />} onClick={() => handleQuickAction('New Shipment')} variant="primary" />
          <QuickAction title="Track Logistics" icon={<MapPin size={16} />} onClick={() => handleQuickAction('Track Logistics')} />
          <QuickAction title="Distribution Support" icon={<MessageCircle size={16} />} onClick={() => handleQuickAction('Distribution Support')} variant="secondary" />
        </div>

        <ProfileMenu user={user} onLogout={handleLogout} />
      </header>
      
      <main style={styles.mainContent}>
        {/* --- Supply Chain KPIs --- */}
        <div style={styles.kpiGrid}>
          <KpiCard title="Total Shipments" value="27" icon={<ClipboardList size={18} />} trend={12} color="#3b82f6" />
          <KpiCard title="Rail Transports" value="12" icon={<Train size={18} />} trend={8} color="#10b981" />
          <KpiCard title="Road Deliveries" value="15" icon={<Truck size={18} />} trend={5} color="#8b5cf6" />
          <KpiCard title="Supply Chain Cost" value="$1,245" icon={<CreditCard size={18} />} trend={8} color="#f59e0b" />
          <KpiCard title="In Transit" value="3" icon={<Box size={18} />} trend={-25} color="#06b6d4" />
          <KpiCard title="Distribution Centers" value="8" icon={<Building2 size={18} />} trend={3} color="#ec4899" />
        </div>

        {/* --- Customer Widgets --- */}
        <div style={styles.widgetGrid}>
          <StatusWidget title="My Recent Orders" items={myOrders} />
          <StatusWidget title="Shipment Tracking" items={shipmentTracking} />
          
          <div style={styles.performanceWidget}>
            <h4 style={styles.widgetTitle}>Account Summary</h4>
            <div style={styles.performanceMetrics}>
              <div style={styles.metric}>
                <span style={styles.metricLabel}>Member Since</span>
                <span style={styles.metricValue}>January 2024</span>
              </div>
              <div style={styles.metric}>
                <span style={styles.metricLabel}>Total Spent</span>
                <span style={styles.metricValue}>$4,567</span>
              </div>
              <div style={styles.metric}>
                <span style={styles.metricLabel}>Delivery Address</span>
                <span style={styles.metricValue}>123 Main St, City</span>
              </div>
              <div style={styles.metric}>
                <span style={styles.metricLabel}>Next Delivery</span>
                <span style={styles.metricValue}>Tomorrow 2-4 PM</span>
              </div>
            </div>
          </div>

          <StatusWidget title="Account Activity" items={accountActivity} />
          <StatusWidget title="Notifications" items={notifications.slice(0,4).map(n => ({ text: n.text, value: n.type, color: '#10b981' }))} />
        </div>

        {/* --- Customer Action Panels --- */}
        <div style={styles.chartsGrid}>
          <div style={styles.controlPanel}>
            <h3>Quick Orders by Category</h3>
            <div style={styles.controlActions}>
              <button 
                className="control-btn"
                style={styles.controlBtn}
                onClick={() => handleCategoryQuickOrder('Shipping Boxes')}
              >
                📦 Shipping Boxes
              </button>
              <button 
                className="control-btn"
                style={styles.controlBtn}
                onClick={() => handleCategoryQuickOrder('Protective Wrapping')}
              >
                🧻 Protective Wrapping
              </button>
              <button 
                className="control-btn"
                style={styles.controlBtn}
                onClick={() => handleCategoryQuickOrder('Sealing Supplies')}
              >
                📏 Sealing Supplies
              </button>
              <button 
                className="control-btn"
                style={styles.controlBtn}
                onClick={() => handleCategoryQuickOrder('Custom Solutions')}
              >
                ⭐ Custom Solutions
              </button>
            </div>
          </div>
          
          <div style={styles.controlPanel}>
            <h3>Account Management</h3>
            <div style={styles.controlActions}>
              <button style={styles.controlBtn} onClick={() => navigate('/account/profile')}>Update Profile</button>
              <button style={styles.controlBtn} onClick={() => navigate('/account/password')}>Change Password</button>
              <button style={styles.controlBtn} onClick={() => navigate('/account/addresses')}>Shipping Addresses</button>
              <button style={styles.controlBtn} onClick={() => navigate('/account/payments')}>Payment Methods</button>
            </div>
          </div>
          
          <div style={styles.controlPanel}>
            <h3>Customer Support</h3>
            <div style={styles.controlActions}>
              <button style={styles.controlBtn} onClick={() => navigate('/support/track-order')}>Track Order</button>
              <button style={styles.controlBtn} onClick={() => navigate('/support/returns')}>Return Request</button>
              <button style={styles.controlBtn} onClick={() => navigate('/support/chat')}>Live Chat Support</button>
              <button style={styles.controlBtn} onClick={() => navigate('/support/packaging-help')}>Packaging Help</button>
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
    position: 'relative',
  },
  headerCenter: {
    display: 'flex',
    gap: '12px',
  },
  headerActions: {
    display: 'flex',
    gap: '12px',
  },
  // Profile Menu Styles
  profileMenu: {
    position: 'relative',
  },
  profileTrigger: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
  },
  avatarContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '8px 12px',
    borderRadius: '12px',
    transition: 'background-color 0.2s',
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#3b82f6',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    fontWeight: '600',
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  userName: {
    color: '#f8fafc',
    fontSize: '14px',
    fontWeight: '500',
    lineHeight: '1.2',
  },
  userRole: {
    color: '#94a3b8',
    fontSize: '12px',
    lineHeight: '1.2',
  },
  dropdownArrow: {
    color: '#94a3b8',
    fontSize: '12px',
    marginLeft: '4px',
  },
  profileDropdown: {
    position: 'absolute',
    top: '100%',
    right: '0',
    marginTop: '8px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
    border: '1px solid #e2e8f0',
    minWidth: '240px',
    zIndex: 1000,
    overflow: 'hidden',
  },
  dropdownHeader: {
    padding: '16px',
    borderBottom: '1px solid #e2e8f0',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    backgroundColor: '#f8fafc',
  },
  avatarLarge: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    backgroundColor: '#3b82f6',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    fontWeight: '600',
  },
  dropdownUserName: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1e293b',
    lineHeight: '1.2',
  },
  dropdownUserEmail: {
    fontSize: '14px',
    color: '#64748b',
    lineHeight: '1.2',
  },
  dropdownDivider: {
    height: '1px',
    backgroundColor: '#e2e8f0',
  },
  dropdownItem: {
    width: '100%',
    padding: '12px 16px',
    border: 'none',
    backgroundColor: 'transparent',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#374151',
    transition: 'background-color 0.2s',
    textAlign: 'left',
  },
  logoutItem: {
    color: '#dc2626',
    borderTop: '1px solid #e2e8f0',
  },
  itemIcon: {
    fontSize: '16px',
    width: '20px',
    textAlign: 'center',
  },
  itemLabel: {
    flex: 1,
    textAlign: 'left',
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
  quickActionBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    backgroundColor: '#3b82f6',
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
    transition: 'all 0.3s ease',
    fontWeight: '500',
  },
};

// Add CSS for animations and hover effects
const profileMenuStyles = `
  .profile-menu .profile-trigger:hover .avatar-container {
    background-color: #334155;
  }
  
  .profile-menu .dropdown-item:hover {
    background-color: #f1f5f9;
  }
  
  .profile-menu .logout-item:hover {
    background-color: #fef2f2;
  }
  
  .control-btn {
    transition: all 0.3s ease;
  }
  
  .control-btn:hover {
    background-color: #667eea !important;
    color: white !important;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    border-color: #667eea !important;
  }
  
  .control-btn:active {
    transform: translateY(0);
  }
  
  .profile-dropdown {
    animation: fadeInDown 0.2s ease-out;
  }
  
  @keyframes fadeInDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

// Add styles to document if not already added
if (!document.querySelector('#profile-menu-styles')) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'profile-menu-styles';
  styleSheet.type = 'text/css';
  styleSheet.innerText = profileMenuStyles;
  document.head.appendChild(styleSheet);
}

export default CustomerDashboard;