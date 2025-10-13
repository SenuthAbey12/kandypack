import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const CustomerPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [orders, setOrders] = useState([]);
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [trackingId, setTrackingId] = useState('');
  

  // User-specific storage key
  const userKey = useMemo(() => `kandypack_orders:${user?.id || user?.email || 'guest'}`, [user]);

  // Load user orders from localStorage
  useEffect(() => {
    const loadOrders = () => {
      try {
        const saved = localStorage.getItem(userKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          setOrders(Array.isArray(parsed) ? parsed : []);
        } else {
          // Seed with realistic FMCG orders
          const seededOrders = [
            {
              id: 'KP-2024-001',
              customer_id: user?.id || 'CUST001',
              status: 'In Transit',
              transport_mode: 'Rail',
              route: 'Kandy → Colombo',
              items: [
                { product_id: 'P001', quantity: 50, product_name: 'Detergent Powder 1kg' },
                { product_id: 'P003', quantity: 30, product_name: 'Cooking Oil 1L' }
              ],
              total_space: 70.0,
              total_value: 35100,
              order_date: '2024-01-10',
              estimated_delivery: '2024-01-17',
              actual_delivery: null,
              progress: 75,
              delivery_city: 'Colombo',
              train_assignment: { trip_id: 'TRAIN-A21', departure: '2024-01-15 08:00' },
              truck_assignment: { truck_id: 'TRUCK-R7', driver: 'Kamal Perera' },
              customer_notes: 'Urgent delivery for supermarket restock'
            },
            {
              id: 'KP-2024-002',
              customer_id: user?.id || 'CUST001',
              status: 'Delivered',
              transport_mode: 'Road',
              route: 'Kandy → Galle',
              items: [
                { product_id: 'P005', quantity: 20, product_name: 'Tea Leaves 500g' },
                { product_id: 'P006', quantity: 15, product_name: 'Biscuits 200g (Pack of 24)' }
              ],
              total_space: 20.0,
              total_value: 14600,
              order_date: '2024-01-05',
              estimated_delivery: '2024-01-12',
              actual_delivery: '2024-01-12',
              progress: 100,
              delivery_city: 'Galle',
              train_assignment: null,
              truck_assignment: { truck_id: 'TRUCK-G12', driver: 'Sunil Fernando' },
              customer_notes: 'Regular monthly supply'
            },
            {
              id: 'KP-2024-003',
              customer_id: user?.id || 'CUST001',
              status: 'Processing',
              transport_mode: 'Rail',
              route: 'Kandy → Jaffna',
              items: [
                { product_id: 'P002', quantity: 100, product_name: 'Toilet Soap 100g (Pack of 12)' },
                { product_id: 'P007', quantity: 40, product_name: 'Shampoo 400ml' }
              ],
              total_space: 50.0,
              total_value: 48800,
              order_date: '2024-01-12',
              estimated_delivery: '2024-01-20',
              actual_delivery: null,
              progress: 25,
              delivery_city: 'Jaffna',
              train_assignment: { trip_id: 'TRAIN-B15', departure: '2024-01-18 06:00' },
              truck_assignment: null,
              customer_notes: 'Bulk order for distributor'
            }
          ];
          setOrders(seededOrders);
        }
      } catch (error) {
        console.error('Error loading orders:', error);
      }
    };

    loadOrders();
  }, [userKey, user]);

  // Save orders to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(userKey, JSON.stringify(orders));
    } catch (error) {
      console.error('Error saving orders:', error);
    }
  }, [orders, userKey]);

  // Simulate real-time order updates
  useEffect(() => {
    const interval = setInterval(() => {
      setOrders(prev => prev.map(order => {
        if (['Processing', 'In Transit'].includes(order.status) && order.progress < 100) {
          const increment = order.status === 'Processing' ? 5 : 10;
          const newProgress = Math.min(100, order.progress + increment);
          let newStatus = order.status;
          
          if (newProgress >= 100) {
            newStatus = 'Delivered';
          } else if (newProgress >= 50 && order.status === 'Processing') {
            newStatus = 'In Transit';
          }
          
          return {
            ...order,
            progress: newProgress,
            status: newStatus,
            actual_delivery: newStatus === 'Delivered' ? new Date().toISOString().split('T')[0] : order.actual_delivery
          };
        }
        return order;
      }));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // Calculate business statistics
  const stats = useMemo(() => {
    const totalOrders = orders.length;
    const activeShipments = orders.filter(o => ['In Transit', 'Processing', 'Scheduled'].includes(o.status)).length;
    const totalOrderValue = orders.reduce((sum, order) => sum + order.total_value, 0);
    const railDeliveries = orders.filter(o => o.transport_mode === 'Rail').length;
    const averageDeliveryTime = orders.filter(o => o.actual_delivery)
      .reduce((sum, order) => {
        const orderDate = new Date(order.order_date);
        const deliveryDate = new Date(order.actual_delivery);
        return sum + (deliveryDate - orderDate) / (1000 * 60 * 60 * 24);
      }, 0) / orders.filter(o => o.actual_delivery).length || 0;

    return { totalOrders, activeShipments, totalOrderValue, railDeliveries, averageDeliveryTime };
  }, [orders]);

  // Filter orders by status
  const currentOrders = orders.filter(o => ['In Transit', 'Processing', 'Scheduled'].includes(o.status));
  const pastOrders = orders.filter(o => o.status === 'Delivered');

  // Get status style
  const getStatusStyle = (status) => {
    const styles = {
      'Processing': { backgroundColor: '#f39c12', color: 'white' },
      'In Transit': { backgroundColor: '#3498db', color: 'white' },
      'Delivered': { backgroundColor: '#27ae60', color: 'white' },
      'Scheduled': { backgroundColor: '#9b59b6', color: 'white' },
      'Cancelled': { backgroundColor: '#e74c3c', color: 'white' }
    };
    return styles[status] || { backgroundColor: '#95a5a6', color: 'white' };
  };

  // Render Dashboard
  const renderDashboard = () => (
    <div style={styles.dashboardGrid}>
      {/* Statistics Cards */}
      <div style={styles.statsContainer}>
        <div 
          style={styles.statCard}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.15)';
            e.currentTarget.style.borderColor = 'rgba(102, 126, 234, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
            e.currentTarget.style.borderColor = 'rgba(233, 236, 239, 0.8)';
          }}
        >
          <div style={styles.statGlow}></div>
          <div style={styles.statIcon}>📦</div>
          <div style={styles.statContent}>
            <h3>{stats.totalOrders}</h3>
            <p>Total Orders</p>
            <small>LKR {stats.totalOrderValue?.toLocaleString()}</small>
          </div>
        </div>
        <div 
          style={styles.statCard}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.15)';
            e.currentTarget.style.borderColor = 'rgba(102, 126, 234, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
            e.currentTarget.style.borderColor = 'rgba(233, 236, 239, 0.8)';
          }}
        >
          <div style={styles.statGlow}></div>
          <div style={styles.statIcon}>🚚</div>
          <div style={styles.statContent}>
            <h3>{stats.activeShipments}</h3>
            <p>Active Shipments</p>
            <small>In pipeline</small>
          </div>
        </div>
        <div 
          style={styles.statCard}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.15)';
            e.currentTarget.style.borderColor = 'rgba(102, 126, 234, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
            e.currentTarget.style.borderColor = 'rgba(233, 236, 239, 0.8)';
          }}
        >
          <div style={styles.statGlow}></div>
          <div style={styles.statIcon}>🚂</div>
          <div style={styles.statContent}>
            <h3>{stats.railDeliveries}</h3>
            <p>Rail Deliveries</p>
            <small>Cost-efficient</small>
          </div>
        </div>
        <div 
          style={styles.statCard}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.15)';
            e.currentTarget.style.borderColor = 'rgba(102, 126, 234, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
            e.currentTarget.style.borderColor = 'rgba(233, 236, 239, 0.8)';
          }}
        >
          <div style={styles.statGlow}></div>
          <div style={styles.statIcon}>⏱️</div>
          <div style={styles.statContent}>
            <h3>{stats.averageDeliveryTime?.toFixed(1)}</h3>
            <p>Avg. Days</p>
            <small>Delivery time</small>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={styles.actionsSection}>
        <h3 style={styles.sectionTitle}>Quick Actions</h3>
        <div style={styles.actionButtons}>
          <button style={styles.actionBtn} onClick={() => navigate('/products')}>
            <span style={styles.actionIcon}>🛒</span>
            <div>
              <div style={styles.actionTitle}>Place New Order</div>
              <div style={styles.actionDesc}>FMCG products catalog</div>
            </div>
          </button>
          <button style={styles.actionBtn} onClick={() => setShowTrackingModal(true)}>
            <span style={styles.actionIcon}>📍</span>
            <div>
              <div style={styles.actionTitle}>Track Shipment</div>
              <div style={styles.actionDesc}>Real-time order tracking</div>
            </div>
          </button>
          <button style={styles.actionBtn} onClick={() => setActiveTab('support')}>
            <span style={styles.actionIcon}>💬</span>
            <div>
              <div style={styles.actionTitle}>Get Support</div>
              <div style={styles.actionDesc}>Customer service</div>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Orders Preview */}
      <div style={styles.ordersSection}>
        <h3 style={styles.sectionTitle}>Recent Orders</h3>
        <div style={styles.ordersList}>
          {orders.slice(0, 3).map(order => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      </div>
    </div>
  );

  // Order Card Component
  const OrderCard = ({ order }) => (
    <div 
      style={styles.orderCard}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
        e.currentTarget.style.borderColor = '#667eea';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
        e.currentTarget.style.borderColor = '#e9ecef';
      }}
    >
      <div style={styles.orderGlow}></div>
      <div style={styles.orderHeader}>
        <div>
          <span style={styles.orderId}>{order.id}</span>
          <span style={styles.orderDate}>{order.order_date}</span>
        </div>
        <span style={{ ...styles.orderStatus, ...getStatusStyle(order.status) }}>
          {order.status}
        </span>
      </div>
      
      <div style={styles.orderDetails}>
        <div style={styles.orderInfo}>
          <div style={styles.transportMode}>
            <span style={styles.modeIcon}>
              {order.transport_mode === 'Rail' ? '🚂' : '🚛'}
            </span>
            <span>{order.transport_mode} • {order.route}</span>
          </div>
          
          <div style={styles.orderItems}>
            {order.items.slice(0, 2).map((item, index) => (
              <span key={index} style={styles.itemTag}>
                {item.product_name} × {item.quantity}
              </span>
            ))}
            {order.items.length > 2 && (
              <span style={styles.moreItems}>+{order.items.length - 2} more</span>
            )}
          </div>
          
          <div style={styles.orderMeta}>
            <span>Space: {order.total_space} units</span>
            <span>Value: LKR {order.total_value?.toLocaleString()}</span>
            <span>City: {order.delivery_city}</span>
          </div>

          {order.train_assignment && (
            <div style={styles.assignmentInfo}>
              <small>Train: {order.train_assignment.trip_id} • Dep: {order.train_assignment.departure}</small>
            </div>
          )}
        </div>

        <div style={styles.progressContainer}>
          <div style={styles.progressBar}>
            <div style={{ ...styles.progressFill, width: `${order.progress}%` }}></div>
          </div>
          <span style={styles.progressText}>
            {order.status === 'Delivered' ? 'Delivered' : `${order.progress}%`}
          </span>
          <div style={styles.eta}>
            {order.status === 'Delivered' ? order.actual_delivery : `ETA: ${order.estimated_delivery}`}
          </div>
        </div>
      </div>
    </div>
  );

  // Render Current Orders
  const renderCurrentOrders = () => (
    <div style={styles.ordersSection}>
      <h3 style={styles.sectionTitle}>Current Orders • {currentOrders.length} Active</h3>
      <div style={styles.ordersList}>
        {currentOrders.map(order => (
          <OrderCard key={order.id} order={order} />
        ))}
        {currentOrders.length === 0 && (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>📦</div>
            <h4>No Active Orders</h4>
            <p>You don't have any orders in progress</p>
            <button style={styles.primaryBtn} onClick={() => navigate('/products')}>
              Place Your First Order
            </button>
          </div>
        )}
      </div>
    </div>
  );

  // Render Order History
  const renderOrderHistory = () => (
    <div style={styles.ordersSection}>
      <h3 style={styles.sectionTitle}>Order History • {pastOrders.length} Delivered</h3>
      <div style={styles.ordersList}>
        {pastOrders.map(order => (
          <OrderCard key={order.id} order={order} />
        ))}
        {pastOrders.length === 0 && (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>📋</div>
            <h4>No Order History</h4>
            <p>Your delivered orders will appear here</p>
          </div>
        )}
      </div>
    </div>
  );

  // Render Delivery Tracking
  const renderDeliveryTracking = () => (
    <div style={styles.ordersSection}>
      <h3 style={styles.sectionTitle}>Delivery Tracking</h3>
      <div style={styles.trackingContainer}>
        <div style={styles.trackingInput}>
          <input
            style={styles.input}
            placeholder="Enter Order ID (e.g., KP-2024-001)"
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
          />
          <button style={styles.primaryBtn} onClick={() => setTrackingId(trackingId)}>
            Track Order
          </button>
        </div>

        {trackingId && (
          <div style={styles.trackingResult}>
            {(() => {
              const order = orders.find(o => o.id === trackingId);
              if (!order) {
                return (
                  <div style={styles.trackingNotFound}>
                    <div style={styles.statusIcon}>❌</div>
                    <h4>Order Not Found</h4>
                    <p>No order found with ID: {trackingId}</p>
                  </div>
                );
              }

              return (
                <div style={styles.trackingDetails}>
                  <div style={styles.trackingHeader}>
                    <h4>Order {order.id}</h4>
                    <span style={{ ...styles.orderStatus, ...getStatusStyle(order.status) }}>
                      {order.status}
                    </span>
                  </div>

                  <div style={styles.trackingTimeline}>
                    <div style={styles.timelineStep}>
                      <div style={styles.timelineDot}></div>
                      <div style={styles.timelineContent}>
                        <strong>Order Placed</strong>
                        <p>{order.order_date}</p>
                      </div>
                    </div>
                    
                    <div style={styles.timelineStep}>
                      <div style={{ 
                        ...styles.timelineDot, 
                        ...(order.progress >= 25 ? styles.timelineDotActive : {}) 
                      }}></div>
                      <div style={styles.timelineContent}>
                        <strong>Processing</strong>
                        <p>Quality check & packaging</p>
                      </div>
                    </div>

                    {order.train_assignment && (
                      <div style={styles.timelineStep}>
                        <div style={{ 
                          ...styles.timelineDot, 
                          ...(order.progress >= 50 ? styles.timelineDotActive : {}) 
                        }}></div>
                        <div style={styles.timelineContent}>
                          <strong>Rail Transport</strong>
                          <p>Train {order.train_assignment.trip_id}</p>
                          <small>Departs: {order.train_assignment.departure}</small>
                        </div>
                      </div>
                    )}

                    <div style={styles.timelineStep}>
                      <div style={{ 
                        ...styles.timelineDot, 
                        ...(order.progress >= 75 ? styles.timelineDotActive : {}) 
                      }}></div>
                      <div style={styles.timelineContent}>
                        <strong>Last-Mile Delivery</strong>
                        {order.truck_assignment ? (
                          <p>Truck {order.truck_assignment.truck_id} • Driver: {order.truck_assignment.driver}</p>
                        ) : (
                          <p>Awaiting truck assignment</p>
                        )}
                      </div>
                    </div>

                    <div style={styles.timelineStep}>
                      <div style={{ 
                        ...styles.timelineDot, 
                        ...(order.progress === 100 ? styles.timelineDotActive : {}) 
                      }}></div>
                      <div style={styles.timelineContent}>
                        <strong>Delivered</strong>
                        {order.actual_delivery ? (
                          <p>Completed on {order.actual_delivery}</p>
                        ) : (
                          <p>Estimated: {order.estimated_delivery}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );

  // Render Support
  const renderSupport = () => (
    <div style={styles.ordersSection}>
      <h3 style={styles.sectionTitle}>Customer Support</h3>
      <div style={styles.supportGrid}>
        <div style={styles.supportCard}>
          <h4>📞 Contact Information</h4>
          <div style={styles.contactInfo}>
            <p><strong>Kandypack Head Office</strong></p>
            <p>Kandy, Sri Lanka</p>
            <p>Phone: +94 81 234 5678</p>
            <p>Email: support@kandypack.lk</p>
            <p>Business Hours: 8:00 AM - 6:00 PM</p>
          </div>
        </div>

        <div style={styles.supportCard}>
          <h4>❓ Frequently Asked Questions</h4>
          <div style={styles.faqList}>
            <div style={styles.faqItem}>
              <strong>How far in advance should I place orders?</strong>
              <p>Minimum 7 days advance required for train scheduling and capacity allocation.</p>
            </div>
            <div style={styles.faqItem}>
              <strong>What is the space consumption rate?</strong>
              <p>Each product has a specific space consumption rate for train capacity planning.</p>
            </div>
            <div style={styles.faqItem}>
              <strong>How is last-mile delivery handled?</strong>
              <p>Trucks from local stores handle final delivery based on predefined routes.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={styles.container}>
      <div style={styles.backgroundPattern}></div>
      <div style={styles.appShell}>
        {/* Sidebar */}
        <aside style={styles.sidebar}>
          <div style={styles.sidebarGlow}></div>
          <div style={styles.sidebarBrand}>
            <div style={styles.brandLogo}>KP</div>
            <div>
              <div style={styles.brandTitle}>Kandypack</div>
              <div style={styles.brandSubtitle}>FMCG Distribution</div>
            </div>
          </div>

          <nav style={styles.sidebarNav}>
            {[
              { id: 'dashboard', icon: '📊', label: 'Dashboard' },
              { id: 'current', icon: '🚚', label: 'Current Orders' },
              { id: 'history', icon: '📋', label: 'Order History' },
              { id: 'tracking', icon: '📍', label: 'Track Delivery' },
              { id: 'support', icon: '💬', label: 'Support' }
            ].map(item => (
              <button
                key={item.id}
                style={
                  activeTab === item.id 
                    ? { ...styles.sidebarItem, ...styles.sidebarItemActive }
                    : styles.sidebarItem
                }
                onClick={() => setActiveTab(item.id)}
              >
                <span style={styles.sidebarIcon}>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
            
            <div style={styles.sidebarSpacer}></div>
            
            <button
              style={styles.sidebarItem}
              onClick={() => navigate('/products')}
            >
              <span style={styles.sidebarIcon}>🛒</span>
              <span>Place New Order</span>
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <div style={styles.contentArea}>
          <header style={styles.header}>
            <div style={styles.headerContent}>
              <div style={styles.headerLeft}>
                <h1 style={styles.title}>Kandypack Customer Portal</h1>
                <p style={styles.subtitle}>
                  {user?.company_name || 'Wholesale Distributor'} • {user?.name || 'Customer'}
                </p>
              </div>
              <div style={styles.headerRight}>
                <div style={styles.userInfo}>
                  <span style={styles.userName}>{user?.name || 'Customer'}</span>
                  <span style={styles.userRole}>{user?.company_name || 'Wholesale Partner'}</span>
                </div>
              </div>
            </div>
          </header>

          <main style={styles.main}>
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'current' && renderCurrentOrders()}
            {activeTab === 'history' && renderOrderHistory()}
            {activeTab === 'tracking' && renderDeliveryTracking()}
            {activeTab === 'support' && renderSupport()}
          </main>
        </div>
      </div>

      {/* Tracking Modal */}
      {showTrackingModal && (
        <div style={styles.modalOverlay} onClick={() => setShowTrackingModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalGlow}></div>
            <div style={styles.modalHeader}>
              <h3>Track Your Shipment</h3>
              <button style={styles.closeBtn} onClick={() => setShowTrackingModal(false)}>×</button>
            </div>
            <div style={styles.modalContent}>
              {renderDeliveryTracking()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Enhanced styles with FMCG theme
const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    position: 'relative',
    overflowX: 'hidden'
  },
  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `
      radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(120, 119, 198, 0.2) 0%, transparent 50%)
    `,
    pointerEvents: 'none'
  },
  appShell: {
    display: 'flex',
    minHeight: '100vh',
    position: 'relative',
    zIndex: 1
  },
  sidebar: {
    width: '280px',
    background: 'rgba(255,255,255,0.95)',
    backdropFilter: 'blur(20px)',
    borderRight: '1px solid rgba(255,255,255,0.3)',
    padding: '24px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    boxShadow: '2px 0 20px rgba(0,0,0,0.08)',
    position: 'relative'
  },
  sidebarGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '100px',
    background: 'linear-gradient(180deg, rgba(102, 126, 234, 0.1) 0%, transparent 100%)',
    pointerEvents: 'none'
  },
  sidebarBrand: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '8px 12px',
    color: '#2c3e50'
  },
  brandLogo: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '800',
    color: 'white'
  },
  brandTitle: {
    fontSize: '18px',
    fontWeight: '700',
    lineHeight: '1.1'
  },
  brandSubtitle: {
    fontSize: '12px',
    color: '#7f8c8d',
    marginTop: '2px'
  },
  sidebarNav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    flex: 1
  },
  sidebarItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    color: '#2c3e50',
    background: 'transparent',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    textAlign: 'left',
    fontSize: '14px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden',
    fontWeight: '500'
  },
  sidebarItemHover: {
    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))',
    transform: 'translateX(4px)',
    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)'
  },
  sidebarItemActive: {
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    color: 'white',
    boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)',
    transform: 'translateX(6px)'
  },
  sidebarIcon: {
    width: '20px',
    textAlign: 'center',
    fontSize: '16px'
  },
  sidebarSpacer: {
    flex: 1
  },
  contentArea: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    background: '#f8f9fa'
  },
  header: {
    background: 'white',
    padding: '20px 40px',
    borderBottom: '1px solid #e9ecef',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  headerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '1400px',
    margin: '0 auto'
  },
  headerLeft: {
    color: '#2c3e50'
  },
  title: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    margin: '0 0 4px 0',
    color: '#2c3e50'
  },
  subtitle: {
    fontSize: '1rem',
    color: '#7f8c8d',
    margin: '0'
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  userInfo: {
    textAlign: 'right'
  },
  userName: {
    display: 'block',
    fontWeight: '600',
    color: '#2c3e50'
  },
  userRole: {
    display: 'block',
    fontSize: '12px',
    color: '#7f8c8d'
  },
  main: {
    flex: 1,
    padding: '40px',
    maxWidth: '1400px',
    margin: '0 auto',
    width: '100%'
  },
  dashboardGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '30px'
  },
  statsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '24px'
  },
  statCard: {
    background: 'white',
    borderRadius: '16px',
    padding: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    border: '1px solid rgba(233, 236, 239, 0.8)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden',
    cursor: 'pointer'
  },
  statCardHover: {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
    borderColor: 'rgba(102, 126, 234, 0.3)'
  },
  statGlow: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '100px',
    height: '100px',
    background: 'radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 70%)',
    borderRadius: '50%',
    transform: 'translate(30px, -30px)',
    pointerEvents: 'none'
  },
  statIcon: {
    fontSize: '2rem',
    width: '60px',
    height: '60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    borderRadius: '12px',
    color: 'white'
  },
  statContent: {
    flex: 1
  },
  actionsSection: {
    background: 'white',
    borderRadius: '12px',
    padding: '30px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    border: '1px solid #e9ecef'
  },
  sectionTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: '20px',
    letterSpacing: '-0.5px',
    position: 'relative'
  },
  sectionTitleAccent: {
    position: 'absolute',
    bottom: '-5px',
    left: 0,
    width: '60px',
    height: '4px',
    background: 'linear-gradient(90deg, #667eea, #764ba2)',
    borderRadius: '2px'
  },
  actionButtons: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '16px'
  },
  actionBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '20px',
    background: 'white',
    border: '2px solid #e9ecef',
    borderRadius: '16px',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    textAlign: 'left',
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    fontWeight: '500'
  },
  actionBtnHover: {
    transform: 'translateY(-3px)',
    boxShadow: '0 8px 24px rgba(102, 126, 234, 0.15)',
    borderColor: '#667eea'
  },
  actionGlow: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '80px',
    height: '80px',
    background: 'radial-gradient(circle, rgba(102, 126, 234, 0.08) 0%, transparent 70%)',
    borderRadius: '50%',
    transform: 'translate(20px, -20px)',
    pointerEvents: 'none'
  },
  actionIcon: {
    fontSize: '1.5rem',
    width: '50px',
    height: '50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    borderRadius: '10px',
    color: 'white'
  },
  actionTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: '4px'
  },
  actionDesc: {
    fontSize: '14px',
    color: '#7f8c8d'
  },
  ordersSection: {
    background: 'white',
    borderRadius: '12px',
    padding: '30px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    border: '1px solid #e9ecef'
  },
  ordersList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  orderCard: {
    border: '1px solid #e9ecef',
    borderRadius: '16px',
    padding: '20px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    background: 'white',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    cursor: 'pointer'
  },
  orderCardHover: {
    transform: 'translateY(-3px)',
    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
    borderColor: '#667eea'
  },
  orderGlow: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '100px',
    height: '100px',
    background: 'radial-gradient(circle, rgba(102, 126, 234, 0.06) 0%, transparent 70%)',
    borderRadius: '50%',
    transform: 'translate(30px, -30px)',
    pointerEvents: 'none'
  },
  orderHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '16px'
  },
  orderId: {
    fontWeight: 'bold',
    fontSize: '16px',
    color: '#2c3e50',
    display: 'block'
  },
  orderDate: {
    fontSize: '12px',
    color: '#7f8c8d',
    marginTop: '2px'
  },
  orderStatus: {
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    whiteSpace: 'nowrap'
  },
  orderDetails: {
    display: 'grid',
    gridTemplateColumns: '1fr auto',
    gap: '20px',
    alignItems: 'center'
  },
  orderInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  transportMode: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#2c3e50'
  },
  modeIcon: {
    fontSize: '16px'
  },
  orderItems: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
    margin: '8px 0'
  },
  itemTag: {
    background: '#f8f9fa',
    padding: '4px 8px',
    borderRadius: '6px',
    fontSize: '12px',
    color: '#495057',
    border: '1px solid #e9ecef'
  },
  moreItems: {
    fontSize: '12px',
    color: '#7f8c8d',
    fontStyle: 'italic'
  },
  orderMeta: {
    display: 'flex',
    gap: '12px',
    fontSize: '12px',
    color: '#7f8c8d'
  },
  assignmentInfo: {
    marginTop: '8px'
  },
  progressContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    minWidth: '120px'
  },
  progressBar: {
    width: '100%',
    height: '6px',
    background: '#e9ecef',
    borderRadius: '3px',
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #667eea, #764ba2)',
    transition: 'width 0.3s ease',
    borderRadius: '3px'
  },
  progressText: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#2c3e50'
  },
  eta: {
    fontSize: '11px',
    color: '#7f8c8d'
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#7f8c8d'
  },
  emptyIcon: {
    fontSize: '4rem',
    marginBottom: '16px',
    opacity: 0.5
  },
  primaryBtn: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '12px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)',
    textTransform: 'none',
    letterSpacing: '0.5px'
  },
  primaryBtnHover: {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)',
    background: 'linear-gradient(135deg, #5a67d8 0%, #667eea 100%)'
  },
  primaryBtnGlow: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '20px',
    height: '20px',
    background: 'rgba(255, 255, 255, 0.3)',
    borderRadius: '50%',
    transform: 'translate(-50%, -50%) scale(0)',
    transition: 'transform 0.3s ease',
    pointerEvents: 'none'
  },
  trackingContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  trackingInput: {
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-end'
  },
  input: {
    flex: 1,
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '14px'
  },
  trackingResult: {
    marginTop: '20px'
  },
  trackingNotFound: {
    textAlign: 'center',
    padding: '40px 20px',
    color: '#7f8c8d'
  },
  trackingDetails: {
    background: '#f8f9fa',
    borderRadius: '12px',
    padding: '24px'
  },
  trackingHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px'
  },
  trackingTimeline: {
    position: 'relative',
    paddingLeft: '20px'
  },
  timelineStep: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '16px',
    marginBottom: '24px',
    position: 'relative'
  },
  timelineDot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    background: '#e9ecef',
    marginTop: '4px',
    flexShrink: 0
  },
  timelineDotActive: {
    background: '#27ae60'
  },
  timelineContent: {
    flex: 1
  },
  supportGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '20px'
  },
  supportCard: {
    background: '#f8f9fa',
    borderRadius: '12px',
    padding: '24px',
    border: '1px solid #e9ecef'
  },
  contactInfo: {
    lineHeight: '1.6'
  },
  faqList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  faqItem: {
    paddingBottom: '16px',
    borderBottom: '1px solid #e9ecef'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px'
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: '20px',
    width: '100%',
    maxWidth: '800px',
    maxHeight: '90vh',
    overflow: 'hidden',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
    border: '1px solid rgba(255,255,255,0.2)',
    backdropFilter: 'blur(20px)',
    position: 'relative'
  },
  modalGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
    borderRadius: '20px',
    pointerEvents: 'none'
  },
  modalHeader: {
    padding: '24px 24px 16px 24px',
    borderBottom: '1px solid #e9ecef',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#7f8c8d',
    width: '30px',
    height: '30px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%'
  },
  modalContent: {
    padding: '24px'
  }
};

export default CustomerPage;