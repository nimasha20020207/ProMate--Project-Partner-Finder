import React,{useEffect,useState} from 'react';
import axios from "axios";
import AdminNavbar from '../../components/AdminNavbar';

const Requestmanagement = () => {
    const [requests, setRequests] = useState([]);

  const fetchRequests = () => {
    axios.get("http://localhost:5000/api/admin/requests")
      .then(res => setRequests(res.data))
      .catch(err => console.log(err));
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const updateStatus = (id, status) => {
    axios.put(`http://localhost:3000/api/admin/requests/${id}`, { status })
      .then(fetchRequests)
      .catch(err => console.log(err));
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white">
        <AdminNavbar />
      </div>

      {/* Main content */}
      <div className="flex-1 p-6 bg-surface">
            <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Requests</h1>
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">Student</th>
            <th>Project</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map(r => (
            <tr key={r._id} className="border-b">
              <td className="p-2">{r.studentFullName}</td>
              <td>{r.projectTitle}</td>
              <td>{r.roleRequested}</td>
              <td>{r.status}</td>
              <td className="space-x-2">
                <button
                  onClick={() => updateStatus(r._id, "Accepted")}
                  className="bg-green-500 text-white px-2 py-1 rounded"
                >
                  Accept
                </button>
                <button
                  onClick={() => updateStatus(r._id, "Rejected")}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
      </div>
    </div>
  )
}

export default Requestmanagement