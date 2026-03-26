import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminNavbar from '../../components/AdminNavbar'

const Admindashboard = () => {
  const [report, setReport] = useState({});

  useEffect(() => {
    axios.get("http://localhost:3000/api/admin/reports")
      .then(res => setReport(res.data))
      .catch(err => console.log(err));
  }, []);

  return (

    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white">
        <AdminNavbar />
      </div>

      {/* Main content */}
      <div className="flex-1 p-6 bg-surface">

        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white shadow p-4 rounded">
          <h2 className="font-semibold">Total Students</h2>
          <p className="text-xl">{report.totalStudents}</p>
        </div>
        <div className="bg-white shadow p-4 rounded">
          <h2 className="font-semibold">Total Projects</h2>
          <p className="text-xl">{report.totalProjects}</p>
        </div>
        <div className="bg-white shadow p-4 rounded">
          <h2 className="font-semibold">Total Requests</h2>
          <p className="text-xl">{report.totalRequests}</p>
        </div>
        <div className="bg-white shadow p-4 rounded">
          <h2 className="font-semibold">Pending Requests</h2>
          <p className="text-xl">{report.pendingRequests}</p>
        </div>
      </div>
      </div>
    </div>
  );
}

export default Admindashboard