import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FiHome, FiFolder, FiUsers, FiLogOut, FiShield, FiMenu, FiX, FiGlobe 
} from 'react-icons/fi';
import { useState } from 'react';

const Sidebar = ({ collapsed, setCollapsed }) => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <>
      <button className="sidebar-toggle" onClick={() => setCollapsed(!collapsed)}>
        {collapsed ? <FiMenu /> : <FiX />}
      </button>
      <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <FiShield className="logo-icon" />
            <div className="logo-text">
              <h1>LoanAdmin</h1>
              <span className="logo-subtitle">Management System</span>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/admin" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <FiHome className="nav-icon" />
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/admin/files" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <FiFolder className="nav-icon" />
            <span>Loan Files</span>
          </NavLink>
          {isAdmin && (
            <NavLink to="/admin/users" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <FiUsers className="nav-icon" />
              <span>Manage Users</span>
            </NavLink>
          )}
          <a href="/" target="_blank" rel="noopener noreferrer" className="nav-link">
            <FiGlobe className="nav-icon" />
            <span>Public Website</span>
          </a>
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="user-details">
              <p className="user-name">{user?.name}</p>
              <p className="user-role">{user?.role === 'admin' ? 'Administrator' : 'Sub Admin'}</p>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <FiLogOut />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
