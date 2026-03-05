import React from 'react';
import {Routes, Route, Link} from 'react-router-dom';
import recommendations from './pages/RecEngine/recommendations';

function App() {
  return (
    // <div className="text-3xl font-bold text-blue-600 p-10">
    //   ProjectMate Frontend Ready 🚀
    // </div>
    <div>
      <Routes>
        <Route path="/" element={<recommendations />} />
      </Routes>
    </div>
  );
}

export default App;

{/* <Route path="/" element={<Home />} /> */}