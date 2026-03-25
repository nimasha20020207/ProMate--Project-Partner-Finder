import React from 'react';
import {Routes, Route, Link} from 'react-router-dom';
import Admindashboard from './pages/Admin/Admindashboard';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Admindashboard/>} />
      </Routes>

    </div>
  );
}

export default App;

{/* <Route path="/" element={<Home />} /> */}