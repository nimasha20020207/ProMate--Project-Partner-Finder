import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const firstName = user?.fullName ? user.fullName.split(' ')[0] : 'User';
  const getInitials = (name) => name ? name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U';
  const initials = getInitials(user?.fullName);

  return (
    <div id="page-dashboard" className="page active" style={{ display: 'block' }}>
      <div className="page-hdr">
        <div className="page-hdr-left">
          <h1>Welcome back, {firstName} 👋</h1>
          <p>Here's your project partner activity</p>
        </div>
        <div className="page-hdr-right">
          <button className="btn btn-outline btn-sm" onClick={() => navigate('/profile')}>View Profile</button>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/edit-profile')}>✏️ Edit Profile</button>
        </div>
      </div>
      
      <div className="profile-hero">
        <div className="ph-avatar" style={{ overflow: 'hidden' }}>
          {user?.profilePicture ? (
            <img src={user.profilePicture} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            initials
          )}
        </div>
        <div className="ph-info">
          <h2>{user?.fullName || 'Student'}</h2>
          <div className="ph-dept">📍 {user?.department || 'Dept. Unassigned'} · {user?.academicInfo?.year ? `Year ${user.academicInfo.year}` : 'Year N/A'}</div>
          <div className="ph-chips">
            {(user?.specialization || user?.academicInfo?.specialization) && <span className="ph-chip">🎓 {user.specialization || user.academicInfo.specialization}</span>}
            {user?.availability?.weeklyHours && <span className="ph-chip">⏰ {user.availability.weeklyHours} hrs/week</span>}
            {user?.availability?.preferredDays?.length > 0 && <span className="ph-chip">🟢 Available</span>}
          </div>
        </div>
        <div className="ph-actions">
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/edit-profile')}>✏️ Edit</button>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/profile')}>👁️ Preview</button>
        </div>
      </div>
      
      <div className="stats-row">
        <div className="stat-card-sm">
          <div className="sc-label">Skills Listed</div>
          <div className="sc-value">
            {(user?.skills?.languages?.length || 0) + (user?.skills?.frameworks?.length || 0) + (user?.skills?.tools?.length || 0) + (user?.skills?.databases?.length || 0) + (user?.skills?.libraries?.length || 0)}
          </div>
          <div className="sc-sub">Add more to match better</div>
        </div>
        <div className="stat-card-sm"><div className="sc-label">Projects Applied</div><div className="sc-value">0</div><div className="sc-sub">0 accepted · 0 pending</div></div>
        <div className="stat-card-sm"><div className="sc-label">Match Score Avg</div><div className="sc-value">N/A</div><div className="sc-sub">New Profile</div></div>
      </div>
      
      <div className="ai-banner">
        <div className="ai-banner-icon">🤖</div>
        <div className="ai-banner-body">
          <h4>AI Skill Suggestions · Web Development Domain</h4>
          <p>Based on your skills, you may also know these. Click to add:</p>
          <div className="ai-tags">
            <span className="ai-tag">+ TypeScript</span>
            <span className="ai-tag">+ REST APIs</span>
            <span className="ai-tag">+ Git & GitHub</span>
            <span className="ai-tag">+ Tailwind CSS</span>
          </div>
        </div>
      </div>
      
      <div className="grid-2">
        <div className="card card-sm" style={{ display: 'flex', flexDirection: 'column', gap: '.6rem' }}>
          <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '.95rem', fontWeight: 700, marginBottom: '.25rem' }}>🔔 Recent Requests</div>
          <div style={{ fontSize: '.85rem', color: 'var(--mid)', padding: '1rem', textAlign: 'center', background: 'var(--bg)', borderRadius: '10px' }}>
            No recent requests currently.
          </div>
        </div>
        <div className="card card-sm">
          <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '.95rem', fontWeight: 700, marginBottom: '.75rem' }}>⚡ Quick Actions</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
            <button className="btn btn-outline btn-full" style={{ color: 'var(--mid)' }} onClick={() => navigate('/profile')} type="button">📋 Browse Projects</button>
            <button className="btn btn-outline btn-full" style={{ color: 'var(--mid)' }} onClick={() => navigate('/recprojects')} type="button">⭐ View Matches</button>
            <button className="btn btn-primary btn-full" onClick={() => navigate('/edit-profile')} type="button">✏️ Edit My Profile</button>
            <button className="btn btn-outline btn-full" onClick={() => navigate('/profile')} type="button">👁️ Preview Profile</button>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
