import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminNavbar from "../../components/AdminNavbar";
import { Users, Folder, Bell, Clock } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Link } from "react-router-dom";

const Admindashboard = () => {
  const [report, setReport] = useState({});

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/admin/reports")
      .then((res) => setReport(res.data))
      .catch((err) => console.log(err));
  }, []);

  // 🔵 Dummy Pie Data
  const userStats = [
    { name: "Active Users", value: 70 },
    { name: "Inactive Users", value: 30 },
  ];

  const COLORS = ["#3B82F6", "#F472B6"];

  // 🟡 Dummy Feedbacks
  const feedbacks = [
    { id: 1, name: "John Doe", message: "Great platform!", date: "2h ago" },
    { id: 2, name: "Sarah", message: "Easy to find teammates.", date: "5h ago" },
    { id: 3, name: "Michael", message: "UI looks clean 👍", date: "1d ago" },
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
    
    {/* Sidebar */}
    <AdminNavbar />

    {/* Main Content */}
    <div className="flex-1 p-8">

      {/* 🔷 Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-textSecondary">
          Welcome back! Here's what's happening today.
        </h2>
      </div>

      {/* 🔷 Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Students */}
        <div className="relative p-6 rounded-2xl bg-gradient-to-br from-primary to-blue-200 text-white shadow-lg hover:scale-[1.02] transition">
          <div className="absolute top-4 right-4 opacity-20">
            <Users size={60} />
          </div>
          <h2 className="text-sm uppercase tracking-wide font-bold">New Users</h2>
          <p className="text-4xl font-bold mt-2">
            {report.totalStudents || 0}
          </p>
        </div>

        {/* Projects */}
        <div className="relative p-6 rounded-2xl bg-gradient-to-br from-secondary to-pink-200 text-white shadow-lg hover:scale-[1.02] transition">
          <div className="absolute top-4 right-4 opacity-20">
            <Folder size={60} />
          </div>
          <h2 className="text-sm uppercase tracking-wide font-bold text-textPrimary">New Projects</h2>
          <p className="text-4xl font-bold mt-2 text-textPrimary">
            {report.totalProjects || 0}
          </p>
        </div>

        {/* Requests */}
        <div className="relative p-6 rounded-2xl bg-gradient-to-br from-accent to-yellow-200 text-black shadow-lg hover:scale-[1.02] transition">
          <div className="absolute top-4 right-4 opacity-20">
            <Bell size={60} />
          </div>
          <h2 className="text-sm uppercase tracking-wide font-bold">All Requests</h2>
          <p className="text-4xl font-bold mt-2">
            {report.totalRequests || 0}
          </p>
        </div>

        {/* Pending */}
        <div className="relative p-6 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-200 text-white shadow-lg hover:scale-[1.02] transition">
          <div className="absolute top-4 right-4 opacity-20">
            <Clock size={60} />
          </div>
          <h2 className="text-sm uppercase tracking-wide font-bold">Pending Requests</h2>
          <p className="text-4xl font-bold mt-2">
            {report.pendingRequests || 0}
          </p>
        </div>

      </div>

      {/* 🔻 Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">

        {/* 🔵 Chart Card */}
        <div className="p-6 rounded-2xl bg-white/70 backdrop-blur-xl shadow-xl border border-white/40">
          <h2 className="text-lg font-semibold mb-4 text-textPrimary">
            User Activity
          </h2>

          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={userStats}
                cx="50%"
                cy="50%"
                outerRadius={90}
                dataKey="value"
                label={({ percent }) =>
                  `${(percent * 100).toFixed(0)}%`
                }
              >
                {userStats.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

          {/* Legend */}
          <div className="flex justify-center gap-6 mt-4 text-sm">
            <span className="flex items-center gap-2">
              <div className="w-3 h-3 bg-primary rounded-full"></div>
              Active
            </span>
            <span className="flex items-center gap-2">
              <div className="w-3 h-3 bg-secondary rounded-full"></div>
              Inactive
            </span>
          </div>
        </div>

        {/* 🟡 Feedback Panel */}
        <div className="p-6 rounded-2xl bg-white/70 backdrop-blur-xl shadow-xl border border-white/40">
          
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-textPrimary">
              Latest Feedbacks
            </h2>

            <Link
              to="/adminfeedbacks"
              className="text-sm text-primary font-medium hover:underline"
            >
              View All →
            </Link>
          </div>

          <div className="space-y-4 max-h-72 overflow-y-auto">

            {feedbacks.map((fb) => (
              <div
                key={fb.id}
                className="p-4 rounded-xl bg-gradient-to-r from-accent/10 to-secondary/10 hover:shadow-lg transition"
              >
                <div className="flex justify-between items-center mb-1">
                  <p className="font-semibold text-textPrimary">
                    {fb.name}
                  </p>
                  <span className="text-xs text-textSecondary">
                    {fb.date}
                  </span>
                </div>

                <p className="text-sm text-textSecondary">
                  {fb.message}
                </p>
              </div>
            ))}

          </div>
        </div>

      </div>

    </div>
  </div>
  );
};

export default Admindashboard;