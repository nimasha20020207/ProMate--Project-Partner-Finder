import React from 'react'
import Navbar from './components/Navbar'

const Dashboard = () => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white">
        <Navbar />
      </div>

      {/* Main content */}
      <div className="flex-1 p-6 bg-surface">

        {/* Search Bar */}
        <div className="mb-6">
            <input
            type="text"
            placeholder="Search projects..."
            className="w-full p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div>
        
        <button className="mb-4 px-4 py-2 bg-blue-500 text-white rounded">
          All Projects
        </button>
        <br />
        <button className="mb-4 px-4 py-2 bg-green-500 text-white rounded">
          Recently Uploaded
        </button>
        <br />
        <button className="px-4 py-2 bg-purple-500 text-white rounded">
          Recommended for you
        </button>
      </div>
    </div>
  )
}

export default Dashboard
