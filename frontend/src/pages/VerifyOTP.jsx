import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const VerifyOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const email = location.state?.email;

  if (!email) {
    // If user arrived here directly without an email in state, redirect back
    navigate('/forgot-password');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (otp.length !== 6) {
      setError('Please enter the 6-digit code exactly.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:3000/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });
      const data = await res.json();
      
      if (res.ok) {
        // Pass both email and the verified OTP (as proof) to the final reset screen
        navigate('/reset-password', { state: { email, otp } });
      } else {
        setError(data.message || 'Invalid or expired OTP.');
      }
    } catch (err) {
      setError('Server error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page active" style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center' }}>
      <div className="auth-blob-1"></div>
      <div className="auth-blob-2"></div>
      <div className="auth-card" style={{ zIndex: 10 }}>
        <div className="auth-header" style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
          <h2>Verify Email</h2>
          <p>We sent a 6-digit code to <strong>{email}</strong></p>
        </div>
        
        {error && <div className="form-error show" style={{ marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group text-center">
            <label className="form-label" style={{ textAlign: 'center' }}>Authentication Code</label>
            <input 
              type="text" 
              className="form-input text-center text-2xl tracking-widest" 
              maxLength={6}
              value={otp} 
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} 
              placeholder="000000" 
              style={{ padding: '1rem' }}
            />
          </div>
          <button type="submit" className="btn btn-primary btn-full flex justify-center mt-4" style={{ padding: '.8rem' }} disabled={loading}>
            {loading ? 'Verifying...' : 'Verify Code'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyOTP;
