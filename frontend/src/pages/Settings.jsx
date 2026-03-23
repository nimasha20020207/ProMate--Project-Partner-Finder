import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="section-card" style={{ maxWidth: '600px', margin: '3rem auto' }}>
      <div className="section-card-title">
        <span className="section-icon">⚙️</span>
        Account Settings
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <div className="notif-row">
          <div className="notif-info">
            <h5>Email Notifications</h5>
            <p>Receive updates about project matches directly to your inbox.</p>
          </div>
          <div className="toggle-switch">
            <input type="checkbox" defaultChecked />
            <div className="toggle-track"></div>
          </div>
        </div>
        <div className="notif-row">
          <div className="notif-info">
            <h5>Profile Visibility</h5>
            <p>Allow other students to view your profile and skills.</p>
          </div>
          <div className="toggle-switch">
            <input type="checkbox" defaultChecked />
            <div className="toggle-track"></div>
          </div>
        </div>
      </div>

      <button className="btn btn-outline btn-full" onClick={handleLogout} style={{ marginBottom: '2rem' }}>
        Log Out
      </button>

      <div className="danger-zone">
        <h3>Delete Account</h3>
        <p>Once you delete your account, there is no going back. Please be certain.</p>
        <div className="danger-actions">
          <button className="btn btn-danger">Delete Account</button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
