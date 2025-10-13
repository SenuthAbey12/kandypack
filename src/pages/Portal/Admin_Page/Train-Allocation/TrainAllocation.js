import React, { useEffect, useState } from "react";
import "./trainallocation.css";

const tokenHeader = { Authorization: `Bearer ${localStorage.getItem("authToken") || "demo"}` };

export default function TrainAllocation({ onGoTruckAssignment }) {
  const [orders, setOrders] = useState([]);
  const [trips, setTrips] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      try { const r = await fetch("http://localhost:5000/api/admin/orders?status=confirmed", { headers: tokenHeader }); if (r.ok) return setOrders(await r.json()); } catch {}
      setOrders([{ order_id:"ORD001", destination_city:"Colombo", customer_name:"John", required_space:12.5, order_date:"2025-10-02" }]);
    })();
  }, []);

  const loadTrips = async (order) => {
    setSelectedOrder(order); setSelectedTrip(null);
    try {
      const r = await fetch(`http://localhost:5000/api/admin/train-trips?city=${encodeURIComponent(order.destination_city)}`, { headers: tokenHeader });
      if (r.ok) return setTrips(await r.json());
    } catch {}
    setTrips([{ trip_id:"TT001", train_id:"TR100", route_id:"R_KAN_COL", depart_time:new Date(Date.now()+8*86400000).toISOString(), arrive_time:new Date(Date.now()+8*86400000+6*3600000).toISOString(), capacity:200, capacity_used:40 }]);
  };

  const assign = async () => {
    if (!selectedOrder || !selectedTrip) return;
    setBusy(true);
    try {
      const r = await fetch(`http://localhost:5000/api/admin/orders/${encodeURIComponent(selectedOrder.order_id)}/schedule-trains`, {
        method:"POST", headers:{ "Content-Type":"application/json", ...tokenHeader },
        body: JSON.stringify({ route_id:selectedTrip.route_id, store_id:selectedTrip.store_id })
      });
      if (!r.ok) throw new Error();
    } catch {}
    setBusy(false);
    alert("Order reserved on train (demo). Continue to Truck Assignment.");
    onGoTruckAssignment?.();
  };

  return (
    <div className="trainalloc">
      <h2>Train Allocation</h2>

      <div className="grid">
        <div className="panel">
          <h3>Pending Orders</h3>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Order</th><th>Destination</th><th>Req.</th><th>Date</th><th></th></tr></thead>
              <tbody>
                {orders.map(o=>(
                  <tr key={o.order_id}>
                    <td className="mono">{o.order_id}</td><td>{o.destination_city}</td><td>{o.required_space} u</td><td>{o.order_date}</td>
                    <td><button className="btn" onClick={()=>loadTrips(o)}>Find Trips</button></td>
                  </tr>
                ))}
                {orders.length===0 && <tr><td colSpan={5} className="empty">No orders</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        <div className="panel">
          <h3>Matching Train Trips {selectedOrder ? `• ${selectedOrder.destination_city}` : ""}</h3>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Trip</th><th>Train</th><th>Route</th><th>Depart</th><th>Arrive</th><th>Remaining</th><th></th></tr></thead>
              <tbody>
                {trips.map(t=>{
                  const remain = Number(t.capacity) - Number(t.capacity_used||0);
                  return (
                    <tr key={t.trip_id}>
                      <td className="mono">{t.trip_id}</td><td>{t.train_id}</td><td>{t.route_id}</td>
                      <td>{new Date(t.depart_time).toLocaleString()}</td><td>{new Date(t.arrive_time).toLocaleString()}</td><td>{remain}</td>
                      <td><button className={`btn ${selectedTrip?.trip_id===t.trip_id?"primary":""}`} onClick={()=>setSelectedTrip(t)}>{selectedTrip?.trip_id===t.trip_id?"Selected":"Select"}</button></td>
                    </tr>
                  );
                })}
                {trips.length===0 && <tr><td colSpan={7} className="empty">No trips</td></tr>}
              </tbody>
            </table>
          </div>
          <div className="actions">
            <button className="btn" disabled={!selectedTrip || busy} onClick={assign}>{busy ? "Assigning…" : "Assign to Train"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
