import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import './AdminDashboard.css';

const AdminAnalytics = () => {
  const { user } = useAuth();
  const { theme } = useTheme();

  const [stats] = useState({
    deliveryRate: 96.5,
    fuelEfficiency: 12.8,
    costPerMile: 2.45,
    inventoryTurnover: 8.2
  });

  // Analytics data for export
  const analyticsData = {
    performanceMetrics: [
      { metric: 'On-time Delivery Rate', value: `${stats.deliveryRate}%`, status: 'Good' },
      { metric: 'Fleet Utilization', value: '78.5%', status: 'Average' },
      { metric: 'Cost per Mile', value: `$${stats.costPerMile}`, status: 'Normal' },
      { metric: 'Inventory Turnover', value: `${stats.inventoryTurnover}x`, status: 'Good' }
    ],
    routeEfficiency: [
      { route: 'Colombo-Kandy Route', efficiency: '94%', type: 'Road' },
      { route: 'Kandy-Galle Route', efficiency: '78%', type: 'Road' },
      { route: 'Main Line Railway', efficiency: '96%', type: 'Rail' },
      { route: 'Coast Line Railway', efficiency: '92%', type: 'Rail' }
    ],
    costAnalysis: [
      { category: 'Fuel Costs', amount: 145000, trend: 'up' },
      { category: 'Maintenance', amount: 89000, trend: 'stable' },
      { category: 'Staff Wages', amount: 234000, trend: 'stable' },
      { category: 'Insurance', amount: 56000, trend: 'down' }
    ]
  };

  // Export analytics report to CSV
  const exportAnalyticsReport = () => {
    try {
      let csvContent = '';
      
      // Performance Metrics Section
      csvContent += 'KANDYPACK ANALYTICS REPORT\n';
      csvContent += `Generated on: ${new Date().toLocaleString()}\n\n`;
      
      csvContent += 'PERFORMANCE METRICS\n';
      csvContent += 'Metric,Value,Status\n';
      analyticsData.performanceMetrics.forEach(item => {
        csvContent += `"${item.metric}","${item.value}","${item.status}"\n`;
      });
      
      csvContent += '\nROUTE EFFICIENCY\n';
      csvContent += 'Route,Efficiency,Type\n';
      analyticsData.routeEfficiency.forEach(item => {
        csvContent += `"${item.route}","${item.efficiency}","${item.type}"\n`;
      });
      
      csvContent += '\nCOST ANALYSIS\n';
      csvContent += 'Category,Amount (Rs.),Trend\n';
      analyticsData.costAnalysis.forEach(item => {
        csvContent += `"${item.category}","${item.amount.toLocaleString()}","${item.trend}"\n`;
      });

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `kandypack_analytics_report_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Show success feedback
      alert('Analytics report exported successfully! Check your downloads folder.');
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    }
  };

  const renderPerformanceMetrics = () => (
    <div className="analytics-card">
      <h3>Performance Metrics</h3>
      <div className="metric-row">
        <span>On-time Delivery Rate</span>
        <span className="metric-value good">{stats.deliveryRate}%</span>
      </div>
      <div className="metric-row">
        <span>Fleet Utilization</span>
        <span className="metric-value average">78.5%</span>
      </div>
      <div className="metric-row">
        <span>Cost per Mile</span>
        <span className="metric-value">${stats.costPerMile}</span>
      </div>
      <div className="metric-row">
        <span>Inventory Turnover</span>
        <span className="metric-value good">{stats.inventoryTurnover}x</span>
      </div>
    </div>
  );

  const renderRouteEfficiency = () => (
    <div className="analytics-card">
      <h3>Route Efficiency</h3>
      <div className="chart-placeholder">
        📈 Route efficiency trends over time
        <div style={{ marginTop: '20px', fontSize: '14px', color: '#64748b' }}>
          <div>• Colombo-Kandy Route: 94% efficiency</div>
          <div>• Kandy-Galle Route: 78% efficiency</div>
          <div>• Main Line Railway: 96% efficiency</div>
          <div>• Coast Line Railway: 92% efficiency</div>
        </div>
      </div>
    </div>
  );

  const renderCostAnalysis = () => (
    <div className="analytics-card">
      <h3>Transportation Cost Analysis</h3>
      <div className="cost-breakdown">
        <div className="cost-item">
          <span>Fuel</span>
          <span>45%</span>
        </div>
        <div className="cost-item">
          <span>Maintenance</span>
          <span>25%</span>
        </div>
        <div className="cost-item">
          <span>Labor</span>
          <span>20%</span>
        </div>
        <div className="cost-item">
          <span>Other</span>
          <span>10%</span>
        </div>
      </div>
    </div>
  );

  const renderPredictiveInsights = () => (
    <div className="analytics-card">
      <h3>Predictive Insights</h3>
      <div className="insight-item">
        <span className="insight-icon">⚠️</span>
        <span>High traffic expected on Colombo-Kandy route tomorrow</span>
      </div>
      <div className="insight-item">
        <span className="insight-icon">📈</span>
        <span>15% increase in demand predicted for next week</span>
      </div>
      <div className="insight-item">
        <span className="insight-icon">💡</span>
        <span>Route optimization could save 12% in fuel costs</span>
      </div>
      <div className="insight-item">
        <span className="insight-icon">🚛</span>
        <span>3 vehicles due for maintenance this week</span>
      </div>
    </div>
  );

  return (
    <div className="dashboard-content">
      <div className="section-header">
        <h2 className="section-title">Supply Chain Analytics</h2>
        <div className="table-actions">
          <button className="btn-secondary" onClick={exportAnalyticsReport}>📊 Export Report</button>
          <button className="btn-secondary">⚙️ Configure</button>
        </div>
      </div>
      
      <div className="analytics-grid">
        {renderPerformanceMetrics()}
        {renderRouteEfficiency()}
        {renderCostAnalysis()}
        {renderPredictiveInsights()}
      </div>

      <div className="analytics-grid" style={{ marginTop: '24px' }}>
        <div className="analytics-card">
          <h3>Monthly Trends</h3>
          <div className="chart-placeholder">
            📊 Monthly performance comparison
            <div style={{ marginTop: '20px', fontSize: '14px', color: '#64748b' }}>
              <div>• September: 96.5% delivery rate</div>
              <div>• August: 94.2% delivery rate</div>
              <div>• July: 95.8% delivery rate</div>
            </div>
          </div>
        </div>
        
        <div className="analytics-card">
          <h3>Revenue Analysis</h3>
          <div className="metric-row">
            <span>This Month</span>
            <span className="metric-value good">$45,670</span>
          </div>
          <div className="metric-row">
            <span>Last Month</span>
            <span className="metric-value">$42,300</span>
          </div>
          <div className="metric-row">
            <span>Growth Rate</span>
            <span className="metric-value good">+8.0%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;