import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/images/logo.jpeg';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const emailRegex = /^\S+@\S+\.\S+$/i;
    if (!email || !emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:3000/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      
      if (res.ok) {
        // Pass the email via state so the next screen knows who we are verifying
        navigate('/verify-otp', { state: { email } });
      } else {
        setError(data.message || 'Failed to send OTP.');
      }
    } catch (err) {
      setError('Server error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="page-login" className="page active" style={{ display: 'flex' }}>
      <div className="auth-blob-1"></div>
      <div className="auth-blob-2"></div>
      <div className="auth-card">
        <div className="auth-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img src={logo} alt="ProMate Logo" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
          <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--p)' }}>ProMate</span>
        </div>
        <div className="auth-header" style={{ marginBottom: '1.5rem' }}>
          <h2>Reset your Password</h2>
          <p>Enter your email address to receive a 6-digit verification code</p>
        </div>
        
        {error && <div className="form-error show" style={{ marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input 
              type="email" 
              className="form-input" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="student@example.com" 
            />
          </div>
          <button type="submit" className="btn btn-primary btn-full flex justify-center items-center" style={{ padding: '.8rem' }} disabled={loading}>
            {loading ? 'Sending Code...' : 'Send OTP verification'}
          </button>
        </form>
        <div className="auth-footer-text">
          Remember your password? <Link to="/login" style={{ cursor: 'pointer' }}>Log In</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
