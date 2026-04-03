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
  const [githubData, setGithubData] = useState(null);

  useEffect(() => {
    const fetchGithub = async () => {
      let username = null;
      if (profileUser?.socialLinks?.github) {
        try {
          const urlStr = profileUser.socialLinks.github;
          if (urlStr.includes('github.com/')) {
            username = new URL(urlStr).pathname.split('/').filter(Boolean).pop();
          } else {
            username = urlStr.replace('@', '');
          }
        } catch (e) {}
      }
      
      if (username) {
        try {
          const res = await fetch(`https://api.github.com/users/${username}`);
          if (res.ok) {
            const data = await res.json();
            setGithubData({ ...data, extractedUsername: username });
          }
        } catch (err) {
          console.error("Github fetch error", err);
        }
      } else {
        setGithubData(null);
      }
    };
    if (profileUser) {
      fetchGithub();
    }
  }, [profileUser]);

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
            <span className="ph-chip glass-chip">🎓 {user?.specialization || user?.academicInfo?.specialization || 'Specialization Not Set'}</span>
            <span className="ph-chip glass-chip">📞 {user?.contactNumber || 'No Contact'}</span>
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
            <div className="pv-detail"><span className="pv-detail-lbl">Contact</span><span className="pv-detail-val">{user?.contactNumber || 'Not Provided'}</span></div>
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

          {githubData && (
            <div className="card shadow-card" style={{ background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.25rem' }}>
                <img src={githubData.avatar_url} alt="GitHub Avatar" style={{ width: '45px', height: '45px', borderRadius: '50%', border: '2px solid #2563eb', padding: '2px' }} />
                <div>
                  <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '1rem', fontWeight: 700, color: '#1e293b' }}>{githubData.name || githubData.login}</div>
                  <a href={githubData.html_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.8rem', color: '#64748b', textDecoration: 'none', fontWeight: 500 }}>@{githubData.login}</a>
                </div>
                <div style={{ marginLeft: 'auto', background: '#e0e7ff', padding: '8px', borderRadius: '50%', color: '#3730A3', display: 'flex', alignItems: 'center', justifyItems: 'center' }}>
                  <svg height="20" viewBox="0 0 16 16" width="20" fill="currentColor"><path fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path></svg>
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', textAlign: 'center' }}>
                <div style={{ background: '#f1f5f9', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#2563eb' }}>{githubData.public_repos}</div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Repos</div>
                </div>
                <div style={{ background: '#f1f5f9', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#2563eb' }}>{githubData.followers}</div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Followers</div>
                </div>
                <div style={{ background: '#f1f5f9', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#2563eb' }}>{githubData.following}</div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Following</div>
                </div>
              </div>
              
              {githubData.bio && (
                <div style={{ marginTop: '1.25rem', fontSize: '0.85rem', color: '#475569', fontStyle: 'italic', borderLeft: '3px solid #cbd5e1', paddingLeft: '10px', lineHeight: 1.5 }}>
                  "{githubData.bio}"
                </div>
              )}
            </div>
          )}
          
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
