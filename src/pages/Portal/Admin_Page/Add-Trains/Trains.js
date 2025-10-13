import React, { useEffect, useMemo, useState } from "react";
import "./trains.css";

import { ORDERED_ROUTES } from "../../../../data/rail/index";

const tokenHeader = { Authorization: `Bearer ${localStorage.getItem("authToken") || "demo"}` };

const norm = (s) => (s || "").trim().toLowerCase();

/** Find an ordered route JSON that contains both endpoints (fuzzy match). */
function findOrdered(start, end) {
  const sLC = norm(start), eLC = norm(end);
  for (const r of ORDERED_ROUTES) {
    const names = r.ordered.map((n) => norm(n));
    const si = names.findIndex((n) => n === sLC || n.includes(sLC) || sLC.includes(n));
    const ei = names.findIndex((n) => n === eLC || n.includes(eLC) || eLC.includes(n));
    if (si !== -1 && ei !== -1) return { r, si, ei };
  }
  return null;
}

/** Get the intermediate stops between two indices (exclude endpoints). */
function midsBetween(r, si, ei) {
  const [lo, hi] = si <= ei ? [si, ei] : [ei, si];
  return r.ordered.slice(lo + 1, hi);
}

export default function Trains() {
  const [trains, setTrains] = useState([]);

  // Add form (keep all existing necessary components)
  const [form, setForm] = useState({ train_id: "", capacity: "", notes: "" });
  const [route, setRoute] = useState({ route_id: "", start_city: "", end_city: "", destinations: "" });
  const [suggesting, setSuggesting] = useState(false);

  // Search
  const [query, setQuery] = useState("");

  // Inline edit state
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ capacity: "", notes: "" });
  const [savingId, setSavingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Load existing trains (demo fallback if backend is not up)
  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("http://localhost:5000/api/admin/trains", { headers: tokenHeader });
        if (r.ok) return setTrains(await r.json());
      } catch {}
      setTrains([{ train_id: "TR100", capacity: 200, notes: "" }]); // fallback sample
    })();
  }, []);

  /** Add Train + Route */
  const add = async (e) => {
    e.preventDefault();

    const trainPayload = {
      train_id: form.train_id.trim(),
      capacity: Number(form.capacity || 0),
      notes: form.notes?.trim() || "",
    };

    const routePayload = {
      route_id: route.route_id.trim() || `${trainPayload.train_id}-R`,
      start_city: route.start_city.trim(),
      end_city: route.end_city.trim(),
      destinations: (route.destinations || "").trim(),
    };

    if (!trainPayload.train_id) return alert("Train ID is required.");
    if (!routePayload.start_city || !routePayload.end_city) {
      return alert("Start and End city are required for the route.");
    }

    try {
      const r1 = await fetch("http://localhost:5000/api/admin/trains", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...tokenHeader },
        body: JSON.stringify(trainPayload),
      });
      if (!r1.ok) throw new Error("Train create failed");

      const r2 = await fetch("http://localhost:5000/api/admin/train-routes", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...tokenHeader },
        body: JSON.stringify(routePayload),
      });
      if (!r2.ok) throw new Error("Route create failed");

      setTrains((t) => [trainPayload, ...t]);
      setForm({ train_id: "", capacity: "", notes: "" });
      setRoute({ route_id: "", start_city: "", end_city: "", destinations: "" });
      alert("Train + Route added");
    } catch (err) {
      console.error(err);
      setTrains((t) => [trainPayload, ...t]); // optimistic fallback
      alert("Saved locally. Check backend endpoints if needed.");
    }
  };

  /** Suggest destinations from the predefined ordered routes (offline, instant) */
  const suggestFromOrdered = () => {
    const start = route.start_city.trim();
    const end = route.end_city.trim();
    if (!start || !end) return alert("Enter Start and End city first.");

    setSuggesting(true);
    try {
      const hit = findOrdered(start, end);
      if (!hit) {
        alert("No predefined route contains both endpoints. Add or adjust files in /src/data/rail.");
        return;
      }
      const mids = midsBetween(hit.r, hit.si, hit.ei);
      if (!mids.length) return alert("No intermediate stops for this pair on the selected route.");
      setRoute((r) => ({ ...r, destinations: mids.join(", ") }));
    } finally {
      setSuggesting(false);
    }
  };

  /** Google Maps helper (visual only) */
  const mapsUrl = (origin, destination) => {
    const base = "https://www.google.com/maps/dir/?api=1";
    const p = new URLSearchParams({ origin, destination, travelmode: "transit", transit_mode: "train" });
    return `${base}&${p.toString()}`;
  };
  const openMaps = () => {
    const s = route.start_city.trim();
    const d = route.end_city.trim();
    if (!s || !d) return;
    window.open(mapsUrl(s, d), "_blank", "noopener,noreferrer");
  };

  // Derived list = filtered by query (no sorting requested)
  const visibleTrains = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return trains;
    return trains.filter((t) => {
      const hay = `${t.train_id || t.id} ${t.capacity} ${t.notes || ""}`.toLowerCase();
      return hay.includes(q);
    });
  }, [trains, query]);

  // Edit helpers
  const startEdit = (t) => {
    const id = t.train_id || t.id;
    setEditingId(id);
    setEditForm({ capacity: String(t.capacity ?? ""), notes: t.notes ?? "" });
  };
  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ capacity: "", notes: "" });
  };
  const saveEdit = async () => {
    const id = editingId;
    if (!id) return;
    setSavingId(id);
    const payload = { capacity: Number(editForm.capacity || 0), notes: editForm.notes?.trim() || "" };
    try {
      const r = await fetch(`http://localhost:5000/api/admin/trains/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...tokenHeader },
        body: JSON.stringify(payload),
      });
      if (!r.ok) throw new Error();
    } catch {
      // demo fallback
    } finally {
      setSavingId(null);
    }
    setTrains((list) =>
      list.map((x) => ((x.train_id || x.id) === id ? { ...x, ...payload, train_id: x.train_id || id } : x))
    );
    cancelEdit();
  };

  // Delete
  const remove = async (id) => {
    if (!window.confirm("Delete this train?")) return;
    setDeletingId(id);
    try {
      const r = await fetch(`http://localhost:5000/api/admin/trains/${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: tokenHeader,
      });
      if (!r.ok) throw new Error();
    } catch {
      // demo fallback
    } finally {
      setDeletingId(null);
    }
    setTrains((t) => t.filter((x) => (x.train_id || x.id) !== id));
  };

  return (
    <div className="trains">
      {/* Header row: title left, search right */}
      <div className="page-header">
        <h2>Train Management</h2>
        <div className="header-tools">
          <input
            className="toolbar-input"
            placeholder="Search by ID, capacity, notes…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search trains"
          />
          <div className="muted">
            Showing <b>{visibleTrains.length}</b> of <b>{trains.length}</b>
          </div>
        </div>
      </div>

      {/* Form panel */}
      <div className="panels">
        <div className="panel">
          <h3>Add Train + Route</h3>
          <form className="grid" onSubmit={add}>
            {/* TRAIN */}
            <label>
              <span>Train ID</span>
              <input
                required
                value={form.train_id}
                onChange={(e) => setForm((f) => ({ ...f, train_id: e.target.value }))}
              />
            </label>
            <label>
              <span>Capacity (u)</span>
              <input
                required
                type="number"
                min="0"
                step="0.0001"
                value={form.capacity}
                onChange={(e) => setForm((f) => ({ ...f, capacity: e.target.value }))}
              />
            </label>
            <label className="full">
              <span>Notes</span>
              <textarea
                rows={2}
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              />
            </label>

            {/* ROUTE */}
            <label>
              <span>Route ID</span>
              <input
                placeholder="(auto if empty)"
                value={route.route_id}
                onChange={(e) => setRoute((r) => ({ ...r, route_id: e.target.value }))}
              />
            </label>
            <label>
              <span>Start City / Station</span>
              <input
                required
                placeholder="e.g., Kandy"
                value={route.start_city}
                onChange={(e) => setRoute((r) => ({ ...r, start_city: e.target.value }))}
              />
            </label>
            <label>
              <span>End City / Station</span>
              <input
                required
                placeholder="e.g., Colombo Fort / Negombo / Galle / Matara / Jaffna / Trincomalee"
                value={route.end_city}
                onChange={(e) => setRoute((r) => ({ ...r, end_city: e.target.value }))}
              />
            </label>
            <label className="full">
              <span>Destinations (intermediate stations)</span>
              <textarea
                rows={2}
                placeholder="Click ‘Suggest from Rail’ to auto-fill (editable)"
                value={route.destinations}
                onChange={(e) => setRoute((r) => ({ ...r, destinations: e.target.value }))}
              />
            </label>

            {/* Actions */}
            <div className="actions full" style={{ gap: 8, flexWrap: "wrap" }}>
              <button type="button" className="btn" onClick={openMaps}>
                View route in Google Maps
              </button>

              <button type="button" className="btn" onClick={suggestFromOrdered} disabled={suggesting}>
                {suggesting ? "Suggesting…" : "Suggest from Rail (offline)"}
              </button>
              <button className="btn primary" type="submit">
                Add Train
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Table */}
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Capacity</th>
              <th>Notes</th>
              <th className="right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {visibleTrains.map((t) => {
              const id = t.train_id || t.id;
              const isEditing = editingId === id;
              return (
                <tr key={id}>
                  <td className="mono">{id}</td>

                  <td>
                    {isEditing ? (
                      <input
                        type="number"
                        min="0"
                        step="0.0001"
                        value={editForm.capacity}
                        onChange={(e) => setEditForm((f) => ({ ...f, capacity: e.target.value }))}
                      />
                    ) : (
                      t.capacity
                    )}
                  </td>

                  <td>
                    {isEditing ? (
                      <input
                        value={editForm.notes}
                        onChange={(e) => setEditForm((f) => ({ ...f, notes: e.target.value }))}
                      />
                    ) : (
                      t.notes || "-"
                    )}
                  </td>

                  <td className="right">
                    {!isEditing ? (
                      <div className="row-actions">
                        <button className="btn" onClick={() => startEdit(t)}>Edit</button>
                        <button className="btn danger" onClick={() => remove(id)} disabled={deletingId === id}>
                          {deletingId === id ? "Deleting…" : "Delete"}
                        </button>
                      </div>
                    ) : (
                      <div className="row-actions">
                        <button className="btn primary" onClick={saveEdit} disabled={savingId === id}>
                          {savingId === id ? "Saving…" : "Save"}
                        </button>
                        <button className="btn" onClick={cancelEdit}>Cancel</button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
            {visibleTrains.length === 0 && (
              <tr>
                <td colSpan={4} className="empty">No matching trains</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
