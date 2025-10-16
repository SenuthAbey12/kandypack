import React from "react";
import "./metrics.css";

export default function Metrics() {
  return (
    <div className="assistant-metrics">
      <h2>Performance Metrics</h2>
      <div className="metrics-grid">
        <div className="metric-item"><span className="metric-number">28</span><span className="metric-label">Tickets Resolved Today</span></div>
        <div className="metric-item"><span className="metric-number">95%</span><span className="metric-label">Driver Satisfaction</span></div>
        <div className="metric-item"><span className="metric-number">15</span><span className="metric-label">Active Drivers</span></div>
        <div className="metric-item"><span className="metric-number">2.5 min</span><span className="metric-label">Avg Response Time</span></div>
      </div>
    </div>
  );
}