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
      const res = await fetch('http://localhost:3000/api/profile/me', {
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
    const res = await fetch('http://localhost:3000/api/auth/login', {
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
    const res = await fetch('http://localhost:3000/api/auth/register', {
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

  const logout = () => {
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, fetchProfile }}>
      {!loading ? children : <div>Loading...</div>}
    </AuthContext.Provider>
  );
};
