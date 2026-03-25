import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminNavbar from '../../components/AdminNavbar'

const Admindashboard = () => {
  const [data, setData] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios.get("/api/admin/reports", {
      headers: { Authorization: token }
    })
    .then(res => setData(res.data))
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

        <h1>dashboard</h1>
        <div className="cards">
        <div>Total Students: {data.totalStudents}</div>
        <div>Total Projects: {data.totalProjects}</div>
        <div>Total Requests: {data.totalRequests}</div>
        <div>Pending Requests: {data.pendingRequests}</div>
      </div>
        
      </div>
    </div>
  );
}

export default Admindashboard