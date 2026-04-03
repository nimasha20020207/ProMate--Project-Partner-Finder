import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { calculateProfileCompleteness } from '../../utils/profileUtils';
import { 
  User, Mail, BookOpen, Briefcase, Code, Globe, 
  Calendar, Clock, Link as LinkIcon, LogOut, Save, X, Phone,
  Github, Linkedin, CheckCircle2, AlertCircle, Info, Hash,
  ChevronRight, Award, Brain, Plus
} from 'lucide-react';
import Modal from '../../components/Modal';
import './EditProfile.css';

const EditProfile = () => {
  const navigate = useNavigate();
  const { user, token, fetchProfile } = useAuth();
  const [activeSegment, setActiveSegment] = useState('personal'); 
  const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    studentId: "",
    department: "",
    bio: "",
    contactNumber: "",
    profilePicture: "",
    socialLinks: { github: "", linkedin: "", portfolio: "" },
    academicInfo: { specialization: "", year: "", semester: "", cgpa: "" },
    skills: { languages: [], frameworks: [], libraries: [], databases: [], tools: [] },
    availability: { weeklyHours: 10, preferredDays: [], preferredTime: [] },
    interests: [],
    preferredRoles: []
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        ...user,
        academicInfo: { 
          specialization: user.academicInfo?.specialization || "",
          year: user.academicInfo?.year?.toString() || "", 
          semester: user.academicInfo?.semester?.toString() || "", 
          cgpa: user.academicInfo?.cgpa || "" 
        },
        skills: { 
          languages: user.skills?.languages || [],
          frameworks: user.skills?.frameworks || [],
          libraries: user.skills?.libraries || [],
          databases: user.skills?.databases || [],
          tools: user.skills?.tools || []
        },
        availability: { 
          weeklyHours: user.availability?.weeklyHours || 10,
          preferredDays: user.availability?.preferredDays || [],
          preferredTime: user.availability?.preferredTime || []
        },
        socialLinks: { 
          github: user.socialLinks?.github || "",
          linkedin: user.socialLinks?.linkedin || "",
          portfolio: user.socialLinks?.portfolio || ""
        },
        contactNumber: user.contactNumber || "",
        preferredRoles: user.preferredRoles || []
      }));
    }
  }, [user]);

  // Predefined Skill Lists
  const skillData = {
    languages: ['JavaScript', 'TypeScript', 'Python', 'Java', 'C', 'C++', 'C#', 'Go', 'Rust', 'Kotlin', 'Swift', 'PHP', 'Ruby', 'Dart', 'R', 'MATLAB'],
    frameworks: ['React', 'Angular', 'Vue.js', 'Next.js', 'Nuxt.js', 'Node.js', 'Express.js', 'Django', 'Flask', 'Spring Boot', 'ASP.NET', 'Laravel', 'Ruby on Rails', 'Flutter', 'React Native'],
    libraries: ['Redux', 'Axios', 'jQuery', 'Loash', 'TensorFlow', 'Keras', 'PyTorch', 'Scikit-learn', 'Pandas', 'NumPy', 'Chart.js', 'D3.js', 'Three.js', 'Socket.io', 'Bootstrap'],
    databases: ['MongoDB', 'MySQL','PostgreSQL', 'SQLite', 'Oracle', 'Microsoft SQL Server', 'Firebase', 'Redis', 'Cassandra', 'DynamoDB', 'Neo4j'],
    tools: ['Git', 'GitHub', 'GitLab', 'Docker', 'Kubernetes', 'Postman', 'Jira', 'Trello', 'Figma', 'Adobe XD', 'VS Code', 'IntelliJ IDEA', 'Eclipse', 'Webpack', 'Babel']
  };

  const skillCategories = ['languages', 'frameworks', 'libraries', 'databases', 'tools'];
  const interests = ["AI / ML", "Web Development", "Mobile Development", "UI/UX", "DevOps", "Data Science", "Cloud Computing", "IoT", "Blockchain", "Game Development", "Cybersecurity"];
  const rolesOptions = ["Frontend Developer", "Backend Developer", "Fullstack Developer", "Mobile App Developer", "ML Engineer", "Data Scientist", "UI/UX Designer", "DevOps Engineer", "QA Engineer", "Project Manager"];
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const times = ["Morning", "Afternoon", "Evening", "Night"];

  const [activeDropdown, setActiveDropdown] = useState(null);
  const [skillInput, setSkillInput] = useState({ category: 'languages', text: '' });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNestedChange = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: { ...prev[parent], [field]: value }
    }));
  };

  const handleMultiSelect = (field, value) => {
    setFormData(prev => {
      const current = prev[field] || [];
      const updated = current.includes(value) 
        ? current.filter(i => i !== value) 
        : [...current, value];
      return { ...prev, [field]: updated };
    });
  };

  const handleAvailabilitySelect = (field, value) => {
    setFormData(prev => {
      const current = prev.availability[field] || [];
      const updated = current.includes(value) 
        ? current.filter(i => i !== value) 
        : [...current, value];
      return { ...prev, availability: { ...prev.availability, [field]: updated } };
    });
  };

  const handleRemoveSkill = (cat, skill) => {
    setFormData(prev => ({
      ...prev,
      skills: { ...prev.skills, [cat]: prev.skills[cat].filter(s => s !== skill) }
    }));
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/profile/', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        await fetchProfile();
        setShowSuccess(true);
      } else {
        const errorData = await res.json();
        alert(errorData.msg || "Error updating profile");
      }
    } catch (err) {
      alert("Error updating profile");
    }
  };

  const toggleDropdown = (id) => setActiveDropdown(activeDropdown === id ? null : id);

  const { percentage: completeness } = calculateProfileCompleteness(formData);

  return (
    <div id="page-edit-profile" className="page active" style={{ display: 'block', paddingBottom: '3rem', background: '#f8fafc' }}>
      
      <div className="page-hdr" style={{ maxWidth: '1200px', margin: '0 auto 2rem auto', paddingTop: '1.5rem' }}>
        <div className="page-hdr-left">
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <User size={28} color="var(--p)" /> Edit Profile
          </h1>
          <p>Craft your professional presence on ProMate</p>
        </div>
        <div className="page-hdr-right" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button className="btn btn-outline btn-sm" onClick={() => navigate('/profile')}>Discard</button>
          <button className="btn btn-primary btn-sm" onClick={handleSubmit}>
            <Save size={16} /> Save Changes
          </button>
        </div>
      </div>

      <div className="ep-outer-container">
        <div className="ep-main-card">
          {/* 📋 Sidebar Navigation */}
          <aside className="ep-sidebar">
            <div className="ep-sb-item" style={{ pointerEvents: 'none', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
               <div className="cc-pct" style={{ fontSize: '1.2rem' }}>{completeness}%</div>
               <div style={{ fontSize: '0.7rem', color: 'var(--mid)' }}>Completeness</div>
            </div>
            
            <div className={`ep-sb-item ${activeSegment === 'personal' ? 'active' : ''}`} onClick={() => setActiveSegment('personal')}>
              <User className="ep-sb-icon" /> Personal Details
            </div>
            <div className={`ep-sb-item ${activeSegment === 'academic' ? 'active' : ''}`} onClick={() => setActiveSegment('academic')}>
              <BookOpen className="ep-sb-icon" /> Academic Info
            </div>
            <div className={`ep-sb-item ${activeSegment === 'social' ? 'active' : ''}`} onClick={() => setActiveSegment('social')}>
              <Globe className="ep-sb-icon" /> Social Links
            </div>
            <div className={`ep-sb-item ${activeSegment === 'skills' ? 'active' : ''}`} onClick={() => setActiveSegment('skills')}>
              <Code className="ep-sb-icon" /> Skills & Tech
            </div>
            <div className={`ep-sb-item ${activeSegment === 'availability' ? 'active' : ''}`} onClick={() => setActiveSegment('availability')}>
              <Calendar className="ep-sb-icon" /> Availability
            </div>
            <div className={`ep-sb-item ${activeSegment === 'interests' ? 'active' : ''}`} onClick={() => setActiveSegment('interests')}>
              <Brain className="ep-sb-icon" /> Project Interests
            </div>
            <div className={`ep-sb-item ${activeSegment === 'roles' ? 'active' : ''}`} onClick={() => setActiveSegment('roles')}>
              <Briefcase className="ep-sb-icon" /> Preferred Roles
            </div>

            <div className="ep-sb-promo">
              <Award size={20} style={{ color: 'var(--p)', marginBottom: '0.5rem' }} />
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--p)' }}>Pro Tip</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--mid)', marginTop: '2px' }}>Complete your profile to get better project matches!</div>
            </div>
          </aside>

          {/* 📝 Main Content Area */}
          <main className="ep-content">
            
            {activeSegment === 'personal' && (
              <div className="ep-section-card">
                <div className="ep-section-header">
                  <div className="ep-section-icon-bg"><User size={20} /></div>
                  <h2>Personal Information</h2>
                </div>
                
                <div className="pf-upload-card">
                  <div style={{ position: 'relative', display: 'inline-block' }}>
                    <img 
                      src={formData.profilePicture || "https://ui-avatars.com/api/?name=" + (formData.fullName || "User")} 
                      alt="Avatar" 
                      className="ep-avatar-lg"
                    />
                    <label htmlFor="pf-upload" className="pf-upload-btn">
                      <Plus size={16} />
                    </label>
                    <input id="pf-upload" type="file" hidden accept="image/*" onChange={async (e) => {
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
                          await fetchProfile();
                        } else { alert("Upload failed: " + data.message); }
                      } catch (err) { alert("Error uploading image"); }
                    }} />
                  </div>
                  <div className="pf-upload-info">
                     <h3>{formData.fullName || "Your Student Profile"}</h3>
                     <p>{formData.email}</p>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input type="text" className="ep-form-input" value={formData.fullName} onChange={e => handleInputChange("fullName", e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Student ID</label>
                    <div className="ep-form-input readonly"><Hash size={14} /> {formData.studentId}</div>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Professional Bio</label>
                  <textarea 
                    className="ep-form-input" 
                    rows="4" 
                    placeholder="Tell potential teammates about your passion, goals..." 
                    value={formData.bio || ""} 
                    onChange={e => handleInputChange("bio", e.target.value)}
                  ></textarea>
                </div>

                <div className="form-group">
                  <label className="form-label"><Phone size={14} /> Contact Number</label>
                  <input type="text" className="ep-form-input" placeholder="+94 77 123 4567" value={formData.contactNumber} onChange={e => handleInputChange("contactNumber", e.target.value)} />
                </div>
              </div>
            )}

            {activeSegment === 'academic' && (
              <div className="ep-section-card">
                <div className="ep-section-header">
                  <div className="ep-section-icon-bg"><BookOpen size={20} /></div>
                  <h2>Academic Background</h2>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Department <span style={{ color: 'var(--mid)', fontWeight: 400, fontSize: '0.75rem' }}>(Contact Admin to change)</span></label>
                  <div className="ep-form-input readonly">
                    <BookOpen size={14} /> {formData.department || "Not Set"}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Year of Study</label>
                    <select className="ep-form-input" value={formData.academicInfo.year} onChange={e => handleNestedChange("academicInfo", "year", e.target.value)}>
                      <option value="">Select Year</option>
                      {['1', '2', '3', '4'].map(y => <option key={y} value={y}>Year {y}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Semester</label>
                    <select className="ep-form-input" value={formData.academicInfo.semester} onChange={e => handleNestedChange("academicInfo", "semester", e.target.value)}>
                      <option value="">Select Semester</option>
                      {['1', '2'].map(s => <option key={s} value={s}>Semester {s}</option>)}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Specialization <span style={{ color: 'var(--mid)', fontWeight: 400, fontSize: '0.75rem' }}>(Contact Admin to change)</span></label>
                    <div className="ep-form-input readonly">
                       <Award size={14} /> {formData.academicInfo.specialization || "Not Set"}
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Current CGPA</label>
                    <input type="number" className="ep-form-input" value={formData.academicInfo.cgpa} onChange={e => handleNestedChange("academicInfo", "cgpa", e.target.value)} min="0" max="4" step="0.01" />
                  </div>
                </div>
              </div>
            )}

            {activeSegment === 'social' && (
              <div className="ep-section-card">
                <div className="ep-section-header">
                  <div className="ep-section-icon-bg"><Globe size={20} /></div>
                  <h2>Professional Links</h2>
                </div>
                
                <div className="form-group">
                  <label className="form-label"><Github size={14} /> GitHub Profile</label>
                  <input type="url" className="ep-form-input" placeholder="https://github.com/username" value={formData.socialLinks?.github || ""} onChange={e => handleNestedChange("socialLinks", "github", e.target.value)} />
                </div>

                <div className="form-group">
                  <label className="form-label"><Linkedin size={14} /> LinkedIn Profile</label>
                  <input type="url" className="ep-form-input" placeholder="https://linkedin.com/in/username" value={formData.socialLinks?.linkedin || ""} onChange={e => handleNestedChange("socialLinks", "linkedin", e.target.value)} />
                </div>

                <div className="form-group">
                  <label className="form-label"><LinkIcon size={14} /> Personal Portfolio</label>
                  <input type="url" className="ep-form-input" placeholder="https://yourwebsite.com" value={formData.socialLinks?.portfolio || ""} onChange={e => handleNestedChange("socialLinks", "portfolio", e.target.value)} />
                </div>
              </div>
            )}

            {activeSegment === 'skills' && (
              <div className="ep-section-card">
                <div className="ep-section-header">
                  <div className="ep-section-icon-bg"><Code size={20} /></div>
                  <h2>Skills & Tech</h2>
                </div>

                <div className="skill-section-main">
                  {skillCategories.map(cat => (
                    <div key={cat} className="skill-cat-row">
                      <div className="skill-cat-label">{cat}</div>
                      <div className="skill-grid">
                        {skillData[cat].map(skill => {
                          const isSelected = formData.skills[cat]?.includes(skill);
                          return (
                            <div 
                              key={skill} 
                              className={`skill-chip-toggle ${isSelected ? 'active' : ''}`}
                              onClick={() => isSelected ? handleRemoveSkill(cat, skill) : setFormData(prev => ({ ...prev, skills: { ...prev.skills, [cat]: [...prev.skills[cat], skill] } }))}
                            >
                              {skill} {isSelected ? <CheckCircle2 size={12} /> : <Plus size={12} />}
                            </div>
                          );
                        })}
                      </div>
                      
                      {/* Custom Skills for this category */}
                      <div className="custom-skill-list">
                         {formData.skills[cat]?.filter(s => !skillData[cat].includes(s)).map(s => (
                           <span key={s} className="skill-tag-removable" onClick={() => handleRemoveSkill(cat, s)}>
                             {s} <X size={12} />
                           </span>
                         ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="custom-skill-adder">
                  <label className="form-label">Add Custom Technology</label>
                  <div className="adder-flex">
                    <select value={skillInput.category} onChange={e => setSkillInput({...skillInput, category: e.target.value})}>
                      {skillCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                    <input 
                      type="text" 
                      placeholder="Enter skill name..." 
                      value={skillInput.text} 
                      onChange={e => setSkillInput({...skillInput, text: e.target.value})}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const val = skillInput.text.trim();
                          if (val) {
                            const cat = skillInput.category;
                            if (!formData.skills[cat].includes(val)) {
                              setFormData(prev => ({ ...prev, skills: { ...prev.skills, [cat]: [...(prev.skills[cat] || []), val] } }));
                            }
                            setSkillInput({...skillInput, text: ''});
                          }
                        }
                      }}
                    />
                    <button className="btn btn-primary" onClick={() => {
                      const val = skillInput.text.trim();
                      if (val) {
                         const cat = skillInput.category;
                         if (!formData.skills[cat].includes(val)) {
                           setFormData(prev => ({ ...prev, skills: { ...prev.skills, [cat]: [...(prev.skills[cat] || []), val] } }));
                         }
                         setSkillInput({...skillInput, text: ''});
                      }
                    }}><Plus size={20} /></button>
                  </div>
                </div>
              </div>
            )}

            {activeSegment === 'interests' && (
              <div className="ep-section-card">
                <div className="ep-section-header">
                  <div className="ep-section-icon-bg"><Brain size={20} /></div>
                  <h2>Project Interests</h2>
                </div>
                
                <div className="ai-suggestion-banner">
                  <Brain size={20} color="var(--p)" />
                  <div>
                    <h4>Project Domain Selection</h4>
                    <p>Select domains that excite you. We use these to recommend projects!</p>
                  </div>
                </div>

                <div className="interest-selection-grid">
                  {interests.map(domain => {
                    const isSelected = formData.interests.includes(domain);
                    return (
                      <div 
                        key={domain} 
                        className={`interest-pill ${isSelected ? 'active' : ''}`}
                        onClick={() => handleMultiSelect('interests', domain)}
                      >
                        {isSelected ? <CheckCircle2 size={16} /> : <Plus size={16} />}
                        <span>{domain}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeSegment === 'availability' && (
              <div className="ep-section-card">
                <div className="ep-section-header">
                  <div className="ep-section-icon-bg"><Calendar size={20} /></div>
                  <h2>Weekly Availability</h2>
                </div>
                
                <div className="avail-info-box">
                  <label className="form-label">Dedicated Hours Per Week: <strong>{formData.availability.weeklyHours}h</strong></label>
                  <input type="range" min="1" max="40" value={formData.availability.weeklyHours || 10} onChange={e => handleNestedChange("availability", "weeklyHours", e.target.value)} />
                </div>

                <div className="form-group">
                  <label className="form-label">Working Days</label>
                  <div className="day-grid">
                    {days.map(d => (
                      <div key={d} className={`day-btn ${formData.availability.preferredDays.includes(d) ? 'active' : ''}`} onClick={() => handleAvailabilitySelect("preferredDays", d)}>
                        {d.substring(0,3)}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Preferred Time Window</label>
                  <div className="chip-grid">
                    {times.map(t => (
                      <div key={t} className={`chip-btn ${formData.availability.preferredTime.includes(t) ? 'active' : ''}`} onClick={() => handleAvailabilitySelect("preferredTime", t)}>
                        {t}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeSegment === 'roles' && (
              <div className="ep-section-card">
                <div className="ep-section-header">
                  <div className="ep-section-icon-bg"><Briefcase size={20} /></div>
                  <h2>Preferred Project Roles</h2>
                </div>
                
                <div className="role-selection-grid">
                  {rolesOptions.map(role => {
                    const isSelected = formData.preferredRoles.includes(role);
                    return (
                      <div 
                        key={role} 
                        className={`role-card-select ${isSelected ? 'active' : ''}`}
                        onClick={() => handleMultiSelect('preferredRoles', role)}
                      >
                        <div className="role-check">{isSelected ? <CheckCircle2 size={16} /> : <div className="dot"></div>}</div>
                        <span>{role}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </main>
        </div>
      </div>

      {showSuccess && (
        <div className="success-modal-overlay">
          <div className="success-modal-card">
            <div className="success-bounce-icon">
              <CheckCircle2 size={60} color="#10b981" />
            </div>
            <h2>Profile Updated!</h2>
            <p>Your changes have been saved successfully. Your profile is looking great!</p>
            <button className="btn btn-primary btn-full success-btn" onClick={() => navigate('/profile')}>
              View My Profile
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProfile;
