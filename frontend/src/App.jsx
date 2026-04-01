import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Landing from './pages/Landing';
import Login from './pages/Users/Login';
import Register from './pages/Users/Register';
import Dashboard from './pages/Users/Dashboard';
import ProfileView from './pages/Users/ProfileView';
import EditProfile from './pages/Users/EditProfile';
import Settings from './pages/Users/Settings';
import ChangePassword from './pages/Users/ChangePassword';
import Navbar from './components/Navbar';
import ForgotPassword from './pages/Users/ForgotPassword';
import VerifyOTP from './pages/Users/VerifyOTP';
import ResetPassword from './pages/Users/ResetPassword';
import FAQChatbot from './components/FAQChatbot';

// ProjectMate Recommendation Pages
import Recommendations from './pages/RecEngine/ProjectRecommendations';
import Candidates from './pages/RecEngine/StudentRecommendations';
import Feedbacks from './pages/RecEngine/Feedbacks';
import RecProjects from './pages/RecEngine/RecProjects';

const PrivateRoute = ({ children }) => {
  const { token, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!token) return <Navigate to="/login" />;

  return (
    <div className="flex h-screen">
      <Navbar />
      <main className="main-area flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Private User Routes */}
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/change-password" element={<PrivateRoute><ChangePassword /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><ProfileView /></PrivateRoute>} />
          <Route path="/profile/:id" element={<PrivateRoute><ProfileView /></PrivateRoute>} />
          <Route path="/edit-profile" element={<PrivateRoute><EditProfile /></PrivateRoute>} />
          <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />

          {/* ProjectMate Recommendation Routes */}
          <Route path="/recs" element={<PrivateRoute><Recommendations /></PrivateRoute>} />
          <Route path="/sturecs" element={<PrivateRoute><Candidates /></PrivateRoute>} />
          <Route path="/feedbacks" element={<PrivateRoute><Feedbacks /></PrivateRoute>} />
          <Route path="/recprojects" element={<PrivateRoute><RecProjects /></PrivateRoute>} />
        </Routes>
        <FAQChatbot />
      </AuthProvider>
    </Router>
  );
}

export default App;