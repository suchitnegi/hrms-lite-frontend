import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">📋 HRMS Lite</div>
      <ul className="sidebar-nav">
        <li>
          <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>
            📊 Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/employees" className={({ isActive }) => (isActive ? "active" : "")}>
            👥 Employees
          </NavLink>
        </li>
        <li>
          <NavLink to="/attendance" className={({ isActive }) => (isActive ? "active" : "")}>
            📅 Attendance
          </NavLink>
        </li>
      </ul>
    </aside>
  );
}

export default Sidebar;
