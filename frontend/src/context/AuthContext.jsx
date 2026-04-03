import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      fetchProfile();
    } else {
      localStorage.removeItem('token');
      setUser(null);
      setLoading(false);
    }
  }, [token]);

  const fetchProfile = async () => {
    try {
      const res = await fetch('http://127.0.0.1:3000/api/profile/me', {
        headers: {
          'x-auth-token': token
        }
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data); // data is the user object directly
      } else {
        setToken(null);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (identifier, password) => {
    const res = await fetch('http://127.0.0.1:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password })
    });
    
    const data = await res.json();
    if (res.ok) {
      setToken(data.token);
      return { success: true, user: data.user };
    }
    return { success: false, message: data.message };
  };

  const register = async (userData) => {
    const res = await fetch('http://127.0.0.1:3000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    
    const data = await res.json();
    if (res.ok) {
      setToken(data.token);
      return { success: true };
    }
    return { success: false, message: data.message };
  };

  const checkAvailability = async (fields) => {
    try {
      const res = await fetch('http://127.0.0.1:3000/api/auth/check-availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields)
      });
      if (!res.ok) {
        return { success: false, available: true, message: 'Server error during check' };
      }
      const data = await res.json();
      return { success: true, available: data.available, message: data.message };
    } catch (error) {
      console.error('Error checking availability:', error);
      return { success: false, available: true, message: 'Server unreachable' };
    }
  };

  const logout = () => {
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, fetchProfile, checkAvailability }}>
      {!loading ? children : <div>Loading...</div>}
    </AuthContext.Provider>
  );
};
