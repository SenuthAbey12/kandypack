import React from "react";
import "./reports.css";

export default function Reports() {
  return (
    <div className="driver-reports">
      <h2>Reports</h2>
      <div className="list">
        <div className="list-item">
          <div>
            <div><strong>Mileage (This Week)</strong></div>
            <div className="muted">432 km</div>
          </div>
          <span className="badge">Summary</span>
        </div>
        <div className="list-item">
          <div>
            <div><strong>Incidents</strong></div>
            <div className="muted">No incidents reported</div>
          </div>
          <span className="badge">OK</span>
        </div>
      </div>
    </div>
  );
}