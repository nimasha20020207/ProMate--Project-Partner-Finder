import React from 'react'
import AdminNavbar from '../../components/AdminNavbar' // ✅ FIX: missing import

const AdminFeedbacks = () => {

  // Dummy feedback data
  const feedbacks = [
    {
      id: "STU001",
      name: "John Doe",
      rating: 4,
      comment: "The system is very user-friendly and helpful.",
      improvement: "Add dark mode feature"
    },
    {
      id: "STU002",
      name: "Jane Smith",
      rating: 5,
      comment: "Excellent experience! Everything works perfectly.",
      improvement: "No major improvements needed"
    },
    {
      id: "STU003",
      name: "Michael Lee",
      rating: 3,
      comment: "Good, but some pages load slowly.",
      improvement: "Improve performance speed"
    },
    {
      id: "STU004",
      name: "Sarah Khan",
      rating: 2,
      comment: "UI is confusing in some sections.",
      improvement: "Improve navigation and layout"
    }
  ];

  // Render stars
  const renderStars = (rating) => {
    return "⭐".repeat(rating) + "☆".repeat(5 - rating);
  };

  return (
    <div className="flex h-screen overflow-hidden">

      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white fixed h-full">
        <AdminNavbar />
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 p-6 overflow-y-auto bg-gray-50">

        <h2 className="text-2xl font-bold mb-6 text-textPrimary">User Feedbacks⭐</h2>

        <div className="bg-white shadow-md rounded-xl overflow-hidden">
          <table className="w-full border-collapse">

            <thead className="bg-primary">
              <tr>
                <th className="p-3 text-left text-white">Student ID</th>
                <th className="p-3 text-left text-white">Student Name</th>
                <th className="p-3 text-left text-white">Ratings</th>
                <th className="p-3 text-left text-white">Feedback Comment</th>
                <th className="p-3 text-left text-white">Improvement Area</th>
              </tr>
            </thead>

            <tbody>
              {feedbacks.map((fb, index) => (
                <tr key={index} className="border-t hover:bg-gray-100">
                  <td className="p-3">{fb.id}</td>
                  <td className="p-3">{fb.name}</td>
                  <td className="p-3 text-yellow-500 font-medium">
                    {renderStars(fb.rating)}
                  </td>
                  <td className="p-3">{fb.comment}</td>
                  <td className="p-3">{fb.improvement}</td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>

      </div>
    </div>
  )
}

export default AdminFeedbacks;