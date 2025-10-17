import React from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { useTheme } from "../../../context/ThemeContext";
import "../Admin_Page/AdminDashboard.css";
import "./DriverDashboard.css";

import AdminHeader from "../../../Components/AdminHeader";
import AdminSidebar from "../../../Components/AdminSidebar";

import Overview from "./Overview/Overview";
import Assignments from "./Assignments/Assignments";
import Trips from "./Trips/Trips";
import Reports from "./Reports/Reports";
import Settings from "./Settings/Settings";
import Requests from "./Requests/Requests"; // NEW

const NAV_ITEMS = [
  { key: "overview", path: "overview", label: "Overview" },
  { key: "requests", path: "requests", label: "Admin Requests" }, // NEW
  { key: "assignments", path: "assignments", label: "My Assignments" },
  { key: "trips", path: "trips", label: "Trips" },
  { key: "reports", path: "reports", label: "Reports" },
  { key: "settings", path: "settings", label: "Settings" },
];

export default function DriverDashboard() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const subtitle = `Welcome, ${user?.name || "Driver"}`;
  const goAssignments = () => navigate("/driver/assignments");
  const goTrips = () => navigate("/driver/trips");

  return (
    <div className={`admin-dashboard ${theme}`}>
      <AdminHeader
        title="Driver Operations Center"
        subtitle={subtitle}
        theme={theme}
        onToggleTheme={toggleTheme}
        onLogout={logout}
      />
      <main className="dashboard-content">
        <AdminSidebar items={NAV_ITEMS} basePath="/driver" />
        <section className="main-content">
          <Routes>
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<Overview onGoAssignments={goAssignments} onGoTrips={goTrips} />} />
            <Route path="assignments" element={<Assignments />} />
            <Route path="trips" element={<Trips />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
            <Route path="requests" element={<Requests />} /> {/* NEW */}
            <Route path="*" element={<Navigate to="overview" replace />} />
          </Routes>
        </section>
      </main>
    </div>
  );
}