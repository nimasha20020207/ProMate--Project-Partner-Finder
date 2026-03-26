import React, { useState, useEffect } from 'react'
import axios from "axios"
import AdminNavbar from '../../components/AdminNavbar'

const Projectmanagement = () => {
  const [projects, setProjects] = useState([]);

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

  return (
     <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white">
        <AdminNavbar />
      </div>

      {/* Main content */}
      <div className="flex-1 p-6 bg-surface">
            <h1 className="text-2xl font-bold mb-4">Projects</h1>
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">Title</th>
            <th>Team Size</th>
            <th>Domain</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map(p => (
            <tr key={p._id} className="border-b">
              <td className="p-2">{p.title}</td>
              <td>{p.teamSize}</td>
              <td>{p.domain.join(", ")}</td>
              <td>
                <button
                  onClick={() => deleteProject(p._id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  )
}

export default Projectmanagement