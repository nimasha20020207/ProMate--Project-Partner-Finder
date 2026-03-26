import React,{useEffect,useState} from 'react'
import axios from "axios"
import AdminNavbar from '../../components/AdminNavbar'

const Studentmanagement = () => {
    const [students, setStudents] = useState([]);

  const fetchStudents = () => {
    axios.get("http://localhost:3000/api/admin/students")
      .then(res => setStudents(res.data))
      .catch(err => console.log(err));
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const deleteStudent = (id) => {
    if (window.confirm("Delete this student?")) {
      axios.delete(`http://localhost:5000/api/admin/students/${id}`)
        .then(fetchStudents)
        .catch(err => console.log(err));
    }
  };
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white">
        <AdminNavbar />
      </div>

      {/* Main content */}
      <div className="flex-1 p-6 bg-surface">
            <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Students</h1>
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">Full Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map(s => (
            <tr key={s._id} className="border-b">
              <td className="p-2">{s.fullName}</td>
              <td>{s.email}</td>
              <td>{s.department}</td>
              <td>
                <button
                  onClick={() => deleteStudent(s._id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
      </div>
    </div>
  )
}

export default Studentmanagement