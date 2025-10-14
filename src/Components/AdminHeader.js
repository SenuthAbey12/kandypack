import React from "react";
import PropTypes from "prop-types";

const AdminHeader = ({ title, subtitle, theme, onToggleTheme, onLogout }) => (
  <header className="dashboard-header">
    <div className="header-left">
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </div>
    <div className="header-right">
      <button type="button" onClick={onToggleTheme} className="theme-btn">
        {theme === "light" ? "Switch to Dark" : "Switch to Light"}
      </button>
      <button type="button" onClick={onLogout} className="logout-btn">
        Logout
      </button>
    </div>
  </header>
);

AdminHeader.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  theme: PropTypes.oneOf(["light", "dark"]).isRequired,
  onToggleTheme: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
};

export default AdminHeader;
