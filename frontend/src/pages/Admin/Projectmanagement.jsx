import React, { useState, useEffect, useRef } from 'react'
import axios from "axios"
import AdminNavbar from '../../components/AdminNavbar'

const Projectmanagement = () => {
  const [projects, setProjects] = useState([]);
  const tableRef = useRef(null);

  // ✅ Reject Modal State
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [reason, setReason] = useState("");
  const [comments, setComments] = useState("");
  const [error, setError] = useState("");

  const fetchProjects = () => {
    axios.get("http://localhost:3000/api/admin/projects")
      .then(res => setProjects(res.data))
      .catch(err => console.log(err));
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const deleteProject = (id) => {
    if (window.confirm("Delete this project?")) {
      axios.delete(`http://localhost:3000/api/admin/projects/${id}`)
        .then(fetchProjects)
        .catch(err => console.log(err));
    }
  };

  const scrollToTable = () => {
    tableRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // ✅ Open Reject Modal
  const openRejectModal = (project) => {
    setSelectedProject(project);
    setReason("");
    setComments("");
    setError("");
    setShowRejectModal(true);
  };

  // ✅ Handle Reject
  const handleReject = () => {
    if (!reason) {
      setError("Please select a reason");
      return;
    }

    if (comments.trim().length < 5) {
      setError("Comments must be at least 5 characters");
      return;
    }

    console.log("Rejected project:", selectedProject._id, {
      reason,
      comments,
    });

    setShowRejectModal(false);
    alert("Project rejected successfully!");
  };

  return (
    <div className="flex h-screen overflow-hidden">

      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white fixed h-full">
        <AdminNavbar />
      </div>

      {/* Main */}
      <div className="flex-1 ml-64 p-6 overflow-y-auto bg-gray-50">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            New Projects 📝
          </h1>

          <button
            onClick={scrollToTable}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm shadow"
          >
            View All Projects
          </button>
        </div>

        {/* ================= CARDS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {projects.map((p) => (
            <div
              key={p._id}
              className="bg-white rounded-2xl shadow-md p-5 hover:shadow-xl transition border flex flex-col justify-between"
            >
              {/* Header */}
              <div className="mb-3">
                <h2 className="text-lg font-bold text-gray-800">
                  {p.title}
                </h2>
                <p className="text-sm text-gray-500 line-clamp-2">
                  {p.description}
                </p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-3 text-xs">
                <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded">
                  {p.projectType}
                </span>
                <span className="bg-green-100 text-green-600 px-2 py-1 rounded">
                  Team: {p.teamSize}
                </span>
                <span className="bg-purple-100 text-purple-600 px-2 py-1 rounded">
                  {p.domain?.[0]}
                </span>
              </div>

              {/* Key Info */}
              <div className="text-sm text-gray-700 space-y-1 mb-3">
                <p>
                  <strong>Year:</strong> {p.academicConstraints?.year} |
                  <strong> Sem:</strong> {p.academicConstraints?.semester}
                </p>

                <p>
                  <strong>CGPA:</strong>{" "}
                  <span className="text-yellow-500 font-semibold">
                    {p.academicConstraints?.minimumCGPA}
                  </span>
                </p>

                <p>
                  <strong>Skills:</strong>{" "}
                  {p.essentialSkills?.languages?.slice(0, 2).join(", ")}
                </p>

                <p>
                  <strong>Roles:</strong>{" "}
                  {p.requiredRoles?.slice(0, 2).join(", ")}
                </p>
              </div>

              {/* Footer */}
              <div className="flex justify-between items-center mt-auto">
                <div className="text-xs text-gray-500">
                  {p.availabilityRequirement?.weeklyHours}h/week
                </div>

                <div className="flex gap-2">
                  <button className="text-blue-500 border border-blue-500 px-3 py-1 rounded text-sm hover:bg-blue-50">
                    View
                  </button>

                  <button className="bg-accent text-white px-3 py-1 rounded text-sm hover:bg-accent-600">
                    Approve
                  </button>

                  <button
                    onClick={() => openRejectModal(p)}
                    className="bg-secondary text-white px-3 py-1 rounded text-sm hover:bg-secondary-600"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ================= TABLE ================= */}
        <div ref={tableRef} className="mt-16">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            All Projects Table
          </h2>

          <div className="overflow-x-auto bg-white rounded-xl shadow">
            <table className="min-w-full text-sm text-left">

              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="p-3">Title</th>
                  <th>Team</th>
                  <th>Type</th>
                  <th>Academic</th>
                  <th>Skills</th>
                  <th>Roles</th>
                  <th>Availability</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {projects.map((p) => (
                  <tr key={p._id} className="border-b hover:bg-gray-50">

                    <td className="p-3 font-medium">
                      {p.title}
                      <p className="text-gray-400">{p.domain?.join(", ")}</p>
                    </td>

                    <td>{p.teamSize}</td>

                    <td>{p.projectType}</td>

                    <td>
                      Y{p.academicConstraints?.year} / S{p.academicConstraints?.semester}
                      <br />
                      <span className="text-yellow-500 font-semibold">
                        CGPA {p.academicConstraints?.minimumCGPA}
                      </span>
                    </td>

                    <td>
                      {p.essentialSkills?.languages?.slice(0,2).join(", ")}
                      <br />
                      <span className="text-gray-400">
                        {p.essentialSkills?.frameworks?.slice(0,1)}
                      </span>
                    </td>

                    <td>{p.requiredRoles?.join(", ")}</td>

                    <td>
                      {p.availabilityRequirement?.weeklyHours}h/week
                      <br />
                      {p.availabilityRequirement?.durationWeeks}w
                    </td>

                    <td className="space-x-2">
                      <button className="text-blue-500 border border-blue-500 px-2 py-1 rounded text-xs">
                        View
                      </button>

                      <button
                        onClick={() => deleteProject(p._id)}
                        className="bg-pink-400 text-white px-2 py-1 rounded text-xs"
                      >
                        Remove
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        </div>

      </div>

      {/* ================= REJECT MODAL ================= */}
      {showRejectModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4 text-red-500">
              Reject Project
            </h2>

            <p className="mb-2">
              Project: <strong>{selectedProject?.title}</strong>
            </p>

            <label className="block text-sm font-medium mb-1">Reason</label>
            <select
              className="w-full border rounded p-2 mb-2"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            >
              <option value="">-- Select Reason --</option>
              <option value="Incomplete details">Incomplete details</option>
              <option value="Not relevant">Not relevant</option>
              <option value="Low quality idea">Low quality idea</option>
              <option value="Duplicate project">Duplicate project</option>
              <option value="Other">Other</option>
            </select>

            <label className="block text-sm font-medium mb-1">Comments</label>
            <textarea
              className="w-full border rounded p-2 mb-2"
              rows={3}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Minimum 5 characters"
            />

            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

            <div className="flex justify-end gap-2 mt-2">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>

              <button
                onClick={handleReject}
                className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default Projectmanagement;