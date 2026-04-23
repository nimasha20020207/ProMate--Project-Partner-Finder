import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AllProjects.css';

const ProjectDetailsView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [viewingProject, setViewingProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasRequested, setHasRequested] = useState(false);

  const fetchProject = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/posts/${id}`);
      if (res.ok) {
        const data = await res.json();
        const displayId = data.projectId || 'P0000';
        setViewingProject({
          ...data,
          displayId,
          displayTitle: `${displayId} - ${data.title}`
        });
      } else {
        alert('Failed to fetch project details');
        navigate(-1);
      }
    } catch (err) {
      console.error(err);
      alert('Network error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [id, navigate]);

  useEffect(() => {
    const checkJoinStatus = async () => {
      if (viewingProject && user && viewingProject.itNumber !== user.studentId) {
        try {
          const res = await fetch(`http://localhost:3000/api/notifications?targetIt=${viewingProject.itNumber}`);
          if (res.ok) {
            const notifications = await res.json();
            const myRequest = notifications.find(n => 
              n.senderIt && n.senderIt.includes(user.studentId) &&
              n.message && n.message.includes(viewingProject.displayTitle)
            );
            if (myRequest) {
              setHasRequested(true);
            }
          }
        } catch (err) {
          console.error('Failed to check join status', err);
        }
      }
    };
    checkJoinStatus();
  }, [viewingProject, user]);

  const handleJoin = async () => {
    const payload = {
      senderIt: user ? `${user.studentId} - ${user.fullName}` : 'Unknown',
      targetIt: viewingProject.itNumber || 'Unknown',
      message: `Requested to join ${viewingProject.displayTitle} project`,
      type: 'join_request'
    };

    try {
      const res = await fetch('http://localhost:3000/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setHasRequested(true);
        alert('Join Request Sent to the Notifications Page!');
      } else {
        alert('Failed to send request');
      }
    } catch (err) {
      console.error(err);
      alert('Network error');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this project forever?')) return;
    try {
      const res = await fetch(`http://localhost:3000/api/posts/${id}`, {
        method: 'DELETE',
        headers: {
          'x-auth-token': token
        }
      });
      if (res.ok) {
        alert('Project deleted successfully');
        navigate('/your-projects');
      } else {
        alert('Failed to delete project');
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) {
    return <div className="all-loading" style={{ marginTop: '100px' }}>Loading details...</div>;
  }

  if (!viewingProject) {
    return null;
  }

  const isOwner = user?.studentId === viewingProject.itNumber;

  return (
    <div className="all-projects-container" style={{ paddingTop: '40px', maxWidth: '900px', margin: '0 auto' }}>
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        style={{ marginBottom: '20px', background: 'none', border: 'none', color: '#3B82F6', cursor: 'pointer', fontWeight: '600', fontSize: '15px' }}
      >
        ← Back
      </button>

      <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        <div style={{ padding: '24px', borderBottom: '1px solid #eaeaea' }}>
          <h2 style={{ margin: 0, fontSize: '24px', color: '#1e293b', fontWeight: '700' }}>{viewingProject.displayTitle}</h2>
        </div>

        <div className="all-project-details-view relative">
          <div className="all-details-body" style={{ paddingBottom: '32px' }}>
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
            
            {viewingProject.dueDate && (
              <div style={{ fontSize: '15px', color: '#ef4444', marginBottom: '24px', fontWeight: '600' }}>
                Due Date: <span style={{ color: '#1e293b' }}>{new Date(viewingProject.dueDate).toLocaleDateString('en-GB')}</span>
              </div>
            )}

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
                {['languages', 'frameworks', 'databases', 'libraries', 'tools'].map(cat => (
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
                {!['languages', 'frameworks', 'databases', 'libraries', 'tools'].some(cat => viewingProject.essentialSkills?.[cat]?.length > 0) && (
                  <span className="all-empty-text">No essential skills specified.</span>
                )}
              </div>

              <div className="all-details-section all-box-optional">
                <h4>Nice to Have</h4>
                {['languages', 'frameworks', 'databases', 'libraries', 'tools'].map(cat => (
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
                {!['languages', 'frameworks', 'databases', 'libraries', 'tools'].some(cat => viewingProject.optionalSkills?.[cat]?.length > 0) && (
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

          <div className="all-details-footer" style={{ position: 'relative', borderBottomLeftRadius: 0, borderBottomRightRadius: 0, marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '20px' }}>
            {isOwner ? (
              <>
                <button className="btn-delete" style={{ background: 'transparent', border: '2px solid #ef4444', color: '#ef4444', padding: '12px 32px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }} onClick={handleDelete}>Delete Post</button>
                <button className="btn-update" style={{ background: 'transparent', border: '2px solid #3B82F6', color: '#3B82F6', padding: '12px 32px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }} onClick={() => navigate('/update-project/' + id)}>Update Details</button>
              </>
            ) : (
              <button 
                className="all-btn-join" 
                onClick={handleJoin}
                disabled={hasRequested}
                style={hasRequested ? { background: '#94a3b8', cursor: 'not-allowed', color: '#fff', border: 'none' } : {}}
              >
                {hasRequested ? 'Requested to Join' : 'Join Project'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsView;
