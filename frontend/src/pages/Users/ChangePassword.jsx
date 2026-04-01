import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ChangePassword = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  return (
    <div id="page-change-password" className="page active" style={{ display: 'block', paddingBottom: '3rem' }}>
      <div className="page-hdr">
        <div className="page-hdr-left">
          <h1>Security Settings</h1>
          <p>Update your password to keep your account secure</p>
        </div>
        <div className="page-hdr-right">
          <button className="btn btn-outline btn-sm" onClick={() => navigate('/settings')}>← Back to Settings</button>
        </div>
      </div>

      <div className="section-card" style={{ maxWidth: '600px', margin: '2rem auto' }}>
        <div className="section-card-title">
          <span className="section-icon">🔐</span>
          Change Password
        </div>
        
        <form onSubmit={handlePasswordChange}>
          {passwordError && <div className="form-error show" style={{ marginBottom: '1rem' }}>{passwordError}</div>}
          {passwordSuccess && <div style={{ color: 'var(--success)', fontSize: '0.85rem', marginBottom: '1rem', fontWeight: 600 }}>{passwordSuccess}</div>}
          
          <div className="form-group">
            <label className="form-label">Current Password</label>
            <div className="pw-wrap">
              <input type={showCurrentPassword ? "text" : "password"} required className="form-input" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Enter current password" />
              <button className="pw-toggle" type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)}>{showCurrentPassword ? "🙈" : "👁️"}</button>
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">New Password</label>
            <div className="pw-wrap">
              <input type={showNewPassword ? "text" : "password"} required className="form-input" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Create a strong new password" />
              <button className="pw-toggle" type="button" onClick={() => setShowNewPassword(!showNewPassword)}>{showNewPassword ? "🙈" : "👁️"}</button>
            </div>
            {newPassword.length > 0 && (
              <div className="pw-strength">
                <div className={`pw-seg ${newPassword.length > 3 ? 'weak' : ''} ${newPassword.length > 7 ? 'strong' : ''}`}></div>
                <div className={`pw-seg ${newPassword.length > 5 ? 'fair' : ''} ${newPassword.length > 7 ? 'strong' : ''}`}></div>
                <div className={`pw-seg ${newPassword.length > 7 ? 'strong' : ''}`}></div>
              </div>
            )}
          </div>
          
          <div className="form-group">
            <label className="form-label">Confirm New Password</label>
            <div className="pw-wrap">
              <input type={showConfirmPassword ? "text" : "password"} required className="form-input" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Repeat new password" />
              <button className="pw-toggle" type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>{showConfirmPassword ? "🙈" : "👁️"}</button>
            </div>
          </div>
          
          <div style={{ marginTop: '2.5rem', textAlign: 'right' }}>
            <button type="submit" className="btn btn-primary btn-lg" style={{ minWidth: '180px' }}>Save New Password</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
