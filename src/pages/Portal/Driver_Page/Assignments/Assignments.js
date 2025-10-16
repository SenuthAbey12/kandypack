import React from "react";
import "./assignments.css";

const sample = [
  { id: "ASG-1204", route: "Colombo → Kandy", window: "09:30 – 12:00", status: "Assigned" },
  { id: "ASG-1205", route: "Kandy → Matale", window: "13:30 – 15:00", status: "Pending" },
];

export default function Assignments() {
  return (
    <div className="driver-assignments">
      <h2>My Assignments</h2>
      <div className="list">
        {sample.map((a) => (
          <div key={a.id} className="list-item">
            <div>
              <div><strong>{a.id}</strong> — {a.route}</div>
              <div className="muted">{a.window}</div>
            </div>
            <span className="badge">{a.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}