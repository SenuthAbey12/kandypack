import React, { useState, useEffect } from "react";
import "./inventory.css";

export default function Inventory() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    setItems([
      { id: "INV001", name: "Packaging Box (Large)", current: 150, min: 50, status: "adequate" },
      { id: "INV002", name: "Bubble Wrap Roll", current: 25, min: 30, status: "low" },
      { id: "INV003", name: "Shipping Labels", current: 500, min: 100, status: "adequate" },
    ]);
  }, []);
  return (
    <div className="assistant-inventory">
      <h2>Inventory</h2>
      <div className="inv-list">
        {items.map(it => (
          <div key={it.id} className="inv-item">
            <div>
              <div><strong>{it.name}</strong></div>
              <div className="muted">Current: {it.current} • Min: {it.min}</div>
            </div>
            <div className={`status ${it.status}`}>
              {it.status}
              {it.status === "low" && <button className="btn small">Reorder</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}