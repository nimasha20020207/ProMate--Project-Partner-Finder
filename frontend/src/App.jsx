import React from 'react';
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
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
import ProjectView from './pages/RecEngine/ProjectView';
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
import History from './pages/Admin/History'

import './App.css';

// 🔐 Protected Route Component
import ProtectedRoute from './components/ProtectedRoute';

// Simple Layout for pages that NEED the FAQ Chatbot but NO extra Navbar
const BaseLayout = () => (
  <>
    <Outlet />
    <FAQChatbot />
  </>
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <BaseLayout />,
    children: [
      { index: true, element: <Landing /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "forgot-password", element: <ForgotPassword /> },
      { path: "verify-otp", element: <VerifyOTP /> },
      { path: "reset-password", element: <ResetPassword /> },
      
      // 👤 Student & Admin Routes (Protected routes handle their own Navbars)
      { path: "dashboard", element: <ProtectedRoute allowedRoles={['student']}><Dashboard /></ProtectedRoute> },
      { path: "change-password", element: <ProtectedRoute allowedRoles={['student']}><ChangePassword /></ProtectedRoute> },
      { path: "profile", element: <ProtectedRoute allowedRoles={['student']}><ProfileView /></ProtectedRoute> },
      { path: "profile/:id", element: <ProtectedRoute allowedRoles={['student', 'admin']}><ProfileView /></ProtectedRoute> },
      { path: "edit-profile", element: <ProtectedRoute allowedRoles={['student']}><EditProfile /></ProtectedRoute> },
      { path: "settings", element: <ProtectedRoute allowedRoles={['student']}><Settings /></ProtectedRoute> },
      { path: "recs", element: <ProtectedRoute allowedRoles={['student']}><Recommendations /></ProtectedRoute> },
      { path: "sturecs", element: <ProtectedRoute allowedRoles={['student']}><Candidates /></ProtectedRoute> },
      { path: "feedbacks", element: <ProtectedRoute allowedRoles={['student']}><Feedbacks /></ProtectedRoute> },
      { path: "recprojects", element: <ProtectedRoute allowedRoles={['student']}><RecProjects /></ProtectedRoute> },
      { path: "projectview", element: <ProtectedRoute allowedRoles={['student']}><ProjectView /></ProtectedRoute> },
      { path: "insert-project", element: <ProtectedRoute allowedRoles={['student']}><InsertPost /></ProtectedRoute> },
      { path: "your-projects", element: <ProtectedRoute allowedRoles={['student']}><YourProjects /></ProtectedRoute> },
      { path: "all-projects", element: <ProtectedRoute allowedRoles={['student']}><AllProjects /></ProtectedRoute> },
      { path: "notifications", element: <ProtectedRoute allowedRoles={['student']}><Notifications /></ProtectedRoute> },
      { path: "admindashboard", element: <ProtectedRoute allowedRoles={['admin']}><Admindashboard /></ProtectedRoute> },
      { path: "projectman", element: <ProtectedRoute allowedRoles={['admin']}><Projectmanagement /></ProtectedRoute> },
      { path: "studentman", element: <ProtectedRoute allowedRoles={['admin']}><Studentmanagement /></ProtectedRoute> },
      { path: "requestman", element: <ProtectedRoute allowedRoles={['admin']}><Requestmanagement /></ProtectedRoute> },
      { path: "adminfeedbacks", element: <ProtectedRoute allowedRoles={['admin']}><AdminFeedbacks /></ProtectedRoute> },
      { path: "history", element: <ProtectedRoute allowedRoles={['admin']}><History /></ProtectedRoute> },
      
      // 🚫 Fallback
      { path: "*", element: <div className="flex items-center justify-center h-screen bg-slate-50"><h1 className="text-2xl font-bold text-gray-500">404 - Page Not Found</h1></div> }
    ]
  }
]);

export default function App() {
  return null;
}
