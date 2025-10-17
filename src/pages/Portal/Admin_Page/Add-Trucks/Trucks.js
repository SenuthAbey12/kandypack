import React, { useEffect, useMemo, useState } from "react";
import "./trucks.css"; // Reuse the same CSS rules as products.css

const tokenHeader = { Authorization: `Bearer ${localStorage.getItem("authToken") || "demo"}` };

export default function Trucks() {
  const [trucks, setTrucks] = useState([]);
  const [adding, setAdding] = useState(false);

  // Add form
  const [form, setForm] = useState({ truck_id: "", license_plate: "", capacity: "" });

  // Inline edit state
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ license_plate: "", capacity: "" });
  const [savingId, setSavingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // NEW: search only (no sorting)
  const [query, setQuery] = useState("");

  // Load trucks
  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("http://localhost:5000/api/admin/trucks", { headers: tokenHeader });
        if (r.ok) return setTrucks(await r.json());
      } catch {}
      // demo fallback
      setTrucks([
        { truck_id: "TK01", license_plate: "WP-1234", capacity: 60 },
        { truck_id: "TK02", license_plate: "SP-5678", capacity: 45 },
      ]);
    })();
  }, []);

  /** Add truck */
  const add = async (e) => {
    e.preventDefault();
    setAdding(true);
    const payload = { ...form, capacity: Number(form.capacity || 0) };
    try {
      const r = await fetch("http://localhost:5000/api/admin/trucks", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...tokenHeader },
        body: JSON.stringify(payload),
      });
      if (!r.ok) throw new Error();
      const added = await r.json().catch(() => payload);
      setTrucks((t) => [added, ...t]);
    } catch {
      setTrucks((t) => [payload, ...t]); // demo fallback
    } finally {
      setAdding(false);
    }
    setForm({ truck_id: "", license_plate: "", capacity: "" });
  };

  /** Start editing a row */
  const startEdit = (t) => {
    const id = t.truck_id || t.id;
    setEditingId(id);
    setEditForm({ license_plate: t.license_plate ?? "", capacity: String(t.capacity ?? "") });
  };

  /** Cancel editing */
  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ license_plate: "", capacity: "" });
  };

  /** Save edited row */
  const saveEdit = async () => {
    const id = editingId;
    if (!id) return;
    setSavingId(id);
    const payload = { license_plate: editForm.license_plate, capacity: Number(editForm.capacity || 0) };
    try {
      const r = await fetch(`http://localhost:5000/api/admin/trucks/${encodeURIComponent(id)}`, {
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
    setTrucks((list) =>
      list.map((x) => ((x.truck_id || x.id) === id ? { ...x, ...payload, truck_id: x.truck_id || id } : x))
    );
    cancelEdit();
  };

  /** Delete truck with confirm */
  const remove = async (id) => {
    if (!window.confirm("Delete this truck?")) return;
    setDeletingId(id);
    try {
      const r = await fetch(`http://localhost:5000/api/admin/trucks/${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: tokenHeader,
      });
      if (!r.ok) throw new Error();
    } catch {
      // demo fallback
    } finally {
      setDeletingId(null);
    }
    setTrucks((t) => t.filter((x) => (x.truck_id || x.id) !== id));
  };

  // Derived list: filter only (no sort)
  const visibleTrucks = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return trucks;
    return trucks.filter((t) => {
      const hay = `${t.truck_id || t.id} ${t.license_plate} ${t.capacity}`.toLowerCase();
      return hay.includes(q);
    });
  }, [trucks, query]);

  return (
    // Shared admin-page wrapper keeps visuals aligned across modules
    <div className="admin-page trucks">
      <h2>Truck Management</h2>

      {/* Top: Add panel (left) + Find panel (right) */}
      <div className="panels">
        <div className="panel">
          <h3>Add Truck</h3>
          <form className="grid" onSubmit={add}>
            <label>
              <span>Truck ID</span>
              <input
                required
                value={form.truck_id}
                onChange={(e) => setForm((f) => ({ ...f, truck_id: e.target.value }))}
              />
            </label>
            <label>
              <span>License Plate</span>
              <input
                required
                value={form.license_plate}
                onChange={(e) => setForm((f) => ({ ...f, license_plate: e.target.value }))}
              />
            </label>
            <label>
              <span>Capacity (u)</span>
              <input
                required
                type="number"
                step="0.0001"
                min="0"
                value={form.capacity}
                onChange={(e) => setForm((f) => ({ ...f, capacity: e.target.value }))}
              />
            </label>
            <div className="actions full">
              <button className="btn primary" disabled={adding}>
                {adding ? "Adding…" : "Add Truck"}
              </button>
            </div>
          </form>
        </div>

        {/* Search + quick stats */}
        <div>
          <h3>Find Trucks</h3>
          <div className="toolbar">
            <input
              className="toolbar-input"
              placeholder="Search by ID, license plate, capacity…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search trucks"
            />
            <div className="muted">
              Showing <b>{visibleTrucks.length}</b> of <b>{trucks.length}</b>
            </div>
          </div>
        </div>
      </div>

      <br />

      {/* Table (plain headers; no sorting UI) */}
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Truck ID</th>
              <th>License Plate</th>
              <th>Capacity</th>
              <th className="right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {visibleTrucks.map((t) => {
              const id = t.truck_id || t.id;
              const isEditing = editingId === id;
              return (
                <tr key={id}>
                  <td className="mono">{id}</td>

                  <td>
                    {isEditing ? (
                      <input
                        value={editForm.license_plate}
                        onChange={(e) => setEditForm((f) => ({ ...f, license_plate: e.target.value }))}
                      />
                    ) : (
                      t.license_plate
                    )}
                  </td>

                  <td>
                    {isEditing ? (
                      <input
                        type="number"
                        step="0.0001"
                        min="0"
                        value={editForm.capacity}
                        onChange={(e) => setEditForm((f) => ({ ...f, capacity: e.target.value }))}
                      />
                    ) : (
                      t.capacity
                    )}
                  </td>

                  <td className="right">
                    {!isEditing ? (
                      <div className="row-actions">
                        <button className="btn" onClick={() => startEdit(t)}>Edit</button>
                        <button
                          className="btn danger"
                          onClick={() => remove(id)}
                          disabled={deletingId === id}
                        >
                          {deletingId === id ? "Deleting…" : "Delete"}
                        </button>
                      </div>
                    ) : (
                      <div className="row-actions">
                        <button
                          className="btn primary"
                          onClick={saveEdit}
                          disabled={savingId === id}
                        >
                          {savingId === id ? "Saving…" : "Save"}
                        </button>
                        <button className="btn" onClick={cancelEdit}>Cancel</button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
            {visibleTrucks.length === 0 && (
              <tr>
                <td colSpan={4} className="empty">No matching trucks</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
