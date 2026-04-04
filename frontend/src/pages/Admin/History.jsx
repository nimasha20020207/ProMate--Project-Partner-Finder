import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const SuspensionHistory = () => {
  const { token } = useAuth();
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/admin/suspensions", {
        headers: { "x-auth-token": token },
      })
      .then((res) => setData(res.data))
      .catch((err) => console.log(err));
  }, [token]);

  return (
    <div className="p-6 bg-surface min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-textPrimary">
        Suspension History 🚫
      </h1>

      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-primary text-white">
            <tr>
              <th className="p-3 border-r">Name</th>
              <th className="p-3 border-r">Student ID</th>
              <th className="p-3 border-r">Reason</th>
              <th className="p-3 border-r">Comments</th>
              <th className="p-3">Suspend Date</th>
            </tr>
          </thead>

          <tbody>
            {data.map((s) => (
              <tr key={s._id} className="border-b hover:bg-surface transition-colors">
                <td className="p-3 text-textPrimary font-medium">
                  {s.studentId?.fullName || "N/A"}
                </td>
                <td className="p-3 text-textSecondary">{s.studentId?.studentId || "N/A"}</td>
                <td className="p-3 text-textSecondary">{s.reason}</td>
                <td className="p-3 text-textSecondary">{s.additionalComments}</td>
                <td className="p-3 text-textSecondary">
                  {new Date(s.suspendDate).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={5} className="p-4 text-center text-textSecondary">
                  No suspension records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SuspensionHistory;