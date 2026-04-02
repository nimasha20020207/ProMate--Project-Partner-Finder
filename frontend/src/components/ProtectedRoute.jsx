import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from './Navbar';
import AdminNavbar from './AdminNavbar';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, token, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If user data is not yet loaded, show loading
  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Check role authorization
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect based on their actual role
    if (user.role === 'admin') {
      return <Navigate to="/admindashboard" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }

  // Select the correct Navbar based on role
  const Navigation = user.role === 'admin' ? AdminNavbar : Navbar;

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Navigation />
      <main className="flex-1 overflow-y-auto p-4 transition-all duration-300">
        {children}
      </main>
    </div>
  );
};

export default ProtectedRoute;
