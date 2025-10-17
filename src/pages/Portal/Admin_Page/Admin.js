import React from "react";
import { useAuth } from "../../../context/AuthContext";
import { useTheme } from "../../../context/ThemeContext";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import "./AdminDashboard.css";
import "./admin-page-theme.css";

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
  { key: "overview", path: "overview", label: "Overview" },
  { key: "products", path: "products", label: "Add Products" },
  { key: "employees", path: "employees", label: "Add Employees" },
  { key: "trucks", path: "trucks", label: "Add Trucks" },
  { key: "trains", path: "trains", label: "Add Trains" },
  { key: "train-allocation", path: "train-allocation", label: "Train Allocation" },
  { key: "truck-assignment", path: "truck-assignment", label: "Truck Assignment" },
  { key: "reports", path: "reports", label: "Reports & Analytics" },
];

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const subtitle = `Welcome, ${user?.name || "Administrator"}`;

  const handleGoAllocate = (order) =>
    navigate("/admin/train-allocation", order ? { state: { focusOrder: order } } : undefined);
  const handleGoTruckAssignment = () => navigate("/admin/truck-assignment");

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
        <AdminSidebar items={NAV_ITEMS} basePath="/admin" />

        <section className="main-content">
          <Routes>
            <Route index element={<Navigate to="overview" replace />} />
            <Route
              path="overview"
              element={<Overview onGoAllocate={handleGoAllocate} />}
            />
            <Route path="products" element={<Products />} />
            <Route path="employees" element={<Employees />} />
            <Route path="trucks" element={<Trucks />} />
            <Route path="trains" element={<Trains />} />
            <Route
              path="train-allocation"
              element={
                <TrainAllocation
                  onGoTruckAssignment={handleGoTruckAssignment}
                />
              }
            />
            <Route path="truck-assignment" element={<TruckAssignment />} />
            <Route path="truck-assignments" element={<Navigate to="truck-assignment" replace />} />
            <Route path="reports" element={<Reports />} />
            <Route path="*" element={<Navigate to="overview" replace />} />
          </Routes>
        </section>
      </main>
    </div>
  );
}
