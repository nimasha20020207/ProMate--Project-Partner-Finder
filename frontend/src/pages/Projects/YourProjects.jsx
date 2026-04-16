import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import ProjectCard from '../../components/ProjectCard';
import { useNavigate } from 'react-router-dom';
import './YourProjects.css';

const YourProjects = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
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

        const filteredData = mappedData.filter(project => project.itNumber === user?.studentId);
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
      const res = await fetch(`http://localhost:3000/api/posts/${id}`, {
        method: 'DELETE',
        headers: {
          'x-auth-token': token
        }
      });
      if (res.ok) {
        setProjects(prev => prev.filter(p => p._id !== id));
      } else {
        alert('Failed to delete project');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="your-projects-layout">
      <div className="your-projects-header">
        <div className="header-text">
          <h1>Your Projects</h1>
          <p>Manage all your posted partnership requests.</p>
        </div>
        <button className="create-project-btn" onClick={() => navigate('/insert-project')}>
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
            <button className="create-link-btn" onClick={() => navigate('/insert-project')}>
              Create your first project →
            </button>
          </div>
        ) : (
          <div className="projects-grid">
            {projects.map(project => (
              <ProjectCard key={project._id} project={project} onView={(p) => navigate('/projects/' + p._id)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default YourProjects;
