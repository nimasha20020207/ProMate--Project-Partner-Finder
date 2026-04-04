import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";

const Recommendations = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/recommendations/projects/S1")
      .then((res) => res.json())
      .then((data) => setProjects(data));
  }, []);

  return (
    <div className="flex min-h-screen">

      {/* Main content */}
      <div className="flex-1 p-6 bg-surface">

        {/* Button */}
        <div className="mb-6 flex justify-end">
  <button
    onClick={() => window.location.href = "/feedbacks"}
    className="relative w-full max-w-xs px-6 py-3 font-semibold text-white rounded-xl 
               bg-gradient-to-r from-primary to-secondary
               shadow-md hover:shadow-lg transition-transform duration-300 hover:scale-105
               text-sm text-center"
  >
    Rate Recommendations⭐⭐
  </button>
</div>

        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((item, i) => {
            const percentage = (item.score * 100).toFixed(0);

            const progressColor =
              percentage > 75
                ? "from-accent to-yellow-400"
                : percentage > 50
                ? "from-primary to-blue-400"
                : "from-secondary to-pink-400";

            return (
              <div
                key={i}
                className="relative rounded-xl p-[1px] bg-gradient-to-r from-primary via-secondary to-accent hover:scale-[1.02] transition duration-300"
              >
                {/* Card */}
                <div className="bg-white rounded-xl p-4 backdrop-blur-md shadow-md hover:shadow-lg transition">
                  {/* Title */}
                  <h3 className="text-lg font-semibold text-textPrimary mb-1">
                    {item.project.title}
                  </h3>

                  {/* Description */}
                  <p className="text-textSecondary text-sm mb-3 line-clamp-3">
                    {item.project.description}
                  </p>

                  {/* Score Section */}
                  <div className="flex items-center gap-4 mb-3">
                    {/* Gradient Circle */}
                    <div className="relative w-12 h-12">
                      <svg className="w-12 h-12 transform -rotate-90">
                        <circle
                          cx="24"
                          cy="24"
                          r="20"
                          className="stroke-gray-200"
                          strokeWidth="5"
                          fill="none"
                        />
                        <circle
                          cx="24"
                          cy="24"
                          r="20"
                          stroke="url(#grad)"
                          strokeWidth="5"
                          fill="none"
                          strokeDasharray={2 * Math.PI * 20}
                          strokeDashoffset={
                            2 * Math.PI * 20 * (1 - percentage / 100)
                          }
                          strokeLinecap="round"
                        />
                        <defs>
                          <linearGradient id="grad">
                            <stop offset="0%" stopColor="#3B82F6" />
                            <stop offset="50%" stopColor="#F472B6" />
                            <stop offset="100%" stopColor="#FACC15" />
                          </linearGradient>
                        </defs>
                      </svg>

                      <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-textPrimary">
                        {percentage}%
                      </div>
                    </div>

                    {/* Score Text */}
                    <div className="text-sm">
                      <p className="text-textSecondary">Match Score</p>
                      <p className="font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        {percentage}%
                      </p>
                    </div>
                  </div>

                  {/* Explanation */}
                  <p className="text-sm text-textPrimary mb-3 line-clamp-3">
                    {item.explanation}
                  </p>

                  {/* Matched Skills */}
              <div className="flex flex-wrap gap-2 mt-2">
                {item.details?.matchedSkills?.map((skill, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded"
                  >
                    {skill}
                  </span>
                ))}
              </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-3 mt-3">
                    {item.project.domain?.map((d, index) => (
                      <span
                        key={index}
                        className="text-xs px-2 py-1 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 text-primary font-medium"
                      >
                        {d}
                      </span>
                    ))}
                  </div>

                  {/* Button */}
                  <button 
                  onClick={() => window.location.href = "/projectview"}
                  className="w-full py-2 rounded-lg font-medium text-white bg-primary hover:from-secondary hover:to-primary transition-all duration-300 shadow-sm hover:shadow-md text-sm">
                    View Project
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Recommendations;