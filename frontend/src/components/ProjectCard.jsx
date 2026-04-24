import React from 'react';
import './ProjectCard.css';

const ProjectCard = ({ project, onView }) => {
  return (
    <div className="project-card">
      <div className="project-card-body">
        <div className="project-card-header">
          <h3 className="project-title" title={project.displayTitle || project.title}>{project.displayTitle || project.title}</h3>
          <span className="project-type-badge">{project.projectType || 'Project'}</span>
        </div>
        
        {project.itNumber && (
          <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '12px', fontWeight: '500' }}>
            IT Number: <span style={{ color: '#1e293b' }}>{project.itNumber}</span>
          </div>
        )}

        <p className="project-desc">
          {project.description || 'No description provided.'}
        </p>

        {project.dueDate && (
          <div style={{ fontSize: '13px', color: '#ef4444', marginBottom: '12px', fontWeight: '600' }}>
            Due Date: <span>{new Date(project.dueDate).toLocaleDateString('en-GB')}</span>
          </div>
        )}

        <div className="project-stats">
          <div className="stat">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            <span>Team: 
              <strong style={project.teamSize <= 0 ? { color: '#ef4444', backgroundColor: '#fef2f2', padding: '2px 6px', borderRadius: '4px', border: '1px solid #fecaca' } : {}}>
                {project.teamSize <= 0 ? 'FULL' : (project.teamSize || 'Any')}
              </strong>
            </span>
          </div>
          <div className="stat">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
            <span>CGPA: <strong>{project.minimumCGPA || 'None'}</strong></span>
          </div>
        </div>

        {project.domain && project.domain.length > 0 && (
          <div className="project-domains">
            {project.domain.slice(0, 3).map((dom, i) => (
              <span key={i} className="domain-tag">{dom}</span>
            ))}
            {project.domain.length > 3 && (
              <span className="domain-tag-more">+{project.domain.length - 3}</span>
            )}
          </div>
        )}
      </div>

      <div className="project-card-footer">
        <button className="view-btn" onClick={() => onView(project)}>
          View Details
        </button>
      </div>
    </div>
  );
};

export default ProjectCard;
