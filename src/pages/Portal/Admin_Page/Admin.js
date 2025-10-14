import React, { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useTheme } from "../../../context/ThemeContext";
import "./AdminDashboard.css";

import AdminHeader from "../../../Components/AdminHeader";
import AdminSidebar from "../../../Components/AdminSidebar";

import Overview from "./Overview/Overview";
import Products from "./Add-Products/Products";
import Employees from "./Add-Employees/Employees";
import Trucks from "./Add-Trucks/Trucks";
import Trains from "./Add-Trains/Trains";
import TrainAllocation from "./Train-Allocation/TrainAllocation";
import TruckAssignment from "./Truck-Schedule/TruckAssignment";
import Reports from "./Report&Analytics/Reports";

const NAV_ITEMS = [
  { key: "overview", label: "Overview" },
  { key: "products", label: "Add Products" },
  { key: "employees", label: "Add Employees" },
  { key: "trucks", label: "Add Trucks" },
  { key: "trains", label: "Add Trains" },
  { key: "train-allocation", label: "Train Allocation" },
  { key: "truck-assignment", label: "Truck Assignment" },
  { key: "reports", label: "Reports & Analytics" },
];

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [view, setView] = useState("overview");

  const subtitle = `Welcome, ${user?.name || "Administrator"}`;

  return (
    <div className={`admin-dashboard ${theme}`}>
      <AdminHeader
        title="Rail & Road Distribution Control Center"
        subtitle={subtitle}
        theme={theme}
        onToggleTheme={toggleTheme}
        onLogout={logout}
      />

      <main className="dashboard-content">
        <AdminSidebar items={NAV_ITEMS} activeKey={view} onSelect={setView} />

        <section className="main-content">
          {view === "overview" && (
            <Overview onGoAllocate={() => setView("train-allocation")} />
          )}
          {view === "products" && <Products />}
          {view === "employees" && <Employees />}
          {view === "trucks" && <Trucks />}
          {view === "trains" && <Trains />}
          {view === "train-allocation" && (
            <TrainAllocation onGoTruckAssignment={() => setView("truck-assignment")} />
          )}
          {view === "truck-assignment" && <TruckAssignment />}
          {view === "reports" && <Reports />}
        </section>
      </main>
    </div>
  );
}
