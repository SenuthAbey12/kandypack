import React, { useState } from "react";
import "./settings.css";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
const tokenHeader = { Authorization: `Bearer ${localStorage.getItem("authToken") || "demo"}` };

export default function Settings() {
  const [tab, setTab] = useState("profile");

  // Profile form
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [pLoading, setPLoading] = useState(false);
  const [pMsg, setPMsg] = useState("");

  // Password form
  const [pwd, setPwd] = useState({ current: "", next: "", confirm: "" });
  const [wLoading, setWLoading] = useState(false);
  const [wMsg, setWMsg] = useState("");

  const onProfileSubmit = async (e) => {
    e.preventDefault();
    setPLoading(true);
    setPMsg("");
    try {
      const res = await fetch(`${API_BASE}/portal/assistant/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...tokenHeader },
        body: JSON.stringify(profile),
      });
      if (!res.ok) throw new Error("Update failed");
      setPMsg("Profile updated successfully.");
    } catch (err) {
      setPMsg("Failed to update profile.");
    } finally {
      setPLoading(false);
    }
  };

  const onPasswordSubmit = async (e) => {
    e.preventDefault();
    setWMsg("");
    if (!pwd.current || !pwd.next || !pwd.confirm) {
      setWMsg("Please fill all fields.");
      return;
    }
    if (pwd.next.length < 8) {
      setWMsg("New password must be at least 8 characters.");
      return;
    }
    if (pwd.next !== pwd.confirm) {
      setWMsg("Passwords do not match.");
      return;
    }
    setWLoading(true);
    try {
      const res = await fetch(`${API_BASE}/portal/assistant/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...tokenHeader },
        body: JSON.stringify({ currentPassword: pwd.current, newPassword: pwd.next }),
      });
      if (!res.ok) throw new Error("Change failed");
      setWMsg("Password changed successfully.");
      setPwd({ current: "", next: "", confirm: "" });
    } catch (err) {
      setWMsg("Failed to change password. Check your current password.");
    } finally {
      setWLoading(false);
    }
  };

  return (
    <div className="assistant-settings">
      <h2>Settings</h2>

      <div className="segmented">
        <button className={`seg-btn ${tab === "profile" ? "active" : ""}`} onClick={() => setTab("profile")}>
          Profile
        </button>
        <button className={`seg-btn ${tab === "password" ? "active" : ""}`} onClick={() => setTab("password")}>
          Password
        </button>
      </div>

      {tab === "profile" && (
        <form className="panel" onSubmit={onProfileSubmit}>
          <h3>Profile Details</h3>
          <div className="grid">
            <label>
              <span>Name  </span>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                placeholder="Jane Assistant"
                required
              />
            </label>
            <label>
              <span>Email  </span>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                placeholder="assistant@example.com"
                required
              />
            </label>
            <label>
              <span>Phone  </span>
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                placeholder="+94 7X XXX XXXX"
              />
            </label>
          </div>
          <div className="actions">
            <button type="submit" className="btn primary" disabled={pLoading}>
              {pLoading ? "Saving..." : "Save Changes"}
            </button>
            {pMsg && <span className="muted">{pMsg}</span>}
          </div>
        </form>
      )}

      {tab === "password" && (
        <form className="panel" onSubmit={onPasswordSubmit}>
          <h3>Change Password</h3>
          <div className="grid">
            <label>
              <span>Current Password  </span>
              <input
                type="password"
                value={pwd.current}
                onChange={(e) => setPwd({ ...pwd, current: e.target.value })}
                placeholder="XXXXXXXXXXXX"
                required
              />
            </label>
            <label>
              <span>New Password  </span>
              <input
                type="password"
                value={pwd.next}
                onChange={(e) => setPwd({ ...pwd, next: e.target.value })}
                placeholder="XXXXXXXXXXXX"
                required
                minLength={8}
              />
            </label>
            <label>
              <span>Confirm Password  </span>
              <input
                type="password"
                value={pwd.confirm}
                onChange={(e) => setPwd({ ...pwd, confirm: e.target.value })}
                placeholder="XXXXXXXXXXXX"
                required
                minLength={8}
              />
            </label>
          </div>
          <div className="actions">
            <button type="submit" className="btn primary" disabled={wLoading}>
              {wLoading ? "Updating..." : "Update Password"}
            </button>
            {wMsg && <span className="muted">{wMsg}</span>}
          </div>
        </form>
      )}
    </div>
  );
}