import React, { useEffect, useState } from "react";
import "./overview.css";

const tokenHeader = { Authorization: `Bearer ${localStorage.getItem("authToken") || "demo"}` };
const ASSIGNED_KEY = "trainAllocation.assignedOrders";

const readAssignedOrderIds = () => {
  if (typeof window === "undefined" || !window.sessionStorage) return [];
  try {
    const raw = sessionStorage.getItem(ASSIGNED_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const IconClipboard = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="8" y="2" width="8" height="4" rx="1.5" />
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <line x1="9" y1="10" x2="15" y2="10" />
    <line x1="9" y1="14" x2="15" y2="14" />
  </svg>
);

const IconTruck = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="7" width="11" height="7" rx="1.5" />
    <path d="M14 11h3l2.5 2.5V16H14v-5z" />
    <circle cx="7" cy="17" r="1.6" />
    <circle cx="16.5" cy="17" r="1.6" />
  </svg>
);

const IconTrain = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="3" width="14" height="13" rx="2" />
    <line x1="5" y1="12" x2="19" y2="12" />
    <circle cx="9" cy="16.5" r="1.5" />
    <circle cx="15" cy="16.5" r="1.5" />
    <path d="M8 20l-2 2" />
    <path d="M16 20l2 2" />
  </svg>
);

const IconGauge = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.5 18c-.31-.81-.5-1.69-.5-2.6A8 8 0 0 1 12 7.4a8 8 0 0 1 8 8c0 .9-.19 1.79-.5 2.6" />
    <path d="M12 13l3-3" />
    <circle cx="12" cy="15.4" r="1.6" />
    <line x1="6" y1="21" x2="9" y2="18" />
    <line x1="18" y1="21" x2="15" y2="18" />
  </svg>
);

export default function Overview({ onGoAllocate }) {
  const [stats, setStats] = useState({});
  const [pendingOrders, setPendingOrders] = useState([]);
  const [resources, setResources] = useState({ drivers: 0, assistants: 0, trucks: 0, trains: 0 });

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("http://localhost:5000/api/admin/system-stats", { headers: tokenHeader });
        if (r.ok) return setStats(await r.json());
      } catch {}
      setStats({ totalPendingOrders: 15, totalTrucks: 2, totalTrains: 2, totalCapacityUtilization: 67 });
    })();

    (async () => {
      try {
        const r = await fetch("http://localhost:5000/api/admin/orders?status=confirmed", { headers: tokenHeader });
        if (r.ok) {
          const data = await r.json();
          const assigned = new Set(readAssignedOrderIds());
          return setPendingOrders(
            (Array.isArray(data) ? data : []).filter(
              (order) => !assigned.has(order?.order_id ?? order?.id)
            )
          );
        }
      } catch {}
      const assigned = new Set(readAssignedOrderIds());
      setPendingOrders(
        [
        {
          order_id: "ORD001",
          customer_name: "John Doe",
          destination_city: "Colombo",
          order_date: "2025-10-02",
          required_space: 12.5,
        },
        {
          order_id: "ORD002",
          customer_name: "Jane Smith",
          destination_city: "Galle",
          order_date: "2025-10-03",
          required_space: 8.2,
        },
      ].filter((order) => {
          const key = order?.order_id ?? order?.id;
          return key ? !assigned.has(key) : true;
        })
      );
    })();

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

  useEffect(() => {
    const handleAssigned = (event) => {
      const id = event.detail?.orderId;
      if (!id) return;
      setPendingOrders((list) => {
        let removed = false;
        const next = list.filter((o) => {
          const key = o.order_id ?? o.id;
          if (key === id) removed = true;
          return key !== id;
        });
        if (removed) {
          setStats((prev) => ({
            ...prev,
            totalPendingOrders: Math.max(0, (prev.totalPendingOrders ?? 0) - 1),
          }));
        }
        return next;
      });
    };
    window.addEventListener("train-allocation:order-assigned", handleAssigned);
    return () => window.removeEventListener("train-allocation:order-assigned", handleAssigned);
  }, []);

  const handleAllocateClick = (order) => {
    const key = order?.order_id ?? order?.id;
    if (!key) return;
    let removed = false;
    setPendingOrders((list) => {
      const next = list.filter((o) => {
        const id = o.order_id ?? o.id;
        if (id === key) removed = true;
        return id !== key;
      });
      return next;
    });
    if (removed) {
      setStats((prev) => ({
        ...prev,
        totalPendingOrders: Math.max(0, (prev.totalPendingOrders ?? 0) - 1),
      }));
    }
    onGoAllocate?.({ ...order, order_id: key });
  };

  const summaryCards = [
    {
      key: "pending",
      label: "Pending Orders",
      value: stats.totalPendingOrders ?? 0,
      icon: <IconClipboard />,
    },
    {
      key: "trucks",
      label: "Available Trucks",
      value: stats.totalTrucks ?? 0,
      icon: <IconTruck />,
    },
    {
      key: "trains",
      label: "Available Trains",
      value: stats.totalTrains ?? 0,
      icon: <IconTrain />,
    },
    {
      key: "capacity",
      label: "Capacity Utilization",
      value: `${stats.totalCapacityUtilization ?? 0}%`,
      icon: <IconGauge />,
    },
  ];

  return (
    <div className="admin-page overview">
      <div className="stats-grid">
        {summaryCards.map(({ key, label, value, icon }) => (
          <div className={`stat-card stat-${key}`} key={key}>
            <div className="icon">{icon}</div>
            <div>
              <h3>{value}</h3>
              <p>{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mini-grid">
        <div className="panel">
          <h2>Orders Requiring Allocation</h2>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Destination</th>
                  <th>Req. Space</th>
                  <th>Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {pendingOrders.map((o) => (
                  <tr key={o.order_id}>
                    <td className="mono">{o.order_id}</td>
                    <td>{o.customer_name}</td>
                    <td>{o.destination_city}</td>
                    <td>{o.required_space} u</td>
                    <td>{o.order_date}</td>
                    <td>
                      <button className="btn primary" onClick={() => handleAllocateClick(o)}>
                        Allocate
                      </button>
                    </td>
                  </tr>
                ))}
                {pendingOrders.length === 0 && (
                  <tr>
                    <td colSpan={6} className="empty">
                      No pending orders
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="panel">
          <h2>Available Resources (Now)</h2>
          <ul className="bubbles">
            <li>
              <span>Drivers</span>
              <strong>{resources.drivers}</strong>
            </li>
            <li>
              <span>Assistants</span>
              <strong>{resources.assistants}</strong>
            </li>
            <li>
              <span>Trucks</span>
              <strong>{resources.trucks}</strong>
            </li>
            <li>
              <span>Trains</span>
              <strong>{resources.trains}</strong>
            </li>
          </ul>
          <p className="muted small">Tip: Add more in "Add Employees / Trucks / Trains".</p>
        </div>
      </div>
    </div>
  );
}
