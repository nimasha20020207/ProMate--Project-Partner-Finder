import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { calculateProfileCompleteness } from '../utils/profileUtils';

const EditProfile = () => {
  const navigate = useNavigate();
  const { user, token, fetchProfile } = useAuth();
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    studentId: "",
    department: "",
    degreeProgram: "",
    bio: "",
    profilePicture: "",
    socialLinks: { github: "", linkedin: "", portfolio: "" },
    academicInfo: { specialization: "", year: "", semester: "", cgpa: "" },
    skills: { languages: [], frameworks: [], libraries: [], databases: [], tools: [] },
    availability: { weeklyHours: "", preferredDays: [], preferredTime: [] },
    interests: [],
    preferredRoles: []
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        ...user,
        academicInfo: { ...prev.academicInfo, ...user.academicInfo },
        skills: { ...prev.skills, ...user.skills },
        availability: { ...prev.availability, ...user.availability },
        socialLinks: { ...prev.socialLinks, ...user.socialLinks }
      }));
    }
  }, [user]);

  // Skill categories based on schema
  const skillCategories = ['languages', 'frameworks', 'libraries', 'databases', 'tools'];
  const interests = ["AI / ML", "Web Dev", "Mobile", "UI/UX", "DevOps", "Databases", "Security", "Cloud", "IoT", "Blockchain"];
  const roles = ["Frontend Developer", "Backend Developer", "Full Stack", "ML Engineer", "UI/UX Designer", "DevOps", "QA Engineer"];
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const times = ["Morning", "Afternoon", "Evening", "Night"];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNestedChange = (parent, field, value) => {
    setFormData(prev => ({ ...prev, [parent]: { ...prev[parent], [field]: value } }));
  };

  const [skillInput, setSkillInput] = useState({ category: 'languages', text: '' });
  
  const handleAddSkill = () => {
    if (!skillInput.text.trim()) return;
    const cat = skillInput.category;
    const val = skillInput.text.trim();
    if (!formData.skills[cat].includes(val)) {
      setFormData(prev => ({
        ...prev,
        skills: { ...prev.skills, [cat]: [...prev.skills[cat], val] }
      }));
    }
    setSkillInput({ ...skillInput, text: '' });
  };

  const handleRemoveSkill = (cat, skill) => {
    setFormData(prev => ({
      ...prev,
      skills: { ...prev.skills, [cat]: prev.skills[cat].filter(s => s !== skill) }
    }));
  };

  const handleMultiSelect = (field, value) => {
    const exists = formData[field].includes(value);
    const updated = exists ? formData[field].filter(v => v !== value) : [...formData[field], value];
    setFormData({ ...formData, [field]: updated });
  };

  const handleAvailabilitySelect = (field, value) => {
    const exists = formData.availability[field].includes(value);
    const updated = exists ? formData.availability[field].filter(v => v !== value) : [...formData.availability[field], value];
    setFormData({ ...formData, availability: { ...formData.availability, [field]: updated } });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json", "x-auth-token": token },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        await fetchProfile();
        navigate("/profile");
      } else {
        alert("Failed to update profile");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving profile");
    }
  };

  // UI calculations
  const { percentage: completeness, checks } = calculateProfileCompleteness(formData);

  return (
    <div id="page-edit-profile" className="page active" style={{ display: 'block', paddingBottom: '3rem' }}>
      <div className="page-hdr">
        <div className="page-hdr-left">
          <h1>Edit Profile</h1>
          <p>Update your skills, availability, and preferences</p>
        </div>
        <div className="page-hdr-right">
          <button className="btn btn-outline btn-sm" onClick={() => navigate('/profile')}>Discard</button>
          <button className="btn btn-primary btn-sm" onClick={handleSubmit}>💾 Save Changes</button>
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: '1.25rem', alignItems: 'start' }}>
        <div className="completeness-card">
          <div className="cc-header">
            <div>
              <div className="cc-pct">{completeness}%</div>
              <div style={{ fontSize: '.78rem', color: 'var(--mid)' }}>Profile Complete</div>
            </div>
            <div style={{ fontSize: '2rem' }}>🏅</div>
          </div>
          <div className="cc-bar-bg"><div className="cc-bar" style={{ width: `${completeness}%` }}></div></div>
          <div className="cc-items">
            <div className={`cc-item ${checks.personalInfo ? 'cc-item-done' : ''}`}><div className={`cc-dot ${checks.personalInfo ? 'cc-done' : 'cc-todo'}`}></div><span style={!checks.personalInfo ? {color: 'var(--mid)'} : {}}>{checks.personalInfo ? '✓ Personal Information' : '○ Personal Information'}</span></div>
            <div className={`cc-item ${checks.skills ? 'cc-item-done' : ''}`}><div className={`cc-dot ${checks.skills ? 'cc-done' : 'cc-todo'}`}></div><span style={!checks.skills ? {color: 'var(--mid)'} : {}}>{checks.skills ? '✓ Skills Added' : '○ Skills Missing'}</span></div>
            <div className={`cc-item ${checks.interests ? 'cc-item-done' : ''}`}><div className={`cc-dot ${checks.interests ? 'cc-done' : 'cc-todo'}`}></div><span style={!checks.interests ? {color: 'var(--mid)'} : {}}>{checks.interests ? '✓ Interests Selected' : '○ Interests Missing'}</span></div>
            <div className={`cc-item ${checks.roles ? 'cc-item-done' : ''}`}><div className={`cc-dot ${checks.roles ? 'cc-done' : 'cc-todo'}`}></div><span style={!checks.roles ? {color: 'var(--mid)'} : {}}>{checks.roles ? '✓ Preferred Roles' : '○ Preferred Roles Missing'}</span></div>
            <div className={`cc-item ${checks.availability ? 'cc-item-done' : ''}`}><div className={`cc-dot ${checks.availability ? 'cc-done' : 'cc-todo'}`}></div><span style={!checks.availability ? {color: 'var(--mid)'} : {}}>{checks.availability ? '✓ Availability Added' : '○ Availability (incomplete)'}</span></div>
            <div className={`cc-item ${checks.bio ? 'cc-item-done' : ''}`}><div className={`cc-dot ${checks.bio ? 'cc-done' : 'cc-todo'}`}></div><span style={!checks.bio ? {color: 'var(--mid)'} : {}}>{checks.bio ? '✓ Bio Added' : '○ Bio Missing'}</span></div>
          </div>
        </div>
        
        <div className="ai-banner">
          <div className="ai-banner-icon">🤖</div>
          <div className="ai-banner-body">
            <h4>AI Skill Suggestions</h4>
            <p>Based on your domain. Add them in the skills section.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="section-card">
          <div className="section-card-title"><span className="section-icon">👤</span>Personal Information</div>
          
          <div className="form-group">
            <label className="form-label">Profile Picture</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {formData.profilePicture && <img src={formData.profilePicture} alt="Avatar" style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border)' }} />}
              <input type="file" className="form-input" accept="image/*" onChange={async (e) => {
                const file = e.target.files[0];
                if (!file) return;
                const fd = new FormData();
                fd.append('profilePicture', file);
                try {
                  const res = await fetch('http://localhost:3000/api/profile/upload', {
                    method: 'POST',
                    headers: { 'x-auth-token': token },
                    body: fd
                  });
                  const data = await res.json();
                  if (res.ok) {
                    handleInputChange("profilePicture", data.url);
                    await fetchProfile(); // sync updated picture
                  } else {
                    alert("Upload failed: " + data.message);
                  }
                } catch (err) {
                  alert("Error uploading image");
                }
              }} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group"><label className="form-label">Full Name</label><input type="text" className="form-input" value={formData.fullName} onChange={e => handleInputChange("fullName", e.target.value)} /></div>
            <div className="form-group"><label className="form-label">Student ID</label><input type="text" className="form-input" value={formData.studentId} disabled style={{ backgroundColor: '#f3f4f6' }} /></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">University Email</label><input type="email" className="form-input" value={formData.email} disabled style={{ backgroundColor: '#f3f4f6' }} /></div>
            <div className="form-group">
              <label className="form-label">Department</label>
              <select className="form-input" value={formData.department} onChange={e => handleInputChange("department", e.target.value)}>
                <option value="">Select Department</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Software Engineering">Software Engineering</option>
                <option value="Data Science">Data Science</option>
                <option value="Cyber Security">Cyber Security</option>
                <option value="Interactive Media">Interactive Media</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Degree Program</label><input type="text" className="form-input" value={formData.degreeProgram} onChange={e => handleInputChange("degreeProgram", e.target.value)} /></div>
            <div className="form-group">
              <label className="form-label">Year of Study</label>
              <select className="form-input" value={formData.academicInfo.year} onChange={e => handleNestedChange("academicInfo", "year", e.target.value)}>
                <option value="">Select Year</option>
                <option value="1">Year 1</option>
                <option value="2">Year 2</option>
                <option value="3">Year 3</option>
                <option value="4">Year 4</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Semester</label>
              <select className="form-input" value={formData.academicInfo.semester} onChange={e => handleNestedChange("academicInfo", "semester", e.target.value)}>
                <option value="">Select Semester</option>
                <option value="1">Semester 1</option>
                <option value="2">Semester 2</option>
              </select>
            </div>
            <div className="form-group"><label className="form-label">CGPA</label><input type="number" className="form-input" value={formData.academicInfo.cgpa} onChange={e => handleNestedChange("academicInfo", "cgpa", e.target.value)} min="0" max="4" step="0.01" /></div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Specialization</label>
              <input type="text" className="form-input" value={formData.academicInfo.specialization} onChange={e => handleNestedChange("academicInfo", "specialization", e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Bio (About)</label>
            <input type="text" className="form-input" placeholder="Tell teammates about yourself..." value={formData.bio || ""} onChange={e => handleInputChange("bio", e.target.value)} />
          </div>
        </div>

        <div className="section-card">
          <div className="section-card-title"><span className="section-icon">🔗</span>Social Links</div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">GitHub</label>
              <input type="url" className="form-input" placeholder="https://github.com/username" value={formData.socialLinks?.github || ""} onChange={e => handleNestedChange("socialLinks", "github", e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">LinkedIn</label>
              <input type="url" className="form-input" placeholder="https://linkedin.com/in/username" value={formData.socialLinks?.linkedin || ""} onChange={e => handleNestedChange("socialLinks", "linkedin", e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Portfolio / Website</label>
            <input type="url" className="form-input" placeholder="https://yourwebsite.com" value={formData.socialLinks?.portfolio || ""} onChange={e => handleNestedChange("socialLinks", "portfolio", e.target.value)} />
          </div>
        </div>

        <div className="section-card">
          <div className="section-card-title"><span className="section-icon">🧩</span>Skills & Technologies</div>
          
          {skillCategories.map(cat => (
             formData.skills[cat] && formData.skills[cat].length > 0 && (
               <div key={cat} style={{ marginBottom: '1rem' }}>
                 <div className="form-label" style={{ textTransform: 'capitalize' }}>{cat}</div>
                 <div className="skill-tags">
                   {formData.skills[cat].map(s => (
                     <span key={s} className="skill-tag" style={{ cursor: 'pointer' }} onClick={() => handleRemoveSkill(cat, s)} title="Click to remove">{s} ×</span>
                   ))}
                 </div>
               </div>
             )
          ))}

          <div style={{ marginTop: '1.5rem', background: 'var(--bg)', padding: '1rem', borderRadius: '10px' }}>
             <label className="form-label">Add a new skill</label>
             <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
               <select className="form-input" style={{ width: '150px' }} value={skillInput.category} onChange={e => setSkillInput({...skillInput, category: e.target.value})}>
                 {skillCategories.map(cat => <option key={cat} value={cat} style={{ textTransform: 'capitalize' }}>{cat}</option>)}
               </select>
               <input type="text" className="form-input" placeholder="Type skill here..." value={skillInput.text} onChange={e => setSkillInput({...skillInput, text: e.target.value})} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddSkill(); }}} />
               <button type="button" className="btn btn-primary" onClick={handleAddSkill}>+ Add</button>
             </div>
          </div>
        </div>

        <div className="grid-2">
          <div className="section-card" style={{ marginBottom: 0 }}>
            <div className="section-card-title"><span className="section-icon">💡</span>Interests</div>
            <div className="chip-group">
              {interests.map(i => (
                <span key={i} className={`chip ${formData.interests.includes(i) ? 'active' : ''}`} onClick={() => handleMultiSelect("interests", i)}>
                  {i}
                </span>
              ))}
            </div>
          </div>
          
          <div className="section-card" style={{ marginBottom: 0 }}>
            <div className="section-card-title"><span className="section-icon">🕐</span>Availability</div>
            <div className="form-group">
              <label className="form-label">Preferred Working Days</label>
              <div className="avail-grid" style={{ marginBottom: '.75rem' }}>
                {days.map(d => (
                  <div key={d} className="day-block" onClick={() => handleAvailabilitySelect("preferredDays", d)}>
                    <div className="day-lbl">{d.substring(0,3)}</div>
                    <div className={`edit-day-chip ${formData.availability.preferredDays.includes(d) ? 'active' : ''}`}>
                      {formData.availability.preferredDays.includes(d) ? '✓' : ''}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Weekly Hours</span>
                <span style={{ fontWeight: 400, color: 'var(--mid)' }}>{formData.availability.weeklyHours} hrs</span>
              </label>
              <input type="range" min="1" max="40" value={formData.availability.weeklyHours || 10} onChange={e => handleNestedChange("availability", "weeklyHours", e.target.value)} style={{ width: '100%' }} />
            </div>

            <div className="form-group" style={{ marginTop: '.75rem' }}>
              <label className="form-label" style={{ marginBottom: '.4rem' }}>Preferred Time</label>
              <div className="chip-group">
                {times.map(t => (
                  <span key={t} className={`chip ${formData.availability.preferredTime.includes(t) ? 'active' : ''}`} onClick={() => handleAvailabilitySelect("preferredTime", t)}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="section-card" style={{ marginTop: '1.25rem' }}>
          <div className="section-card-title"><span className="section-icon">🎭</span>Preferred Roles</div>
          <div className="role-grid">
            {roles.map(r => (
              <div key={r} className={`role-opt ${formData.preferredRoles.includes(r) ? 'selected' : ''}`} onClick={() => handleMultiSelect("preferredRoles", r)}>
                <input type="checkbox" checked={formData.preferredRoles.includes(r)} readOnly />
                <div><div className="role-lbl">{r}</div></div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '.75rem', marginTop: '1.5rem', paddingBottom: '2rem' }}>
          <button className="btn btn-outline" type="button" onClick={() => navigate('/profile')}>Cancel</button>
          <button className="btn btn-primary" type="submit">💾 Save All Changes</button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
