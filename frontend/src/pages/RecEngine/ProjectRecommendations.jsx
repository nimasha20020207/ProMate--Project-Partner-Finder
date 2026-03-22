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
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white">
        <Navbar />
      </div>

      {/* Main content */}
      <div className="flex-1 p-6 bg-surface">
          
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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
              className="relative rounded-2xl p-[1px] bg-gradient-to-r from-primary via-secondary to-accent hover:scale-[1.02] transition duration-300"
            >
              {/* Card */}
              <div className="bg-surface rounded-2xl p-5 backdrop-blur-md shadow-lg hover:shadow-2xl transition">

                {/* Title */}
                <h3 className="text-xl font-semibold text-textPrimary mb-2">
                  {item.project.title}
                </h3>

                {/* Description */}
                <p className="text-textSecondary text-sm mb-4">
                  {item.project.description}
                </p>

                {/* Score Section */}
                <div className="flex items-center justify-between mb-5">

                  {/* Gradient Circle */}
                  <div className="relative w-16 h-16">
                    <svg className="w-16 h-16 transform -rotate-90">
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        className="stroke-gray-200"
                        strokeWidth="6"
                        fill="none"
                      />
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        stroke="url(#grad)"
                        strokeWidth="6"
                        fill="none"
                        strokeDasharray={2 * Math.PI * 28}
                        strokeDashoffset={
                          2 * Math.PI * 28 * (1 - percentage / 100)
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

                    <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-textPrimary">
                      {percentage}%
                    </div>
                  </div>

                  {/* Score Text */}
                  <div className="text-right">
                    <p className="text-sm text-textSecondary">Match Score</p>
                    <p className="font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                      {percentage}%
                    </p>
                  </div>
                </div>

                {/* Gradient Progress Bar */}
                <div className="mb-4">
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full bg-gradient-to-r ${progressColor} transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>

                {/* Explanation */}
                <p className="text-sm text-textPrimary">
                  {item.explanation}
                </p>

                

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {item.project.domain?.map((d, index) => (
                    <span
                      key={index}
                      className="text-xs px-3 py-1 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 text-primary font-medium"
                    >
                      {d}
                    </span>
                  ))}
                </div>

                {/* Button */}
                <button className="mt-5 w-full py-2 rounded-xl font-medium text-white bg-primary hover:from-secondary hover:to-primary transition-all duration-300 shadow-md hover:shadow-lg">
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