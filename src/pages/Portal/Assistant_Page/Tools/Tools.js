import React from "react";
import "./tools.css";

export default function Tools() {
  return (
    <div className="assistant-tools">
      <h2>Assistant Tools</h2>
      <div className="tools-grid">
        <button className="tool-btn">Driver Communication</button>
        <button className="tool-btn">Generate Reports</button>
        <button className="tool-btn">Schedule Management</button>
        <button className="tool-btn">Vehicle Maintenance</button>
        <button className="tool-btn">Customer Follow-up</button>
        <button className="tool-btn">Emergency Protocol</button>
      </div>
    </div>
  );
}