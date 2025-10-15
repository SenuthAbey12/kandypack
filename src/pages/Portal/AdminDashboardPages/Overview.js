import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Overview = ({ handleNavigation, warehouses, routes, getPerformanceData, performancePeriod, setPerformancePeriod, orders }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        // In a real app, you'd use a configured base URL
        const response = await axios.get('http://localhost:5000/api/dashboard/stats');
        setStats(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch dashboard stats. Please try again later.');
        console.error(err);
        // Set some mock data for UI development if the backend isn't running
        setStats({
          totalOrders: 0,
          totalVehicles: 0,
          totalDrivers: 0,
          pendingOrders: 0,
          completedToday: 0,
          revenue: 0,
          costPerMile: 0,
          warehouseUtilization: 0,
          fuelEfficiency: 0,
          railShipments: 0,
          roadShipments: 0,
          customerSatisfaction: 0,
          averageDeliveryTime: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const renderStatsCards = () => {
    if (loading) {
      return (
        <div className="stats-grid">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="stat-card is-loading">
              <div className="stat-header">
                <div className="stat-icon"></div>
                <div className="stat-trend"></div>
              </div>
              <div className="stat-body">
                <h3>&nbsp;</h3>
                <p>&nbsp;</p>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (error) {
      return <div className="error-message">{error}</div>;
    }

    if (!stats) {
      return null;
    }

    return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-header">
          <div className="stat-icon">📊</div>
          <div className="stat-trend up">
            ↗️ +12%
          </div>
        </div>
        <div className="stat-body">
          <h3>{stats.totalOrders.toLocaleString()}</h3>
          <p>Total Shipments</p>
        </div>
      </div>
      
      <div className="stat-card">
        <div className="stat-header">
          <div className="stat-icon">🚛</div>
          <div className="stat-trend up">
            ↗️ +3
          </div>
        </div>
        <div className="stat-body">
          <h3>{stats.totalVehicles}</h3>
          <p>Fleet Vehicles</p>
          <small>{stats.totalDrivers} drivers active</small>
        </div>
      </div>
      
      <div className="stat-card">
        <div className="stat-header">
          <div className="stat-icon">📦</div>
          <div className="stat-trend down">
            ↘️ -5
          </div>
        </div>
        <div className="stat-body">
          <h3>{stats.pendingOrders}</h3>
          <p>Pending Shipments</p>
          <small>{stats.completedToday} completed today</small>
        </div>
      </div>
      
      <div className="stat-card">
        <div className="stat-header">
          <div className="stat-icon">💰</div>
          <div className="stat-trend up">
            ↗️ +8%
          </div>
        </div>
        <div className="stat-body">
          <h3>${stats.revenue.toLocaleString()}</h3>
          <p>Monthly Revenue</p>
          <small>${stats.costPerMile}/mile avg cost</small>
        </div>
      </div>
      
      <div className="stat-card">
        <div className="stat-header">
          <div className="stat-icon">🏭</div>
          <div className="stat-trend up">
            ↗️ +2%
          </div>
        </div>
        <div className="stat-body">
          <h3>{stats.warehouseUtilization}%</h3>
          <p>Warehouse Utilization</p>
          <small>3 facilities operational</small>
        </div>
      </div>
      
      <div className="stat-card">
        <div className="stat-header">
          <div className="stat-icon">⛽</div>
          <div className="stat-trend up">
            ↗️ +5%
          </div>
        </div>
        <div className="stat-body">
          <h3>{stats.fuelEfficiency}</h3>
          <p>Fuel Efficiency (km/L)</p>
          <small>Fleet average</small>
        </div>
      </div>
      
      <div className="stat-card">
        <div className="stat-header">
          <div className="stat-icon">🚄</div>
          <div className="stat-trend up">
            ↗️ +15%
          </div>
        </div>
        <div className="stat-body">
          <h3>{stats.railShipments}</h3>
          <p>Rail Shipments</p>
          <small>{stats.roadShipments} road shipments</small>
        </div>
      </div>
      
      <div className="stat-card">
        <div className="stat-header">
          <div className="stat-icon">⭐</div>
          <div className="stat-trend up">
            ↗️ +1.2%
          </div>
        </div>
        <div className="stat-body">
          <h3>{stats.customerSatisfaction}%</h3>
          <p>Customer Satisfaction</p>
          <small>{stats.averageDeliveryTime} days avg delivery</small>
        </div>
      </div>
    </div>
    );
  };

  const renderQuickActions = () => (
    <div className="quick-actions">
      <h2 className="section-title">Quick Actions</h2>
      <div className="actions-grid">
        <button className="action-btn" onClick={() => handleNavigation('orders')}>
          <span className="action-btn-icon">📦</span>
          Create Shipment
        </button>
        <button className="action-btn" onClick={() => handleNavigation('drivers')}>
          <span className="action-btn-icon"></span>
          Dispatch Vehicle
        </button>
        <button className="action-btn" onClick={() => handleNavigation('tracking')}>
          <span className="action-btn-icon">📍</span>
          Track Shipments
        </button>
        <button className="action-btn" onClick={() => handleNavigation('routes')}>
          <span className="action-btn-icon">️</span>
          Optimize Routes
        </button>
        <button className="action-btn" onClick={() => handleNavigation('inventory')}>
          <span className="action-btn-icon">📋</span>
          Check Inventory
        </button>
        <button className="action-btn" onClick={() => handleNavigation('analytics')}>
          <span className="action-btn-icon">📊</span>
          View Analytics
        </button>
      </div>
    </div>
  );

  const renderSupplyChainOverview = () => {
    if (!stats) return null;
    return (
    <div className="supply-chain-overview">
      <div className="overview-section">
        <div className="section-header">
          <h3 className="section-title">Transportation Mix</h3>
          <div className="transport-stats">
            <div className="transport-item">
              <span className="transport-icon">🚛</span>
              <span className="transport-label">Road</span>
              <span className="transport-value">{stats.roadShipments}</span>
            </div>
            <div className="transport-item">
              <span className="transport-icon">🚄</span>
              <span className="transport-label">Rail</span>
              <span className="transport-value">{stats.railShipments}</span>
            </div>
          </div>
        </div>
        
        <div className="chart-placeholder">
          📊 Transportation mode distribution chart
        </div>
      </div>
      
      <div className="overview-section">
        <h3 className="section-title">Active Routes Status</h3>
        <div className="routes-status">
          {routes.slice(0, 4).map(route => (
            <div key={route.id} className="route-status-item">
              <div className="route-info">
                <span className="route-name">{route.name}</span>
                <span className={`route-type ${route.type}`}>
                  {route.type === 'rail' ? '🚄' : '🚛'} {route.type}
                </span>
              </div>
              <div className="route-metrics">
                <span className="route-distance">{route.distance}km</span>
                <span className={`route-efficiency ${route.efficiency > 90 ? 'good' : route.efficiency > 80 ? 'average' : 'poor'}`}>
                  {route.efficiency}% efficient
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    );
  };

  const renderWarehouseStatus = () => (
    <div className="warehouse-status">
      <div className="section-header">
        <h3 className="section-title">Warehouse Status</h3>
        <button className="btn-secondary" onClick={() => handleNavigation('warehouses')}>
          🏭 Manage All
        </button>
      </div>
      
      <div className="warehouse-grid">
        {warehouses.map(warehouse => (
          <div key={warehouse.id} className="warehouse-card">
            <div className="warehouse-header">
              <h4>{warehouse.name}</h4>
              <span className="warehouse-location"> {warehouse.location}</span>
            </div>
            <div className="warehouse-metrics">
              <div className="metric">
                <span className="metric-label">Utilization</span>
                <div className="utilization-bar">
                  <div 
                    className="utilization-fill" 
                    style={{ width: `${warehouse.utilizationRate}%` }}
                  ></div>
                </div>
                <span className="metric-value">{warehouse.utilizationRate}%</span>
              </div>
              <div className="metric">
                <span className="metric-label">Capacity</span>
                <span className="metric-value">{warehouse.current.toLocaleString()}/{warehouse.capacity.toLocaleString()}</span>
              </div>
              <div className="metric">
                <span className="metric-label">Environment</span>
                <span className="metric-value">{warehouse.temperature}°C, {warehouse.humidity}% RH</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPerformanceSection = () => {
    const perfData = getPerformanceData();
    
    return (
      <div className="performance-section">
        <div className="performance-chart">
          <div className="chart-header">
            <h3 className="chart-title">Performance Overview</h3>
            <div className="chart-filter">
              <button 
                className={`filter-btn ${performancePeriod === 'today' ? 'active' : ''}`}
                onClick={() => setPerformancePeriod('today')}
              >
                Today
              </button>
              <button 
                className={`filter-btn ${performancePeriod === 'week' ? 'active' : ''}`}
                onClick={() => setPerformancePeriod('week')}
              >
                Week
              </button>
              <button 
                className={`filter-btn ${performancePeriod === 'month' ? 'active' : ''}`}
                onClick={() => setPerformancePeriod('month')}
              >
                Month
              </button>
            </div>
          </div>
          <div className="chart-content">
            <div className="performance-metrics">
              <div className="metric-card">
                <div className="metric-label">Revenue</div>
                <div className="metric-value">${perfData.revenue.toLocaleString()}</div>
                <div className="metric-change positive">{perfData.growth}</div>
              </div>
              <div className="metric-card">
                <div className="metric-label">Orders</div>
                <div className="metric-value">{perfData.orders}</div>
                <div className="metric-change positive">{perfData.growth}</div>
              </div>
              <div className="metric-card">
                <div className="metric-label">Efficiency</div>
                <div className="metric-value">{perfData.efficiency}%</div>
                <div className="metric-change positive">{perfData.growth}</div>
              </div>
            </div>
            <div className="chart-placeholder">
              📊 {perfData.description}
            </div>
          </div>
        </div>
      
      <div className="activity-feed">
        <h3 className="section-title">Recent Activity</h3>
        <div className="activity-item">
          <div className="activity-icon success">✓</div>
          <div className="activity-content">
            <div className="activity-title">Order #1248 delivered</div>
            <div className="activity-description">Successfully delivered to customer location</div>
            <div className="activity-time">2 minutes ago</div>
          </div>
        </div>
        
        <div className="activity-item">
          <div className="activity-icon warning">⚠</div>
          <div className="activity-content">
            <div className="activity-title">Driver assignment needed</div>
            <div className="activity-description">5 orders pending driver assignment</div>
            <div className="activity-time">15 minutes ago</div>
          </div>
        </div>
        
        <div className="activity-item">
          <div className="activity-icon info">📝</div>
          <div className="activity-content">
            <div className="activity-title">New order received</div>
            <div className="activity-description">Order #1249 created by KandyMart</div>
            <div className="activity-time">1 hour ago</div>
          </div>
        </div>
        
        <div className="activity-item">
          <div className="activity-icon success">👤</div>
          <div className="activity-content">
            <div className="activity-title">New driver registered</div>
            <div className="activity-description">John Doe completed verification</div>
            <div className="activity-time">3 hours ago</div>
          </div>
        </div>
      </div>
    </div>
    );
  };

  const renderRecentOrders = () => (
    <div className="recent-orders">
      <div className="table-header">
        <h3 className="section-title">Recent Orders</h3>
        <div className="table-actions">
          <button className="btn-secondary" onClick={() => handleNavigation('orders')}>
            📋 View All
          </button>
          <button className="btn-secondary">
            ⬇️ Export
          </button>
        </div>
      </div>
      
      <table className="orders-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Destination</th>
            <th>Status</th>
            <th>Driver</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="order-id">#1248</td>
            <td>KandyMart Pvt Ltd</td>
            <td>Colombo 03</td>
            <td><span className="status-badge delivered">Delivered</span></td>
            <td>Nimal Silva</td>
            <td>Rs. 12,500</td>
          </tr>
          <tr>
            <td className="order-id">#1247</td>
            <td>Tech Solutions</td>
            <td>Kandy</td>
            <td><span className="status-badge in-transit">In Transit</span></td>
            <td>Sunil Perera</td>
            <td>Rs. 8,900</td>
          </tr>
          <tr>
            <td className="order-id">#1246</td>
            <td>Green Store</td>
            <td>Galle</td>
            <td><span className="status-badge pending">Pending</span></td>
            <td>-</td>
            <td>Rs. 6,750</td>
          </tr>
          <tr>
            <td className="order-id">#1245</td>
            <td>Fashion Hub</td>
            <td>Negombo</td>
            <td><span className="status-badge in-transit">In Transit</span></td>
            <td>Kamal Fernando</td>
            <td>Rs. 15,200</td>
          </tr>
          <tr>
            <td className="order-id">#1244</td>
            <td>Book World</td>
            <td>Matara</td>
            <td><span className="status-badge delivered">Delivered</span></td>
            <td>Ravi Mendis</td>
            <td>Rs. 4,800</td>
          </tr>
        </tbody>
      </table>
    </div>
  );

  return (
    <div>
      {renderStatsCards()}
      {renderQuickActions()}
      {renderSupplyChainOverview()}
      {renderWarehouseStatus()}
      {renderPerformanceSection()}
      {renderRecentOrders()}
    </div>
  );
};

export default Overview;