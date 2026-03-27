import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    department: '',
    yearOfStudy: '',
    password: '',
    confirmPassword: '',
    studentId: '',
    degreeProgram: '',
    specialization: '',
    semester: '',
    bio: ''
  });

  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleNextStep1 = () => {
    const { firstName, lastName, email, department, yearOfStudy } = formData;
    if (!firstName || !lastName || !email || !department || !yearOfStudy) {
      setError('Please fill all required fields to continue.');
      return;
    }
    const emailRegex = /^\S+@\S+\.\S+$/i;
    if (!emailRegex.test(email)) {
      setError('Please provide a valid email address.');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleNextStep2 = () => {
    const { password, confirmPassword } = formData;
    if (!password || !confirmPassword) {
      setError('Please fill in and confirm your password.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!agreedToTerms) {
      setError('You must agree to the Terms of Service and Privacy Policy to continue.');
      return;
    }
    setError('');
    setStep(3);
  };

  const prevStep = () => {
    setError('');
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { studentId, degreeProgram, specialization, semester } = formData;
    if (!studentId || !degreeProgram || !specialization || !semester) {
      setError('Please fill all required fields to create your account.');
      return;
    }

    const studentIdRegex = /^it\d{8}$/i;
    if (!studentIdRegex.test(studentId)) {
      setError('Student ID must start with "IT" followed by exactly 8 digits.');
      return;
    }
    
    // Combining first and last name for backend full name requirement
    const fullName = `${formData.firstName} ${formData.lastName}`.trim();

    const res = await register({
      fullName,
      studentId: formData.studentId,
      email: formData.email,
      password: formData.password,
      department: formData.department,
      degreeProgram: formData.degreeProgram,
      specialization: formData.specialization,
      yearOfStudy: formData.yearOfStudy,
      semester: formData.semester,
      bio: formData.bio
    });
    if (res.success) {
      navigate('/dashboard');
    } else {
      setError(res.message);
    }
  };

  return (
    <div id="page-register" className="page active" style={{ display: 'flex' }}>
      <div className="auth-blob-1"></div>
      <div className="auth-blob-2"></div>
      <div className="reg-container" style={{ paddingTop: '1.5rem' }}>
        <div className="auth-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <div className="brand-dot" style={{ background: 'var(--p)' }}></div> ProjectMate
        </div>
        
        <div className="reg-card">
          <div className="auth-header" style={{ marginBottom: '1.25rem' }}>
            <h2>Create your account</h2>
            <p>Join ProjectMate and find your ideal project team</p>
          </div>

          <div className="step-indicator">
            <div className={`step-dot ${step >= 1 ? (step === 1 ? 'current' : 'done') : ''}`}>1</div>
            <div className={`step-line ${step >= 2 ? 'done' : ''}`}></div>
            <div className={`step-dot ${step >= 2 ? (step === 2 ? 'current' : 'done') : ''}`}>2</div>
            <div className={`step-line ${step >= 3 ? 'done' : ''}`}></div>
            <div className={`step-dot ${step >= 3 ? (step === 3 ? 'current' : 'done') : ''}`}>3</div>
          </div>

          {error && <div className="form-error show" style={{ marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

          {step === 1 && (
            <div className="step-panel active">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">First Name</label>
                  <input type="text" className="form-input" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Ashan" />
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name</label>
                  <input type="text" className="form-input" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Kavinda" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input type="email" className="form-input" name="email" value={formData.email} onChange={handleChange} placeholder="student@example.com" />
                <div className="form-hint">Enter your primary email address</div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Department</label>
                  <select className="form-input" name="department" value={formData.department} onChange={handleChange}>
                    <option value="">Select department</option>
                    <option>Information Technology</option>
                    <option>Computer Science</option>
                    <option>Software Engineering</option>
                    <option>Data Science</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Year of Study</label>
                  <select className="form-input" name="yearOfStudy" value={formData.yearOfStudy} onChange={handleChange}>
                    <option value="">Select year</option>
                    <option>Year 1</option><option>Year 2</option><option>Year 3</option><option>Year 4</option>
                  </select>
                </div>
              </div>
              <button className="btn btn-primary btn-full" style={{ padding: '.8rem' }} onClick={handleNextStep1} type="button">Continue →</button>
              <div className="auth-footer-text" style={{ marginTop: '.75rem' }}>
                Already have an account? <Link to="/login" style={{ cursor: 'pointer' }}>Sign in</Link>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="step-panel active">
              <p style={{ fontSize: '.85rem', color: 'var(--mid)', marginBottom: '1.25rem' }}>Secure your account with a strong password.</p>
              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="pw-wrap">
                  <input type="password" className="form-input" name="password" value={formData.password} onChange={handleChange} placeholder="Create a strong password" />
                  <button className="pw-toggle" type="button">👁️</button>
                </div>
                <div className="pw-label">Enter a password</div>
              </div>
              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <div className="pw-wrap">
                  <input type="password" className="form-input" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Repeat your password" />
                  <button className="pw-toggle" type="button">👁️</button>
                </div>
              </div>
              <label className="agree-row">
                <input type="checkbox" checked={agreedToTerms} onChange={(e) => setAgreedToTerms(e.target.checked)} />
                I agree to the <span style={{ color: 'var(--p)', fontWeight: 600 }}>Terms of Service</span> and <span style={{ color: 'var(--p)', fontWeight: 600 }}>Privacy Policy</span>
              </label>
              <div style={{ display: 'flex', gap: '.6rem' }}>
                <button className="btn btn-outline" onClick={prevStep} type="button">← Back</button>
                <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={handleNextStep2} type="button">Continue →</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="step-panel active">
              <p style={{ fontSize: '.85rem', color: 'var(--mid)', marginBottom: '1.25rem' }}>Almost done! A few more details to personalize your experience.</p>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Student ID</label>
                  <input type="text" className="form-input" name="studentId" value={formData.studentId} onChange={handleChange} placeholder="e.g. IT23341968" />
                </div>
                <div className="form-group">
                  <label className="form-label">Degree Program</label>
                  <input type="text" className="form-input" name="degreeProgram" value={formData.degreeProgram} onChange={handleChange} placeholder="e.g. BSc (Hons) IT" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Specialization</label>
                  <select className="form-input" name="specialization" value={formData.specialization} onChange={handleChange}>
                    <option value="">Select specialization</option>
                    <option>Software Engineering (SE)</option>
                    <option>Data Science (DS)</option>
                    <option>Computer Science (CS)</option>
                    <option>Information Technology (IT)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Semester</label>
                  <select className="form-input" name="semester" value={formData.semester} onChange={handleChange}>
                    <option value="">Select semester</option>
                    <option>Semester 1</option>
                    <option>Semester 2</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Bio <span style={{ fontWeight: 400, color: 'var(--mid)' }}>(optional)</span></label>
                <input type="text" className="form-input" name="bio" value={formData.bio} onChange={handleChange} placeholder="Tell teammates a bit about yourself..." />
              </div>
              <div className="alert-info" style={{ marginBottom: '1rem', marginTop: '.75rem' }}>ℹ️ You can add skills, interests, and availability from your profile after signing up.</div>
              <div style={{ display: 'flex', gap: '.6rem' }}>
                <button className="btn btn-outline" onClick={prevStep} type="button">← Back</button>
                <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={handleSubmit} type="button">🚀 Create Account</button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Register;
