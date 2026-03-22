import React, { useEffect, useState } from "react";

const StudentRecommendations = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/recommendations/students/P3")
      .then(res => res.json())
      .then(data => setStudents(data));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">
        👨‍🎓 Recommended Students
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {students.map((item, i) => {
          const percentage = (item.score * 100).toFixed(0);

          return (
            <div key={i} className="bg-white p-5 rounded-xl shadow-lg">

              {/* Name */}
              <h3 className="text-lg font-semibold">
                {item.student.fullName}
              </h3>

              {/* Score */}
              <p className="text-sm text-gray-500 mb-2">
                Match Score: {percentage}%
              </p>

              {/* Matched Skills */}
              <div className="flex flex-wrap gap-2 mt-2">
                {item.details?.matchedSkills?.map((skill, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Availability */}
              <p className="mt-2 text-sm">
                {item.details?.availability?.isEnough
                  ? "✔ Available"
                  : "⚠ Not enough availability"}
              </p>

              {/* Explanation */}
              <p className="text-xs mt-2 text-gray-600">
                {item.explanation}
              </p>

            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StudentRecommendations;