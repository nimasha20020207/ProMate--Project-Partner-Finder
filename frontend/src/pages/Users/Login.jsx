import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/images/logo.jpeg';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ identifier: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await login(formData.identifier, formData.password);
    if (res.success) {
      if (res.user && res.user.role === 'admin') {
        navigate('/admindashboard');
      } else {
        navigate('/dashboard');
      }
    } else {
      setError(res.message);
    }
  };

  return (
    <div id="page-login" className="page active">
      <div className="auth-blob-1"></div>
      <div className="auth-blob-2"></div>
      
      <div className="auth-container">
        <div className="auth-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img src={logo} alt="ProMate Logo" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
          <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--p)' }}>ProMate</span>
        </div>
        
        <div className="auth-card">
          <div className="auth-header">
            <h2>Welcome back 👋</h2>
            <p>Sign in to your ProjectMate account</p>
          </div>
          
          <form onSubmit={handleSubmit}>
            {error && <div className="form-error show" style={{ marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
            
            <div className="form-group">
              <label className="form-label">Student ID or Email Address</label>
              <input
                type="text"
                className="form-input"
                name="identifier"
                placeholder="Enter your Student ID or Email"
                value={formData.identifier}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="pw-wrap">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  className="pw-toggle"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>
            
            <div className="remember-row">
              <label className="remember-check">
                <input type="checkbox" /> Remember me
              </label>
              <Link to="/forgot-password" style={{ textDecoration: 'none' }}>
                <span className="forgot-link" style={{ cursor: 'pointer' }}>Forgot password?</span>
              </Link>
            </div>
            
            <button type="submit" className="btn btn-primary btn-full" style={{ padding: '.8rem' }}>
              Sign In →
            </button>
          </form>

          <div className="auth-divider">or continue with</div>
          <div className="social-btns">
            <button className="btn btn-outline" type="button">🔵 Google</button>
            <button className="btn btn-outline" type="button">⚫ GitHub</button>
          </div>
          
          <div className="auth-footer-text">
            Don't have an account? <Link to="/register" style={{ cursor: 'pointer' }}>Create one →</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
