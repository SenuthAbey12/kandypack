// src/pages/Portal/Admin_Page/Products.js
import React, { useEffect, useMemo, useState } from "react";
import "./products.css";

const tokenHeader = { Authorization: `Bearer ${localStorage.getItem("authToken") || "demo"}` };
const fmtMoney = (n) =>
  new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0,
  }).format(Number(n || 0));

export default function Products() {
  const [products, setProducts] = useState([]);
  const [adding, setAdding] = useState(false);

  // NEW: search + sort state
  const [query, setQuery] = useState(""); // search box
  const [sort, setSort] = useState({ key: "product_id", dir: "asc" }); // asc | desc

  // Add form (top panel)
  const [form, setForm] = useState({
    product_id: "",
    name: "",
    description: "",
    price: "",
    space_consumption: "",
    category: "",
    available_quantity: "",
  });

  // Inline edit state
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    product_id: "",
    name: "",
    description: "",
    price: "",
    space_consumption: "",
    category: "",
    available_quantity: "",
  });
  const [savingId, setSavingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Load products
  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("http://localhost:5000/api/admin/products", { headers: tokenHeader });
        if (r.ok) return setProducts(await r.json());
      } catch {}
      // Fallback demo
      setProducts([
        { product_id: "P001", name: "Detergent Box", description: "1kg box", price: 600, space_consumption: 0.5, category: "FMCG", available_quantity: 200 },
        { product_id: "P002", name: "Shampoo Pack", description: "500ml", price: 450, space_consumption: 0.2, category: "FMCG", available_quantity: 300 },
        { product_id: "P003", name: "Soap Carton", description: "20 bars", price: 1200, space_consumption: 1.0, category: "FMCG", available_quantity: 150 },
      ]);
    })();
  }, []);

  /** Add product (top panel) */
  const add = async (e) => {
    e.preventDefault();
    setAdding(true);
    const payload = {
      ...form,
      price: Number(form.price || 0),
      space_consumption: Number(form.space_consumption || 0),
      available_quantity: Number(form.available_quantity || 0),
    };
    try {
      const r = await fetch("http://localhost:5000/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...tokenHeader },
        body: JSON.stringify(payload),
      });
      if (!r.ok) throw new Error();
      const added = await r.json();
      setProducts((p) => [added, ...p]);
    } catch {
      setProducts((p) => [payload, ...p]); // demo fallback
    } finally {
      setAdding(false);
    }
    setForm({
      product_id: "",
      name: "",
      description: "",
      price: "",
      space_consumption: "",
      category: "",
      available_quantity: "",
    });
  };

  /** Start editing a row */
  const startEdit = (p) => {
    setEditingId(p.product_id);
    setEditForm({
      product_id: p.product_id,
      name: p.name ?? "",
      description: p.description ?? "",
      price: String(p.price ?? ""),
      space_consumption: String(p.space_consumption ?? ""),
      category: p.category ?? "",
      available_quantity: String(p.available_quantity ?? ""),
    });
  };

  /** Cancel editing */
  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({
      product_id: "",
      name: "",
      description: "",
      price: "",
      space_consumption: "",
      category: "",
      available_quantity: "",
    });
  };

  /** Save edited row */
  const saveEdit = async () => {
    const id = editingId;
    if (!id) return;
    setSavingId(id);
    const payload = {
      name: editForm.name,
      description: editForm.description,
      price: Number(editForm.price || 0),
      space_consumption: Number(editForm.space_consumption || 0),
      category: editForm.category,
      available_quantity: Number(editForm.available_quantity || 0),
    };
    try {
      const r = await fetch(`http://localhost:5000/api/admin/products/${encodeURIComponent(id)}`, {
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
    setProducts((p) =>
      p.map((x) => (x.product_id === id ? { ...x, ...payload, product_id: id } : x))
    );
    cancelEdit();
  };

  /** Delete product with confirm */
  const remove = async (id) => {
    const ok = window.confirm("Are you sure you want to delete this product?");
    if (!ok) return;
    setDeletingId(id);
    try {
      const r = await fetch(`http://localhost:5000/api/admin/products/${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: tokenHeader,
      });
      if (!r.ok) throw new Error();
    } catch {
      // demo fallback
    } finally {
      setDeletingId(null);
    }
    setProducts((p) => p.filter((x) => x.product_id !== id));
  };

  // NEW: derived list = filtered + sorted (stable)
  const visibleProducts = useMemo(() => {
    const q = query.trim().toLowerCase();
    let rows = !q
      ? products.slice()
      : products.filter((p) => {
          const hay =
            `${p.product_id} ${p.name} ${p.description} ${p.category} ${p.price} ${p.space_consumption} ${p.available_quantity}`
              .toLowerCase();
          return hay.includes(q);
        });

    const { key, dir } = sort;
    const mult = dir === "asc" ? 1 : -1;

    const getVal = (r) => {
      switch (key) {
        case "price":
        case "space_consumption":
        case "available_quantity":
          return Number(r[key] ?? 0);
        default:
          return (r[key] ?? "").toString().toLowerCase();
      }
    };

    // stable sort (decorate-sort-undecorate)
    return rows
      .map((r, i) => [r, i])
      .sort(([a, ai], [b, bi]) => {
        const va = getVal(a);
        const vb = getVal(b);
        let cmp =
          typeof va === "number" && typeof vb === "number"
            ? va - vb
            : String(va).localeCompare(String(vb), undefined, { numeric: true, sensitivity: "base" });
        if (cmp === 0) cmp = ai - bi;
        return cmp * mult;
      })
      .map(([r]) => r);
  }, [products, query, sort]);

  // NEW: sort handler (toggle)
  const onSort = (key) =>
    setSort((s) => (s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" }));

  return (
    <div className="products">
      <h2>Product Management</h2>

      {/* Top: Add + (optional) right column */}
      <div className="panels">
        <div className="panel">
          <h3>Add Product</h3>
          <form className="grid" onSubmit={add}>
            <label>
              <span>Product ID</span>
              <input
                required
                value={form.product_id}
                onChange={(e) => setForm((f) => ({ ...f, product_id: e.target.value }))}
              />
            </label>
            <label>
              <span>Name</span>
              <input
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </label>
            <label className="full">
              <span>Description</span>
              <textarea
                rows={2}
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
            </label>
            <label>
              <span>Price (LKR)</span>
              <input
                required
                type="number"
                min="0"
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
              />
            </label>
            <label>
              <span>Space / item</span>
              <input
                required
                type="number"
                step="0.0001"
                min="0"
                value={form.space_consumption}
                onChange={(e) => setForm((f) => ({ ...f, space_consumption: e.target.value }))}
              />
            </label>
            <label>
              <span>Category</span>
              <input
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              />
            </label>
            <label>
              <span>Available Qty</span>
              <input
                required
                type="number"
                min="0"
                value={form.available_quantity}
                onChange={(e) => setForm((f) => ({ ...f, available_quantity: e.target.value }))}
              />
            </label>
            <div className="actions full">
              <button className="btn primary" disabled={adding}>
                {adding ? "Adding…" : "Add Product"}
              </button>
            </div>
          </form>
        </div>

        {/* NEW: Search + quick stats */}
        <div>
          <h3>Find Products</h3>
          <div className="toolbar">
            <input
              className="toolbar-input"
              placeholder="Search by ID, name, description, category…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search products"
            />
            <div className="muted">
              Showing <b>{visibleProducts.length}</b> of <b>{products.length}</b>
            </div>
          </div>
        </div>
      </div>
      <br></br>
      {/* Table */}
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th className={`sortable ${sort.key === "product_id" ? `sorted-${sort.dir}` : ""}`} onClick={() => onSort("product_id")}>Product</th>
              <th className={`sortable ${sort.key === "name" ? `sorted-${sort.dir}` : ""}`} onClick={() => onSort("name")}>Name</th>
              <th className={`sortable ${sort.key === "description" ? `sorted-${sort.dir}` : ""}`} onClick={() => onSort("description")}>Description</th>
              <th className={`sortable ${sort.key === "price" ? `sorted-${sort.dir}` : ""}`} onClick={() => onSort("price")}>Price</th>
              <th className={`sortable ${sort.key === "space_consumption" ? `sorted-${sort.dir}` : ""}`} onClick={() => onSort("space_consumption")}>Space</th>
              <th className={`sortable ${sort.key === "category" ? `sorted-${sort.dir}` : ""}`} onClick={() => onSort("category")}>Category</th>
              <th className={`sortable ${sort.key === "available_quantity" ? `sorted-${sort.dir}` : ""}`} onClick={() => onSort("available_quantity")}>Available</th>
              <th className="right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {visibleProducts.map((p) => {
              const isEditing = editingId === p.product_id;
              return (
                <tr key={p.product_id}>
                  <td className="mono">{p.product_id}</td>

                  <td>
                    {isEditing ? (
                      <input
                        value={editForm.name}
                        onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                      />
                    ) : (
                      p.name
                    )}
                  </td>

                  <td>
                    {isEditing ? (
                      <input
                        value={editForm.description}
                        onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
                      />
                    ) : (
                      p.description || "-"
                    )}
                  </td>

                  <td>
                    {isEditing ? (
                      <input
                        type="number"
                        min="0"
                        value={editForm.price}
                        onChange={(e) => setEditForm((f) => ({ ...f, price: e.target.value }))}
                      />
                    ) : (
                      fmtMoney(p.price)
                    )}
                  </td>

                  <td>
                    {isEditing ? (
                      <input
                        type="number"
                        step="0.0001"
                        min="0"
                        value={editForm.space_consumption}
                        onChange={(e) =>
                          setEditForm((f) => ({ ...f, space_consumption: e.target.value }))
                        }
                      />
                    ) : (
                      p.space_consumption
                    )}
                  </td>

                  <td>
                    {isEditing ? (
                      <input
                        value={editForm.category}
                        onChange={(e) => setEditForm((f) => ({ ...f, category: e.target.value }))}
                      />
                    ) : (
                      p.category
                    )}
                  </td>

                  <td>
                    {isEditing ? (
                      <input
                        type="number"
                        min="0"
                        value={editForm.available_quantity}
                        onChange={(e) =>
                          setEditForm((f) => ({ ...f, available_quantity: e.target.value }))
                        }
                      />
                    ) : (
                      p.available_quantity
                    )}
                  </td>

                  <td className="right">
                    {!isEditing ? (
                      <div className="row-actions">
                        <button className="btn" onClick={() => startEdit(p)}>Edit</button>
                        <button
                          className="btn danger"
                          onClick={() => remove(p.product_id)}
                          disabled={deletingId === p.product_id}
                        >
                          {deletingId === p.product_id ? "Deleting…" : "Delete"}
                        </button>
                      </div>
                    ) : (
                      <div className="row-actions">
                        <button
                          className="btn primary"
                          onClick={saveEdit}
                          disabled={savingId === p.product_id}
                        >
                          {savingId === p.product_id ? "Saving…" : "Save"}
                        </button>
                        <button className="btn" onClick={cancelEdit}>Cancel</button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
            {visibleProducts.length === 0 && (
              <tr>
                <td colSpan={8} className="empty">No matching products</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
