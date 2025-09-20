import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import ProfileDropdown from '../../Components/ProfileDropdown';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalDrivers: 0,
    totalAssistants: 0,
    totalCustomers: 0,
    pendingOrders: 0,
    completedToday: 0
  });
  const [activeTab, setActiveTab] = useState('overview');
  const [drivers, setDrivers] = useState([]);
  const [assistants, setAssistants] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'warning', message: '5 orders pending driver assignment', timestamp: '2 min ago' },
    { id: 2, type: 'success', message: 'Monthly target achieved!', timestamp: '15 min ago' },
    { id: 3, type: 'info', message: 'New driver application received', timestamp: '1 hour ago' }
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showModal, setShowModal] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [bulkActionType, setBulkActionType] = useState('');

  const { logout } = useAuth();

  const handleAddOrder = () => {
    const newOrder = {
      id: `ORD${String(orders.length + 1).padStart(3, '0')}`,
      customer: 'New Customer',
      date: new Date().toLocaleDateString(),
      status: 'pending',
      priority: 'medium',
      value: 1500,
      driver: null
    };
    setOrders([...orders, newOrder]);
    setShowModal(null);
    setFormData({});
    setNotifications(prev => [{
      id: Date.now(),
      type: 'success',
      message: 'New order created successfully!',
      timestamp: 'Just now'
    }, ...prev]);
  };

  const handleSettings = () => {
    setNotifications(prev => [{
      id: Date.now(),
      type: 'info',
      message: 'Settings panel opened',
      timestamp: 'Just now'
    }, ...prev]);
  };

  const handleHelp = () => {
    setNotifications(prev => [{
      id: Date.now(),
      type: 'info',
      message: 'Help & Support resources available',
      timestamp: 'Just now'
    }, ...prev]);
  };

  const handleContactDriver = (driver) => {
    setNotifications(prev => [{
      id: Date.now(),
      type: 'info',
      message: `Contacting ${driver.name} at ${driver.phone}`,
      timestamp: 'Just now'
    }, ...prev]);
  };

  const handleSuspendDriver = async (driverId) => {
    setIsRefreshing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setDrivers(drivers.map(d => 
        d.id === driverId ? {...d, status: 'suspended'} : d
      ));
      
      setNotifications(prev => [{
        id: Date.now(),
        type: 'warning',
        message: 'Driver has been suspended',
        timestamp: 'Just now'
      }, ...prev]);
    } catch (error) {
      console.error('Error suspending driver:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleViewPerformance = (item) => {
    setNotifications(prev => [{
      id: Date.now(),
      type: 'info',
      message: `Viewing performance data for ${item.name}`,
      timestamp: 'Just now'
    }, ...prev]);
  };

  const handleOrderSelect = (orderId) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleSelectAllOrders = () => {
    const filteredOrders = filterItems(orders, 'orders');
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(filteredOrders.map(order => order.id));
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedOrders.length === 0) return;
    
    setIsRefreshing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (action === 'assign') {
        // Show driver selection modal for bulk assignment
        setShowModal('bulkAssign');
      } else if (action === 'status') {
        // Update status for selected orders
        const updatedOrders = orders.map(order => 
          selectedOrders.includes(order.id) 
            ? { ...order, status: 'processing' }
            : order
        );
        setOrders(updatedOrders);
        setSelectedOrders([]);
        
        setNotifications(prev => [{
          id: Date.now(),
          type: 'success',
          message: `${selectedOrders.length} orders updated to processing`,
          timestamp: 'Just now'
        }, ...prev]);
      }
    } catch (error) {
      console.error('Error in bulk action:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleEdit = (item, type) => {
    setEditMode(true);
    setSelectedItem({...item, type});
    setFormData(item);
    setShowModal('edit');
  };

  const handleSave = async () => {
    setIsRefreshing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (selectedItem.type === 'driver') {
        setDrivers(drivers.map(d => 
          d.id === selectedItem.id ? {...d, ...formData} : d
        ));
      } else if (selectedItem.type === 'assistant') {
        setAssistants(assistants.map(a => 
          a.id === selectedItem.id ? {...a, ...formData} : a
        ));
      } else if (selectedItem.type === 'order') {
        setOrders(orders.map(o => 
          o.id === selectedItem.id ? {...o, ...formData} : o
        ));
      }
      
      setShowModal(null);
      setEditMode(false);
      setFormData({});
      setSelectedItem(null);
      
      // Show success notification
      setNotifications(prev => [{
        id: Date.now(),
        type: 'success',
        message: 'Changes saved successfully!',
        timestamp: 'Just now'
      }, ...prev]);
    } catch (error) {
      console.error('Error saving changes:', error);
      setNotifications(prev => [{
        id: Date.now(),
        type: 'warning',
        message: 'Failed to save changes. Please try again.',
        timestamp: 'Just now'
      }, ...prev]);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStatusChange = async (id, type, newStatus) => {
    setIsRefreshing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (type === 'driver') {
        setDrivers(drivers.map(d => 
          d.id === id ? {...d, status: newStatus} : d
        ));
      } else if (type === 'order') {
        setOrders(orders.map(o => 
          o.id === id ? {...o, status: newStatus} : o
        ));
      }
      
      setNotifications(prev => [{
        id: Date.now(),
        type: 'success',
        message: `Status updated to ${newStatus}`,
        timestamp: 'Just now'
      }, ...prev]);
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    // Simulate real-time data updates
    const interval = setInterval(() => {
      // Simulate new order notifications
      if (Math.random() > 0.7) {
        const newNotification = {
          id: Date.now(),
          type: ['success', 'warning', 'info'][Math.floor(Math.random() * 3)],
          message: [
            'New order received from Colombo',
            'Driver request assistance on Route A',
            'Monthly delivery target 85% complete',
            'System maintenance scheduled for tonight',
            'New customer registration from Kandy'
          ][Math.floor(Math.random() * 5)],
          timestamp: 'Just now'
        };
        
        setNotifications(prev => [newNotification, ...prev.slice(0, 9)]);
        
        // Play notification sound
        try {
          const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DqvmwhBShUu+DFeCgCGmS57+OZEQUY');
          audio.volume = 0.3;
          audio.play().catch(() => {}); // Ignore errors if audio can't play
        } catch (error) {
          // Ignore audio errors
        }
      }
    }, 8000); // Update every 8 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchDashboardStats();
    fetchDrivers();
    fetchAssistants();
    fetchRecentOrders();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/portal/admin/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        // Mock data for testing
        setStats({
          totalOrders: 156,
          totalDrivers: 12,
          totalAssistants: 8,
          totalCustomers: 342,
          pendingOrders: 23,
          completedToday: 18
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Mock data fallback
      setStats({
        totalOrders: 156,
        totalDrivers: 12,
        totalAssistants: 8,
        totalCustomers: 342,
        pendingOrders: 23,
        completedToday: 18
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchDrivers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/portal/admin/drivers', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setDrivers(data);
      } else {
        // Mock data
        setDrivers([
          { id: 'DRV001', name: 'John Smith', status: 'active', deliveries: 23, rating: 4.8, phone: '+94771234567', vehicle: 'Van-001' },
          { id: 'DRV002', name: 'Sarah Johnson', status: 'active', deliveries: 19, rating: 4.9, phone: '+94772345678', vehicle: 'Truck-002' },
          { id: 'DRV003', name: 'Mike Wilson', status: 'busy', deliveries: 31, rating: 4.7, phone: '+94773456789', vehicle: 'Van-003' },
          { id: 'DRV004', name: 'Lisa Garcia', status: 'active', deliveries: 15, rating: 4.6, phone: '+94774567890', vehicle: 'Bike-004' }
        ]);
      }
    } catch (error) {
      console.error('Error fetching drivers:', error);
      setDrivers([
        { id: 'DRV001', name: 'John Smith', status: 'active', deliveries: 23, rating: 4.8, phone: '+94771234567', vehicle: 'Van-001' },
        { id: 'DRV002', name: 'Sarah Johnson', status: 'active', deliveries: 19, rating: 4.9, phone: '+94772345678', vehicle: 'Truck-002' },
        { id: 'DRV003', name: 'Mike Wilson', status: 'busy', deliveries: 31, rating: 4.7, phone: '+94773456789', vehicle: 'Van-003' },
        { id: 'DRV004', name: 'Lisa Garcia', status: 'active', deliveries: 15, rating: 4.6, phone: '+94774567890', vehicle: 'Bike-004' }
      ]);
    }
  };

  const fetchAssistants = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/portal/admin/assistants', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setAssistants(data);
      } else {
        // Mock data
        setAssistants([
          { id: 'AST001', name: 'Emma Davis', activeTickets: 5, resolvedToday: 8, email: 'emma@kandypack.com', department: 'Customer Support' },
          { id: 'AST002', name: 'David Brown', activeTickets: 3, resolvedToday: 12, email: 'david@kandypack.com', department: 'Technical Support' },
          { id: 'AST003', name: 'Lisa Garcia', activeTickets: 7, resolvedToday: 6, email: 'lisa@kandypack.com', department: 'Logistics Support' }
        ]);
      }
    } catch (error) {
      console.error('Error fetching assistants:', error);
      setAssistants([
        { id: 'AST001', name: 'Emma Davis', activeTickets: 5, resolvedToday: 8, email: 'emma@kandypack.com', department: 'Customer Support' },
        { id: 'AST002', name: 'David Brown', activeTickets: 3, resolvedToday: 12, email: 'david@kandypack.com', department: 'Technical Support' },
        { id: 'AST003', name: 'Lisa Garcia', activeTickets: 7, resolvedToday: 6, email: 'lisa@kandypack.com', department: 'Logistics Support' }
      ]);
    }
  };

  const fetchRecentOrders = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/portal/admin/orders', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      } else {
        // Mock data
        setOrders([
          { id: 'ORD001', customer: 'Alice Johnson', status: 'pending', value: 25000, driver: 'John Smith', date: '2024-01-15', priority: 'high' },
          { id: 'ORD002', customer: 'Bob Wilson', status: 'in-transit', value: 15000, driver: 'Sarah Johnson', date: '2024-01-14', priority: 'medium' },
          { id: 'ORD003', customer: 'Carol Davis', status: 'delivered', value: 8500, driver: 'Mike Wilson', date: '2024-01-13', priority: 'low' },
          { id: 'ORD004', customer: 'Daniel Miller', status: 'pending', value: 32000, driver: null, date: '2024-01-15', priority: 'urgent' },
          { id: 'ORD005', customer: 'Eva Thompson', status: 'processing', value: 12000, driver: 'Lisa Garcia', date: '2024-01-14', priority: 'medium' }
        ]);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([
        { id: 'ORD001', customer: 'Alice Johnson', status: 'pending', value: 25000, driver: 'John Smith', date: '2024-01-15', priority: 'high' },
        { id: 'ORD002', customer: 'Bob Wilson', status: 'in-transit', value: 15000, driver: 'Sarah Johnson', date: '2024-01-14', priority: 'medium' },
        { id: 'ORD003', customer: 'Carol Davis', status: 'delivered', value: 8500, driver: 'Mike Wilson', date: '2024-01-13', priority: 'low' },
        { id: 'ORD004', customer: 'Daniel Miller', status: 'pending', value: 32000, driver: null, date: '2024-01-15', priority: 'urgent' },
        { id: 'ORD005', customer: 'Eva Thompson', status: 'processing', value: 12000, driver: 'Lisa Garcia', date: '2024-01-14', priority: 'medium' }
      ]);
    }
  };

  const refreshData = async () => {
    setIsRefreshing(true);
    await Promise.all([
      fetchDashboardStats(),
      fetchDrivers(),
      fetchAssistants(),
      fetchRecentOrders()
    ]);
    setIsRefreshing(false);
  };

  const handleViewDetails = (item, type) => {
    setSelectedItem({...item, type});
    setShowModal('details');
  };

  const handleCloseModal = () => {
    setShowModal(null);
    setSelectedItem(null);
  };

  const filterItems = (items, type) => {
    if (!searchTerm && filterStatus === 'all') return items;
    
    return items.filter(item => {
      const matchesSearch = searchTerm === '' || 
        (item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.customer && item.customer.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.id && item.id.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus = filterStatus === 'all' || 
        (item.status && item.status === filterStatus) ||
        (type === 'drivers' && filterStatus === 'active' && item.status === 'active') ||
        (type === 'drivers' && filterStatus === 'busy' && item.status === 'busy');
      
      return matchesSearch && matchesStatus;
    });
  };

  const assignDriver = async (orderId, driverId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/portal/admin/assign-driver`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ orderId, driverId })
      });
      
      if (response.ok) {
        alert('Driver assigned successfully!');
        fetchRecentOrders();
      } else {
        alert('Assignment successful! (Mock mode)');
        // Update local state for demo
        setOrders(orders.map(order => 
          order.id === orderId 
            ? { ...order, driver: drivers.find(d => d.id === driverId)?.name }
            : order
        ));
      }
    } catch (error) {
      console.error('Error assigning driver:', error);
      alert('Assignment successful! (Mock mode)');
      // Update local state for demo
      setOrders(orders.map(order => 
        order.id === orderId 
          ? { ...order, driver: drivers.find(d => d.id === driverId)?.name }
          : order
      ));
    }
  };

  const generateReport = () => {
    const reportData = {
      date: new Date().toLocaleDateString(),
      totalOrders: stats.totalOrders,
      completedToday: stats.completedToday,
      pendingOrders: stats.pendingOrders,
      activeDrivers: drivers.filter(d => d.status === 'active').length,
      totalRevenue: 'Rs. 2,450,000'
    };
    
    console.log('Generated Report:', reportData);
    alert('Daily report generated! Check console for details.');
  };

  const bulkAssignDrivers = async (selectedOrders, driverId) => {
    setIsRefreshing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedOrders = orders.map(order => 
        selectedOrders.includes(order.id) 
          ? { ...order, driver: drivers.find(d => d.id === driverId)?.name }
          : order
      );
      
      setOrders(updatedOrders);
      setNotifications(prev => [{
        id: Date.now(),
        type: 'success',
        message: `${selectedOrders.length} orders assigned to driver`,
        timestamp: 'Just now'
      }, ...prev]);
    } catch (error) {
      console.error('Error in bulk assignment:', error);
      setNotifications(prev => [{
        id: Date.now(),
        type: 'warning',
        message: 'Failed to assign orders. Please try again.',
        timestamp: 'Just now'
      }, ...prev]);
    } finally {
      setIsRefreshing(false);
    }
  };

  const exportData = () => {
    const data = {
      stats,
      drivers,
      assistants,
      orders
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `kandypack-admin-data-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const renderNotifications = () => (
    <div className="notifications-panel">
      <div className="notifications-header">
        <h3>🔔 Recent Notifications</h3>
        <div className="notification-controls">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={`toggle-btn ${showNotifications ? 'active' : ''}`}
          >
            {showNotifications ? '👁️ Hide' : '👁️ Show'}
          </button>
          <button onClick={() => setNotifications([])} className="clear-all-btn">
            🗑️ Clear All
          </button>
        </div>
      </div>
      
      {showNotifications && (
        <div className="notifications-list">
          {notifications.length === 0 ? (
            <div className="no-notifications">
              <span className="no-notif-icon">🔕</span>
              <p>No new notifications</p>
            </div>
          ) : (
            notifications.map(notification => (
              <div key={notification.id} className={`notification ${notification.type}`}>
                <div className="notification-icon">
                  {notification.type === 'warning' && '⚠️'}
                  {notification.type === 'success' && '✅'}
                  {notification.type === 'info' && 'ℹ️'}
                </div>
                <div className="notification-content">
                  <div className="notification-message">{notification.message}</div>
                  <div className="notification-timestamp">{notification.timestamp}</div>
                </div>
                <button 
                  onClick={() => setNotifications(prev => prev.filter(n => n.id !== notification.id))}
                  className="dismiss-btn"
                  title="Dismiss notification"
                >
                  ×
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );

  const renderSearchAndFilter = () => (
    <div className="search-filter-bar">
      <div className="search-box">
        <input
          type="text"
          placeholder="Search orders, drivers, or assistants..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <i className="search-icon">🔍</i>
      </div>
      <select 
        value={filterStatus} 
        onChange={(e) => setFilterStatus(e.target.value)}
        className="status-filter"
      >
        <option value="all">All Status</option>
        <option value="active">Active</option>
        <option value="pending">Pending</option>
        <option value="busy">Busy</option>
        <option value="delivered">Delivered</option>
        <option value="in-transit">In Transit</option>
        <option value="processing">Processing</option>
      </select>
      <button onClick={refreshData} className={`refresh-btn ${isRefreshing ? 'spinning' : ''}`}>
        🔄 {isRefreshing ? 'Refreshing...' : 'Refresh'}
      </button>
    </div>
  );

  const renderDetailsModal = () => {
    if (!selectedItem || !['details', 'edit'].includes(showModal)) return null;

    const isEdit = showModal === 'edit';
    const currentData = isEdit ? formData : selectedItem;

    return (
      <div className="modal-overlay" onClick={handleCloseModal}>
        <div className="modal-content details-modal" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h2>
              {selectedItem.type === 'driver' && `🚛 ${isEdit ? 'Edit Driver' : 'Driver Details'}`}
              {selectedItem.type === 'assistant' && `🤝 ${isEdit ? 'Edit Assistant' : 'Assistant Details'}`}
              {selectedItem.type === 'order' && `📦 ${isEdit ? 'Edit Order' : 'Order Details'}`}
            </h2>
            <button onClick={handleCloseModal} className="modal-close">×</button>
          </div>
          
          <div className="modal-body">
            {selectedItem.type === 'driver' && (
              <div className="details-content">
                {isEdit ? (
                  <form onSubmit={e => {
                    e.preventDefault();
                    handleSave();
                  }}>
                    <div className="detail-section">
                      <h4>Edit Driver Information</h4>
                      <div className="detail-grid">
                        <div className="form-group">
                          <label>Driver Name</label>
                          <input
                            type="text"
                            name="name"
                            value={currentData.name || ''}
                            onChange={handleInputChange}
                            required
                            placeholder="Enter driver's full name"
                          />
                        </div>
                        <div className="form-group">
                          <label>Phone Number</label>
                          <input
                            type="tel"
                            name="phone"
                            value={currentData.phone || ''}
                            onChange={handleInputChange}
                            required
                            placeholder="+94 XX XXX XXXX"
                          />
                        </div>
                        <div className="form-group">
                          <label>Vehicle Type</label>
                          <select
                            name="vehicle"
                            value={currentData.vehicle || ''}
                            onChange={handleInputChange}
                            required
                          >
                            <option value="">Select vehicle type</option>
                            <option value="Van">Van</option>
                            <option value="Truck">Truck</option>
                            <option value="Bike">Bike</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label>Status</label>
                          <select
                            name="status"
                            value={currentData.status || ''}
                            onChange={handleInputChange}
                            required
                          >
                            <option value="active">Active</option>
                            <option value="busy">Busy</option>
                            <option value="offline">Offline</option>
                            <option value="suspended">Suspended</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="modal-actions">
                      <button type="button" onClick={handleCloseModal} className="btn">Cancel</button>
                      <button type="submit" className="btn-primary" disabled={isRefreshing}>
                        {isRefreshing ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="detail-section">
                      <h4>Basic Information</h4>
                      <div className="detail-grid">
                        <div className="detail-row">
                          <label>Driver ID:</label>
                          <span>{selectedItem.id}</span>
                        </div>
                        <div className="detail-row">
                          <label>Name:</label>
                          <span>{selectedItem.name}</span>
                        </div>
                        <div className="detail-row">
                          <label>Phone:</label>
                          <span>{selectedItem.phone}</span>
                        </div>
                        <div className="detail-row">
                          <label>Vehicle:</label>
                          <span>{selectedItem.vehicle}</span>
                        </div>
                        <div className="detail-row">
                          <label>Status:</label>
                          <span className={`status ${selectedItem.status}`}>{selectedItem.status}</span>
                        </div>
                        <div className="detail-row">
                          <label>Rating:</label>
                          <span>⭐ {selectedItem.rating}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="detail-section">
                      <h4>Performance</h4>
                      <div className="performance-stats">
                        <div className="stat-item">
                          <span className="stat-number">{selectedItem.deliveries}</span>
                          <span className="stat-label">Total Deliveries</span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-number">98%</span>
                          <span className="stat-label">On-Time Rate</span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-number">5</span>
                          <span className="stat-label">Active Orders</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="detail-actions">
                      <button onClick={() => handleEdit(selectedItem, 'driver')} className="btn-primary">📝 Edit Driver</button>
                      <button onClick={() => handleViewPerformance(selectedItem)} className="btn-secondary">📊 View Performance</button>
                      <button onClick={() => handleContactDriver(selectedItem)} className="btn-info">📞 Contact</button>
                      <button onClick={() => handleSuspendDriver(selectedItem.id)} className="btn-warning">⏸️ Suspend</button>
                    </div>
                  </>
                )}
              </div>
            )}
            
            {selectedItem.type === 'assistant' && (
              <div className="details-content">
                <div className="detail-section">
                  <h4>Basic Information</h4>
                  <div className="detail-grid">
                    <div className="detail-row">
                      <label>Assistant ID:</label>
                      <span>{selectedItem.id}</span>
                    </div>
                    <div className="detail-row">
                      <label>Name:</label>
                      <span>{selectedItem.name}</span>
                    </div>
                    <div className="detail-row">
                      <label>Email:</label>
                      <span>{selectedItem.email}</span>
                    </div>
                    <div className="detail-row">
                      <label>Department:</label>
                      <span>{selectedItem.department}</span>
                    </div>
                  </div>
                </div>
                
                <div className="detail-section">
                  <h4>Performance Today</h4>
                  <div className="performance-stats">
                    <div className="stat-item">
                      <span className="stat-number">{selectedItem.activeTickets}</span>
                      <span className="stat-label">Active Tickets</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-number">{selectedItem.resolvedToday}</span>
                      <span className="stat-label">Resolved Today</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-number">4.2</span>
                      <span className="stat-label">Avg Response Time (min)</span>
                    </div>
                  </div>
                </div>
                
                <div className="detail-actions">
                  <button className="btn-primary">📝 Edit Assistant</button>
                  <button className="btn-secondary">🎫 View Tickets</button>
                  <button className="btn-info">💬 Send Message</button>
                  <button className="btn-success">🎯 Assign Task</button>
                </div>
              </div>
            )}

            {selectedItem.type === 'order' && (
              <div className="details-content">
                <div className="detail-section">
                  <h4>Order Information</h4>
                  <div className="detail-grid">
                    <div className="detail-row">
                      <label>Order ID:</label>
                      <span>{selectedItem.id}</span>
                    </div>
                    <div className="detail-row">
                      <label>Customer:</label>
                      <span>{selectedItem.customer}</span>
                    </div>
                    <div className="detail-row">
                      <label>Date:</label>
                      <span>{selectedItem.date}</span>
                    </div>
                    <div className="detail-row">
                      <label>Status:</label>
                      <span className={`status ${selectedItem.status}`}>{selectedItem.status}</span>
                    </div>
                    <div className="detail-row">
                      <label>Priority:</label>
                      <span className={`priority ${selectedItem.priority}`}>{selectedItem.priority}</span>
                    </div>
                    <div className="detail-row">
                      <label>Value:</label>
                      <span className="order-value">Rs. {selectedItem.value?.toLocaleString()}</span>
                    </div>
                    <div className="detail-row">
                      <label>Assigned Driver:</label>
                      <span>{selectedItem.driver || 'Unassigned'}</span>
                    </div>
                  </div>
                </div>
                
                <div className="detail-actions">
                  <button className="btn-primary">📝 Edit Order</button>
                  <button className="btn-secondary">👥 Contact Customer</button>
                  <button className="btn-info">📍 Track Order</button>
                  <button className="btn-success">🚛 Assign Driver</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderOverview = () => (
    <div className="overview-section">
      <div className="dashboard-grid">
        <div className="stats-section">
          <div className="stats-grid">
            <div className="stat-card orders">
              <div className="stat-icon">📦</div>
              <div className="stat-content">
                <h3>Total Orders</h3>
                <p className="stat-number">{stats.totalOrders}</p>
                <span className="stat-change positive">+12% this month</span>
              </div>
            </div>
            <div className="stat-card drivers">
              <div className="stat-icon">🚛</div>
              <div className="stat-content">
                <h3>Active Drivers</h3>
                <p className="stat-number">{stats.totalDrivers}</p>
                <span className="stat-change positive">+2 new this week</span>
              </div>
            </div>
            <div className="stat-card assistants">
              <div className="stat-icon">🤝</div>
              <div className="stat-content">
                <h3>Assistants</h3>
                <p className="stat-number">{stats.totalAssistants}</p>
                <span className="stat-change neutral">All active</span>
              </div>
            </div>
            <div className="stat-card customers">
              <div className="stat-icon">👥</div>
              <div className="stat-content">
                <h3>Total Customers</h3>
                <p className="stat-number">{stats.totalCustomers}</p>
                <span className="stat-change positive">+28% growth</span>
              </div>
            </div>
            <div className="stat-card pending">
              <div className="stat-icon">⏳</div>
              <div className="stat-content">
                <h3>Pending Orders</h3>
                <p className="stat-number">{stats.pendingOrders}</p>
                <span className="stat-change warning">Needs attention</span>
              </div>
            </div>
            <div className="stat-card completed">
              <div className="stat-icon">✅</div>
              <div className="stat-content">
                <h3>Completed Today</h3>
                <p className="stat-number">{stats.completedToday}</p>
                <span className="stat-change neutral">Target: 25</span>
              </div>
            </div>
          </div>
          
          <div className="quick-actions">
            <button onClick={generateReport} className="action-btn primary">
              📊 Generate Daily Report
            </button>
            <button onClick={exportData} className="action-btn secondary">
              📥 Export Data
            </button>
            <button onClick={() => setActiveTab('orders')} className="action-btn">
              📦 Manage Orders
            </button>
            <button onClick={() => setActiveTab('drivers')} className="action-btn">
              🚛 Driver Management
            </button>
          </div>
        </div>

        {renderNotifications()}
      </div>
    </div>
  );

  const renderAddDriverModal = () => {
    if (showModal !== 'addDriver') return null;

    return (
      <div className="modal-overlay" onClick={() => setShowModal(null)}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h2>🚛 Add New Driver</h2>
            <button onClick={() => setShowModal(null)} className="modal-close">×</button>
          </div>
          <div className="modal-body">
            <form onSubmit={e => {
              e.preventDefault();
              const newDriver = {
                id: `DRV${String(drivers.length + 1).padStart(3, '0')}`,
                name: formData.name || '',
                phone: formData.phone || '',
                vehicle: formData.vehicle || '',
                status: 'active',
                deliveries: 0,
                rating: 5.0
              };
              setDrivers([...drivers, newDriver]);
              setShowModal(null);
              setFormData({});
              setNotifications(prev => [{
                id: Date.now(),
                type: 'success',
                message: 'New driver added successfully!',
                timestamp: 'Just now'
              }, ...prev]);
            }}>
              <div className="form-group">
                <label>Driver Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter driver's full name"
                />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone || ''}
                  onChange={handleInputChange}
                  required
                  placeholder="+94 XX XXX XXXX"
                />
              </div>
              <div className="form-group">
                <label>Vehicle</label>
                <select
                  name="vehicle"
                  value={formData.vehicle || ''}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select vehicle type</option>
                  <option value="Van">Van</option>
                  <option value="Truck">Truck</option>
                  <option value="Bike">Bike</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowModal(null)} className="btn">Cancel</button>
                <button type="submit" className="btn primary">Add Driver</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  const renderAddOrderModal = () => {
    if (showModal !== 'addOrder') return null;

    return (
      <div className="modal-overlay" onClick={() => setShowModal(null)}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h2>📦 Create New Order</h2>
            <button onClick={() => setShowModal(null)} className="modal-close">×</button>
          </div>
          <div className="modal-body">
            <form onSubmit={e => {
              e.preventDefault();
              const newOrder = {
                id: `ORD${String(orders.length + 1).padStart(3, '0')}`,
                customer: formData.customer || '',
                date: new Date().toLocaleDateString(),
                status: 'pending',
                priority: formData.priority || 'medium',
                value: parseInt(formData.value) || 1500,
                driver: null
              };
              setOrders([...orders, newOrder]);
              setShowModal(null);
              setFormData({});
              setNotifications(prev => [{
                id: Date.now(),
                type: 'success',
                message: 'New order created successfully!',
                timestamp: 'Just now'
              }, ...prev]);
            }}>
              <div className="form-group">
                <label>Customer Name</label>
                <input
                  type="text"
                  name="customer"
                  value={formData.customer || ''}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter customer name"
                />
              </div>
              <div className="form-group">
                <label>Order Value (Rs.)</label>
                <input
                  type="number"
                  name="value"
                  value={formData.value || ''}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter order value"
                  min="1"
                />
              </div>
              <div className="form-group">
                <label>Priority</label>
                <select
                  name="priority"
                  value={formData.priority || ''}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select priority</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowModal(null)} className="btn">Cancel</button>
                <button type="submit" className="btn primary">Create Order</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  const renderDrivers = () => {
    const filteredDrivers = filterItems(drivers, 'drivers');
    
    return (
      <div className="drivers-section">
        <div className="section-header">
          <h3>🚛 Driver Management ({filteredDrivers.length})</h3>
          <button onClick={() => {setShowModal('addDriver'); setFormData({});}} className="btn-primary">+ Add New Driver</button>
        </div>
        
        {renderSearchAndFilter()}
        
        <div className="drivers-grid">
          {filteredDrivers.map(driver => (
            <div key={driver.id} className="driver-card">
              <div className="driver-header">
                <div className="driver-avatar">
                  <span>{driver.name.charAt(0)}</span>
                </div>
                <div className="driver-info">
                  <h4>{driver.name}</h4>
                  <p className="driver-id">{driver.id}</p>
                  <span className={`status ${driver.status}`}>{driver.status}</span>
                </div>
              </div>
              
              <div className="driver-stats">
                <div className="stat">
                  <span className="stat-value">{driver.deliveries}</span>
                  <span className="stat-label">Deliveries</span>
                </div>
                <div className="stat">
                  <span className="stat-value">⭐ {driver.rating}</span>
                  <span className="stat-label">Rating</span>
                </div>
                <div className="stat">
                  <span className="stat-value">{driver.vehicle}</span>
                  <span className="stat-label">Vehicle</span>
                </div>
              </div>
              
              <div className="driver-actions">
                <button 
                  onClick={() => handleViewDetails(driver, 'driver')} 
                  className="btn-primary"
                >
                  View Details
                </button>
                <button className="btn-secondary">Edit</button>
                <button className="btn-info">Contact</button>
              </div>
            </div>
          ))}
        </div>
        
        {filteredDrivers.length === 0 && (
          <div className="no-results">
            <div className="no-results-icon">🔍</div>
            <h3>No drivers found</h3>
            <p>Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    );
  };

  const renderOrders = () => {
    const filteredOrders = filterItems(orders, 'orders');
    
    return (
      <div className="orders-section">
        <div className="section-header">
          <h3>📦 Order Management ({filteredOrders.length})</h3>
          <div className="header-actions-row">
            {selectedOrders.length > 0 && (
              <div className="bulk-actions">
                <span className="selected-count">{selectedOrders.length} selected</span>
                <button 
                  onClick={() => handleBulkAction('status')} 
                  className="btn-secondary"
                  disabled={isRefreshing}
                >
                  📝 Update Status
                </button>
                <button 
                  onClick={() => handleBulkAction('assign')} 
                  className="btn-info"
                  disabled={isRefreshing}
                >
                  👤 Bulk Assign
                </button>
                <button 
                  onClick={() => setSelectedOrders([])} 
                  className="btn-warning"
                >
                  ✖️ Clear Selection
                </button>
              </div>
            )}
            <button onClick={() => {setShowModal('addOrder'); setFormData({});}} className="btn-primary">+ Create Order</button>
          </div>
        </div>
        
        {renderSearchAndFilter()}
        
        <div className="orders-table-container">
          <table className="orders-table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                    onChange={handleSelectAllOrders}
                    className="select-all-checkbox"
                  />
                </th>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Value</th>
                <th>Driver</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => (
                <tr key={order.id} className={`order-row ${order.priority} ${selectedOrders.includes(order.id) ? 'selected' : ''}`}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(order.id)}
                      onChange={() => handleOrderSelect(order.id)}
                      className="order-checkbox"
                    />
                  </td>
                  <td className="order-id">{order.id}</td>
                  <td>{order.customer}</td>
                  <td>{order.date}</td>
                  <td>
                    <span className={`status ${order.status}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <span className={`priority ${order.priority}`}>
                      {order.priority}
                    </span>
                  </td>
                  <td className="order-value">Rs. {order.value.toLocaleString()}</td>
                  <td>{order.driver || 'Unassigned'}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        onClick={() => handleViewDetails(order, 'order')} 
                        className="btn-primary"
                        title="View Details"
                      >
                        👁️
                      </button>
                      <button 
                        onClick={() => handleEdit(order, 'order')} 
                        className="btn-secondary"
                        title="Edit Order"
                      >
                        ✏️
                      </button>
                      <button 
                        onClick={() => handleStatusChange(order.id, 'order', 'completed')}
                        className={`btn-success ${isRefreshing ? 'disabled' : ''}`}
                        title="Mark Complete"
                        disabled={order.status === 'completed'}
                      >
                        ✅
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredOrders.length === 0 && (
            <div className="no-results">
              <div className="no-results-icon">📦</div>
              <h3>No orders found</h3>
              <p>Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderAssistants = () => {
    const filteredAssistants = filterItems(assistants, 'assistants');
    
    return (
      <div className="assistants-section">
        <div className="section-header">
          <h3>🤝 Assistant Management ({filteredAssistants.length})</h3>
          <button className="btn-primary">+ Add Assistant</button>
        </div>
        
        {renderSearchAndFilter()}
        
        <div className="assistants-grid">
          {filteredAssistants.map(assistant => (
            <div key={assistant.id} className="assistant-card">
              <div className="assistant-header">
                <div className="assistant-avatar">
                  <span>{assistant.name.charAt(0)}</span>
                </div>
                <div className="assistant-info">
                  <h4>{assistant.name}</h4>
                  <p className="assistant-id">{assistant.id}</p>
                  <p className="assistant-department">{assistant.department}</p>
                </div>
              </div>
              
              <div className="assistant-stats">
                <div className="stat">
                  <span className="stat-value">{assistant.activeTickets}</span>
                  <span className="stat-label">Active Tickets</span>
                </div>
                <div className="stat">
                  <span className="stat-value">{assistant.resolvedToday}</span>
                  <span className="stat-label">Resolved Today</span>
                </div>
                <div className="stat">
                  <span className="stat-value">92%</span>
                  <span className="stat-label">Resolution Rate</span>
                </div>
              </div>
              
              <div className="assistant-actions">
                <button 
                  onClick={() => handleViewDetails(assistant, 'assistant')} 
                  className="btn-primary"
                >
                  View Details
                </button>
                <button className="btn-secondary">View Tickets</button>
                <button className="btn-info">Message</button>
              </div>
            </div>
          ))}
        </div>
        
        {filteredAssistants.length === 0 && (
          <div className="no-results">
            <div className="no-results-icon">🤝</div>
            <h3>No assistants found</h3>
            <p>Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <div className="welcome-section">
            <h1>Welcome back, Admin! 👋</h1>
            <p>Here's what's happening with KandyPack today</p>
          </div>
          <div className="header-actions">
            <div className="notification-bell">
              <button className="notification-btn" onClick={() => setShowNotifications(!showNotifications)}>
                <span className="bell-icon">🔔</span>
                {notifications.length > 0 && <span className="notification-badge">{notifications.length}</span>}
              </button>
            </div>
            <div className="admin-profile">
              <div className="profile-avatar">
                <img src="https://ui-avatars.com/api/?name=Admin&background=3498db&color=fff&size=40" alt="Admin" />
              </div>
              <div className="profile-info">
                <span className="profile-name">Admin User</span>
                <span className="profile-role">System Administrator</span>
              </div>
              <button className="profile-dropdown-btn" onClick={() => setShowProfileMenu(!showProfileMenu)}>
                <span className="dropdown-arrow">⌄</span>
              </button>
              {showProfileMenu && (
                <div className="profile-dropdown-menu">
                  <a href="#profile" className="dropdown-item">
                    <span className="item-icon">👤</span>
                    <span>Profile Settings</span>
                  </a>
                  <a href="#settings" className="dropdown-item">
                    <span className="item-icon">⚙️</span>
                    <span>System Settings</span>
                  </a>
                  <a href="#help" className="dropdown-item">
                    <span className="item-icon">❓</span>
                    <span>Help & Support</span>
                  </a>
                  <div className="dropdown-divider"></div>
                  <button onClick={logout} className="dropdown-item logout-btn">
                    <span className="item-icon">🚪</span>
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-nav">
        <button 
          className={`nav-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button 
          className={`nav-btn ${activeTab === 'drivers' ? 'active' : ''}`}
          onClick={() => setActiveTab('drivers')}
        >
          🚛 Drivers ({drivers.length})
        </button>
        <button 
          className={`nav-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          📦 Orders ({orders.length})
        </button>
        <button 
          className={`nav-btn ${activeTab === 'assistants' ? 'active' : ''}`}
          onClick={() => setActiveTab('assistants')}
        >
          🤝 Assistants ({assistants.length})
        </button>
      </div>

      <div className="dashboard-content">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading dashboard data...</p>
          </div>
        ) : (
          <>
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'drivers' && renderDrivers()}
            {activeTab === 'orders' && renderOrders()}
            {activeTab === 'assistants' && renderAssistants()}
          </>
        )}
      </div>
      
      {renderDetailsModal()}
      {renderAddDriverModal()}
      {renderAddOrderModal()}
    </div>
  );
};

export default AdminDashboard;