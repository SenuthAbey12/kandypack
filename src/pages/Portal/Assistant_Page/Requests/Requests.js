import React, { useState, useEffect } from "react";
import "./requests.css";

export default function Requests() {
  const [requests, setRequests] = useState([]);
  useEffect(() => {
    setRequests([
      { id: "REQ001", driver: "John Driver", type: "Route Change", desc: "Traffic on main route", time: "10:30 AM", status: "pending" },
      { id: "REQ002", driver: "Jane Driver", type: "Vehicle Issue", desc: "Tire pressure warning", time: "09:15 AM", status: "resolved" },
    ]);
  }, []);
  const setStatus = (id, status) => setRequests(r => r.map(x => x.id === id ? ({ ...x, status }) : x));
  return (
    <div className="assistant-requests">
      <h2>Driver Requests</h2>
      <div className="list">
        {requests.map(r => (
          <div key={r.id} className="list-item">
            <div>
              <div><strong>{r.id}</strong> — {r.driver}</div>
              <div className="muted">{r.type} • {r.desc} • {r.time}</div>
            </div>
            {r.status === "pending" ? (
              <div className="right">
                <button className="btn approve" onClick={() => setStatus(r.id, "approved")}>Approve</button>
                <button className="btn deny" onClick={() => setStatus(r.id, "denied")}>Deny</button>
              </div>
            ) : (
              <span className={`badge ${r.status}`}>{r.status}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}