import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './InsertProject.css';

const CheckboxGroup = ({ options, selectedValues, onChange }) => (
  <div className="checkbox-group-ip">
    {options.map((option) => (
      <label key={option} className="checkbox-label-ip">
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
  const { token } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    teamSize: '',
    projectType: '',
    minimumCGPA: '',
    essentialSkills: { languages: [], frameworks: [], libraries: [], databases: [], tools: [] },
    optionalSkills: { languages: [], frameworks: [], libraries: [], databases: [], tools: [] },
    requiredRoles: [],
    availabilityRequirement: { weeklyHours: '', meetingDays: [], durationWeeks: '' },
    domain: [],
    dueDate: ''
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
        if (!strVal) {
          errorMsg = 'Project title cannot be empty.';
        } else if (/^\d+$/.test(strVal)) {
          errorMsg = 'Project title cannot be only numbers.';
        } else if (/^\d/.test(strVal)) {
          errorMsg = 'Project title cannot start with a number.';
        }
        break;
      case 'description':
        if (!strVal) {
          errorMsg = 'Description cannot be empty.';
        } else if (/^\d+$/.test(strVal)) {
          errorMsg = 'Description cannot be only numbers.';
        }
        break;
      case 'teamSize':
        if (!strVal || parseInt(strVal) < 1) errorMsg = 'Team size must be at least 1.';
        break;
      case 'projectType':
        if (!strVal) errorMsg = 'Project type is required.';
        break;
      case 'dueDate':
        if (!strVal) {
          errorMsg = 'Due date is required.';
        } else {
          const selectedDate = new Date(strVal);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          if (selectedDate <= today) {
            errorMsg = 'Due date must be a future date.';
          }
        }
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
        if (strVal !== '' && (parseFloat(strVal) < 0 || parseFloat(strVal) > 4.0)) errorMsg = 'CGPA must be between 0.0 and 4.0.';
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
    setFormData((prev) => {
      const updatedData = {
        ...prev,
        [type]: { ...prev[type], [category]: newValues }
      };
      
      if (type === 'essentialSkills' && touched.essentialSkills) {
        const hasEssentialSkills = Object.values(updatedData.essentialSkills).some(arr => arr && arr.length > 0);
        setErrors(e => ({
          ...e,
          essentialSkills: hasEssentialSkills ? '' : "Essential Skills can't be empty."
        }));
      }

      return updatedData;
    });
  };

  const validateAll = () => {
    const newErrors = {};
    const textFields = ['title', 'description', 'teamSize', 'projectType', 'minimumCGPA', 'dueDate'];

    textFields.forEach(field => {
      const err = validateField(field, formData[field]);
      if (err) newErrors[field] = err;
    });

    const nestedFields = ['weeklyHours', 'durationWeeks'];
    nestedFields.forEach(field => {
      const err = validateField(field, formData.availabilityRequirement[field]);
      if (err) newErrors[field] = err;
    });

    const hasEssentialSkills = Object.values(formData.essentialSkills).some(arr => arr && arr.length > 0);
    if (!hasEssentialSkills) {
      newErrors.essentialSkills = "Essential Skills can't be empty.";
    }

    setErrors(newErrors);

    const allTouched = {};
    [...textFields, ...nestedFields, 'essentialSkills'].forEach(f => allTouched[f] = true);
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

    try {
      const response = await fetch('http://localhost:3000/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        if (onSuccess) {
          onSuccess();
        } else {
          alert('Project created successfully!');
          navigate('/your-projects');
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

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="insert-project-container-ip">
      <div className="insert-project-card-ip">
        <h1 className="insert-project-title-ip">Create New Project</h1>
        <p className="insert-project-subtitle-ip">Post a new project outline to find the perfect team members.</p>

        <form onSubmit={handleSubmit} className="insert-project-form-ip" noValidate>
          {/* Section: Basic Info */}
          <div className="form-section-ip">
            <h2>Basic Information</h2>

            <div className="form-group-ip">
              <label>Project Title *</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} onBlur={handleBlur} className={touched.title && errors.title ? 'input-error-ip' : ''} placeholder="Enter project title" />
              {touched.title && errors.title && <span className="error-message-ip">{errors.title}</span>}
            </div>

            <div className="form-group-ip">
              <label>Description *</label>
              <textarea name="description" value={formData.description} onChange={handleChange} onBlur={handleBlur} className={touched.description && errors.description ? 'input-error-ip' : ''} placeholder="What is this project about? Provide some context and goals."></textarea>
              {touched.description && errors.description && <span className="error-message-ip">{errors.description}</span>}
            </div>

            <div className="form-row-ip">
              <div className="form-group-ip">
                <label>Team Size *</label>
                <input type="number" name="teamSize" value={formData.teamSize} onChange={handleChange} onBlur={handleBlur} className={touched.teamSize && errors.teamSize ? 'input-error-ip' : ''} min="1" placeholder="e.g. 4" />
                {touched.teamSize && errors.teamSize && <span className="error-message-ip">{errors.teamSize}</span>}
              </div>
              <div className="form-group-ip">
                <label>Project Type *</label>
                <select name="projectType" value={formData.projectType} onChange={handleChange} onBlur={handleBlur} className={touched.projectType && errors.projectType ? 'input-error-ip' : ''}>
                  <option value="">Select Type</option>
                  <option value="Research">Research</option>
                  <option value="Development">Development</option>
                  <option value="Final Year Project">Final Year Project</option>
                  <option value="Hackathon">Hackathon</option>
                  <option value="Open Source">Open Source</option>
                </select>
                {touched.projectType && errors.projectType && <span className="error-message-ip">{errors.projectType}</span>}
              </div>
            </div>

            <div className="form-group-ip">
              <label>Due Date *</label>
              <input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} onBlur={handleBlur} min={todayStr} className={touched.dueDate && errors.dueDate ? 'input-error-ip' : ''} />
              {touched.dueDate && errors.dueDate && <span className="error-message-ip">{errors.dueDate}</span>}
            </div>

            <div className="form-group-ip">
              <label>Domain *</label>
              <CheckboxGroup
                options={["Web Development", "Mobile Development", "AI / ML", "Data Science", "Cybersecurity", "Cloud Computing", "Game Development", "IoT", "Blockchain", "DevOps"]}
                selectedValues={formData.domain}
                onChange={(values) => setFormData(prev => ({ ...prev, domain: values }))}
              />
            </div>
          </div>

          {/* Section: Academic Constraints */}
          <div className="form-section-ip">
            <h2>Academic Details (Auto-filled from Profile)</h2>
            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>Your IT Number, Specialization, Year, and Semester are automatically linked to this project.</p>
            <div className="form-row-ip">
              <div className="form-group-ip">
                <label>Minimum CGPA Requirement (Optional)</label>
                <input type="number" step="0.01" name="minimumCGPA" value={formData.minimumCGPA} onChange={handleChange} onBlur={handleBlur} className={touched.minimumCGPA && errors.minimumCGPA ? 'input-error-ip' : ''} placeholder="e.g. 3.0" />
                {touched.minimumCGPA && errors.minimumCGPA && <span className="error-message-ip">{errors.minimumCGPA}</span>}
              </div>
            </div>
          </div>

          {/* Section: Essential Skills */}
          <div className="form-section-ip">
            <h2>Essential Skills (Must Have)</h2>
            {touched.essentialSkills && errors.essentialSkills && (
              <span className="error-message-ip" style={{ display: 'block', marginBottom: '15px' }}>
                {errors.essentialSkills}
              </span>
            )}
            <div className="form-group-ip">
              <label>Languages *</label>
              <CheckboxGroup
                options={["JavaScript", "TypeScript", "Python", "Java", "C", "C++", "C#", "Go", "Rust", "Kotlin", "Swift", "PHP", "Ruby", "Dart", "R", "MATLAB"]}
                selectedValues={formData.essentialSkills.languages}
                onChange={(values) => handleSkillChange('essentialSkills', 'languages', values)}
              />
            </div>
            <div className="form-group-ip">
              <label>Frameworks *</label>
              <CheckboxGroup
                options={["React", "Angular", "Vue.js", "Next.js", "Nuxt.js", "Node.js", "Express.js", "Django", "Flask", "Spring Boot", "ASP.NET", "Laravel", "Ruby on Rails", "Flutter", "React Native"]}
                selectedValues={formData.essentialSkills.frameworks}
                onChange={(values) => handleSkillChange('essentialSkills', 'frameworks', values)}
              />
            </div>
            <div className="form-group-ip">
              <label>Databases *</label>
              <CheckboxGroup
                options={["MongoDB", "MySQL", "PostgreSQL", "SQLite", "Oracle", "Microsoft SQL Server", "Firebase", "Redis", "Cassandra", "DynamoDB", "Neo4j"]}
                selectedValues={formData.essentialSkills.databases}
                onChange={(values) => handleSkillChange('essentialSkills', 'databases', values)}
              />
            </div>

            <div className="form-group-ip">
              <label>Libraries *</label>
              <CheckboxGroup
                options={["Redux", "Axios", "jQuery", "Lodash", "TensorFlow", "Keras", "PyTorch", "Scikit-learn", "Pandas", "NumPy", "Chart.js", "D3.js", "Three.js", "Socket.io", "Bootstrap"]}
                selectedValues={formData.essentialSkills.libraries}
                onChange={(values) => handleSkillChange('essentialSkills', 'libraries', values)}
              />
            </div>

            <div className="form-group-ip">
              <label>Tools *</label>
              <CheckboxGroup
                options={["Git", "GitHub", "GitLab", "Docker", "Kubernetes", "Postman", "Jira", "Trello", "Figma", "Adobe XD", "VS Code", "IntelliJ IDEA", "Eclipse", "Webpack", "Babel"]}
                selectedValues={formData.essentialSkills.tools}
                onChange={(values) => handleSkillChange('essentialSkills', 'tools', values)}
              />
            </div>
          </div>

          {/* Section: Optional Skills */}
          <div className="form-section-ip">
            <h2>Optional Skills (Nice to Have)</h2>
            <div className="form-group-ip">
              <label>Languages</label>
              <CheckboxGroup
                options={["JavaScript", "TypeScript", "Python", "Java", "C", "C++", "C#", "Go", "Rust", "Kotlin", "Swift", "PHP", "Ruby", "Dart", "R", "MATLAB"]}
                selectedValues={formData.optionalSkills.languages}
                onChange={(values) => handleSkillChange('optionalSkills', 'languages', values)}
              />
            </div>
            <div className="form-group-ip">
              <label>Frameworks</label>
              <CheckboxGroup
                options={["React", "Angular", "Vue.js", "Next.js", "Nuxt.js", "Node.js", "Express.js", "Django", "Flask", "Spring Boot", "ASP.NET", "Laravel", "Ruby on Rails", "Flutter", "React Native"]}
                selectedValues={formData.optionalSkills.frameworks}
                onChange={(values) => handleSkillChange('optionalSkills', 'frameworks', values)}
              />
            </div>
            <div className="form-group-ip">
              <label>Databases</label>
              <CheckboxGroup
                options={["MongoDB", "MySQL", "PostgreSQL", "SQLite", "Oracle", "Microsoft SQL Server", "Firebase", "Redis", "Cassandra", "DynamoDB", "Neo4j"]}
                selectedValues={formData.optionalSkills.databases}
                onChange={(values) => handleSkillChange('optionalSkills', 'databases', values)}
              />
            </div>

            <div className="form-group-ip">
              <label>Libraries </label>
              <CheckboxGroup
                options={["Redux", "Axios", "jQuery", "Lodash", "TensorFlow", "Keras", "PyTorch", "Scikit-learn", "Pandas", "NumPy", "Chart.js", "D3.js", "Three.js", "Socket.io", "Bootstrap"]}
                selectedValues={formData.optionalSkills.libraries}
                onChange={(values) => handleSkillChange('optionalSkills', 'libraries', values)}
              />
            </div>

            <div className="form-group-ip">
              <label>Tools </label>
              <CheckboxGroup
                options={["Git", "GitHub", "GitLab", "Docker", "Kubernetes", "Postman", "Jira", "Trello", "Figma", "Adobe XD", "VS Code", "IntelliJ IDEA", "Eclipse", "Webpack", "Babel"]}
                selectedValues={formData.optionalSkills.tools}
                onChange={(values) => handleSkillChange('optionalSkills', 'tools', values)}
              />
            </div>
          </div>

          {/* Section: Roles & Availability */}
          <div className="form-section-ip">
            <h2>Roles & Availability</h2>
            <div className="form-group-ip">
              <label>Required Roles *</label>
              <CheckboxGroup
                options={["Frontend Developer", "Backend Developer", "Fullstack Developer", "Mobile App Developer", "ML Engineer", "Data Scientist", "UI/UX Designer", "DevOps Engineer", "QA Engineer", "Project Manager"]}
                selectedValues={formData.requiredRoles}
                onChange={(values) => setFormData(prev => ({ ...prev, requiredRoles: values }))}
              />
            </div>

            <div className="form-row-ip">
              <div className="form-group-ip">
                <label>Weekly Hours Required *</label>
                <input type="number" name="weeklyHours" value={formData.availabilityRequirement.weeklyHours} onChange={(e) => handleNestedChange('availabilityRequirement', 'weeklyHours', e.target.value)} onBlur={() => handleNestedBlur('availabilityRequirement', 'weeklyHours')} className={touched.weeklyHours && errors.weeklyHours ? 'input-error-ip' : ''} min="1" placeholder="e.g. 10" />
                {touched.weeklyHours && errors.weeklyHours && <span className="error-message-ip">{errors.weeklyHours}</span>}
              </div>
              <div className="form-group-ip">
                <label>Duration (Weeks) *</label>
                <input type="number" name="durationWeeks" value={formData.availabilityRequirement.durationWeeks} onChange={(e) => handleNestedChange('availabilityRequirement', 'durationWeeks', e.target.value)} onBlur={() => handleNestedBlur('availabilityRequirement', 'durationWeeks')} className={touched.durationWeeks && errors.durationWeeks ? 'input-error-ip' : ''} min="1" placeholder="e.g. 12" />
                {touched.durationWeeks && errors.durationWeeks && <span className="error-message-ip">{errors.durationWeeks}</span>}
              </div>
            </div>

            <div className="form-group-ip">
              <label>Preferred Meeting Days *</label>
              <CheckboxGroup
                options={['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']}
                selectedValues={formData.availabilityRequirement.meetingDays}
                onChange={(values) => handleNestedChange('availabilityRequirement', 'meetingDays', values)}
              />
            </div>
          </div>

          <div className="form-actions-ip">
            <button type="submit" className="submit-btn-ip">Create Project</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InsertProject;