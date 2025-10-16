import React from "react";
import "./overview.css";

export default function Overview({ onGoRequests }) {
  return (
    <div className="assistant-overview">
      <h2>Today</h2>
      <div className="quick-actions">
        <button className="btn" onClick={onGoRequests}>Driver Requests</button>
      </div>
      <div className="stat-cards">
        <div className="stat-card"><strong>Pending Requests</strong><div>4</div></div>
        <div className="stat-card"><strong>Low Stock Items</strong><div>2</div></div>
      </div>
    </div>
  );
}