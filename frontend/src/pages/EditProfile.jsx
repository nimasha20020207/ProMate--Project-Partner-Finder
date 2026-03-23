import React from 'react';
import { useNavigate } from 'react-router-dom';

const EditProfile = () => {
  const navigate = useNavigate();

  return (
    <div id="page-edit-profile" className="page active" style={{ display: 'block' }}>
      <div className="page-hdr">
        <div className="page-hdr-left">
          <h1>Edit Profile</h1>
          <p>Update your skills, availability, and preferences</p>
        </div>
        <div className="page-hdr-right">
          <button className="btn btn-outline btn-sm" onClick={() => navigate('/profile')}>Discard</button>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/profile')}>💾 Save Changes</button>
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: '1.25rem', alignItems: 'start' }}>
        <div className="completeness-card">
          <div className="cc-header">
            <div>
              <div className="cc-pct">74%</div>
              <div style={{ fontSize: '.78rem', color: 'var(--mid)' }}>Profile Complete</div>
            </div>
            <div style={{ fontSize: '2rem' }}>🏅</div>
          </div>
          <div className="cc-bar-bg"><div className="cc-bar" style={{ width: '74%' }}></div></div>
          <div className="cc-items">
            <div className="cc-item"><div className="cc-dot cc-done"></div><span>✓ Personal Information</span></div>
            <div className="cc-item"><div className="cc-dot cc-done"></div><span>✓ Skills Added</span></div>
            <div className="cc-item"><div className="cc-dot cc-done"></div><span>✓ Interests Selected</span></div>
            <div className="cc-item cc-item-roles"><div className="cc-dot cc-done"></div><span>✓ Preferred Roles</span></div>
            <div className="cc-item cc-item-avail"><div className="cc-dot cc-todo"></div><span style={{ color: 'var(--mid)' }}>○ Availability (incomplete)</span></div>
            <div className="cc-item cc-item-bio"><div className="cc-dot cc-todo"></div><span style={{ color: 'var(--mid)' }}>○ Bio Missing</span></div>
          </div>
        </div>
        
        <div className="ai-banner">
          <div className="ai-banner-icon">🤖</div>
          <div className="ai-banner-body">
            <h4>AI Skill Suggestions</h4>
            <p>Based on your domain. Click to add:</p>
            <div className="ai-tags">
              <span className="ai-tag">+ TypeScript</span>
              <span className="ai-tag">+ REST APIs</span>
              <span className="ai-tag">+ Git & GitHub</span>
              <span className="ai-tag">+ Tailwind CSS</span>
            </div>
          </div>
        </div>
      </div>

      <div className="section-card">
        <div className="section-card-title"><span className="section-icon">👤</span>Personal Information</div>
        <div className="form-row">
          <div className="form-group"><label className="form-label">First Name</label><input type="text" className="form-input" defaultValue="Ashan" /></div>
          <div className="form-group"><label className="form-label">Last Name</label><input type="text" className="form-input" defaultValue="Kavinda" /></div>
        </div>
        <div className="form-row">
          <div className="form-group"><label className="form-label">University Email</label><input type="email" className="form-input" defaultValue="ashan@university.ac.lk" /></div>
          <div className="form-group"><label className="form-label">Student ID</label><input type="text" className="form-input" defaultValue="IT20012345" /></div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Department</label>
            <select className="form-input" defaultValue="Information Technology">
              <option>Information Technology</option><option>Computer Science</option><option>Software Engineering</option><option>Data Science</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Year of Study</label>
            <select className="form-input" defaultValue="Year 3">
              <option>Year 1</option><option>Year 2</option><option>Year 3</option><option>Year 4</option>
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group"><label className="form-label">Degree Program</label><input type="text" className="form-input" defaultValue="BSc (Hons) Information Technology" /></div>
          <div className="form-group"><label className="form-label">CGPA</label><input type="number" className="form-input" defaultValue="3.78" min="0" max="4" step="0.01" /></div>
        </div>
        <div className="form-group">
          <label className="form-label">Bio</label>
          <input type="text" className="form-input" placeholder="Tell teammates about yourself..." defaultValue="Passionate about full-stack development and AI-powered apps." />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Project Domain</label>
            <select className="form-input" defaultValue="Web Development">
              <option>Web Development</option><option>Mobile</option><option>AI / ML</option><option>Cybersecurity</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Specialization</label>
            <select className="form-input" defaultValue="Software Engineering (SE)">
              <option>Software Engineering (SE)</option><option>Data Science (DS)</option><option>CS</option><option>IT</option>
            </select>
          </div>
        </div>
      </div>

      <div className="section-card">
        <div className="section-card-title"><span className="section-icon">🧩</span>Skills & Technologies</div>
        <div className="skill-tags" style={{ marginBottom: '.75rem' }}>
          <span className="skill-tag" style={{ cursor: 'pointer' }}>React.js ×</span>
          <span className="skill-tag" style={{ cursor: 'pointer' }}>Node.js ×</span>
          <span className="skill-tag" style={{ cursor: 'pointer' }}>MongoDB ×</span>
          <span className="skill-tag" style={{ cursor: 'pointer' }}>JavaScript ×</span>
          <span className="skill-tag" style={{ cursor: 'pointer' }}>Express.js ×</span>
          <span className="skill-tag" style={{ cursor: 'pointer' }}>HTML/CSS ×</span>
          <span className="skill-tag" style={{ cursor: 'pointer' }}>Python ×</span>
          <span className="skill-tag" style={{ cursor: 'pointer' }}>Figma ×</span>
        </div>
        <div className="skill-adder">
          <input type="text" placeholder="Type a skill and press Add…" />
          <button type="button">+ Add</button>
        </div>
        <div className="alert-info">🤖 Skill names are auto-normalized (e.g. "JS" → "JavaScript")</div>
      </div>

      <div className="grid-2">
        <div className="section-card" style={{ marginBottom: 0 }}>
          <div className="section-card-title"><span className="section-icon">💡</span>Interests</div>
          <div className="chip-group">
            <span className="chip active">Web Dev</span>
            <span className="chip active">AI / ML</span>
            <span className="chip">Mobile</span>
            <span className="chip active">UI/UX</span>
            <span className="chip">DevOps</span>
            <span className="chip active">Databases</span>
            <span className="chip">Security</span>
            <span className="chip">Cloud</span>
            <span className="chip">IoT</span>
            <span className="chip">Blockchain</span>
          </div>
        </div>
        <div className="section-card" style={{ marginBottom: 0 }}>
          <div className="section-card-title"><span className="section-icon">🕐</span>Availability</div>
          <div className="avail-grid" style={{ marginBottom: '.75rem' }}>
            <div className="day-block"><div className="day-lbl">Mon</div><div className="edit-day-chip active">✓</div></div>
            <div className="day-block"><div className="day-lbl">Tue</div><div className="edit-day-chip active">✓</div></div>
            <div className="day-block"><div className="day-lbl">Wed</div><div className="edit-day-chip"></div></div>
            <div className="day-block"><div className="day-lbl">Thu</div><div className="edit-day-chip active">✓</div></div>
            <div className="day-block"><div className="day-lbl">Fri</div><div className="edit-day-chip active">✓</div></div>
            <div className="day-block"><div className="day-lbl">Sat</div><div className="edit-day-chip active">✓</div></div>
            <div className="day-block"><div className="day-lbl">Sun</div><div className="edit-day-chip"></div></div>
          </div>
          <div className="hrs-label">
            <span>Weekly Hours</span>
            <div className="hrs-val"><span>10</span> <small>hrs/week</small></div>
          </div>
          <input type="range" min="1" max="40" defaultValue="10" step="1" />
          <div style={{ marginTop: '.75rem' }}>
            <label className="form-label" style={{ marginBottom: '.4rem' }}>Preferred Time</label>
            <div className="chip-group">
              <span className="chip">🌅 Morning</span>
              <span className="chip active">🌙 Evening</span>
              <span className="chip">📅 Weekend</span>
            </div>
          </div>
        </div>
      </div>

      <div className="section-card" style={{ marginTop: '1.25rem' }}>
        <div className="section-card-title"><span className="section-icon">🎭</span>Preferred Roles</div>
        <div className="role-grid">
          <div className="role-opt selected"><input type="checkbox" defaultChecked /><div><div className="role-lbl">🖥️ Frontend Developer</div><div className="role-sub">React, HTML/CSS, UI</div></div></div>
          <div className="role-opt selected"><input type="checkbox" defaultChecked /><div><div className="role-lbl">⚙️ Backend Developer</div><div className="role-sub">Node.js, APIs, DB</div></div></div>
          <div className="role-opt"><input type="checkbox" /><div><div className="role-lbl">🔄 Full Stack</div><div className="role-sub">End-to-end dev</div></div></div>
          <div className="role-opt"><input type="checkbox" /><div><div className="role-lbl">🤖 ML Engineer</div><div className="role-sub">Python, Models</div></div></div>
          <div className="role-opt"><input type="checkbox" /><div><div className="role-lbl">🎨 UI/UX Designer</div><div className="role-sub">Figma, Prototyping</div></div></div>
          <div className="role-opt"><input type="checkbox" /><div><div className="role-lbl">🚀 DevOps</div><div className="role-sub">Docker, CI/CD</div></div></div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '.75rem', marginTop: '1.5rem', paddingBottom: '2rem' }}>
        <button className="btn btn-outline" onClick={() => navigate('/profile')} type="button">Discard Changes</button>
        <button className="btn btn-primary" onClick={() => navigate('/profile')} type="button">💾 Save All Changes</button>
      </div>
    </div>
  );
};

export default EditProfile;
