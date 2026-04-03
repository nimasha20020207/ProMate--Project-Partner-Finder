import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import './UpdateProject.css';

const CheckboxGroup = ({ options, selectedValues = [], onChange }) => {
  const handleCheckboxChange = (option) => {
    if (selectedValues.includes(option)) {
      onChange(selectedValues.filter(item => item !== option));
    } else {
      onChange([...selectedValues, option]);
    }
  };

  return (
    <div className="update-checkbox-group">
      {options.map(option => (
        <label key={option} className="update-checkbox-label">
          <input
            type="checkbox"
            checked={selectedValues.includes(option)}
            onChange={() => handleCheckboxChange(option)}
          />
          <span className="update-checkbox-text">{option}</span>
        </label>
      ))}
    </div>
  );
};

const UpdateProject = ({ project, onSave }) => {
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    projectType: '',
    domain: [],
    essentialSkills: { languages: [], frameworks: [], databases: [], libraries: [], tools: [] },
    optionalSkills: { languages: [], frameworks: [], databases: [], libraries: [], tools: [] },
    requiredRoles: [],
    teamSize: '',
    minimumCGPA: '',
    availabilityRequirement: { durationWeeks: '', weeklyHours: '', meetingDays: [] }
  });

  useEffect(() => {
    if (project) {
      setFormData({
        ...project,
        title: project.title || '',
        description: project.description || '',
        projectType: project.projectType || '',
        domain: project.domain || [],
        essentialSkills: { 
          languages: project.essentialSkills?.languages || [], 
          frameworks: project.essentialSkills?.frameworks || [], 
          databases: project.essentialSkills?.databases || [],
          libraries: project.essentialSkills?.libraries || [], 
          tools: project.essentialSkills?.tools || [] 
        },
        optionalSkills: { 
          languages: project.optionalSkills?.languages || [], 
          frameworks: project.optionalSkills?.frameworks || [], 
          databases: project.optionalSkills?.databases || [], 
          libraries: project.optionalSkills?.libraries || [],
          tools: project.optionalSkills?.tools || [] 
        },
        requiredRoles: project.requiredRoles || [],
        teamSize: project.teamSize || '',
        minimumCGPA: project.minimumCGPA || '',
        availabilityRequirement: { 
          durationWeeks: project.availabilityRequirement?.durationWeeks || '', 
          weeklyHours: project.availabilityRequirement?.weeklyHours || '', 
          meetingDays: project.availabilityRequirement?.meetingDays || [] 
        }
      });
    }
  }, [project]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNestedChange = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: { ...prev[parent], [field]: value }
    }));
  };

  const handleSkillChange = (type, category, values) => {
    setFormData(prev => ({
      ...prev,
      [type]: { ...prev[type], [category]: values }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.domain.length === 0) {
      alert('Please select at least one domain.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/posts/${project._id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        onSave({...formData, _id: project._id}); // Pass updated data up immediately
      } else {
        const errorData = await response.json();
        alert(`Failed to update project: ${errorData.msg || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Error updating project:", error);
      alert('An error occurred while updating the project.');
    }
  };

  return (
    <div className="update-project-container">
      <div className="update-project-card">
        <h1 className="update-project-title">Update Project Details</h1>
        <p className="update-project-subtitle">Modify the fields and hit save to update the database.</p>

        <form onSubmit={handleSubmit} className="update-project-form">
          {/* Section: Basic Info */}
          <div className="form-section">
            <h2>Basic Information</h2>

            <div className="form-group">
              <label>Project Title *</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} required placeholder="Enter project title" />
            </div>

            <div className="form-group">
              <label>Description *</label>
              <textarea name="description" value={formData.description} onChange={handleChange} required placeholder="What is this project about? Provide some context and goals." rows="4"></textarea>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Project Type *</label>
                <select name="projectType" value={formData.projectType} onChange={handleChange} required>
                  <option value="" disabled>Select Type</option>
                  <option value="Academic">Academic</option>
                  <option value="Hackathon">Hackathon</option>
                  <option value="Research">Research</option>
                  <option value="Startup/Side Hustle">Startup/Side Hustle</option>
                  <option value="Open Source">Open Source</option>
                </select>
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

          <div className="form-section">
            <h2>Academic Requirements & Constraints (Auto-filled from Profile)</h2>
            <div className="form-row">
              <div className="form-group">
                <label>Team Size Limit *</label>
                <input type="number" name="teamSize" value={formData.teamSize} onChange={handleChange} required min="1" placeholder="e.g. 4" />
              </div>
              <div className="form-group">
                <label>Minimum CGPA (Optional)</label>
                <input type="number" name="minimumCGPA" value={formData.minimumCGPA} onChange={handleChange} step="0.01" min="0" max="4" placeholder="e.g. 3.0" />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Essential Skills (Must Have)</h2>
            <div className="form-group">
              <label>Languages</label>
              <CheckboxGroup 
                options={["JavaScript","TypeScript","Python","Java","C","C++","C#","Go","Rust","Kotlin","Swift","PHP","Ruby","Dart","R","MATLAB"]}
                selectedValues={formData.essentialSkills.languages}
                onChange={(values) => handleSkillChange('essentialSkills', 'languages', values)}
              />
            </div>
            <div className="form-group">
              <label>Frameworks</label>
              <CheckboxGroup 
                options={["React","Angular","Vue.js","Next.js","Nuxt.js","Node.js","Express.js","Django","Flask","Spring Boot","ASP.NET","Laravel","Ruby on Rails","Flutter","React Native"]}
                selectedValues={formData.essentialSkills.frameworks}
                onChange={(values) => handleSkillChange('essentialSkills', 'frameworks', values)}
              />
            </div>
            <div className="form-group">
              <label>Databases</label>
              <CheckboxGroup 
                options={["MongoDB","MySQL","PostgreSQL","SQLite","Oracle","Microsoft SQL Server","Firebase","Redis","Cassandra","DynamoDB","Neo4j"]}
                selectedValues={formData.essentialSkills.databases}
                onChange={(values) => handleSkillChange('essentialSkills', 'databases', values)}
              />
            </div>

            <div className="form-group">
              <label>Libraries</label>
              <CheckboxGroup 
                options={["Redux","Axios","jQuery","Lodash","TensorFlow","Keras","PyTorch","Scikit-learn","Pandas","NumPy","Chart.js","D3.js","Three.js","Socket.io","Bootstrap"]}
                selectedValues={formData.essentialSkills.libraries}
                onChange={(values) => handleSkillChange('essentialSkills', 'libraries', values)}
              />
            </div>

            <div className="form-group">
              <label>Tools</label>
              <CheckboxGroup 
                options={["Git","GitHub","GitLab","Docker","Kubernetes","Postman","Jira","Trello","Figma","Adobe XD","VS Code","IntelliJ IDEA","Eclipse","Webpack","Babel"]}
                selectedValues={formData.essentialSkills.tools}
                onChange={(values) => handleSkillChange('essentialSkills', 'tools', values)}
              />
            </div>
          </div>


          <div className="form-section">
            <h2>Optional Skills (Nice to Have)</h2>
            <div className="form-group">
              <label>Languages</label>
              <CheckboxGroup 
                options={["JavaScript","TypeScript","Python","Java","C","C++","C#","Go","Rust","Kotlin","Swift","PHP","Ruby","Dart","R","MATLAB"]}
                selectedValues={formData.optionalSkills.languages}
                onChange={(values) => handleSkillChange('optionalSkills', 'languages', values)}
              />
            </div>
            <div className="form-group">
              <label>Frameworks</label>
              <CheckboxGroup 
                options={["React","Angular","Vue.js","Next.js","Nuxt.js","Node.js","Express.js","Django","Flask","Spring Boot","ASP.NET","Laravel","Ruby on Rails","Flutter","React Native"]}
                selectedValues={formData.optionalSkills.frameworks}
                onChange={(values) => handleSkillChange('optionalSkills', 'frameworks', values)}
              />
            </div>
            <div className="form-group">
              <label>Databases</label>
              <CheckboxGroup 
                options={["MongoDB","MySQL","PostgreSQL","SQLite","Oracle","Microsoft SQL Server","Firebase","Redis","Cassandra","DynamoDB","Neo4j"]}
                selectedValues={formData.optionalSkills.databases}
                onChange={(values) => handleSkillChange('optionalSkills', 'databases', values)}
              />
            </div>

            <div className="form-group">
              <label>Libraries</label>
              <CheckboxGroup 
                options={["Redux","Axios","jQuery","Lodash","TensorFlow","Keras","PyTorch","Scikit-learn","Pandas","NumPy","Chart.js","D3.js","Three.js","Socket.io","Bootstrap"]}
                selectedValues={formData.optionalSkills.libraries}
                onChange={(values) => handleSkillChange('optionalSkills', 'libraries', values)}
              />
            </div>

            <div className="form-group">
              <label>Tools</label>
              <CheckboxGroup 
                options={["Git","GitHub","GitLab","Docker","Kubernetes","Postman","Jira","Trello","Figma","Adobe XD","VS Code","IntelliJ IDEA","Eclipse","Webpack","Babel"]}
                selectedValues={formData.optionalSkills.tools}
                onChange={(values) => handleSkillChange('optionalSkills', 'tools', values)}
              />
            </div>
          </div>


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
                <input type="number" value={formData.availabilityRequirement.weeklyHours} onChange={(e) => handleNestedChange('availabilityRequirement', 'weeklyHours', e.target.value)} required min="1" placeholder="e.g. 10" />
              </div>
              <div className="form-group">
                <label>Duration (Weeks) *</label>
                <input type="number" value={formData.availabilityRequirement.durationWeeks} onChange={(e) => handleNestedChange('availabilityRequirement', 'durationWeeks', e.target.value)} required min="1" placeholder="e.g. 12" />
              </div>
            </div>

            <div className="form-group">
              <label>Preferred Meeting Days</label>
              <CheckboxGroup 
                options={['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']}
                selectedValues={formData.availabilityRequirement.meetingDays}
                onChange={(values) => handleNestedChange('availabilityRequirement', 'meetingDays', values)}
              />
            </div>
          </div>

          <div className="update-project-actions">
            <button type="submit" className="btn-save">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProject;
