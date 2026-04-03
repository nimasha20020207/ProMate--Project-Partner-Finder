import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import AdminNavbar from "../../components/AdminNavbar";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const StudentManagement = () => {

  const navigate = useNavigate();

  const { token } = useAuth();
  const [students, setStudents] = useState([]);
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [reason, setReason] = useState("");
  const [additionalComments, setAdditionalComments] = useState("");
  const [suspendDate, setSuspendDate] = useState("");
  const [error, setError] = useState("");
  const [searchId, setSearchId] = useState(""); // search input

  const tableRef = useRef(null);

  const fetchStudents = () => {
    axios
      .get("http://localhost:3000/api/admin/students", {
        headers: { "x-auth-token": token },
      })
      .then((res) => setStudents(res.data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchStudents();
  }, [token]);

  const openSuspendModal = (student) => {
    setSelectedStudent(student);
    setReason("");
    setAdditionalComments("");
    setSuspendDate("");
    setError("");
    setShowSuspendModal(true);
  };

  const handleSuspend = async() => {
  if (!reason) return setError("Please select a reason.");
  if (additionalComments.trim().length < 5)
    return setError("Additional comments must be at least 5 characters.");
  if (!suspendDate) return setError("Please select a suspension date.");

  try {
    await axios.post(
      `http://localhost:3000/api/admin/suspend/${selectedStudent._id}`,
      {
        reason,
        additionalComments,
        suspendDate
      },
      {
        headers: { "x-auth-token": token }
      }
    );

    // ✅ Remove student from UI immediately
    setStudents((prev) =>
      prev.filter((s) => s._id !== selectedStudent._id)
    );

    setShowSuspendModal(false);
    alert("Student suspended successfully!");

  } catch (err) {
    console.error(err);
    setError("Failed to suspend student");
  }
};

  const verifyStudent = (id) => {
    alert("Student verified (mock action)");
  };

  const scrollToTable = () => {
    tableRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Filter students by student ID
  const filteredStudents = students.filter((s) =>
    s.studentId.toLowerCase().includes(searchId.toLowerCase())
  );

  return (
    <div className="flex h-screen">
      <div className="flex-1 p-6 bg-surface">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-textPrimary">New Users 👨‍🎓👩‍🎓</h1>
          <button
            onClick={scrollToTable}
            className="bg-[#3B82F6] text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
          >
            View All Users
          </button>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
          {students.map((s) => (
            <div
              key={s._id}
              className="bg-white shadow-md rounded-xl p-5 border hover:shadow-lg transition transform hover:-translate-y-1"
            >
              <div className="mb-3">
                <h2 className="text-lg font-bold text-[#3B82F6]">{s.fullName}</h2>
                <p className="text-sm text-gray-500">ID: {s.studentId}</p>
              </div>

              <div className="text-sm text-[#374151] space-y-1">
                <p><strong>Degree:</strong> {s.degreeProgram}</p>
                <p><strong>Department:</strong> {s.department}</p>
                <p><strong>Specialization:</strong> {s.academicInfo?.specialization}</p>
                <p><strong>Year:</strong> {s.academicInfo?.year}</p>
                <p><strong>Semester:</strong> {s.academicInfo?.semester}</p>
              </div>

              <div className="flex justify-between mt-4 gap-2">
                <button 
                onClick={() => navigate(`/profile/${s._id}`)}
                className="bg-[#3B82F6] text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition">
                  View Profile
                </button>
                <button
                  onClick={() => verifyStudent(s._id)}
                  className="bg-secondary text-white px-3 py-1 rounded text-sm hover:opacity-90 transition"
                >
                  Verify⭐
                </button>
                <button
                  onClick={() => openSuspendModal(s)}
                  className="bg-[#6B7280] text-white px-3 py-1 rounded text-sm hover:bg-gray-500 transition"
                >
                  Suspend
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* All Students Table */}
        <div ref={tableRef} className="bg-white p-4 rounded-xl shadow-md mb-12">
          <h2 className="text-xl font-bold text-[#1F2937] mb-4">All Students</h2>

          {/* Search Bar */}
          {/* Search Bar */}
<div className="mb-4 flex justify-end">
  <input
    type="text"
    placeholder="Search by Student ID..."
    value={searchId}
    onChange={(e) => setSearchId(e.target.value)}
    className="w-full md:w-1/3 border border-blue-400 bg-blue-50 shadow-sm rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-500"
  />
</div>

          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-2 border">Full Name</th>
                  <th className="p-2 border">Student ID</th>
                  <th className="p-2 border">Email</th>
                  <th className="p-2 border">Degree</th>
                  <th className="p-2 border">Department</th>
                  <th className="p-2 border">Specialization</th>
                  <th className="p-2 border">Year</th>
                  <th className="p-2 border">Semester</th>
                  <th className="p-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((s) => (
                  <tr key={s._id} className="border-b hover:bg-gray-50">
                    <td className="p-2 border">{s.fullName}</td>
                    <td className="p-2 border">{s.studentId}</td>
                    <td className="p-2 border">{s.email}</td>
                    <td className="p-2 border">{s.degreeProgram}</td>
                    <td className="p-2 border">{s.department}</td>
                    <td className="p-2 border">{s.academicInfo?.specialization}</td>
                    <td className="p-2 border">{s.academicInfo?.year}</td>
                    <td className="p-2 border">{s.academicInfo?.semester}</td>
                    <td className="p-2 border space-x-2">
                      <button 
                      onClick={() => navigate(`/profile/${s._id}`)}
                      className="bg-[#3B82F6] text-white px-2 py-1 rounded text-sm hover:bg-blue-700 transition">
                        View Profile
                      </button>
                      <button
                        onClick={() => openSuspendModal(s)}
                        className="bg-textSecondary text-white px-2 py-1 rounded text-sm hover:bg-red-600 transition"
                      >
                        Suspend
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Suspend Modal */}
      {showSuspendModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4 text-[#EF4444]">Suspend Student</h2>
            <p className="mb-2">
              You are suspending: <strong>{selectedStudent.fullName}</strong>
            </p>

            <label className="block text-sm font-medium mb-1">Reason</label>
            <select
              className="w-full border rounded p-2 mb-2 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            >
              <option value="">-- Select Reason --</option>
              <option value="Violation of rules">Violation of rules</option>
              <option value="Attendance issue">Attendance issue</option>
              <option value="Plagiarism / Academic misconduct">Plagiarism / Academic misconduct</option>
              <option value="Other">Other</option>
            </select>

            <label className="block text-sm font-medium mb-1">Additional Comments</label>
            <textarea
              className="w-full border rounded p-2 mb-2 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
              rows={3}
              value={additionalComments}
              onChange={(e) => setAdditionalComments(e.target.value)}
              placeholder="Provide additional context (min 5 characters)"
            />

            <label className="block text-sm font-medium mb-1">Suspension Date</label>
            <input
              type="date"
              className="w-full border rounded p-2 mb-2 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
              value={suspendDate}
              onChange={(e) => setSuspendDate(e.target.value)}
            />

            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

            <div className="flex justify-end gap-2 mt-2">
              <button
                onClick={() => setShowSuspendModal(false)}
                className="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSuspend}
                className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600 transition"
              >
                Suspend
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentManagement;