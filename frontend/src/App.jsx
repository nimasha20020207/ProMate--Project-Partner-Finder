import React from 'react';
import {Routes, Route, Link} from 'react-router-dom';
import Recommendations from './pages/RecEngine/ProjectRecommendations';

function App() {
  return (
    // <div className="text-3xl font-bold text-blue-600 p-10">
    //   ProjectMate Frontend Ready 🚀
    // </div>
    <div>
      <Routes>
        <Route path="/" element={<Recommendations />} />
      </Routes>
    </div>
  );
}

export default App;

{/* <Route path="/" element={<Home />} /> */}