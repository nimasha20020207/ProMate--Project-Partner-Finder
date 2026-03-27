import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { calculateProfileCompleteness } from '../../utils/profileUtils';

const ProfileView = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user: authUser, token } = useAuth();
  
  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublicProfile = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/profile/${id}`, {
          headers: { "x-auth-token": token }
        });
        if (res.ok) {
          const data = await res.json();
          setProfileUser(data);
        }
      } catch (err) {
        console.error("Failed to load public profile", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPublicProfile();
    } else {
      setProfileUser(authUser);
      setLoading(false);
    }
  }, [id, authUser, token]);

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading Profile...</div>;
  if (!profileUser) return <div style={{ padding: '2rem', textAlign: 'center' }}>Profile not found</div>;

  const user = profileUser;
  const isOwnProfile = !id || id === authUser?._id;

  const getInitials = (name) => name ? name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U';
  const initials = getInitials(user?.fullName);
  const fullName = user?.fullName || 'Student Name';
  const department = user?.department || 'Department Not Set';
  const studentId = user?.studentId || 'N/A';
  const year = user?.academicInfo?.year ? `Year ${user.academicInfo.year}` : 'Year N/A';
  const bio = user?.bio || 'Passionate about full-stack development and AI-powered apps. Looking for collaborative projects.';
  const { percentage: completeness } = calculateProfileCompleteness(user);

  return (
    <div id="page-profile-view" className="page active" style={{ display: 'block', paddingBottom: '3rem' }}>
      <div className="page-hdr">
        <div className="page-hdr-left">
          <h1>My Profile</h1>
          <p>This is how other students see your profile</p>
        </div>
        <div className="page-hdr-right">
          <button className="btn btn-outline btn-sm" onClick={() => navigate('/dashboard')}>← Dashboard</button>
          {isOwnProfile && <button className="btn btn-primary btn-sm" onClick={() => navigate('/edit-profile')}>✏️ Edit Profile</button>}
        </div>
      </div>

      <div className="profile-hero premium-hero">
        <div className="ph-avatar premium-avatar" id="pv-hero-avatar" style={{ overflow: 'hidden' }}>
          {user?.profilePicture 
            ? <img src={user.profilePicture} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> 
            : initials}
        </div>
        <div className="ph-info">
          <h2 id="pv-hero-name" className="premium-name">{fullName}</h2>
          <div className="ph-dept premium-dept" id="pv-hero-dept">📍 {department} · {year}</div>
          <div className="ph-chips">
            <span className="ph-chip glass-chip">🎓 {user?.degreeProgram || 'Degree Not Set'}</span>
            <span className="ph-chip glass-chip">⏰ {user?.availability?.weeklyHours || 0} hrs/week</span>
            <span className="ph-chip glass-chip">🟢 Available</span>
          </div>
        </div>
        <div className="ph-actions">
          {isOwnProfile && <button className="btn btn-ghost btn-sm premium-edit-btn" onClick={() => navigate('/edit-profile')}>✏️ Edit</button>}
        </div>
      </div>

      <div className="profile-view-grid">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="profile-sidebar-card shadow-card">
            <div className="pv-avatar shadow-avatar" id="pv-sidebar-avatar" style={{ overflow: 'hidden' }}>
              {user?.profilePicture 
                ? <img src={user.profilePicture} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> 
                : initials}
            </div>
            <div className="pv-name" id="pv-sidebar-name">{fullName}</div>
            <div className="pv-dept" id="pv-sidebar-dept">{department}</div>
            <div className="pv-score-ring" style={{ background: `conic-gradient(var(--p) ${completeness}%, var(--border) 0)` }}>
              <div className="pv-score-inner"><div className="pv-score-num">{completeness}%</div><div className="pv-score-lbl">COMPLETE</div></div>
            </div>
            <div style={{ display: 'flex', gap: '.4rem', justifyContent: 'center', marginBottom: '1rem', flexWrap: 'wrap' }}>
              <span style={{ background: 'var(--pl)', color: 'var(--p)', border: '1px solid #BFDBFE', fontSize: '.72rem', padding: '3px 9px', borderRadius: '20px', fontWeight: 600 }}>🟢 Available</span>
              <span style={{ background: 'var(--pl)', color: 'var(--p)', border: '1px solid #BFDBFE', fontSize: '.72rem', padding: '3px 9px', borderRadius: '20px', fontWeight: 600 }}>{year}</span>
            </div>
            <div className="pv-detail"><span className="pv-detail-lbl">Department</span><span className="pv-detail-val" id="pv-dept-val">{department}</span></div>
            <div className="pv-detail"><span className="pv-detail-lbl">Year</span><span className="pv-detail-val" id="pv-year-val">{year}</span></div>
            <div className="pv-detail"><span className="pv-detail-lbl">Student ID</span><span className="pv-detail-val" id="pv-id-val">{studentId}</span></div>
            <div className="pv-detail"><span className="pv-detail-lbl">CGPA</span><span className="pv-detail-val" id="pv-cgpa-val">{user?.academicInfo?.cgpa || 'N/A'}</span></div>
            <div className="pv-detail"><span className="pv-detail-lbl">Domain</span><span className="pv-detail-val">{user?.academicInfo?.specialization || 'N/A'}</span></div>
            {isOwnProfile && <button className="btn btn-primary btn-full shadow-hover-btn" style={{ marginTop: '1rem' }} onClick={() => navigate('/edit-profile')}>✏️ Edit Profile</button>}
          </div>
          <div className="card card-sm shadow-card">
            <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '.88rem', fontWeight: 700, marginBottom: '.7rem' }}>🎭 Preferred Roles</div>
            <div className="roles-list">
              {user?.preferredRoles?.length > 0 ? user.preferredRoles.map(role => (
                 <div key={role} className="role-row">✅ <span>{role}</span></div>
              )) : <div className="role-row" style={{ color: 'var(--mid)' }}>⬜ <span>No roles selected</span></div>}
            </div>
          </div>
        </div>

        <div className="profile-right">
          <div className="card shadow-card">
            <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '1rem', fontWeight: 700, marginBottom: '.6rem' }}>👤 About</div>
            <p id="pv-bio" style={{ fontSize: '.875rem', color: 'var(--mid)', lineHeight: 1.65 }}>{bio}</p>
            
            {(user?.socialLinks?.github || user?.socialLinks?.linkedin || user?.socialLinks?.portfolio) && (
              <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {user.socialLinks.github && (
                  <a href={user.socialLinks.github} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm" style={{ padding: '0.4rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem' }}>🐙 GitHub</a>
                )}
                {user.socialLinks.linkedin && (
                  <a href={user.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm" style={{ padding: '0.4rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', background: '#0A66C2', color: 'white', border: 'none' }}>💼 LinkedIn</a>
                )}
                {user.socialLinks.portfolio && (
                  <a href={user.socialLinks.portfolio} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm" style={{ padding: '0.4rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', background: 'var(--dark)', color: 'white', border: 'none' }}>🌐 Portfolio</a>
                )}
              </div>
            )}
          </div>
          
          <div className="card shadow-card">
            <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '1rem', fontWeight: 700, marginBottom: '.75rem' }}>🧩 Skills</div>
            <div className="skill-tags" id="pv-skills">
              {['languages', 'frameworks', 'libraries', 'databases', 'tools'].map(cat => (
                user?.skills?.[cat] && user.skills[cat].length > 0 ? user.skills[cat].map(skill => (
                  <span key={`${cat}-${skill}`} className="skill-tag skill-tag-premium">{skill}</span>
                )) : null
              ))}
              {!user?.skills && <span className="skill-tag">No skills added</span>}
            </div>
          </div>
          
          <div className="card shadow-card">
            <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '1rem', fontWeight: 700, marginBottom: '.75rem' }}>💡 Interests</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.4rem' }}>
              {user?.interests?.length > 0 ? user.interests.map(int => (
                <span key={int} className="int-chip active premium-chip">{int}</span>
              )) : <span className="int-chip">No interests added</span>}
            </div>
          </div>
          
          <div className="card shadow-card">
            <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '1rem', fontWeight: 700, marginBottom: '.75rem' }}>🕐 Availability</div>
            <div className="avail-grid" style={{ marginBottom: '.75rem' }}>
              {['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].map(day => (
                <div key={day} className="day-block">
                  <div className="day-lbl">{day.substring(0,3)}</div>
                  <div className={`edit-day-chip ${user?.availability?.preferredDays?.includes(day) ? 'active' : ''}`}>
                    {user?.availability?.preferredDays?.includes(day) ? '✓' : ''}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'center', fontFamily: "'Sora', sans-serif", fontSize: '1.5rem', fontWeight: 800, color: 'var(--p)' }}>
              {user?.availability?.weeklyHours || 0} <small style={{ fontSize: '.75rem', color: 'var(--mid)', fontFamily: 'inherit', fontWeight: 400 }}>hours / week</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
