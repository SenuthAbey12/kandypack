// src/pages/Portal/Admin_Page/Employees.js
import React, { useEffect, useState } from "react";
import "./employees.css";

const tokenHeader = { Authorization: `Bearer ${localStorage.getItem("authToken") || "demo"}` };

// helpers
const extractFirstName = (fullName = "") => fullName.trim().split(/\s+/)[0] || "";
const generatePassword = (len = 12) => {
  const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const lower = "abcdefghjkmnpqrstuvwxyz";
  const digits = "23456789";
  const symbols = "!@#$%&*?";
  const all = upper + lower + digits + symbols;
  const pick = (s) => s[Math.floor(Math.random() * s.length)];
  let pwd = [pick(upper), pick(lower), pick(digits), pick(symbols)];
  for (let i = pwd.length; i < len; i++) pwd.push(pick(all));
  for (let i = pwd.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [pwd[i], pwd[j]] = [pwd[j], pwd[i]]; }
  return pwd.join("");
};
const deliveryHint = ({ email, phone_no }) =>
  email?.trim()
    ? { channel: "email", address: email.trim(), label: `Email: ${email.trim()}` }
    : phone_no?.trim()
    ? { channel: "sms", address: phone_no.trim(), label: `SMS: ${phone_no.trim()}` }
    : { channel: null, address: null, label: "No email/phone provided" };

export default function Employees() {
  // NEW: segment state (default to "driver")
  const [tab, setTab] = useState("driver");

  const [drivers, setDrivers] = useState([]);
  const [assistants, setAssistants] = useState([]);

  // Forms: only requested fields
  const [driverForm, setDriverForm] = useState({
    driver_id: "", name: "", address: "", phone_no: "", email: "",
  });
  const [assistantForm, setAssistantForm] = useState({
    assistant_id: "", name: "", address: "", phone_no: "", email: "",
  });

  useEffect(() => {
    (async () => {
      try { const r = await fetch("http://localhost:5000/api/admin/drivers", { headers: tokenHeader }); if (r.ok) setDrivers(await r.json()); } catch {}
      try { const r = await fetch("http://localhost:5000/api/admin/assistants", { headers: tokenHeader }); if (r.ok) setAssistants(await r.json()); } catch {}
      setDrivers((curr) => curr.length ? curr : [{ driver_id: "DRV001", name: "John Driver", address: "—", phone_no: "+94…", email: "" }]);
      setAssistants((curr) => curr.length ? curr : [{ assistant_id: "AST001", name: "Sarah Support", address: "—", phone_no: "+94…", email: "" }]);
    })();
    // eslint-disable-next-line
  }, []);

  // Submit: follow your procedure
  const addDriver = async (e) => {
    e.preventDefault();
    const user_name = extractFirstName(driverForm.name) || `driver${Date.now()}`;
    const password = generatePassword(12);
    const delivery = deliveryHint(driverForm);
    if (!delivery.channel) { alert("Please provide either Email or Phone to send credentials."); return; }

    const payload = { ...driverForm, user_name, password, deliver_credentials: delivery, must_change_password: true };
    try {
      const r = await fetch("http://localhost:5000/api/admin/drivers", {
        method: "POST", headers: { "Content-Type": "application/json", ...tokenHeader }, body: JSON.stringify(payload),
      });
      if (!r.ok) throw new Error();
      const created = await r.json().catch(() => null);
      setDrivers((d) => [created || driverForm, ...d]);
    } catch {
      setDrivers((d) => [driverForm, ...d]);
    }
    setDriverForm({ driver_id: "", name: "", address: "", phone_no: "", email: "" });
    alert(`Driver added. Credentials will be sent via ${delivery.label}.`);
  };

  const addAssistant = async (e) => {
    e.preventDefault();
    const user_name = extractFirstName(assistantForm.name) || `assistant${Date.now()}`;
    const password = generatePassword(12);
    const delivery = deliveryHint(assistantForm);
    if (!delivery.channel) { alert("Please provide either Email or Phone to send credentials."); return; }

    const payload = { ...assistantForm, user_name, password, deliver_credentials: delivery, must_change_password: true };
    try {
      const r = await fetch("http://localhost:5000/api/admin/assistants", {
        method: "POST", headers: { "Content-Type": "application/json", ...tokenHeader }, body: JSON.stringify(payload),
      });
      if (!r.ok) throw new Error();
      const created = await r.json().catch(() => null);
      setAssistants((a) => [created || assistantForm, ...a]);
    } catch {
      setAssistants((a) => [assistantForm, ...a]);
    }
    setAssistantForm({ assistant_id: "", name: "", address: "", phone_no: "", email: "" });
    alert(`Assistant added. Credentials will be sent via ${delivery.label}.`);
  };

  return (
    <div className="employees">
      <h2>Employees</h2>

      {/* Segmented toggle */}
      <div className="segmented" role="tablist" aria-label="Employee type">
        <button
          type="button"
          role="tab"
          aria-selected={tab === "driver"}
          className={`seg-btn ${tab === "driver" ? "active" : ""}`}
          onClick={() => setTab("driver")}
        >
          🚚 <span>Driver</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "assistant"}
          className={`seg-btn ${tab === "assistant" ? "active" : ""}`}
          onClick={() => setTab("assistant")}
        >
          🤝 <span>Assistant</span>
        </button>
      </div>

      {/* DRIVER PANEL */}
      {tab === "driver" && (
        <div className="panel">
          <h3>Add Driver</h3>
          <form className="grid" onSubmit={addDriver}>
            <label><span>Driver ID</span>
              <input required value={driverForm.driver_id} onChange={(e)=>setDriverForm(f=>({...f,driver_id:e.target.value}))} />
            </label>
            <label><span>Name</span>
              <input required value={driverForm.name} onChange={(e)=>setDriverForm(f=>({...f,name:e.target.value}))} />
            </label>
            <label className="full"><span>Address</span>
              <textarea rows={2} value={driverForm.address} onChange={(e)=>setDriverForm(f=>({...f,address:e.target.value}))} />
            </label>
            <label><span>Phone</span>
              <input value={driverForm.phone_no} onChange={(e)=>setDriverForm(f=>({...f,phone_no:e.target.value}))} />
            </label>
            <label><span>Email</span>
              <input type="email" value={driverForm.email} onChange={(e)=>setDriverForm(f=>({...f,email:e.target.value}))} />
            </label>
            <div className="actions full"><button className="btn primary">Add Driver</button></div>
          </form>

          <div className="table-wrap">
            <table>
              <thead><tr><th>ID</th><th>Name</th><th>Address</th><th>Phone</th><th>Email</th></tr></thead>
              <tbody>
                {drivers.slice(0,6).map((d,i)=> (
                  <tr key={i}>
                    <td className="mono">{d.driver_id || d.id}</td>
                    <td>{d.name}</td>
                    <td>{d.address || "-"}</td>
                    <td>{d.phone_no || d.phone || "-"}</td>
                    <td>{d.email || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ASSISTANT PANEL */}
      {tab === "assistant" && (
        <div className="panel">
          <h3>Add Assistant</h3>
          <form className="grid" onSubmit={addAssistant}>
            <label><span>Assistant ID</span>
              <input required value={assistantForm.assistant_id} onChange={(e)=>setAssistantForm(f=>({...f,assistant_id:e.target.value}))} />
            </label>
            <label><span>Name</span>
              <input required value={assistantForm.name} onChange={(e)=>setAssistantForm(f=>({...f,name:e.target.value}))} />
            </label>
            <label className="full"><span>Address</span>
              <textarea rows={2} value={assistantForm.address} onChange={(e)=>setAssistantForm(f=>({...f,address:e.target.value}))} />
            </label>
            <label><span>Phone</span>
              <input value={assistantForm.phone_no} onChange={(e)=>setAssistantForm(f=>({...f,phone_no:e.target.value}))} />
            </label>
            <label><span>Email</span>
              <input type="email" value={assistantForm.email} onChange={(e)=>setAssistantForm(f=>({...f,email:e.target.value}))} />
            </label>
            <div className="actions full"><button className="btn primary">Add Assistant</button></div>
          </form>

          <div className="table-wrap">
            <table>
              <thead><tr><th>ID</th><th>Name</th><th>Address</th><th>Phone</th><th>Email</th></tr></thead>
              <tbody>
                {assistants.slice(0,6).map((a,i)=> (
                  <tr key={i}>
                    <td className="mono">{a.assistant_id || a.id}</td>
                    <td>{a.name}</td>
                    <td>{a.address || "-"}</td>
                    <td>{a.phone_no || a.phone || "-"}</td>
                    <td>{a.email || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
