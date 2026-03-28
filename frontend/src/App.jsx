import React from 'react';
import {Routes, Route, Link} from 'react-router-dom';
import Admindashboard from './pages/Admin/Admindashboard';
import Projectmanagement from './pages/Admin/Projectmanagement';
import Studentmanagement from './pages/Admin/Studentmanagement';
import Requestmanagement from './pages/Admin/Requestmanagement';
import AdminFeedbacks from './pages/Admin/AdminFeedbacks';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Admindashboard/>} />
      </Routes>

      <Routes>
        <Route path="/projectman" element={<Projectmanagement/>} />
      </Routes>

      <Routes>
        <Route path="/studentman" element={<Studentmanagement/>} />
      </Routes>

      
      <Routes>
        <Route path="/requestman" element={<Requestmanagement/>} />
      </Routes>

      <Routes>
        <Route path="/adminfeedbacks" element={<AdminFeedbacks/>} />
      </Routes>
    </div>
  );
}

export default App;

{/* <Route path="/" element={<Home />} /> */}