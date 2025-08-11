// import React from 'react';
// import { Routes, Route } from 'react-router-dom';
// import Login from './components/Login';
// import FacultyDashboard from './components/FacultyDashboard';
// import StudentDashboard from './components/StudentDashboard';
// import AdminDashboard from './components/AdminDashboard';


// const App = () => {
//   return (
//     <>
//     <AdminDashboard />
//     </>

//   );
// };

// export default App;


import { Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import StudentDashboard from './components/StudentDashboard';
import FacultyDashboard from './components/FacultyDashboard';
import AdminDashboard from './components/AdminDashboard';
import './App.css';

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/faculty" element={<FacultyDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </div>
  );
}

export default App;
