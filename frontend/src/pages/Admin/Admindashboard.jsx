import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
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
    <div>
      <h1>Admin Dashboard</h1>

      <div className="cards">
        <div>Total Students: {data.totalStudents}</div>
        <div>Total Projects: {data.totalProjects}</div>
        <div>Total Requests: {data.totalRequests}</div>
        <div>Pending Requests: {data.pendingRequests}</div>
      </div>
    </div>
  );
}

export default Dashboard;