import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProfileForm = () => {
  const { user, token, fetchProfile } = useAuth();
  const navigate = useNavigate();
  
  const [student, setStudent] = useState({
    degreeProgram: "",
    department: "",
    academicInfo: { specialization: "", year: "", semester: "", cgpa: "" },
    skills: { languages: [], frameworks: [], libraries: [], databases: [], tools: [] },
    availability: { weeklyHours: "", preferredDays: [], preferredTime: [] },
    interests: [],
    preferredRoles: []
  });

  // Pre-fill if user already has partial profile
  useEffect(() => {
    if (user) {
      setStudent(prev => ({
        ...prev,
        ...user,
        academicInfo: { ...prev.academicInfo, ...user.academicInfo },
        skills: { ...prev.skills, ...user.skills },
        availability: { ...prev.availability, ...user.availability }
      }));
    }
  }, [user]);

  const skillOptions = {
    languages: ["Java", "Python", "JavaScript", "C++", "C#", "Go", "TypeScript"],
    frameworks: ["React", "Node.js", "Spring Boot", "Django", "Vue", "Angular", "Express"],
    libraries: ["TensorFlow", "Redux", "Pandas", "jQuery"],
    databases: ["MongoDB", "MySQL", "PostgreSQL", "Firebase", "Redis"],
    tools: ["Git", "Docker", "Figma", "Postman", "AWS", "Jira"]
  };

  const skillLevels = ["Beginner", "Intermediate", "Advanced"];
  const interests = ["AI / ML", "Web Development", "Mobile Apps", "Cybersecurity", "Data Science", "IoT", "UI / UX", "DevOps"];
  const roles = ["Frontend Developer", "Backend Developer", "Full Stack", "ML Engineer", "UI/UX Designer", "DevOps", "QA Engineer"];
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const times = ["Morning", "Afternoon", "Evening", "Night"];

  const handleSkillChange = (category, skill, level) => {
    const updated = student.skills[category].filter(s => s.name !== skill);
    if (level !== "") {
      updated.push({ name: skill, level });
    }
    setStudent({ ...student, skills: { ...student.skills, [category]: updated } });
  };

  const getSkillLevel = (category, skill) => {
    const found = student.skills[category].find(s => s.name === skill);
    return found ? found.level : "";
  };

  const handleMultiSelect = (field, value) => {
    const exists = student[field].includes(value);
    const updated = exists ? student[field].filter(v => v !== value) : [...student[field], value];
    setStudent({ ...student, [field]: updated });
  };

  const handleAvailabilitySelect = (field, value) => {
    const exists = student.availability[field].includes(value);
    const updated = exists ? student.availability[field].filter(v => v !== value) : [...student.availability[field], value];
    setStudent({ ...student, availability: { ...student.availability, [field]: updated } });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json", "x-auth-token": token },
        body: JSON.stringify(student)
      });
      if (res.ok) {
        await fetchProfile();
        navigate("/profile");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="section-card" style={{ maxWidth: '800px', margin: '2rem auto' }}>
      <div className="section-card-title">
        <span className="section-icon">⚙️</span>
        Build Your Profile
      </div>
      <p style={{ color: 'var(--mid)', fontSize: '.9rem', marginBottom: '2rem' }}>
        Complete your profile so peers can find the perfect match for their projects.
      </p>

      <form onSubmit={handleSubmit}>
        
        <h4 className="sb-section-title" style={{ padding: '1rem 0 0.5rem', borderBottom: '1px solid var(--border)', marginBottom: '1rem' }}>Academic Details</h4>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Degree Program</label>
            <select className="form-input" value={student.degreeProgram} onChange={e => setStudent({...student, degreeProgram: e.target.value})}>
              <option value="">Select Category</option>
              <option value="BSc (Hons) IT">BSc (Hons) IT</option>
              <option value="BSc (Hons) CS">BSc (Hons) CS</option>
              <option value="BSc (Hons) SE">BSc (Hons) SE</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Department</label>
            <input className="form-input" placeholder="e.g. Software Engineering" value={student.department} onChange={e => setStudent({...student, department: e.target.value})} />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Specialization</label>
            <select className="form-input" value={student.academicInfo.specialization} onChange={e => setStudent({...student, academicInfo: {...student.academicInfo, specialization: e.target.value}})}>
              <option value="">Select Specialization</option>
              <option value="SE">SE</option>
              <option value="DS">DS</option>
              <option value="CS">CS</option>
              <option value="IT">IT</option>
              <option value="CSNE">CSNE</option>
              <option value="ISE">ISE</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Year of Study</label>
            <select className="form-input" value={student.academicInfo.year} onChange={e => setStudent({...student, academicInfo: {...student.academicInfo, year: e.target.value}})}>
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
            <select className="form-input" value={student.academicInfo.semester} onChange={e => setStudent({...student, academicInfo: {...student.academicInfo, semester: e.target.value}})}>
              <option value="">Select Semester</option>
              <option value="1">Semester 1</option>
              <option value="2">Semester 2</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">CGPA (Optional)</label>
            <input type="number" step="0.01" max="4.0" className="form-input" placeholder="e.g. 3.5" value={student.academicInfo.cgpa} onChange={e => setStudent({...student, academicInfo: {...student.academicInfo, cgpa: e.target.value}})} />
          </div>
        </div>

        <h4 className="sb-section-title" style={{ padding: '1.5rem 0 0.5rem', borderBottom: '1px solid var(--border)', marginBottom: '1rem' }}>Technical Skills</h4>
        
        {Object.keys(skillOptions).map(category => (
          <div key={category} style={{ marginBottom: '1.5rem' }}>
            <div className="skill-cat-label">{category}</div>
            <div className="skill-rows">
              {skillOptions[category].map(skill => {
                const currentLevel = getSkillLevel(category, skill);
                return (
                  <div className="skill-row-item" key={skill}>
                    <span className="skill-name">{skill}</span>
                    <select 
                      className={`skill-select ${currentLevel ? 'has-value' : ''}`}
                      value={currentLevel}
                      onChange={(e) => handleSkillChange(category, skill, e.target.value)}
                    >
                      <option value="">None</option>
                      {skillLevels.map(level => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        <h4 className="sb-section-title" style={{ padding: '1.5rem 0 0.5rem', borderBottom: '1px solid var(--border)', marginBottom: '1rem' }}>Project Interests & Roles</h4>
        
        <div className="form-group">
          <label className="form-label">Interests Domains (Select multiple)</label>
          <div className="chip-group">
            {interests.map(domain => (
              <div 
                key={domain} 
                className={`chip ${student.interests.includes(domain) ? 'active' : ''}`}
                onClick={() => handleMultiSelect("interests", domain)}
              >
                {domain}
              </div>
            ))}
          </div>
        </div>

        <div className="form-group" style={{ marginTop: '1.5rem' }}>
          <label className="form-label">Preferred Project Roles (Select multiple)</label>
          <div className="role-grid">
            {roles.map(role => (
              <div 
                key={role} 
                className={`role-opt ${student.preferredRoles.includes(role) ? 'selected' : ''}`}
                onClick={() => handleMultiSelect("preferredRoles", role)}
              >
                <input type="checkbox" checked={student.preferredRoles.includes(role)} readOnly />
                <div>
                  <div className="role-lbl">{role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <h4 className="sb-section-title" style={{ padding: '1.5rem 0 0.5rem', borderBottom: '1px solid var(--border)', marginBottom: '1rem' }}>Availability</h4>

        <div className="form-group">
          <label className="form-label">Weekly Hours Available for Projects</label>
          <input type="number" className="form-input" placeholder="e.g. 15" value={student.availability.weeklyHours} onChange={e => setStudent({...student, availability: {...student.availability, weeklyHours: e.target.value}})} style={{ maxWidth: '200px' }} />
        </div>

        <div className="form-group">
          <label className="form-label">Preferred Working Days</label>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {days.map(day => (
              <div 
                key={day}
                className={`edit-day-chip ${student.availability.preferredDays.includes(day) ? 'active' : ''}`}
                onClick={() => handleAvailabilitySelect("preferredDays", day)}
                title={day}
              >
                {day.substring(0, 3)}
              </div>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Preferred Time (Select multiple)</label>
          <div className="chip-group">
            {times.map(time => (
              <div 
                key={time} 
                className={`chip ${student.availability.preferredTime.includes(time) ? 'active' : ''}`}
                onClick={() => handleAvailabilitySelect("preferredTime", time)}
              >
                {time}
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: '3rem', textAlign: 'right' }}>
          <button type="submit" className="btn btn-primary btn-lg" style={{ minWidth: '200px' }}>Save Profile</button>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;
