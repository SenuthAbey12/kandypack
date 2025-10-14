import React from "react";
import PropTypes from "prop-types";

const AdminSidebar = ({ items, activeKey, onSelect }) => (
  <aside className="sidebar">
    <nav className="nav-menu">
      {items.map(({ key, label }) => (
        <button
          key={key}
          type="button"
          className={activeKey === key ? "active" : ""}
          onClick={() => onSelect(key)}
        >
          {label}
        </button>
      ))}
    </nav>
  </aside>
);

AdminSidebar.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.node.isRequired,
    })
  ).isRequired,
  activeKey: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default AdminSidebar;
