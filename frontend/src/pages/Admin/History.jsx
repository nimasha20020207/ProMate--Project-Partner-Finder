import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const SuspensionHistory = () => {
  const { token } = useAuth();
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/admin/suspensions", {
        headers: { "x-auth-token": token }
      })
      .then((res) => setData(res.data))
      .catch((err) => console.log(err));
  }, [token]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Suspension History 🚫</h1>

      <table className="w-full border">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Student ID</th>
            <th className="p-2 border">Reason</th>
            <th className="p-2 border">Comments</th>
            <th className="p-2 border">Suspend Date</th>
          </tr>
        </thead>
        <tbody>
          {data.map((s) => (
            <tr key={s._id}>
              <td className="p-2 border">{s.studentId?.fullName}</td>
              <td className="p-2 border">{s.studentId?.studentId}</td>
              <td className="p-2 border">{s.reason}</td>
              <td className="p-2 border">{s.additionalComments}</td>
              <td className="p-2 border">
                {new Date(s.suspendDate).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SuspensionHistory;