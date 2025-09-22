import React from 'react';

const Analytics = ({ getAnalyticsData, analyticsTimeframe, setAnalyticsTimeframe, analyticsView, setAnalyticsView, getRouteEfficiencyData }) => {
    const analyticsData = getAnalyticsData();
    const routeData = getRouteEfficiencyData();
    
    return (
      <div className="analytics-container">
        <div className="section-header">
          <h2 className="section-title">Supply Chain Analytics</h2>
          <div className="analytics-controls">
            <div className="control-group">
              <label>Timeframe:</label>
              <select 
                value={analyticsTimeframe} 
                onChange={(e) => setAnalyticsTimeframe(e.target.value)}
                className="analytics-select"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
              </select>
            </div>
            <div className="control-group">
              <label>View:</label>
              <select 
                value={analyticsView} 
                onChange={(e) => setAnalyticsView(e.target.value)}
                className="analytics-select"
              >
                <option value="overview">Overview</option>
                <option value="detailed">Detailed</option>
                <option value="trends">Trends</option>
              </select>
            </div>
            <div className="table-actions">
              <button className="btn-secondary">📊 Export Report</button>
              <button className="btn-secondary">⚙️ Configure</button>
            </div>
          </div>
        </div>
        
        <div className="analytics-grid">
          <div className="analytics-card performance-metrics">
            <div className="card-header">
              <h3>Performance Metrics</h3>
              <span className="timeframe-badge">{analyticsTimeframe}</span>
            </div>
            <div className="metrics-grid">
              <div className="metric-item">
                <div className="metric-info">
                  <span className="metric-label">On-time Delivery</span>
                  <span className="metric-trend positive">{analyticsData.trends.delivery}</span>
                </div>
                <div className="metric-value-wrapper">
                  <span className="metric-value excellent">{analyticsData.deliveryRate}%</span>
                  <div className="metric-bar">
                    <div className="metric-progress" style={{width: `${analyticsData.deliveryRate}%`}}></div>
                  </div>
                </div>
              </div>
              
              <div className="metric-item">
                <div className="metric-info">
                  <span className="metric-label">Fleet Utilization</span>
                  <span className="metric-trend positive">{analyticsData.trends.fleet}</span>
                </div>
                <div className="metric-value-wrapper">
                  <span className="metric-value good">{analyticsData.fleetUtilization}%</span>
                  <div className="metric-bar">
                    <div className="metric-progress" style={{width: `${analyticsData.fleetUtilization}%`}}></div>
                  </div>
                </div>
              </div>
              
              <div className="metric-item">
                <div className="metric-info">
                  <span className="metric-label">Cost per Mile</span>
                  <span className="metric-trend negative">{analyticsData.trends.cost}</span>
                </div>
                <div className="metric-value-wrapper">
                  <span className="metric-value">${analyticsData.costPerMile}</span>
                  <div className="cost-indicator">
                    <span className="cost-status">Optimized</span>
                  </div>
                </div>
              </div>
              
              <div className="metric-item">
                <div className="metric-info">
                  <span className="metric-label">Inventory Turnover</span>
                  <span className="metric-trend positive">{analyticsData.trends.inventory}</span>
                </div>
                <div className="metric-value-wrapper">
                  <span className="metric-value excellent">{analyticsData.inventoryTurnover}x</span>
                  <div className="metric-bar">
                    <div className="metric-progress" style={{width: `${(analyticsData.inventoryTurnover / 12) * 100}%`}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="analytics-card route-efficiency">
            <div className="card-header">
              <h3>Route Efficiency</h3>
              <button className="card-action-btn">View All</button>
            </div>
            <div className="route-list">
              {routeData.map((route, index) => (
                <div key={index} className="route-efficiency-item">
                  <div className="route-info">
                    <span className="route-name">{route.route}</span>
                    <span className={`efficiency-badge ${route.status}`}>
                      {route.efficiency}%
                    </span>
                  </div>
                  <div className="route-details">
                    <div className="efficiency-bar">
                      <div 
                        className={`efficiency-progress ${route.status}`}
                        style={{width: `${route.efficiency}%`}}
                      ></div>
                    </div>
                    <span className={`trend-indicator ${route.trend.startsWith('+') ? 'positive' : 'negative'}`}>
                      {route.trend}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="analytics-card cost-analysis">
            <div className="card-header">
              <h3>Transportation Cost Analysis</h3>
              <div className="chart-view-toggle">
                <button className="view-btn active">Pie</button>
                <button className="view-btn">Bar</button>
              </div>
            </div>
            <div className="cost-breakdown">
              <div className="cost-chart">
                <div className="cost-pie">
                  <div className="pie-segment fuel" style={{'--percentage': '45%'}}>
                    <span className="segment-label">Fuel 45%</span>
                  </div>
                  <div className="pie-segment maintenance" style={{'--percentage': '25%'}}>
                    <span className="segment-label">Maintenance 25%</span>
                  </div>
                  <div className="pie-segment labor" style={{'--percentage': '20%'}}>
                    <span className="segment-label">Labor 20%</span>
                  </div>
                  <div className="pie-segment other" style={{'--percentage': '10%'}}>
                    <span className="segment-label">Other 10%</span>
                  </div>
                </div>
              </div>
              <div className="cost-legend">
                <div className="legend-item">
                  <div className="legend-color fuel"></div>
                  <span>Fuel Costs</span>
                  <span className="cost-amount">$45,200</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color maintenance"></div>
                  <span>Maintenance</span>
                  <span className="cost-amount">$25,100</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color labor"></div>
                  <span>Labor</span>
                  <span className="cost-amount">$20,050</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color other"></div>
                  <span>Other</span>
                  <span className="cost-amount">$10,025</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="analytics-card predictive-insights">
            <div className="card-header">
              <h3>Predictive Insights</h3>
              <span className="insights-count">5 Active</span>
            </div>
            <div className="insights-list">
              <div className="insight-item high-priority">
                <div className="insight-header">
                  <span className="insight-icon">⚠️</span>
                  <span className="priority-label">High Priority</span>
                  <span className="insight-time">2h</span>
                </div>
                <p>High traffic expected on Colombo-Kandy route tomorrow. Consider alternative routes.</p>
                <div className="insight-action">
                  <button className="action-btn">Optimize Route</button>
                </div>
              </div>
              
              <div className="insight-item medium-priority">
                <div className="insight-header">
                  <span className="insight-icon">📈</span>
                  <span className="priority-label">Medium Priority</span>
                  <span className="insight-time">4h</span>
                </div>
                <p>15% increase in demand predicted for next week. Prepare additional capacity.</p>
                <div className="insight-action">
                  <button className="action-btn">Plan Capacity</button>
                </div>
              </div>
              
              <div className="insight-item low-priority">
                <div className="insight-header">
                  <span className="insight-icon">💡</span>
                  <span className="priority-label">Optimization</span>
                  <span className="insight-time">1d</span>
                </div>
                <p>Route optimization could save 12% in fuel costs. Review suggested changes.</p>
                <div className="insight-action">
                  <button className="action-btn">Review Changes</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
};

export default Analytics;
