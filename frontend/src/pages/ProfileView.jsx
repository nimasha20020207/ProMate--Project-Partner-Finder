import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProfileView = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const getInitials = (name) => name ? name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U';
  const initials = getInitials(user?.fullName);
  const fullName = user?.fullName || 'Student Name';
  const department = user?.department || 'Department Not Set';
  const studentId = user?.studentId || 'N/A';
  const year = user?.academicInfo?.year ? `Year ${user.academicInfo.year}` : 'Year N/A';
  const bio = user?.bio || 'Passionate about full-stack development and AI-powered apps. Looking for collaborative projects.';

  return (
    <div id="page-profile-view" className="page active" style={{ display: 'block' }}>
      <div className="page-hdr">
        <div className="page-hdr-left">
          <h1>My Profile</h1>
          <p>This is how other students see your profile</p>
        </div>
        <div className="page-hdr-right">
          <button className="btn btn-outline btn-sm" onClick={() => navigate('/dashboard')}>← Dashboard</button>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/edit-profile')}>✏️ Edit Profile</button>
        </div>
      </div>

      <div className="profile-hero">
        <div className="ph-avatar" id="pv-hero-avatar">{initials}</div>
        <div className="ph-info">
          <h2 id="pv-hero-name">{fullName}</h2>
          <div className="ph-dept" id="pv-hero-dept">📍 {department} · {year}</div>
          <div className="ph-chips">
            <span className="ph-chip">🎓 IT3040 Student</span>
            <span className="ph-chip">⏰ 10 hrs/week</span>
            <span className="ph-chip">🟢 Available</span>
            <span className="ph-chip">⭐ 82% avg match</span>
          </div>
        </div>
        <div className="ph-actions">
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/edit-profile')}>✏️ Edit</button>
        </div>
      </div>

      <div className="profile-view-grid">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="profile-sidebar-card">
            <div className="pv-avatar" id="pv-sidebar-avatar">{initials}</div>
            <div className="pv-name" id="pv-sidebar-name">{fullName}</div>
            <div className="pv-dept" id="pv-sidebar-dept">{department}</div>
            <div className="pv-score-ring">
              <div className="pv-score-inner"><div className="pv-score-num">74%</div><div className="pv-score-lbl">COMPLETE</div></div>
            </div>
            <div style={{ display: 'flex', gap: '.4rem', justifyContent: 'center', marginBottom: '1rem', flexWrap: 'wrap' }}>
              <span style={{ background: 'var(--pl)', color: 'var(--p)', border: '1px solid #BFDBFE', fontSize: '.72rem', padding: '3px 9px', borderRadius: '20px', fontWeight: 600 }}>🟢 Available</span>
              <span style={{ background: 'var(--pl)', color: 'var(--p)', border: '1px solid #BFDBFE', fontSize: '.72rem', padding: '3px 9px', borderRadius: '20px', fontWeight: 600 }}>{year}</span>
            </div>
            <div className="pv-detail"><span className="pv-detail-lbl">Department</span><span className="pv-detail-val" id="pv-dept-val">{department}</span></div>
            <div className="pv-detail"><span className="pv-detail-lbl">Year</span><span className="pv-detail-val" id="pv-year-val">{year}</span></div>
            <div className="pv-detail"><span className="pv-detail-lbl">Student ID</span><span className="pv-detail-val" id="pv-id-val">{studentId}</span></div>
            <div className="pv-detail"><span className="pv-detail-lbl">CGPA</span><span className="pv-detail-val" id="pv-cgpa-val">3.78</span></div>
            <div className="pv-detail"><span className="pv-detail-lbl">Domain</span><span className="pv-detail-val">Web Dev</span></div>
            <button className="btn btn-primary btn-full" style={{ marginTop: '1rem' }} onClick={() => navigate('/edit-profile')}>✏️ Edit Profile</button>
          </div>
          <div className="card card-sm">
            <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '.88rem', fontWeight: 700, marginBottom: '.7rem' }}>🎭 Preferred Roles</div>
            <div className="roles-list">
              <div className="role-row">✅ <span>Frontend Developer</span></div>
              <div className="role-row">✅ <span>Backend Developer</span></div>
              <div className="role-row" style={{ color: 'var(--mid)' }}>⬜ <span>UI/UX Designer</span></div>
              <div className="role-row" style={{ color: 'var(--mid)' }}>⬜ <span>ML Engineer</span></div>
            </div>
          </div>
        </div>

        <div className="profile-right">
          <div className="card">
            <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '1rem', fontWeight: 700, marginBottom: '.6rem' }}>👤 About</div>
            <p id="pv-bio" style={{ fontSize: '.875rem', color: 'var(--mid)', lineHeight: 1.65 }}>{bio}</p>
          </div>
          <div className="card">
            <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '1rem', fontWeight: 700, marginBottom: '.75rem' }}>🧩 Skills</div>
            <div className="skill-tags" id="pv-skills">
              <span className="skill-tag">React.js</span>
              <span className="skill-tag">Node.js</span>
              <span className="skill-tag">MongoDB</span>
              <span className="skill-tag">JavaScript</span>
              <span className="skill-tag">Express.js</span>
              <span className="skill-tag">HTML/CSS</span>
              <span className="skill-tag">Python</span>
              <span className="skill-tag">Figma</span>
            </div>
          </div>
          <div className="card">
            <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '1rem', fontWeight: 700, marginBottom: '.75rem' }}>💡 Interests</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.4rem' }}>
              <span className="int-chip active">Web Dev</span>
              <span className="int-chip active">AI / ML</span>
              <span className="int-chip active">UI/UX</span>
              <span className="int-chip active">Databases</span>
              <span className="int-chip">Mobile</span>
              <span className="int-chip">DevOps</span>
            </div>
          </div>
          <div className="card">
            <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '1rem', fontWeight: 700, marginBottom: '.75rem' }}>🕐 Availability</div>
            <div className="avail-grid" style={{ marginBottom: '.75rem' }}>
              <div className="day-block"><div className="day-lbl">Mon</div><div className="day-chip active">✓</div></div>
              <div className="day-block"><div className="day-lbl">Tue</div><div className="day-chip active">✓</div></div>
              <div className="day-block"><div className="day-lbl">Wed</div><div className="day-chip"></div></div>
              <div className="day-block"><div className="day-lbl">Thu</div><div className="day-chip active">✓</div></div>
              <div className="day-block"><div className="day-lbl">Fri</div><div className="day-chip active">✓</div></div>
              <div className="day-block"><div className="day-lbl">Sat</div><div className="day-chip active">✓</div></div>
              <div className="day-block"><div className="day-lbl">Sun</div><div className="day-chip"></div></div>
            </div>
            <div style={{ textAlign: 'center', fontFamily: "'Sora', sans-serif", fontSize: '1.5rem', fontWeight: 800, color: 'var(--p)' }}>10 <small style={{ fontSize: '.75rem', color: 'var(--mid)', fontFamily: 'inherit', fontWeight: 400 }}>hours / week</small></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
