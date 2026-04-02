import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import FAQChatbot from './components/FAQChatbot';

// Auth & User Pages
import Landing from './pages/Landing';
import Login from './pages/Users/Login';
import Register from './pages/Users/Register';
import Dashboard from './pages/Users/Dashboard';
import ProfileView from './pages/Users/ProfileView';
import EditProfile from './pages/Users/EditProfile';
import Settings from './pages/Users/Settings';
import ChangePassword from './pages/Users/ChangePassword';
import ForgotPassword from './pages/Users/ForgotPassword';
import VerifyOTP from './pages/Users/VerifyOTP';
import ResetPassword from './pages/Users/ResetPassword';

// Recommendation Pages
import Recommendations from './pages/RecEngine/ProjectRecommendations';
import Candidates from './pages/RecEngine/StudentRecommendations';
import Feedbacks from './pages/RecEngine/Feedbacks';
import RecProjects from './pages/RecEngine/RecProjects';

// Project Pages
import InsertPost from './pages/Projects/InsertProject';
import YourProjects from './pages/Projects/YourProjects';
import AllProjects from './pages/Projects/AllProjects';
import Notifications from './pages/Notifications/Notifications';

// Admin Pages
import Admindashboard from './pages/Admin/Admindashboard';
import Projectmanagement from './pages/Admin/Projectmanagement';
import Studentmanagement from './pages/Admin/Studentmanagement';
import Requestmanagement from './pages/Admin/Requestmanagement';
import AdminFeedbacks from './pages/Admin/AdminFeedbacks';

import './App.css';

// 🔐 Protected Route Component
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Routes>

        {/* 🌐 Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* 👤 Student Routes */}
        <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['student']}><Dashboard /></ProtectedRoute>} />
        <Route path="/change-password" element={<ProtectedRoute allowedRoles={['student']}><ChangePassword /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute allowedRoles={['student']}><ProfileView /></ProtectedRoute>} />
        <Route path="/profile/:id" element={<ProtectedRoute allowedRoles={['student', 'admin']}><ProfileView /></ProtectedRoute>} />
        <Route path="/edit-profile" element={<ProtectedRoute allowedRoles={['student']}><EditProfile /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute allowedRoles={['student']}><Settings /></ProtectedRoute>} />

        {/* 🤖 Recommendations (Student Only) */}
        <Route path="/recs" element={<ProtectedRoute allowedRoles={['student']}><Recommendations /></ProtectedRoute>} />
        <Route path="/sturecs" element={<ProtectedRoute allowedRoles={['student']}><Candidates /></ProtectedRoute>} />
        <Route path="/feedbacks" element={<ProtectedRoute allowedRoles={['student']}><Feedbacks /></ProtectedRoute>} />
        <Route path="/recprojects" element={<ProtectedRoute allowedRoles={['student']}><RecProjects /></ProtectedRoute>} />

        {/* 📁 Projects (Student Only) */}
        <Route path="/insert-project" element={<ProtectedRoute allowedRoles={['student']}><InsertPost /></ProtectedRoute>} />
        <Route path="/your-projects" element={<ProtectedRoute allowedRoles={['student']}><YourProjects /></ProtectedRoute>} />
        <Route path="/all-projects" element={<ProtectedRoute allowedRoles={['student']}><AllProjects /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute allowedRoles={['student']}><Notifications /></ProtectedRoute>} />

        {/* 🛠 Admin Routes */}
        <Route path="/admindashboard" element={<ProtectedRoute allowedRoles={['admin']}><Admindashboard /></ProtectedRoute>} />
        <Route path="/projectman" element={<ProtectedRoute allowedRoles={['admin']}><Projectmanagement /></ProtectedRoute>} />
        <Route path="/studentman" element={<ProtectedRoute allowedRoles={['admin']}><Studentmanagement /></ProtectedRoute>} />
        <Route path="/requestman" element={<ProtectedRoute allowedRoles={['admin']}><Requestmanagement /></ProtectedRoute>} />
        <Route path="/adminfeedbacks" element={<ProtectedRoute allowedRoles={['admin']}><AdminFeedbacks /></ProtectedRoute>} />

        {/* 🚫 Fallback */}
        <Route path="*" element={<div className="flex items-center justify-center h-screen bg-slate-50"><h1 className="text-2xl font-bold text-gray-500">404 - Page Not Found</h1></div>} />

      </Routes>

      <FAQChatbot />
    </AuthProvider>
  );
}

export default App;
