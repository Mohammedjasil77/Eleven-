// src/components/admin/layout/AdminHeader.js
import React, { useContext } from 'react';
import { AuthContext } from '../../../Context/AuthContext';

const AdminHeader = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="admin-header">
      <div className="header-content">
        <div className="header-left">
          <h1>Welcome back, {user?.name || 'Admin'}</h1>
          <p className="current-date">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
        <div className="header-right">
          <div className="header-actions">
            <button className="notification-btn">
              <span className="icon">🔔</span>
            </button>
            <button onClick={logout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;