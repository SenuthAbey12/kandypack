import React from "react";
import "./overview.css";

export default function Overview({ onGoAssignments, onGoTrips }) {
  return (
    <div className="driver-overview">
      <h2>Today</h2>
      <div className="quick-actions">
        <button className="btn" onClick={onGoAssignments}>View Assignments</button>
        <button className="btn" onClick={onGoTrips}>View Trips</button>
      </div>
      <div className="stat-cards">
        <div className="stat-card">
          <strong>Next Stop</strong>
          <div>10:30 AM — Central Hub</div>
        </div>
        <div className="stat-card">
          <strong>Active Load</strong>
          <div>2 pallets — 1.2t</div>
        </div>
        <div className="stat-card">
          <strong>Vehicle</strong>
          <div>Truck TR-203 • OK</div>
        </div>
      </div>
    </div>
  );
}