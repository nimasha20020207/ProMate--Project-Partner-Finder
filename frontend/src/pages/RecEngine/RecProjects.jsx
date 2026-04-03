import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";

const ProjectRecommendations = () => {
  const [projects, setProjects] = useState([]);

  // useEffect(() => {
  //   fetch("http://localhost:3000/api/recommendations/projects/S1")
  //     .then((res) => res.json())
  //     .then((data) => setProjects(data));
  // }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:3000/api/recommendations/projects", {
      method: "GET",
      headers: { "Authorization": `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
      console.log("Fetched projects:", data); // <-- check this
      setProjects(Array.isArray(data) ? data : []);
    })
    .catch(err => console.error(err));
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-surface">
      
      {/* Sidebar (fixed)
      <div className="w-64 bg-gray-800 text-white h-full">
        <Navbar />
      </div> */}

      {/* Main content (scrollable only) */}
      <div className="flex-1 p-6 overflow-y-auto">
        
        {/* Header + Button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-textPrimary">
            🔹 Recommended Projects
          </h2>

          <button onClick={() => window.location.href = "/recs"}
          className="px-5 py-2 rounded-lg text-white text-sm font-medium bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-md hover:scale-105 hover:shadow-xl active:scale-95 transition duration-300">
            Find your best match project💡
          </button>
        </div>

        {/* Summary Card */}
        <div className="mb-6">
          <div className="bg-white rounded-xl shadow-md p-5 border-l-4 border-primary">
            <h3 className="text-lg font-semibold text-textPrimary">
              🔰Recommendation Summary
            </h3>
            <p className="text-textSecondary mt-2">
              You have{" "}
              <span className="font-bold text-primary">
                {projects.length}
              </span>{" "}
              project recommendations.
            </p>
          </div>
        </div>

        {/* Project Cards */}
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((item, i) => {
            const project = item.project;

            return (
              <div
                key={i}
                className="bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition duration-300"
              >
                {/* Title */}
                <h3 className="text-lg font-semibold text-textPrimary mb-3">
                  {project.title}
                </h3>

                {/* Essential Skills */}
                <div className="mb-3">
                  <p className="text-sm text-textSecondary font-medium mb-1">
                    Essential Skills:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(project.essentialSkills).map(
                      ([key, skills], idx) =>
                        skills.map((skill, sidx) => (
                          <span
                            key={`${idx}-${sidx}`}
                            className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary font-medium"
                          >
                            {skill}
                          </span>
                        ))
                    )}
                  </div>
                </div>

                {/* Academic Info */}
                <div className="mb-3 text-sm text-textSecondary">
                  <p>
                    <span className="font-medium text-textPrimary">
                      Specialization:
                    </span>{" "}
                    {project.academicConstraints.specialization.join(", ")}
                  </p>
                  <p>
                    <span className="font-medium text-textPrimary">
                      Year:
                    </span>{" "}
                    {project.academicConstraints.year}
                  </p>
                  <p>
                    <span className="font-medium text-textPrimary">
                      Semester:
                    </span>{" "}
                    {project.academicConstraints.semester}
                  </p>
                </div>

                {/* Domain */}
                <div className="mb-3">
                  <p className="text-sm text-textSecondary font-medium mb-1">
                    Domain:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.domain.map((d, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2 py-1 rounded-full bg-accent/10 text-accent font-medium"
                      >
                        {d}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 mt-4">
                  <button className="flex-1 py-2 rounded-lg font-medium text-white bg-primary hover:bg-secondary transition duration-300 text-sm">
                    View Project
                  </button>
                  <button className="flex-1 py-2 rounded-lg font-medium text-white bg-secondary hover:bg-primary transition duration-300 text-sm">
                    Request to Join
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {projects.length === 0 && (
          <p className="text-center text-textSecondary mt-10">
            No recommendations available yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default ProjectRecommendations;