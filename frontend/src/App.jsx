import React from 'react';
import {Routes, Route, Link} from 'react-router-dom';
import Recommendations from './pages/RecEngine/ProjectRecommendations';
import Candidates from './pages/RecEngine/StudentRecommendations';
import Dashboard from './Dashboard';
import Feedbacks from './pages/RecEngine/Feedbacks';

function App() {
  return (
    // <div className="text-3xl font-bold text-blue-600 p-10">
    //   ProjectMate Frontend Ready 🚀
    // </div>
    <div>
      <Routes>
        <Route path="/" element={<Dashboard />} />
      </Routes>

      <Routes>
        <Route path="/recs" element={<Recommendations />} />
      </Routes>

      <Routes>
        <Route path="/sturecs" element={<Candidates />} />
      </Routes>   

      <Routes>
        <Route path="/feedbacks" element={<Feedbacks />} />
      </Routes>   
    </div>
  );
}

export default App;

{/* <Route path="/" element={<Home />} /> */}