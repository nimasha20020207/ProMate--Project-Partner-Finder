import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import DummyProfile from '../../assets/images/pic1.jpg'; // dummy profile image

const StudentRecommendations = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/recommendations/students/P3")
      .then(res => res.json())
      .then(data => setStudents(data));
  }, []);

  // Find the highest score for the Top Match badge
  const maxScore = students.length > 0 ? Math.max(...students.map(s => s.score)) : 0;

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white">
        <Navbar />
      </div>

      {/* Main content */}
      <div className="flex-1 p-6 bg-surface">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">
            👨‍🎓 Top Matched Students
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {students.map((item, i) => {
              const percentage = (item.score * 100).toFixed(0);
              const isTopMatch = item.score === maxScore;

              return (
                <div key={i} className="bg-white p-5 rounded-xl shadow-lg relative hover:shadow-xl transition-shadow duration-300">

                  {/* Top Match Badge */}
                  {isTopMatch && (
                    <div className="absolute top-2 left-2 bg-gradient-to-r from-secondary to-accent text-white text-xs font-bold px-2 py-1 rounded-full shadow-md z-10">
                      🌟 Top Match
                    </div>
                  )}

                  {/* Profile Image - Top Right */}
                  <div className="absolute top-3 right-3 w-20 h-20 rounded-full p-[2px] bg-gradient-to-r from-primary to-secondary">
                    <img
                      src={DummyProfile}
                      alt={item.student.fullName}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>

                  {/* Name */}
                  <h3 className="text-lg font-semibold mt-10">{item.student.fullName}</h3>

                  {/* Score Section */}
                  <div className="flex items-center gap-4 mb-3 mt-2">
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
                          strokeDashoffset={2 * Math.PI * 20 * (1 - percentage / 100)}
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
                      <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-800">
                        {percentage}%
                      </div>
                    </div>

                    {/* Score Text */}
                    <div className="text-sm">
                      <p className="text-gray-500">Match Score</p>
                      <p className="font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        {percentage}%
                      </p>
                    </div>
                  </div>

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

                  {/* Availability */}
                  <p className="mt-2 text-sm">
                    {item.details?.availability?.isEnough
                      ? "✔ Available"
                      : "⚠ Not enough availability"}
                  </p>

                  {/* Explanation */}
                  <p className="text-xs mt-2 text-gray-600">{item.explanation}</p>

                  {/* View Profile Button */}
                  <button className="w-full py-2 mt-3 rounded-lg font-medium text-white bg-primary hover:from-secondary hover:to-primary transition-all duration-300 shadow-sm hover:shadow-md text-sm">
                    View Profile
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentRecommendations;