import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import InsertPost from './pages/Projects/InsertProject';
import YourProjects from './pages/Projects/YourProjects';
import AllProjects from './pages/Projects/AllProjects';
import Notifications from './pages/Notifications/Notifications';
import './App.css';

function App() {
  return (
    <div className="app-layout">
      <div className="app-sidebar">
        <Navbar />
      </div>

      <main className="app-main-content">
        <Routes>
          <Route path="/" element={
            <div style={{ padding: '40px', fontSize: '24px', fontWeight: 'bold' }}>
              ProjectMate Frontend Dashboard 🚀
            </div>
          } />
          <Route path="/your-projects" element={<YourProjects />} />
          <Route path="/all-projects" element={<AllProjects />} />
          <Route path="/notifications" element={<Notifications />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;