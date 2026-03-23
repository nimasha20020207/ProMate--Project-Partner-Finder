import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import ProfileForm from './pages/ProfileForm';
import ProfileView from './pages/ProfileView';
import EditProfile from './pages/EditProfile';
import Settings from './pages/Settings';
import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar';
import ForgotPassword from './pages/ForgotPassword';
import VerifyOTP from './pages/VerifyOTP';
import ResetPassword from './pages/ResetPassword';

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
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          
          <Route path="/onboarding" element={
            <PrivateRoute><ProfileForm /></PrivateRoute>
          } />
          <Route path="/dashboard" element={
            <PrivateRoute><Dashboard /></PrivateRoute>
          } />
          <Route path="/profile" element={
            <PrivateRoute><ProfileView /></PrivateRoute>
          } />
          <Route path="/profile/:id" element={
            <PrivateRoute><ProfileView /></PrivateRoute>
          } />
          <Route path="/edit-profile" element={
            <PrivateRoute><EditProfile /></PrivateRoute>
          } />
          <Route path="/settings" element={
            <PrivateRoute><Settings /></PrivateRoute>
          } />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;