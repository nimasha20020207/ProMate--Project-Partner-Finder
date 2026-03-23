import React from 'react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div id="page-landing" className="page active" style={{ display: 'block' }}>
      <nav className="landing-nav" id="landingNav">
        <div className="landing-brand" onClick={() => navigate('/')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '32px', height: '32px', background: 'var(--border)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: 'var(--mid)', fontWeight: 500 }}>Logo</div>
          <div className="brand-dot"></div> ProjectMate
        </div>
        <div className="landing-nav-links">
          <span className="landing-nav-link" onClick={() => scrollToSection('features')}>Features</span>
          <span className="landing-nav-link" onClick={() => scrollToSection('how')}>How It Works</span>
          <span className="landing-nav-link" onClick={() => scrollToSection('stats')}>Stats</span>
        </div>
        <div className="landing-nav-actions">
          <button className="btn btn-outline btn-sm" onClick={() => navigate('/login')}>Log In</button>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/register')}>Get Started →</button>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-bg"></div>
        <div className="hero-grid-bg"></div>
        <div className="hero-blob-1"></div>
        <div className="hero-blob-2"></div>
        <div className="hero-content">
          <div className="hero-badge"><div className="hero-badge-dot"></div> AI-Powered Partner Matching</div>
          <h1>Find Your Perfect <span className="gradient-text">Project Partner</span> at University</h1>
          <p className="hero-desc">ProjectMate uses intelligent compatibility scoring to match you with the right teammates based on skills, availability, and interests. No more awkward groupings.</p>
          <div className="hero-actions">
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/register')}>🚀 Create Free Account</button>
            <button className="btn btn-outline btn-lg" onClick={() => navigate('/login')}>Sign In →</button>
          </div>
          <div className="hero-social-proof">
            <div className="avatar-stack">
              <div className="avatar-sm" style={{ background: 'linear-gradient(135deg,#38BDF8,#2563EB)'}}>AK</div>
              <div className="avatar-sm" style={{ background: 'linear-gradient(135deg,#1E3A8A,#0369A1)'}}>SP</div>
              <div className="avatar-sm" style={{ background: 'linear-gradient(135deg,#0369A1,#38BDF8)'}}>NF</div>
              <div className="avatar-sm" style={{ background: 'linear-gradient(135deg,#2563EB,#1E3A8A)'}}>RM</div>
              <div className="avatar-sm" style={{ background: 'linear-gradient(135deg,#7C3AED,#2563EB)'}}>+</div>
            </div>
            <div className="social-text"><strong>1,200+ students</strong> already found their team</div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-card-float">
            <div className="match-row">
              <div className="match-avatar" style={{ background: 'linear-gradient(135deg,#38BDF8,#2563EB)'}}>NK</div>
              <div className="match-info"><h4>Nimal Karunaratne</h4><p>Frontend Dev · 10 hrs/week</p></div>
              <div className="match-score">92%</div>
            </div>
            <div className="match-bar-bg"><div className="match-bar" style={{ width: '92%' }}></div></div>
            <div className="skill-pips"><span className="skill-pip">React</span><span className="skill-pip">Node.js</span><span className="skill-pip">MongoDB</span></div>
          </div>
          <div className="hero-card-float">
            <div className="match-row">
              <div className="match-avatar" style={{ background: 'linear-gradient(135deg,#1E3A8A,#0369A1)'}}>SR</div>
              <div className="match-info"><h4>Sithumi Rathnayake</h4><p>AI Engineer · 8 hrs/week</p></div>
              <div className="match-score">85%</div>
            </div>
            <div className="match-bar-bg"><div className="match-bar" style={{ width: '85%' }}></div></div>
            <div className="skill-pips"><span className="skill-pip">Python</span><span className="skill-pip">FastAPI</span><span className="skill-pip">TF-IDF</span></div>
          </div>
        </div>
      </section>

      <section className="features" id="features">
        <div className="section-label">Why ProjectMate</div>
        <div className="section-title">Everything you need to<br/>build the perfect team</div>
        <div className="section-sub">From smart AI matching to seamless request workflows — we've built the tools university students actually need.</div>
        <div className="features-grid">
          <div className="feature-card"><div className="feature-icon">🧠</div><h3>AI Compatibility Matching</h3><p>Our weighted scoring algorithm analyzes skill overlap, availability, and interest alignment to rank the most compatible partners for you.</p></div>
          <div className="feature-card"><div className="feature-icon">🎯</div><h3>Skill-Based Discovery</h3><p>Browse projects that specifically need your skills. No more scrolling through irrelevant listings — your matches are curated just for you.</p></div>
          <div className="feature-card"><div className="feature-icon">⚡</div><h3>Instant Request Workflow</h3><p>Send partner requests, accept or reject with one click, and watch your team lock automatically when all positions are filled.</p></div>
          <div className="feature-card"><div className="feature-icon">💡</div><h3>Smart Profile Suggestions</h3><p>AI suggests skills you might be missing based on your selected domain, helping you build a complete profile that attracts the right projects.</p></div>
          <div className="feature-card"><div className="feature-icon">📊</div><h3>Transparent Explanations</h3><p>Every match comes with a clear explanation. No black boxes — just honest, readable compatibility breakdowns.</p></div>
          <div className="feature-card"><div className="feature-icon">🔒</div><h3>University-Safe & Private</h3><p>Your data stays within your university ecosystem. No external integrations, no ads, no data selling. Just clean, focused collaboration.</p></div>
        </div>
      </section>

      <section className="steps" id="how">
        <div className="section-label">Getting Started</div>
        <div className="section-title">Up and running in minutes</div>
        <div className="steps-grid">
          <div className="step-card"><div className="step-num">1</div><h4>Create Profile</h4><p>Sign up with your university email and set your basic info.</p></div>
          <div className="step-card"><div className="step-num">2</div><h4>Add Your Skills</h4><p>Fill in your skills, interests, and weekly availability in your profile.</p></div>
          <div className="step-card"><div className="step-num">3</div><h4>Get Matched</h4><p>AI recommends the most compatible partners with clear explanations.</p></div>
          <div className="step-card"><div className="step-num">4</div><h4>Build Your Team</h4><p>Send requests, get accepted, and your project team locks automatically.</p></div>
        </div>
      </section>

      <div className="stats-bar" id="stats">
        <div className="stat-item"><span className="stat-num">1,200+</span><span className="stat-label">Active Students</span></div>
        <div className="stat-item"><span className="stat-num">340+</span><span className="stat-label">Projects Posted</span></div>
        <div className="stat-item"><span className="stat-num">87%</span><span className="stat-label">Match Satisfaction</span></div>
        <div className="stat-item"><span className="stat-num">50+</span><span className="stat-label">Skills Tracked</span></div>
      </div>

      <section className="cta-section">
        <div className="cta-box">
          <h2>Ready to find your team?</h2>
          <p>Join 1,200+ students who've already stopped struggling with group formation. Create your free profile in under 2 minutes.</p>
          <div className="btn-actions" style={{ justifyContent: 'center' }}>
            <button className="btn btn-ghost btn-lg" onClick={() => navigate('/login')}>Log In</button>
            <button className="btn btn-lg" style={{ background: '#fff', color: 'var(--p)' }} onClick={() => navigate('/register')}>🚀 Get Started Free</button>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="footer-brand"><div className="brand-dot" style={{ background: 'var(--sky)' }}></div> ProjectMate</div>
        <div className="footer-text">© 2026 ProjectMate · IT3040 Project · University of Sri Lanka</div>
        <div className="footer-text">Built with 💙 by Module 1 Team</div>
      </footer>
    </div>
  );
};

export default Landing;
