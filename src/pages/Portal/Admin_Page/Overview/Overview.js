import React, { useEffect, useState } from "react";
import "./overview.css";

const tokenHeader = { Authorization: `Bearer ${localStorage.getItem("authToken") || "demo"}` };

export default function Overview({ onGoAllocate }) {
  const [stats, setStats] = useState({});
  const [pendingOrders, setPendingOrders] = useState([]);
  const [resources, setResources] = useState({ drivers: 0, assistants: 0, trucks: 0, trains: 0 });

  useEffect(() => {
    // stats
    (async () => {
      try {
        const r = await fetch("http://localhost:5000/api/admin/system-stats", { headers: tokenHeader });
        if (r.ok) return setStats(await r.json());
      } catch {}
      setStats({ totalPendingOrders: 15, totalTrucks: 2, totalTrains: 2, totalCapacityUtilization: 67 });
    })();

    // pending orders
    (async () => {
      try {
        const r = await fetch("http://localhost:5000/api/admin/orders?status=confirmed", { headers: tokenHeader });
        if (r.ok) return setPendingOrders(await r.json());
      } catch {}
      setPendingOrders([
        { order_id: "ORD001", customer_name: "John Doe", destination_city: "Colombo", order_date: "2025-10-02", required_space: 12.5 },
        { order_id: "ORD002", customer_name: "Jane Smith", destination_city: "Galle", order_date: "2025-10-03", required_space: 8.2 },
      ]);
    })();

    // quick counts
    (async () => {
      try {
        const [d, a, t, tr] = await Promise.all([
          fetch("http://localhost:5000/api/admin/drivers", { headers: tokenHeader }),
          fetch("http://localhost:5000/api/admin/assistants", { headers: tokenHeader }),
          fetch("http://localhost:5000/api/admin/trucks", { headers: tokenHeader }),
          fetch("http://localhost:5000/api/admin/trains", { headers: tokenHeader }),
        ]);
        setResources({
          drivers: d.ok ? (await d.json()).length : 2,
          assistants: a.ok ? (await a.json()).length : 2,
          trucks: t.ok ? (await t.json()).length : 2,
          trains: tr.ok ? (await tr.json()).length : 2,
        });
      } catch {
        setResources({ drivers: 2, assistants: 2, trucks: 2, trains: 2 });
      }
    })();
  }, []);

  return (
    <div className="overview">
      <div className="stats-grid">
        <div className="stat-card"><div className="icon">📋</div><div><h3>{stats.totalPendingOrders ?? 0}</h3><p>Pending Orders</p></div></div>
        <div className="stat-card"><div className="icon">🚛</div><div><h3>{stats.totalTrucks ?? 0}</h3><p>Available Trucks</p></div></div>
        <div className="stat-card"><div className="icon">🚂</div><div><h3>{stats.totalTrains ?? 0}</h3><p>Available Trains</p></div></div>
        <div className="stat-card"><div className="icon">📊</div><div><h3>{stats.totalCapacityUtilization ?? 0}%</h3><p>Capacity Utilization</p></div></div>
      </div>

      <div className="mini-grid">
        <div className="panel">
          <h2>Orders Requiring Allocation</h2>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Order</th><th>Customer</th><th>Destination</th><th>Req. Space</th><th>Date</th><th></th></tr></thead>
              <tbody>
                {pendingOrders.map(o => (
                  <tr key={o.order_id}>
                    <td className="mono">{o.order_id}</td><td>{o.customer_name}</td><td>{o.destination_city}</td>
                    <td>{o.required_space} u</td><td>{o.order_date}</td>
                    <td><button className="btn primary" onClick={onGoAllocate}>Allocate</button></td>
                  </tr>
                ))}
                {pendingOrders.length === 0 && <tr><td colSpan={6} className="empty">No pending orders</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        <div className="panel">
          <h2>Available Resources (Now)</h2>
          <ul className="bubbles">
            <li><span>Drivers</span><strong>{resources.drivers}</strong></li>
            <li><span>Assistants</span><strong>{resources.assistants}</strong></li>
            <li><span>Trucks</span><strong>{resources.trucks}</strong></li>
            <li><span>Trains</span><strong>{resources.trains}</strong></li>
          </ul>
          <p className="muted small">Tip: Add more in “Add Employees / Trucks / Trains”.</p>
        </div>
      </div>
    </div>
  );
}
