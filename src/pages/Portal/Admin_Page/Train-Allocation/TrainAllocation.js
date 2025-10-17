import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./trainallocation.css";

const tokenHeader = { Authorization: `Bearer ${localStorage.getItem("authToken") || "demo"}` };

const HOURS = 60 * 60 * 1000;
const baseTime = Date.now();
const STORAGE_KEY = "trainAllocation.pendingOrders";
const ASSIGNED_KEY = "trainAllocation.assignedOrders";

const demoTripSeeds = [
  {
    trip_id: "TT-COL-01",
    train_id: "TR100",
    route_id: "R_KAN_COL",
    origin_city: "Kandy",
    destination_city: "Colombo",
    depart_in: 6, // hours from now
    duration: 6, // hours
    capacity: 220,
    capacity_used: 80,
    store_id: "MAIN-DEPOT",
  },
  {
    trip_id: "TT-COL-02",
    train_id: "TR104",
    route_id: "R_KAN_COL",
    origin_city: "Peradeniya",
    destination_city: "Colombo",
    depart_in: 30,
    duration: 5.5,
    capacity: 180,
    capacity_used: 60,
    store_id: "MAIN-DEPOT",
  },
  {
    trip_id: "TT-GAL-01",
    train_id: "TR205",
    route_id: "R_COAST_GALLE",
    origin_city: "Colombo Fort",
    destination_city: "Galle",
    depart_in: 10,
    duration: 4.5,
    capacity: 160,
    capacity_used: 30,
    store_id: "COAST-DEPOT",
  },
  {
    trip_id: "TT-MAT-01",
    train_id: "TR208",
    route_id: "R_COAST_MATARA",
    origin_city: "Colombo Fort",
    destination_city: "Matara",
    depart_in: 16,
    duration: 5.5,
    capacity: 200,
    capacity_used: 110,
    store_id: "COAST-DEPOT",
  },
  {
    trip_id: "TT-NEG-01",
    train_id: "TR310",
    route_id: "R_RAGAMA_NEGOMBO",
    origin_city: "Colombo Fort",
    destination_city: "Negombo",
    depart_in: 8,
    duration: 2,
    capacity: 120,
    capacity_used: 20,
    store_id: "NORTH-DEPOT",
  },
  {
    trip_id: "TT-JAF-01",
    train_id: "TR702",
    route_id: "R_NORTH_JAFFNA",
    origin_city: "Colombo Fort",
    destination_city: "Jaffna",
    depart_in: 20,
    duration: 9,
    capacity: 240,
    capacity_used: 160,
    store_id: "NORTH-DEPOT",
  },
  {
    trip_id: "TT-TRI-01",
    train_id: "TR811",
    route_id: "R_EAST_TRINCO",
    origin_city: "Colombo Fort",
    destination_city: "Trincomalee",
    depart_in: 24,
    duration: 11,
    capacity: 210,
    capacity_used: 120,
    store_id: "EAST-DEPOT",
  },
];

const DEMO_TRIPS = demoTripSeeds.map((trip) => {
  const depart = new Date(baseTime + trip.depart_in * HOURS);
  const arrive = new Date(baseTime + (trip.depart_in + trip.duration) * HOURS);
  return {
    ...trip,
    depart_time: depart.toISOString(),
    arrive_time: arrive.toISOString(),
  };
});

const norm = (value) =>
  (value || "")
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");

const remainingCapacity = (trip) =>
  Number(trip.capacity ?? 0) - Number(trip.capacity_used ?? 0);

const fallbackTripsForOrder = (order) => {
  if (!order) return [];
  const city = norm(order.destination_city);
  if (!city) return [];
  const required = Number(order.required_space ?? 0);
  return DEMO_TRIPS.filter((trip) => {
    const target = norm(trip.destination_city);
    const matches =
      target.includes(city) || city.includes(target) || norm(trip.route_id).includes(city);
    const hasCapacity = remainingCapacity(trip) >= required;
    return matches && hasCapacity;
  });
};

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

const writeAssignedOrderIds = (ids) => {
  if (typeof window === "undefined" || !window.sessionStorage) return;
  try {
    sessionStorage.setItem(ASSIGNED_KEY, JSON.stringify(ids));
  } catch {}
};

const markOrderAssigned = (orderId) => {
  if (!orderId) return;
  const ids = readAssignedOrderIds();
  if (!ids.includes(orderId)) {
    ids.push(orderId);
    writeAssignedOrderIds(ids);
  }
  window.dispatchEvent(
    new CustomEvent("train-allocation:order-assigned", { detail: { orderId } })
  );
};

const ensureOrderInList = (list, extra, pinToTop = false) => {
  const base = Array.isArray(list) ? [...list] : [];
  const key = extra?.order_id ?? extra?.id;
  if (!extra || !key) return base;
  const idx = base.findIndex((o) => (o.order_id ?? o.id) === key);
  const merged = idx !== -1 ? { ...base[idx], ...extra, order_id: key } : { ...extra, order_id: key };
  if (idx !== -1) base.splice(idx, 1);
  if (pinToTop) base.unshift(merged);
  else base.push(merged);
  return base;
};

const mergeOrders = (list, additions, pinToTop = false) => {
  let result = Array.isArray(list) ? [...list] : [];
  (Array.isArray(additions) ? additions : []).forEach((order) => {
    result = ensureOrderInList(result, order, pinToTop);
  });
  return result;
};

const readStoredOrders = () => {
  if (typeof window === "undefined" || !window.sessionStorage) return [];
  const assigned = new Set(readAssignedOrderIds());
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((order) => !assigned.has(order?.order_id ?? order?.id));
  } catch {
    return [];
  }
};

export default function TrainAllocation({ onGoTruckAssignment }) {
  const navigate = useNavigate();
  const location = useLocation();
  const focusOrder = location.state?.focusOrder;
  const focusOrderRef = useRef(focusOrder || null);
  const [orders, setOrders] = useState(() => readStoredOrders());
  const [trips, setTrips] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [busy, setBusy] = useState(false);
  const [loadingTrips, setLoadingTrips] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [tripStatus, setTripStatus] = useState({
    message: "Pick an order to view matching trains.",
    tone: "muted",
  });

  useEffect(() => {
    try {
      const assigned = new Set(readAssignedOrderIds());
      const serialized = orders.filter((o) => !assigned.has(o.order_id ?? o.id));
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(serialized));
    } catch {}
  }, [orders]);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("http://localhost:5000/api/admin/orders?status=confirmed", {
          headers: tokenHeader,
        });
        if (r.ok) {
          const data = await r.json();
          const assigned = new Set(readAssignedOrderIds());
          const incoming = (Array.isArray(data) ? data : []).filter(
            (order) => !assigned.has(order?.order_id ?? order?.id)
          );
          setOrders((current) => mergeOrders(current, incoming));
          return;
        }
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  useEffect(() => {
    if (!focusOrder) return;
    const key = focusOrder?.order_id ?? focusOrder?.id;
    if (!key) return;
    if (readAssignedOrderIds().includes(key)) {
      navigate(".", { replace: true, state: {} });
      return;
    }
    focusOrderRef.current = { ...focusOrder, order_id: key };
    setOrders((current) => mergeOrders(current, [{ ...focusOrder, order_id: key }], true));
    setSelectedOrder({ ...focusOrder, order_id: key });
    setSelectedTrip(null);
    setTrips([]);
    setHasSearched(false);
    setLoadingTrips(false);
    setTripStatus({
      message: `Order ${key} is ready for train allocation.`,
      tone: "muted",
    });
    navigate(".", { replace: true, state: {} });
  }, [focusOrder, navigate]);

  const loadTrips = async (order) => {
    if (!order) return;
    setSelectedOrder(order);
    setSelectedTrip(null);
    setHasSearched(true);
    setLoadingTrips(true);
    setTripStatus({ message: "Searching available train trips...", tone: "muted" });
    setTrips([]);

    const required = Number(order.required_space ?? 0);
    try {
      const params = new URLSearchParams({
        city: order.destination_city ?? "",
        required_space: String(required),
      });
      const r = await fetch(`http://localhost:5000/api/admin/train-trips?${params.toString()}`, {
        headers: tokenHeader,
      });
      if (r.ok) {
        const data = await r.json();
        const filtered = (Array.isArray(data) ? data : []).filter(
          (trip) => remainingCapacity(trip) >= required
        );
        if (filtered.length) {
          setTrips(filtered);
          setTripStatus({
            message: `Found ${filtered.length} trip${filtered.length > 1 ? "s" : ""} to ${
              order.destination_city
            }.`,
            tone: "success",
          });
          setLoadingTrips(false);
          return;
        }
      }
    } catch (err) {
      console.error(err);
    }

    const fallback = fallbackTripsForOrder(order);
    setTrips(fallback);
    setTripStatus({
      message: fallback.length
        ? `Showing demo trips for ${order.destination_city}.`
        : `No train trips with enough capacity for ${order.destination_city} right now.`,
      tone: fallback.length ? "muted" : "danger",
    });
    setLoadingTrips(false);
  };

  const handleSelectTrip = (trip) => {
    setSelectedTrip(trip);
    setTripStatus({
      message: `Trip ${trip.trip_id} selected for order ${selectedOrder?.order_id}.`,
      tone: "success",
    });
  };

  const assign = async () => {
    if (!selectedOrder || !selectedTrip) return;
    setBusy(true);
    try {
      const r = await fetch(
        `http://localhost:5000/api/admin/orders/${encodeURIComponent(
          selectedOrder.order_id
        )}/schedule-trains`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", ...tokenHeader },
          body: JSON.stringify({
            route_id: selectedTrip.route_id,
            store_id: selectedTrip.store_id,
            trip_id: selectedTrip.trip_id,
          }),
        }
      );
      if (!r.ok) throw new Error();
      alert(`Order ${selectedOrder.order_id} assigned to trip ${selectedTrip.trip_id}.`);
      onGoTruckAssignment?.();
    } catch (err) {
      console.error(err);
      alert("Saved locally. Sync with the backend when available.");
    } finally {
      setBusy(false);
    }
    const assignedId = selectedOrder?.order_id ?? selectedOrder?.id;
    setOrders((current) => current.filter((o) => (o.order_id ?? o.id) !== assignedId));
    markOrderAssigned(assignedId);
    setSelectedOrder(null);
    setSelectedTrip(null);
    setTrips([]);
    setHasSearched(false);
    setTripStatus({ message: "Pick an order to view matching trains.", tone: "muted" });
  };

  return (
    <div className="admin-page trainalloc">
      <h2>Train Allocation</h2>

      <div className="grid">
        <div className="panel">
          <h3>Pending Orders</h3>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Destination</th>
                  <th>Req.</th>
                  <th>Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr
                    key={o.order_id}
                    className={selectedOrder?.order_id === o.order_id ? "active" : ""}
                  >
                    <td className="mono">{o.order_id}</td>
                    <td>{o.destination_city}</td>
                    <td>{o.required_space} u</td>
                    <td>{o.order_date}</td>
                    <td>
                      <button
                        className="btn"
                        onClick={() => loadTrips(o)}
                        disabled={loadingTrips && selectedOrder?.order_id === o.order_id}
                      >
                        {loadingTrips && selectedOrder?.order_id === o.order_id
                          ? "Searching..."
                          : "Find Trips"}
                      </button>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan={5} className="empty">
                      No orders
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="panel">
          <h3>
            Matching Train Trips {selectedOrder ? `- ${selectedOrder.destination_city}` : ""}
          </h3>
          {tripStatus?.message && (
            <p className={`status-line ${tripStatus.tone}`}>{tripStatus.message}</p>
          )}
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Trip</th>
                  <th>Train</th>
                  <th>Route</th>
                  <th>Depart</th>
                  <th>Arrive</th>
                  <th>Remaining</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {!hasSearched && (
                  <tr>
                    <td colSpan={7} className="empty">
                      Select an order to view upcoming trips.
                    </td>
                  </tr>
                )}
                {hasSearched && loadingTrips && (
                  <tr>
                    <td colSpan={7} className="empty">
                      Searching trips...
                    </td>
                  </tr>
                )}
                {hasSearched &&
                  !loadingTrips &&
                  trips.map((t) => {
                    const remain = remainingCapacity(t);
                    return (
                      <tr
                        key={t.trip_id}
                        className={selectedTrip?.trip_id === t.trip_id ? "active" : ""}
                      >
                        <td className="mono">{t.trip_id}</td>
                        <td>{t.train_id}</td>
                        <td>{t.route_id}</td>
                        <td>{new Date(t.depart_time).toLocaleString()}</td>
                        <td>{new Date(t.arrive_time).toLocaleString()}</td>
                        <td>{remain}</td>
                        <td>
                          <button
                            className={`btn ${
                              selectedTrip?.trip_id === t.trip_id ? "primary" : ""
                            }`}
                            onClick={() => handleSelectTrip(t)}
                          >
                            {selectedTrip?.trip_id === t.trip_id ? "Selected" : "Select"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                {hasSearched && !loadingTrips && trips.length === 0 && (
                  <tr>
                    <td colSpan={7} className="empty">
                      No trips
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="actions">
            <button className="btn" disabled={!selectedTrip || busy} onClick={assign}>
              {busy ? "Assigning..." : "Assign to Train"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
