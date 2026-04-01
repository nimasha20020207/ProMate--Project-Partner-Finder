import React, { useState, useEffect } from 'react';
import Modal from '../../components/Modal';
import './AllProjects.css';

const AllProjects = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewingProject, setViewingProject] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleJoin = async (project) => {
    const payload = {
      senderIt: 'IT23272736',
      targetIt: project.itNumber || 'Unknown',
      message: `Requested to join ${project.displayTitle} project`,
      type: 'join_request'
    };

    try {
      const res = await fetch('http://localhost:3000/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        alert('Join Request Sent to the Notifications Page!');
        setViewingProject(null); // auto close modal explicitly
      } else {
        alert('Failed to send request');
      }
    } catch (err) {
      console.error(err);
      alert('Network error');
    }
  };

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

        // Discard IT23272736 project cards entirely for "All Projects"
        const filteredData = mappedData.filter(project => project.itNumber !== 'IT23272736');
        
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
        <div className="all-projects-grid">
          {filteredProjects.map((project, i) => (
            <div key={i} className="all-card">
              <h3 className="all-card-title">{project.displayTitle}</h3>

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
                <button className="all-btn-view" onClick={() => setViewingProject(project)}>View Project</button>

              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={!!viewingProject} onClose={() => setViewingProject(null)} title={viewingProject?.displayTitle || "Details"}>
        {viewingProject && (
          <div className="all-project-details-view relative">
            <div className="all-details-body">
              <div className="all-details-meta">
                <span className="all-details-badge">{viewingProject.projectType || 'Project'}</span>
                {viewingProject.teamSize && (
                  <span className="all-details-badge all-badge-team">Team of {viewingProject.teamSize}</span>
                )}
                {viewingProject.itNumber && (
                  <span className="all-details-badge" style={{ backgroundColor: '#f8fafc', color: '#475569', border: '1px solid #e2e8f0' }}>
                    IT NO: {viewingProject.itNumber}
                  </span>
                )}
              </div>

              <h3 className="all-section-title-mod">Project Description</h3>
              <p className="all-details-desc">{viewingProject.description || 'No description provided.'}</p>

              <div className="all-details-grid">
                <div className="all-details-section">
                  <h4>Target Domain</h4>
                  <div className="all-details-tags">
                    {viewingProject.domain?.length > 0 ? viewingProject.domain.map((d, i) => (
                      <span key={i} className="all-skill-tag all-domain-tag-mod">{d}</span>
                    )) : <span className="all-empty-text">Not specified</span>}
                  </div>
                </div>
                <div className="all-details-section">
                  <h4>Academic Constraints</h4>
                  <ul className="all-stats-list">
                    <li><span>Specialization:</span> <strong>{viewingProject.specialization || 'Any'}</strong></li>
                    <li><span>Year/Sem:</span> <strong>{viewingProject.year || '-'} / {viewingProject.semester || '-'}</strong></li>
                    <li><span>Min CGPA:</span> <strong>{viewingProject.minimumCGPA || 'None'}</strong></li>
                  </ul>
                </div>
              </div>

              <div className="all-skills-grid">
                <div className="all-details-section all-box-essential">
                  <h4>Must Have Skills</h4>
                  {['languages', 'frameworks', 'databases', 'tools'].map(cat => (
                    viewingProject.essentialSkills?.[cat]?.length > 0 && (
                      <div key={cat} className="all-skill-category">
                        <h5>{cat}</h5>
                        <div className="all-details-tags">
                          {viewingProject.essentialSkills[cat].map((skill, i) => (
                            <span key={i} className="all-skill-tag all-essential-skill">{skill}</span>
                          ))}
                        </div>
                      </div>
                    )
                  ))}
                  {!['languages', 'frameworks', 'databases', 'tools'].some(cat => viewingProject.essentialSkills?.[cat]?.length > 0) && (
                    <span className="all-empty-text">No essential skills specified.</span>
                  )}
                </div>

                <div className="all-details-section all-box-optional">
                  <h4>Nice to Have</h4>
                  {['languages', 'frameworks', 'databases', 'tools'].map(cat => (
                    viewingProject.optionalSkills?.[cat]?.length > 0 && (
                      <div key={cat} className="all-skill-category">
                        <h5>{cat}</h5>
                        <div className="all-details-tags">
                          {viewingProject.optionalSkills[cat].map((skill, i) => (
                            <span key={i} className="all-skill-tag all-optional-skill">{skill}</span>
                          ))}
                        </div>
                      </div>
                    )
                  ))}
                  {!['languages', 'frameworks', 'databases', 'tools'].some(cat => viewingProject.optionalSkills?.[cat]?.length > 0) && (
                    <span className="all-empty-text">No optional skills specified.</span>
                  )}
                </div>
              </div>

              <div className="all-details-section all-box-roles">
                <h4>Engagement & Expected Roles</h4>
                <div className="all-details-grid">
                  <div>
                    <h5>Required Roles:</h5>
                    <div className="all-details-tags">
                      {viewingProject.requiredRoles?.length > 0 ? viewingProject.requiredRoles.map((role, i) => (
                        <span key={i} className="all-skill-tag all-role-tag">{role}</span>
                      )) : <span className="all-empty-text">Not specified</span>}
                    </div>
                  </div>
                  <div>
                    <h5>Commitment:</h5>
                    <ul className="all-stats-list">
                      <li><span>Weekly Hours:</span> <strong>{viewingProject.availabilityRequirement?.weeklyHours ? `${viewingProject.availabilityRequirement.weeklyHours} hrs` : '-'}</strong></li>
                      <li><span>Duration:</span> <strong>{viewingProject.availabilityRequirement?.durationWeeks ? `${viewingProject.availabilityRequirement.durationWeeks} weeks` : '-'}</strong></li>
                      <li style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                        <span style={{ marginBottom: 4 }}>Meeting Days:</span>
                        <strong>{viewingProject.availabilityRequirement?.meetingDays?.join(', ') || 'Flexible'}</strong>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="all-details-footer">
              <button className="all-btn-join" onClick={() => handleJoin(viewingProject)}>Join Project</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AllProjects;
