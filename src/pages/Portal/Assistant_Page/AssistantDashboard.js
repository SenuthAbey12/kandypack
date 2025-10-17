import React from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { useTheme } from "../../../context/ThemeContext";

import AdminHeader from "../../../Components/AdminHeader";
import AdminSidebar from "../../../Components/AdminSidebar";

import Overview from "./Overview/Overview";
import Requests from "./Requests/Requests";
import Inventory from "./Inventory/Inventory";
import Tools from "./Tools/Tools";
import Settings from "./Settings/Settings";

const NAV_ITEMS = [
  { key: "overview", path: "overview", label: "Overview" },
  { key: "requests", path: "requests", label: "Admin Requests" }, // changed
  { key: "inventory", path: "inventory", label: "Inventory" },
  { key: "tools", path: "tools", label: "Assistant Tools" },
  { key: "settings", path: "settings", label: "Settings" },
];

export default function AssistantDashboard() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const subtitle = `Welcome, ${user?.name || "Assistant"}`;
  const goRequests = () => navigate("/assistant/requests");

  return (
    <div className={`admin-dashboard ${theme}`}>
      <AdminHeader
        title="Assistant Operations Center"
        subtitle={subtitle}
        theme={theme}
        onToggleTheme={toggleTheme}
        onLogout={logout}
      />
      <main className="dashboard-content">
        <AdminSidebar items={NAV_ITEMS} basePath="/assistant" />
        <section className="main-content">
          <Routes>
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<Overview onGoRequests={goRequests} />} />
            <Route path="requests" element={<Requests />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="tools" element={<Tools />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="overview" replace />} />
          </Routes>
        </section>
      </main>
    </div>
  );
}