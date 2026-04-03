import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle2 } from 'lucide-react';
import logo from '../../assets/images/logo.jpeg';

const Register = () => {
  const { register, checkAvailability } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    department: '',
    yearOfStudy: '',
    password: '',
    confirmPassword: '',
    studentId: '',
    specialization: '',
    semester: '',
    bio: '',
    contactNumber: '',
    preferredRoles: []
  });

  const [fieldErrors, setFieldErrors] = useState({
    email: '',
    studentId: ''
  });

  const rolesOptions = ["Frontend Developer", "Backend Developer", "Fullstack Developer", "Mobile App Developer", "ML Engineer", "Data Scientist", "UI/UX Designer", "DevOps Engineer", "QA Engineer", "Project Manager"];
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = () => setActiveDropdown(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (error) setError('');
    if (fieldErrors[name]) setFieldErrors({ ...fieldErrors, [name]: '' });
  };

  const handleNextStep1 = async () => {
    const { firstName, lastName, email, department, yearOfStudy } = formData;
    if (!firstName || !lastName || !email || !department || !yearOfStudy) {
      setError('Please fill all required fields to continue.');
      return;
    }
    
    const hasNumber = /\d/;
    if (hasNumber.test(firstName) || hasNumber.test(lastName)) {
      setError('Names cannot contain numbers.');
      return;
    }

    const emailRegex = /^\S+@\S+\.\S+$/i;
    if (!emailRegex.test(email)) {
      setError('Please provide a valid email address.');
      return;
    }

    // Check availability
    const res = await checkAvailability({ email });
    
    // Only block if the backend explicitly confirms the email is already registered
    if (res.available === false) {
      setFieldErrors(prev => ({ ...prev, email: res.message }));
      return;
    }

    // If there was a technical error (server error during check), we log it
    // but DON'T block the user. The final Create Account call will still catch it.
    if (res.success === false) {
      console.warn('Availability check failed technically:', res.message);
      // We clear the error so they aren't stuck by a 500 error
      setFieldErrors(prev => ({ ...prev, email: '' }));
    }

    setError('');
    setFieldErrors(prev => ({ ...prev, email: '' }));
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
    const { studentId, specialization, semester } = formData;
    if (!studentId || !specialization || !semester) {
      setError('Please fill all required fields to create your account.');
      return;
    }

    const studentIdRegex = /^it\d{8}$/i;
    if (!studentIdRegex.test(studentId)) {
      setError('Student ID must start with "IT" followed by exactly 8 digits.');
      return;
    }

    // Check studentId availability
    const resAvail = await checkAvailability({ studentId });
    if (!resAvail.available) {
      setFieldErrors(prev => ({ ...prev, studentId: resAvail.message }));
      return;
    }
    
    const fullName = `${formData.firstName} ${formData.lastName}`.trim();

    const res = await register({
      fullName,
      studentId: formData.studentId,
      email: formData.email,
      password: formData.password,
      department: formData.department,
      specialization: formData.specialization,
      yearOfStudy: formData.yearOfStudy,
      semester: formData.semester,
      bio: formData.bio,
      contactNumber: formData.contactNumber,
      preferredRoles: formData.preferredRoles
    });
    if (res.success) {
      setShowSuccess(true);
    } else {
      setError(res.message);
    }
  };

  return (
    <div id="page-register" className="page active" style={{ display: 'flex' }}>
      <div className="auth-blob-1"></div>
      <div className="auth-blob-2"></div>
      <div className="reg-container" style={{ paddingTop: '1.5rem' }}>
        <div className="auth-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img src={logo} alt="ProMate Logo" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
          <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--p)' }}>ProMate</span>
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
                <input type="email" className={`form-input ${fieldErrors.email ? 'input-error' : ''}`} name="email" value={formData.email} onChange={handleChange} placeholder="student@example.com" />
                {fieldErrors.email && <div className="field-error" style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.35rem', fontWeight: 500 }}>{fieldErrors.email}</div>}
                <div className="form-hint">Enter your primary email address</div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Department</label>
                  <select className="form-input" name="department" value={formData.department} onChange={handleChange}>
                    <option value="">Select department</option>
                    <option>Computing</option>
                    <option>Business</option>
                    <option>Engineering</option>
                    <option>Humanities and Sciences</option>
                    <option>Architecture</option>
                    <option>Graduate Studies</option>
                    <option>SLIIT International Programmes</option>
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
                  <input type={showPassword ? "text" : "password"} className="form-input" name="password" value={formData.password} onChange={handleChange} placeholder="Create a strong password" />
                  <button className="pw-toggle" type="button" onClick={() => setShowPassword(!showPassword)}>{showPassword ? "🙈" : "👁️"}</button>
                </div>
                <div className="pw-label">Enter a password</div>
              </div>
              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <div className="pw-wrap">
                  <input type={showConfirmPassword ? "text" : "password"} className="form-input" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Repeat your password" />
                  <button className="pw-toggle" type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>{showConfirmPassword ? "🙈" : "👁️"}</button>
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
                  <input type="text" className={`form-input ${fieldErrors.studentId ? 'input-error' : ''}`} name="studentId" value={formData.studentId} onChange={handleChange} placeholder="e.g. IT23341968" />
                  {fieldErrors.studentId && <div className="field-error" style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.35rem', fontWeight: 500 }}>{fieldErrors.studentId}</div>}
                </div>
                <div className="form-group">
                  <label className="form-label">Specialization</label>
                  <select className="form-input" name="specialization" value={formData.specialization} onChange={handleChange}>
                    <option value="">Select specialization</option>
                    <option value="Artificial Intelligence">Artificial Intelligence</option>
                    <option value="Software Engineering">Software Engineering</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Data Science">Data Science</option>
                    <option value="Cyber Security">Cyber Security</option>
                    <option value="Computer System & Network Engineering">Computer System & Network Engineering</option>
                    <option value="Information Systems Engineering">Information Systems Engineering</option>
                    <option value="Interactive Media">Interactive Media</option>
                    <option value="Computer Systems Engineering">Computer Systems Engineering</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
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

              <div className="form-group">
                <label className="form-label">Contact Number <span style={{ fontWeight: 400, color: 'var(--mid)' }}>(optional)</span></label>
                <input type="text" className="form-input" name="contactNumber" value={formData.contactNumber} onChange={handleChange} placeholder="+94 77 123 4567" />
              </div>

              <div className="form-group">
                <label className="form-label">Preferred Roles <span style={{ fontWeight: 400, color: 'var(--mid)' }}>(at least one)</span></label>
                <div className="multiselect-container" onClick={(e) => e.stopPropagation()}>
                  <div className={`multiselect-header ${activeDropdown === 'roles' ? 'multiselect-header-focus' : ''}`} onClick={() => setActiveDropdown(activeDropdown === 'roles' ? null : 'roles')}>
                    {formData.preferredRoles.length === 0 ? (
                      <span className="multiselect-placeholder">Select roles...</span>
                    ) : (
                      formData.preferredRoles.map(role => (
                        <span key={role} className="multiselect-chip">
                          {role}
                          <span className="multiselect-chip-remove" onClick={(e) => { 
                            e.stopPropagation(); 
                            const updated = formData.preferredRoles.filter(r => r !== role);
                            setFormData({ ...formData, preferredRoles: updated });
                          }}>×</span>
                        </span>
                      ))
                    )}
                    <div style={{ marginLeft: 'auto', opacity: 0.5 }}>{activeDropdown === 'roles' ? '▲' : '▼'}</div>
                  </div>

                  {activeDropdown === 'roles' && (
                    <div className="multiselect-dropdown" style={{ backgroundColor: 'white' }}>
                      {rolesOptions.map(role => {
                        const isSelected = formData.preferredRoles.includes(role);
                        return (
                          <div 
                            key={role} 
                            className={`multiselect-option ${isSelected ? 'selected' : ''}`}
                            onClick={() => {
                              const exists = formData.preferredRoles.includes(role);
                              const updated = exists 
                                ? formData.preferredRoles.filter(r => r !== role) 
                                : [...formData.preferredRoles, role];
                              setFormData({ ...formData, preferredRoles: updated });
                            }}
                          >
                            {role}
                            {isSelected && <span>✓</span>}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
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

      {showSuccess && (
        <div className="success-modal-overlay">
          <div className="success-modal-card">
            <div className="success-bounce-icon">
              <CheckCircle2 size={60} color="#10b981" />
            </div>
            <h2>Welcome to ProMate!</h2>
            <p>Your account has been created successfully. Let's find your perfect project partner.</p>
            <button className="btn btn-primary btn-full success-btn" onClick={() => navigate('/dashboard')}>
              Get Started 🚀
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
