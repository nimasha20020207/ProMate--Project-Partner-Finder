import React from "react";

const projectView = () => {
  const project = {
    id: "P3",
    title: "ITPM Project",
    essentialSkills: {
      languages: ["JavaScript"],
      frameworks: ["React"],
      libraries: [],
      databases: ["MongoDB", "MySQL"],
      tools: ["Git"],
    },
    requiredRoles: ["Frontend Developer", "Backend Developer", "Fullstack Developer"],
    availabilityRequirement: {
      weeklyHours: 15,
    },
    domain: ["Web Development"],
    academicConstraints: {
      specialization: ["IT"],
      year: 3,
      semester: 1,
      minimumCGPA: 3,
    },
  };

  // Colors
  const colors = {
    primary: "#3B82F6",
    secondary: "#F472B6",
    accent: "#FACC15",
    surface: "#F9FAFB",
    textPrimary: "#1F2937",
    textSecondary: "#6B7280",
  };

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: colors.surface }}>
      {/* Card Container */}
      <div
        className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8 border-l-4"
        style={{ borderColor: colors.primary }}
      >
        {/* Project Title */}
        <h1 className="text-3xl font-bold mb-4" style={{ color: colors.textPrimary }}>
          {project.title}
        </h1>

        {/* Essential Skills */}
        <div className="mb-6">
          <p className="font-semibold mb-2" style={{ color: colors.textSecondary }}>
            🔹 Essential Skills
          </p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(project.essentialSkills).map(([category, skills]) =>
              skills.map((skill, idx) => (
                <span
                  key={`${category}-${idx}`}
                  className="px-3 py-1 rounded-full font-medium text-xs"
                  style={{
                    backgroundColor: colors.primary + "20",
                    color: colors.primary,
                  }}
                >
                  {skill}
                </span>
              ))
            )}
          </div>
        </div>

        {/* Required Roles */}
        <div className="mb-6">
          <p className="font-semibold mb-2" style={{ color: colors.textSecondary }}>
            🎯 Required Roles
          </p>
          <div className="flex flex-wrap gap-2">
            {project.requiredRoles.map((role, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-full font-medium text-xs"
                style={{
                  backgroundColor: colors.secondary + "20",
                  color: colors.secondary,
                }}
              >
                {role}
              </span>
            ))}
          </div>
        </div>

        {/* Weekly Hours */}
        <div className="mb-6">
          <p className="font-semibold" style={{ color: colors.textSecondary }}>
            ⏱ Weekly Hours Required:{" "}
            <span style={{ color: colors.textPrimary, fontWeight: "500" }}>
              {project.availabilityRequirement.weeklyHours} hrs
            </span>
          </p>
        </div>

        {/* Domain */}
        <div className="mb-6">
          <p className="font-semibold mb-2" style={{ color: colors.textSecondary }}>
            🌐 Domain
          </p>
          <div className="flex flex-wrap gap-2">
            {project.domain.map((d, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-full font-medium text-xs"
                style={{
                  backgroundColor: colors.accent + "20",
                  color: colors.accent,
                }}
              >
                {d}
              </span>
            ))}
          </div>
        </div>

        {/* Academic Constraints */}
        <div className="mb-6">
          <p className="font-semibold mb-2" style={{ color: colors.textSecondary }}>
            🎓 Academic Constraints
          </p>
          <ul className="ml-4 list-disc" style={{ color: colors.textPrimary }}>
            <li>Specialization: {project.academicConstraints.specialization.join(", ")}</li>
            <li>Year: {project.academicConstraints.year}</li>
            <li>Semester: {project.academicConstraints.semester}</li>
            <li>Minimum CGPA: {project.academicConstraints.minimumCGPA}</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-6">
          <button
            className="flex-1 py-2 rounded-lg font-medium text-white text-sm"
            style={{ backgroundColor: colors.primary }}
            onClick={() => alert("Request sent! ✅")}
          >
            Request to Join
          </button>
          <button
            className="flex-1 py-2 rounded-lg font-medium text-white text-sm"
            style={{ backgroundColor: colors.secondary }}
            onClick={() => alert("Project bookmarked! ⭐")}
          >
            Bookmark Project
          </button>
        </div>
      </div>
    </div>
  );
};

export default projectView;