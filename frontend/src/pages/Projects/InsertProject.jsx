import React, { useState } from 'react';
import './InsertProject.css';

const CheckboxGroup = ({ options, selectedValues, onChange }) => (
  <div className="checkbox-group">
    {options.map((option) => (
      <label key={option} className="checkbox-label">
        <input
          type="checkbox"
          value={option}
          checked={selectedValues.includes(option)}
          onChange={(e) => {
            const isChecked = e.target.checked;
            const newValues = isChecked
              ? [...selectedValues, option]
              : selectedValues.filter((v) => v !== option);
            onChange(newValues);
          }}
        />
        {option}
      </label>
    ))}
  </div>
);

const InsertProject = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    itNumber: '',
    title: '',
    description: '',
    teamSize: '',
    projectType: '',
    specialization: '',
    year: '',
    semester: '',
    minimumCGPA: '',
    essentialSkills: { languages: [], frameworks: [], libraries: [], databases: [], tools: [] },
    optionalSkills: { languages: [], frameworks: [], libraries: [], databases: [], tools: [] },
    requiredRoles: [],
    availabilityRequirement: { weeklyHours: '', meetingDays: [], durationWeeks: '' },
    domain: []
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = (name, value) => {
    let errorMsg = '';
    const strVal = value !== null && value !== undefined ? String(value).trim() : '';

    switch (name) {
      case 'itNumber':
        if (!strVal) errorMsg = 'IT Number is required.';
        else if (!/^IT\d{8}$/i.test(strVal)) errorMsg = 'IT Number must be exactly 10 characters starting with "IT".';
        break;
      case 'title':
        if (!strVal) errorMsg = 'Project title cannot be empty.';
        break;
      case 'description':
        if (!strVal) errorMsg = 'Description cannot be empty.';
        break;
      case 'teamSize':
        if (!strVal || parseInt(strVal) < 1) errorMsg = 'Team size must be at least 1.';
        break;
      case 'projectType':
        if (!strVal) errorMsg = 'Project type is required.';
        break;
      case 'specialization':
        if (!strVal) errorMsg = 'Specialization is required.';
        break;
      case 'year':
        if (!strVal || parseInt(strVal) < 1 || parseInt(strVal) > 4) errorMsg = 'Year must be between 1 and 4.';
        break;
      case 'semester':
        if (!strVal || parseInt(strVal) < 1 || parseInt(strVal) > 2) errorMsg = 'Semester must be 1 or 2.';
        break;
      case 'minimumCGPA':
        if (strVal === '' || parseFloat(strVal) < 0 || parseFloat(strVal) > 4.0) errorMsg = 'CGPA must be between 0.0 and 4.0.';
        break;
      case 'weeklyHours':
        if (!strVal || parseInt(strVal) < 1) errorMsg = 'Weekly hours must be at least 1.';
        break;
      case 'durationWeeks':
        if (!strVal || parseInt(strVal) < 1) errorMsg = 'Duration must be at least 1 week.';
        break;
      default:
        break;
    }
    return errorMsg;
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const errorMsg = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const handleNestedChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value }
    }));
    if (touched[field]) {
      setErrors((prev) => ({ ...prev, [field]: validateField(field, value) }));
    }
  };

  const handleNestedBlur = (section, field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const errorMsg = validateField(field, formData[section][field]);
    setErrors((prev) => ({ ...prev, [field]: errorMsg }));
  };

  const handleSkillChange = (type, category, newValues) => {
    setFormData((prev) => ({
      ...prev,
      [type]: { ...prev[type], [category]: newValues }
    }));
  };

  const validateAll = () => {
    const newErrors = {};
    const textFields = ['itNumber', 'title', 'description', 'teamSize', 'projectType', 'specialization', 'year', 'semester', 'minimumCGPA'];

    textFields.forEach(field => {
      const err = validateField(field, formData[field]);
      if (err) newErrors[field] = err;
    });

    const nestedFields = ['weeklyHours', 'durationWeeks'];
    nestedFields.forEach(field => {
      const err = validateField(field, formData.availabilityRequirement[field]);
      if (err) newErrors[field] = err;
    });

    setErrors(newErrors);

    const allTouched = {};
    [...textFields, ...nestedFields].forEach(f => allTouched[f] = true);
    setTouched(allTouched);

    if (formData.domain.length === 0) {
      alert('Please select at least one domain.');
      return false;
    }
    if (formData.requiredRoles.length === 0) {
      alert('Please select at least one required role.');
      return false;
    }
    if (formData.availabilityRequirement.meetingDays.length === 0) {
      alert('Please select at least one meeting day.');
      return false;
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateAll()) {
      return;
    }

    const itn = formData.itNumber.trim().toUpperCase();

    try {
      const response = await fetch('http://localhost:3000/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...formData, itNumber: itn })
      });

      if (response.ok) {
        if (onSuccess) {
          onSuccess();
        } else {
          alert('Project created successfully!');
        }
      } else {
        const errorData = await response.json();
        alert(`Failed to create project: ${errorData.msg || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error creating project:', error);
      alert('An error occurred while creating the project. Please check the console.');
    }
  };

  return (
    <div className="insert-project-container">
      <div className="insert-project-card">
        <h1 className="insert-project-title">Create New Project</h1>
        <p className="insert-project-subtitle">Post a new project outline to find the perfect team members.</p>

        <form onSubmit={handleSubmit} className="insert-project-form" noValidate>
          {/* Section: Basic Info */}
          <div className="form-section">
            <h2>Basic Information</h2>
            <div className="form-group">
              <label>IT Number *</label>
              <input type="text" name="itNumber" value={formData.itNumber} onChange={handleChange} onBlur={handleBlur} className={touched.itNumber && errors.itNumber ? 'input-error' : ''} placeholder="e.g. IT23272736" maxLength="10" />
              {touched.itNumber && errors.itNumber && <span className="error-message">{errors.itNumber}</span>}
            </div>

            <div className="form-group">
              <label>Project Title *</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} onBlur={handleBlur} className={touched.title && errors.title ? 'input-error' : ''} placeholder="Enter project title" />
              {touched.title && errors.title && <span className="error-message">{errors.title}</span>}
            </div>

            <div className="form-group">
              <label>Description *</label>
              <textarea name="description" value={formData.description} onChange={handleChange} onBlur={handleBlur} className={touched.description && errors.description ? 'input-error' : ''} placeholder="What is this project about? Provide some context and goals."></textarea>
              {touched.description && errors.description && <span className="error-message">{errors.description}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Team Size *</label>
                <input type="number" name="teamSize" value={formData.teamSize} onChange={handleChange} onBlur={handleBlur} className={touched.teamSize && errors.teamSize ? 'input-error' : ''} min="1" placeholder="e.g. 4" />
                {touched.teamSize && errors.teamSize && <span className="error-message">{errors.teamSize}</span>}
              </div>
              <div className="form-group">
                <label>Project Type *</label>
                <select name="projectType" value={formData.projectType} onChange={handleChange} onBlur={handleBlur} className={touched.projectType && errors.projectType ? 'input-error' : ''}>
                  <option value="">Select Type</option>
                  <option value="Research">Research</option>
                  <option value="Development">Development</option>
                  <option value="Final Year Project">Final Year Project</option>
                  <option value="Hackathon">Hackathon</option>
                  <option value="Open Source">Open Source</option>
                </select>
                {touched.projectType && errors.projectType && <span className="error-message">{errors.projectType}</span>}
              </div>
            </div>

            <div className="form-group">
              <label>Domain *</label>
              <CheckboxGroup
                options={['AI/ML', 'Web Development', 'Mobile Apps', 'Cybersecurity', 'Data Science', 'IoT', 'Blockchain', 'Game Dev']}
                selectedValues={formData.domain}
                onChange={(values) => setFormData(prev => ({ ...prev, domain: values }))}
              />
            </div>
          </div>

          {/* Section: Academic Constraints */}
          <div className="form-section">
            <h2>Academic Details</h2>
            <div className="form-row">
              <div className="form-group">
                <label>Specialization *</label>
                <select name="specialization" value={formData.specialization} onChange={handleChange} onBlur={handleBlur} className={touched.specialization && errors.specialization ? 'input-error' : ''}>
                  <option value="">Select Specialization</option>
                  <option value="SE">Software Engineering (SE)</option>
                  <option value="CS">Computer Science (CS)</option>
                  <option value="IT">Information Technology (IT)</option>
                  <option value="DS">Data Science (DS)</option>
                  <option value="IS">Information Systems (IS)</option>
                  <option value="Any">Any</option>
                </select>
                {touched.specialization && errors.specialization && <span className="error-message">{errors.specialization}</span>}
              </div>
              <div className="form-group">
                <label>Year *</label>
                <input type="number" name="year" value={formData.year} onChange={handleChange} onBlur={handleBlur} className={touched.year && errors.year ? 'input-error' : ''} min="1" max="4" placeholder="e.g. 3" />
                {touched.year && errors.year && <span className="error-message">{errors.year}</span>}
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Semester *</label>
                <input type="number" name="semester" value={formData.semester} onChange={handleChange} onBlur={handleBlur} className={touched.semester && errors.semester ? 'input-error' : ''} min="1" max="2" placeholder="e.g. 1" />
                {touched.semester && errors.semester && <span className="error-message">{errors.semester}</span>}
              </div>
              <div className="form-group">
                <label>Minimum CGPA *</label>
                <input type="number" step="0.01" name="minimumCGPA" value={formData.minimumCGPA} onChange={handleChange} onBlur={handleBlur} className={touched.minimumCGPA && errors.minimumCGPA ? 'input-error' : ''} placeholder="e.g. 3.0" />
                {touched.minimumCGPA && errors.minimumCGPA && <span className="error-message">{errors.minimumCGPA}</span>}
              </div>
            </div>
          </div>

          {/* Section: Essential Skills */}
          <div className="form-section">
            <h2>Essential Skills (Must Have)</h2>
            <div className="form-group">
              <label>Languages *</label>
              <CheckboxGroup
                options={['JavaScript', 'Python', 'Java', 'C++', 'C#', 'Ruby', 'Go', 'Rust']}
                selectedValues={formData.essentialSkills.languages}
                onChange={(values) => handleSkillChange('essentialSkills', 'languages', values)}
              />
            </div>
            <div className="form-group">
              <label>Frameworks *</label>
              <CheckboxGroup
                options={['React', 'Node.js', 'Django', 'Spring Boot', 'Angular', 'Vue', 'Express']}
                selectedValues={formData.essentialSkills.frameworks}
                onChange={(values) => handleSkillChange('essentialSkills', 'frameworks', values)}
              />
            </div>
            <div className="form-group">
              <label>Databases *</label>
              <CheckboxGroup
                options={['MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Firebase', 'Oracle', 'SQLite']}
                selectedValues={formData.essentialSkills.databases}
                onChange={(values) => handleSkillChange('essentialSkills', 'databases', values)}
              />
            </div>
            <div className="form-group">
              <label>Tools & Libraries *</label>
              <CheckboxGroup
                options={['Git', 'Docker', 'Kubernetes', 'AWS', 'Figma', 'TensorFlow', 'Pandas', 'Redux']}
                selectedValues={formData.essentialSkills.tools}
                onChange={(values) => handleSkillChange('essentialSkills', 'tools', values)}
              />
            </div>
          </div>

          {/* Section: Optional Skills */}
          <div className="form-section">
            <h2>Optional Skills (Nice to Have)</h2>
            <div className="form-group">
              <label>Languages</label>
              <CheckboxGroup
                options={['JavaScript', 'Python', 'Java', 'C++', 'C#', 'Ruby', 'Go', 'Rust']}
                selectedValues={formData.optionalSkills.languages}
                onChange={(values) => handleSkillChange('optionalSkills', 'languages', values)}
              />
            </div>
            <div className="form-group">
              <label>Frameworks</label>
              <CheckboxGroup
                options={['React', 'Node.js', 'Django', 'Spring Boot', 'Angular', 'Vue', 'Express']}
                selectedValues={formData.optionalSkills.frameworks}
                onChange={(values) => handleSkillChange('optionalSkills', 'frameworks', values)}
              />
            </div>
            <div className="form-group">
              <label>Databases</label>
              <CheckboxGroup
                options={['MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Firebase', 'Oracle', 'SQLite']}
                selectedValues={formData.optionalSkills.databases}
                onChange={(values) => handleSkillChange('optionalSkills', 'databases', values)}
              />
            </div>
            <div className="form-group">
              <label>Tools & Libraries</label>
              <CheckboxGroup
                options={['Git', 'Docker', 'Kubernetes', 'AWS', 'Figma', 'TensorFlow', 'Pandas', 'Redux']}
                selectedValues={formData.optionalSkills.tools}
                onChange={(values) => handleSkillChange('optionalSkills', 'tools', values)}
              />
            </div>
          </div>

          {/* Section: Roles & Availability */}
          <div className="form-section">
            <h2>Roles & Availability</h2>
            <div className="form-group">
              <label>Required Roles *</label>
              <CheckboxGroup
                options={['Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'UI/UX Designer', 'QA Engineer', 'Data Scientist', 'DevOps Engineer', 'Product Manager']}
                selectedValues={formData.requiredRoles}
                onChange={(values) => setFormData(prev => ({ ...prev, requiredRoles: values }))}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Weekly Hours Required *</label>
                <input type="number" name="weeklyHours" value={formData.availabilityRequirement.weeklyHours} onChange={(e) => handleNestedChange('availabilityRequirement', 'weeklyHours', e.target.value)} onBlur={() => handleNestedBlur('availabilityRequirement', 'weeklyHours')} className={touched.weeklyHours && errors.weeklyHours ? 'input-error' : ''} min="1" placeholder="e.g. 10" />
                {touched.weeklyHours && errors.weeklyHours && <span className="error-message">{errors.weeklyHours}</span>}
              </div>
              <div className="form-group">
                <label>Duration (Weeks) *</label>
                <input type="number" name="durationWeeks" value={formData.availabilityRequirement.durationWeeks} onChange={(e) => handleNestedChange('availabilityRequirement', 'durationWeeks', e.target.value)} onBlur={() => handleNestedBlur('availabilityRequirement', 'durationWeeks')} className={touched.durationWeeks && errors.durationWeeks ? 'input-error' : ''} min="1" placeholder="e.g. 12" />
                {touched.durationWeeks && errors.durationWeeks && <span className="error-message">{errors.durationWeeks}</span>}
              </div>
            </div>

            <div className="form-group">
              <label>Preferred Meeting Days *</label>
              <CheckboxGroup
                options={['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']}
                selectedValues={formData.availabilityRequirement.meetingDays}
                onChange={(values) => handleNestedChange('availabilityRequirement', 'meetingDays', values)}
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-btn">Create Project</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InsertProject;