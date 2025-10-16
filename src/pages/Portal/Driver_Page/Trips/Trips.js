import React from "react";
import "./trips.css";

const trips = [
  { id: "TRP-9001", from: "Colombo", to: "Kandy", depart: "09:00", arrive: "11:15" },
  { id: "TRP-9002", from: "Kandy", to: "Matale", depart: "12:45", arrive: "13:40" },
];

export default function Trips() {
  return (
    <div className="driver-trips">
      <h2>Trips</h2>
      <div className="list">
        {trips.map((t) => (
          <div key={t.id} className="list-item">
            <div>
              <div><strong>{t.id}</strong> — {t.from} → {t.to}</div>
              <div className="muted">{t.depart} → {t.arrive}</div>
            </div>
            <span className="badge">Scheduled</span>
          </div>
        ))}
      </div>
    </div>
  );
}