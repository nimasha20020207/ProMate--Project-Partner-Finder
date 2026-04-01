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

// Admin Pages (UNCHANGED PATHS)
import Admindashboard from './pages/Admin/Admindashboard';
import Projectmanagement from './pages/Admin/Projectmanagement';
import Studentmanagement from './pages/Admin/Studentmanagement';
import Requestmanagement from './pages/Admin/Requestmanagement';
import AdminFeedbacks from './pages/Admin/AdminFeedbacks';

import './App.css';

// 🔐 Private Route
const PrivateRoute = ({ children }) => {
  const { token, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!token) return <Navigate to="/login" />;

  return (
    <div className="flex h-screen">
      <Navbar />
      <main className="main-area flex-1 overflow-y-auto p-4">
        {children}
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Routes>

        {/* 🌐 Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* 👤 User */}
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/change-password" element={<PrivateRoute><ChangePassword /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><ProfileView /></PrivateRoute>} />
        <Route path="/profile/:id" element={<PrivateRoute><ProfileView /></PrivateRoute>} />
        <Route path="/edit-profile" element={<PrivateRoute><EditProfile /></PrivateRoute>} />
        <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />

        {/* 🤖 Recommendations */}
        <Route path="/recs" element={<PrivateRoute><Recommendations /></PrivateRoute>} />
        <Route path="/sturecs" element={<PrivateRoute><Candidates /></PrivateRoute>} />
        <Route path="/feedbacks" element={<PrivateRoute><Feedbacks /></PrivateRoute>} />
        <Route path="/recprojects" element={<PrivateRoute><RecProjects /></PrivateRoute>} />

        {/* 📁 Projects */}
        <Route path="/insert-project" element={<PrivateRoute><InsertPost /></PrivateRoute>} />
        <Route path="/your-projects" element={<PrivateRoute><YourProjects /></PrivateRoute>} />
        <Route path="/all-projects" element={<PrivateRoute><AllProjects /></PrivateRoute>} />
        <Route path="/notifications" element={<PrivateRoute><Notifications /></PrivateRoute>} />

        {/* 🛠 Admin (UNCHANGED PATHS) */}
        <Route path="/admindashboard" element={<PrivateRoute><Admindashboard /></PrivateRoute>} />
        <Route path="/projectman" element={<PrivateRoute><Projectmanagement /></PrivateRoute>} />
        <Route path="/studentman" element={<PrivateRoute><Studentmanagement /></PrivateRoute>} />
        <Route path="/requestman" element={<PrivateRoute><Requestmanagement /></PrivateRoute>} />
        <Route path="/adminfeedbacks" element={<PrivateRoute><AdminFeedbacks /></PrivateRoute>} />

        {/* 🚫 Fallback */}
        <Route path="*" element={<div>Page not found</div>} />

      </Routes>

      <FAQChatbot />
    </AuthProvider>
  );
}

export default App;