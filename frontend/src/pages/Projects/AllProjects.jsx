import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './AllProjects.css';

const AllProjects = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');



  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('http://localhost:3000/api/posts');
      if (res.ok) {
        const data = await res.json();

        // Use the persistent projectId from the backend 
        const mappedData = data.map((project) => {
          const displayId = project.projectId || 'P0000';
          return {
            ...project,
            displayId,
            displayTitle: `${displayId} - ${project.title}`
          };
        });

        // Discard user project cards entirely for "All Projects"
        const filteredData = mappedData.filter(project => project.itNumber !== user?.studentId);

        setProjects(filteredData.reverse()); // Newest first
      }
    } catch (error) {
      console.error('Failed to fetch projects', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const filteredProjects = projects.filter(project => {
    if (!searchQuery) return true;
    const lowerQuery = searchQuery.toLowerCase();

    // Check Title
    if (project.displayTitle?.toLowerCase().includes(lowerQuery) || project.title?.toLowerCase().includes(lowerQuery)) return true;

    // Check Specialization
    if (project.specialization?.toLowerCase().includes(lowerQuery)) return true;

    // Check Domain arrays
    if (project.domain?.some(d => d.toLowerCase().includes(lowerQuery))) return true;

    // Check Essential Skills
    let hasSkill = false;
    if (project.essentialSkills) {
      Object.values(project.essentialSkills).forEach(skills => {
        if (skills?.some(s => s.toLowerCase().includes(lowerQuery))) {
          hasSkill = true;
        }
      });
    }
    return hasSkill;
  });

  return (
    <div className="all-projects-container">
      <div className="all-projects-header">
        <h1>All Projects</h1>
        <p>Discover partnership opportunities from other students.</p>

        <div className="all-search-wrapper">
          <svg className="all-search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
          <input
            type="text"
            className="all-search-input"
            placeholder="Search by title, domain, or specific skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="all-loading">Loading projects...</div>
      ) : filteredProjects.length === 0 ? (
        <div className="all-empty">
          <h3>No projects found</h3>
          <p>Try adjusting your search terms</p>
        </div>
      ) : (

        // Project card in grid layout in all-projects page 
        <div className="all-projects-grid">
          {filteredProjects.map((project, i) => (
            <div key={i} className="all-card">
              <h3 className="all-card-title">{project.displayTitle}</h3>

              <div className="all-academic-info" style={{ marginBottom: '16px' }}>
                <div><span>Owner:</span> {project.itNumber || 'Unknown'}</div>
                <div><span>Need More:</span> {project.teamSize || 'N/A'}</div>
                {project.dueDate && (<div><span>Due Date:</span> {new Date(project.dueDate).toLocaleDateString('en-GB')}</div>)}
              </div>

              <div className="all-section">
                <p className="all-section-title">Essential Skills:</p>
                <div className="all-skills-container">
                  {project.essentialSkills && Object.entries(project.essentialSkills).map(
                    ([key, skills], idx) =>
                      (skills || []).map((skill, sidx) => (
                        <span key={`${idx}-${sidx}`} className="all-skill-pill">
                          {skill}
                        </span>
                      ))
                  )}
                </div>
              </div>

              <div className="all-academic-info">
                <div><span>Specialization:</span> {project.specialization || 'Any'}</div>
                <div><span>Year:</span> {project.year || '-'}</div>
                <div><span>Semester:</span> {project.semester || '-'}</div>
              </div>

              <div className="all-section">
                <p className="all-section-title">Domain:</p>
                <div className="all-domain-container">
                  {(project.domain || []).map((d, idx) => (
                    <span key={idx} className="all-domain-pill">
                      {d}
                    </span>
                  ))}
                </div>
              </div>

              <div className="all-card-actions">
                <button className="all-btn-view" onClick={() => navigate('/projects/' + project._id)}>View Project</button>
              </div>
            </div>
          ))}
          {/* end of project card grid layout */}
        </div>
      )}



    </div>
  );
};

export default AllProjects;
