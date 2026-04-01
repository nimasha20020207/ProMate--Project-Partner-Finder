import React, { useState, useEffect } from 'react';
import ProjectCard from '../../components/ProjectCard';
import Modal from '../../components/Modal';
import InsertProject from './InsertProject';
import UpdateProject from './UpdateProject';
import './YourProjects.css';

const YourProjects = () => {
  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [viewingProject, setViewingProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('http://localhost:3000/api/posts');
      if (res.ok) {
        const data = await res.json();
        
        // Retain chronological sorting logic reading natively mapped IDs from database
        const mappedData = data.map((project) => {
          const displayId = project.projectId || 'P0000';
          return {
            ...project,
            displayId,
            displayTitle: `${displayId} - ${project.title}`
          };
        });

        const filteredData = mappedData.filter(project => project.itNumber === 'IT23272736');
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

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project forever?')) return;
    try {
      const res = await fetch(`http://localhost:3000/api/posts/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProjects(prev => prev.filter(p => p._id !== id));
        setViewingProject(null);
      } else {
        alert('Failed to delete project');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdate = (id) => {
    setIsUpdateModalOpen(true);
  };

  const handleUpdateSuccess = (updatedData) => {
    setIsUpdateModalOpen(false);
    setViewingProject(updatedData);
    fetchProjects();
  };

  return (
    <div className="your-projects-layout">
      <div className="your-projects-header">
        <div className="header-text">
          <h1>Your Projects</h1>
          <p>Manage all your posted partnership requests.</p>
        </div>
        <button className="create-project-btn" onClick={() => setIsModalOpen(true)}>
          Create Project
        </button>
      </div>

      <div className="projects-grid-container">
        {isLoading ? (
          <div className="loading-spinner">Loading projects...</div>
        ) : projects.length === 0 ? (
          <div className="no-projects">
            <h3>No projects found</h3>
            <p>You haven't posted any partnership requests yet.</p>
            <button className="create-link-btn" onClick={() => setIsModalOpen(true)}>
              Create your first project →
            </button>
          </div>
        ) : (
          <div className="projects-grid">
            {projects.map(project => (
              <ProjectCard key={project._id} project={project} onView={setViewingProject} />
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Project">
        <InsertProject onSuccess={() => {
          setIsModalOpen(false);
          fetchProjects();
        }} />
      </Modal>

      <Modal isOpen={!!viewingProject} onClose={() => setViewingProject(null)} title={viewingProject?.displayTitle || viewingProject?.title || "Details"}>
        {viewingProject && (
          <div className="project-details-view relative">
            <div className="details-body">
              <div className="details-meta">
                <span className="details-badge">{viewingProject.projectType || 'Project'}</span>
                {viewingProject.teamSize && (
                  <span className="details-badge badge-team">Team of {viewingProject.teamSize}</span>
                )}
              </div>
              
              <h3 className="section-title">Project Description</h3>
              <p className="details-desc">{viewingProject.description || 'No description provided.'}</p>
              
              <div className="details-grid">
                <div className="details-section">
                  <h4>Target Domain</h4>
                  <div className="details-tags">
                    {viewingProject.domain?.length > 0 ? viewingProject.domain.map((d, i) => (
                      <span key={i} className="skill-tag domain-tag">{d}</span>
                    )) : <span className="empty-text">Not specified</span>}
                  </div>
                </div>
                <div className="details-section">
                  <h4>Academic Constraints</h4>
                  <ul className="stats-list">
                    <li><span>Specialization:</span> <strong>{viewingProject.specialization || 'Any'}</strong></li>
                    <li><span>Year/Sem:</span> <strong>{viewingProject.year || '-'} / {viewingProject.semester || '-'}</strong></li>
                    <li><span>Min CGPA:</span> <strong>{viewingProject.minimumCGPA || 'None'}</strong></li>
                  </ul>
                </div>
              </div>

              <div className="skills-grid">
                <div className="details-section box-essential">
                  <h4>Must Have Skills</h4>
                  {['languages', 'frameworks', 'databases', 'tools'].map(cat => (
                    viewingProject.essentialSkills?.[cat]?.length > 0 && (
                      <div key={cat} className="skill-category">
                        <h5>{cat}</h5>
                        <div className="details-tags">
                          {viewingProject.essentialSkills[cat].map((skill, i) => (
                            <span key={i} className="skill-tag essential-skill">{skill}</span>
                          ))}
                        </div>
                      </div>
                    )
                  ))}
                  {!['languages', 'frameworks', 'databases', 'tools'].some(cat => viewingProject.essentialSkills?.[cat]?.length > 0) && (
                    <span className="empty-text">No essential skills specified.</span>
                  )}
                </div>

                <div className="details-section box-optional">
                  <h4>Nice to Have</h4>
                  {['languages', 'frameworks', 'databases', 'tools'].map(cat => (
                    viewingProject.optionalSkills?.[cat]?.length > 0 && (
                      <div key={cat} className="skill-category">
                        <h5>{cat}</h5>
                        <div className="details-tags">
                          {viewingProject.optionalSkills[cat].map((skill, i) => (
                            <span key={i} className="skill-tag optional-skill">{skill}</span>
                          ))}
                        </div>
                      </div>
                    )
                  ))}
                  {!['languages', 'frameworks', 'databases', 'tools'].some(cat => viewingProject.optionalSkills?.[cat]?.length > 0) && (
                    <span className="empty-text">No optional skills specified.</span>
                  )}
                </div>
              </div>

              <div className="details-section box-roles">
                <h4>Engagement & Expected Roles</h4>
                <div className="details-grid">
                  <div>
                    <h5>Required Roles:</h5>
                    <div className="details-tags">
                      {viewingProject.requiredRoles?.length > 0 ? viewingProject.requiredRoles.map((role, i) => (
                        <span key={i} className="skill-tag role-tag">{role}</span>
                      )) : <span className="empty-text">Not specified</span>}
                    </div>
                  </div>
                  <div>
                    <h5>Commitment:</h5>
                    <ul className="stats-list">
                      <li><span>Weekly Hours:</span> <strong>{viewingProject.availabilityRequirement?.weeklyHours ? `${viewingProject.availabilityRequirement.weeklyHours} hrs` : '-'}</strong></li>
                      <li><span>Duration:</span> <strong>{viewingProject.availabilityRequirement?.durationWeeks ? `${viewingProject.availabilityRequirement.durationWeeks} weeks` : '-'}</strong></li>
                      <li style={{flexDirection: 'column', alignItems: 'flex-start'}}>
                        <span style={{marginBottom: 4}}>Meeting Days:</span> 
                        <strong>{viewingProject.availabilityRequirement?.meetingDays?.join(', ') || 'Flexible'}</strong>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="details-footer">
              <button className="btn-delete" onClick={() => handleDelete(viewingProject._id)}>Delete Post</button>
              <button className="btn-update" onClick={() => handleUpdate(viewingProject._id)}>Update Details</button>
            </div>
          </div>
        )}
      </Modal>

      <Modal isOpen={isUpdateModalOpen} onClose={() => setIsUpdateModalOpen(false)} title="Update Project">
        <UpdateProject project={viewingProject} onSave={handleUpdateSuccess} />
      </Modal>
    </div>
  );
};

export default YourProjects;
