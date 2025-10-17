import React, { useState, useEffect } from "react";
import "./requests.css";

export default function Requests() {
  const [requests, setRequests] = useState([]);
  useEffect(() => {
    setRequests([
      { id: "REQ001", admin: "Alex Admin", type: "Policy Update", desc: "Adjust delivery window", time: "10:30 AM", status: "pending" },
      { id: "REQ002", admin: "Chris Admin", type: "Schedule Change", desc: "Shift coverage needed", time: "09:15 AM", status: "resolved" },
    ]);
  }, []);
  const setStatus = (id, status) => setRequests(r => r.map(x => x.id === id ? ({ ...x, status }) : x));
  return (
    <div className="assistant-requests">
      <h2>Admin Requests</h2> {/* changed */}
      <div className="list">
        {requests.map(r => (
          <div key={r.id} className="list-item">
            <div>
              <div><strong>{r.id}</strong> — {r.admin}</div> {/* changed */}
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