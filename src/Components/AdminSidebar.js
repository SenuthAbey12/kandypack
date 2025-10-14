import React from "react";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";

const AdminSidebar = ({ items, basePath = "/admin" }) => (
  <aside className="sidebar">
    <nav className="nav-menu">
      {items.map(({ key, label, path }) => (
        <NavLink
          key={key}
          to={`${basePath.replace(/\/$/, "")}/${path}`}
          className={({ isActive }) => `nav-item${isActive ? " active" : ""}`}
          end
        >
          {label}
        </NavLink>
      ))}
    </nav>
  </aside>
);

AdminSidebar.propTypes = {
  basePath: PropTypes.string,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
      label: PropTypes.node.isRequired,
    })
  ).isRequired,
};

export default AdminSidebar;
