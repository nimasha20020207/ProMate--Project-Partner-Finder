import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const { logout, user, token } = useAuth();
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');
    
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    
    try {
      const res = await fetch('http://localhost:3000/api/profile/me/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      
      const data = await res.json();
      if (res.ok) {
        setPasswordSuccess('Password successfully updated!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPasswordError(data.message || 'Error updating password');
      }
    } catch (err) {
      setPasswordError('Server error occurred');
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      setDeleteError("Please enter your password to confirm");
      return;
    }
    try {
      const res = await fetch('http://localhost:3000/api/profile/delete-account', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-auth-token': token 
        },
        body: JSON.stringify({ password: deletePassword })
      });
      
      const data = await res.json();
      if (res.ok) {
        logout();
        navigate('/login');
      } else {
        setDeleteError(data.message || "Deletion failed. Check your password.");
      }
    } catch (err) {
      setDeleteError("Server error. Please try again later.");
    }
  };

  return (
    <div className="section-card" style={{ maxWidth: '600px', margin: '3rem auto' }}>
      <div className="section-card-title">
        <span className="section-icon">⚙️</span>
        Account Settings
      </div>

      <div style={{ marginBottom: '2.5rem' }}>
        <h4 className="sb-section-title" style={{ padding: '0 0 0.5rem', borderBottom: '1px solid var(--border)', marginBottom: '1rem' }}>Preferences</h4>
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
      
      <div style={{ marginBottom: '2.5rem' }}>
        <h4 className="sb-section-title" style={{ padding: '0 0 0.5rem', borderBottom: '1px solid var(--border)', marginBottom: '1rem' }}>Account Security</h4>
        <div className="notif-row" style={{ alignItems: 'center' }}>
          <div className="notif-info">
            <h5>Change Password</h5>
            <p>Maintain your account's security by updating your password occasionally.</p>
          </div>
          <button className="btn btn-outline btn-sm" onClick={() => navigate('/change-password')}>Update</button>
        </div>
      </div>

      <div className="danger-zone" style={{ border: '1px solid rgba(239, 68, 68, 0.2)', padding: '1.5rem', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.05)' }}>
        <h3 style={{ color: 'var(--danger)', marginBottom: '0.5rem', fontSize: '1.1rem', fontWeight: 700 }}>Delete Account</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--mid)', marginBottom: '1rem' }}>Once you delete your account, there is no going back. Please be certain.</p>
        <div className="danger-actions">
          {!showDeleteConfirm ? (
            <button className="btn btn-danger" onClick={() => setShowDeleteConfirm(true)}>Delete My Account</button>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ color: 'var(--danger)' }}>Confirm Password</label>
                <input 
                  type="password" 
                  className="ep-form-input" 
                  style={{ borderColor: 'var(--danger)' }}
                  placeholder="Enter password to confirm"
                  value={deletePassword}
                  onChange={(e) => {
                    setDeletePassword(e.target.value);
                    setDeleteError('');
                  }}
                />
              </div>
              {deleteError && <div style={{ color: 'var(--danger)', fontSize: '0.8rem' }}>⚠️ {deleteError}</div>}
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn btn-danger" style={{ flex: 1 }} onClick={handleDeleteAccount}>Yes, Delete Everything</button>
                <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeletePassword('');
                  setDeleteError('');
                }}>Cancel</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
