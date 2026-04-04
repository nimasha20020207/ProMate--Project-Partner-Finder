import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3000/api/admin/projects/${id}`)
      .then(res => res.json())
      .then(data => setProject(data))
      .catch(err => console.log(err));
  }, [id]);

  if (!project) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{project.title}</h1>

      <p className="mb-4 text-gray-600">{project.description}</p>

      <div className="space-y-2">
        <p><strong>Project Type:</strong> {project.projectType}</p>
        <p><strong>Team Size:</strong> {project.teamSize}</p>
        <p><strong>Domain:</strong> {project.domain?.join(", ")}</p>

        <p>
          <strong>Academic:</strong> Year {project.academicConstraints?.year} |
          Semester {project.academicConstraints?.semester}
        </p>

        <p>
          <strong>Min CGPA:</strong> {project.academicConstraints?.minimumCGPA}
        </p>

        <p>
          <strong>Skills:</strong>{" "}
          {project.essentialSkills?.languages?.join(", ")}
        </p>

        <p>
          <strong>Roles:</strong> {project.requiredRoles?.join(", ")}
        </p>

        <p>
          <strong>Availability:</strong>{" "}
          {project.availabilityRequirement?.weeklyHours}h/week
        </p>
      </div>
    </div>
  );
};

export default ProjectDetails;