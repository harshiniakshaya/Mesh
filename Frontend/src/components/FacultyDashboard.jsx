import Sidebar from './Sidebar';
import { useState } from 'react';
import './FacultyDashboard.css';

function FacultyDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCourse, setNewCourse] = useState({
    name: '',
    section: '',
    description: ''
  });
  const [courses, setCourses] = useState([
    { id: 1, name: 'Introduction to Psychology', section: 'Section A', students: 35 },
    { id: 2, name: 'Advanced Statistics', section: 'Section B', students: 28 },
    { id: 3, name: 'Cognitive Neuroscience', section: 'Section C', students: 22 }
  ]);

  const facultyNav = [
    { name: 'Home', icon: '🏠', path: '/faculty' },
    { name: 'Courses', icon: '📚', active: true, path: '/faculty/courses' },
    { name: 'Calendar', icon: '📅', path: '/faculty/calendar' },
    { name: 'Messages', icon: '✉️', path: '/faculty/messages' },
    { name: 'Settings', icon: '⚙️', path: '/faculty/settings' }
  ];

  const activities = [
    { id: 1, type: 'New Material Uploaded', description: 'Uploaded new lecture notes for Introduction to Psychology', time: '2 hours ago', icon: '📄' },
    { id: 2, type: 'Assignment Created', description: 'Created a new assignment for Advanced Statistics', time: '5 hours ago', icon: '📝' },
    { id: 3, type: 'Syllabus Updated', description: 'Updated the syllabus for Cognitive Neuroscience', time: '1 day ago', icon: '📋' }
  ];

  const handleCreateCourse = (e) => {
    e.preventDefault();
    const newId = Math.max(...courses.map(c => c.id)) + 1;
    setCourses([...courses, { id: newId, name: newCourse.name, section: newCourse.section, students: 0 }]);
    setNewCourse({ name: '', section: '', description: '' });
    setShowCreateModal(false);
  };

  const handleManageCourse = (courseId) => {
    alert(`Managing course with ID: ${courseId}`);
  };

  return (
    <div className="dashboard">
      <button className="mobile-menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
      
      <Sidebar 
        user="Dr. Amelia Harper" 
        navItems={facultyNav}
        avatar="https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop"
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      
      <main className="main-content">
        <div className="page-header">
          <h1 className="page-title">Courses</h1>
          <button className="create-button" onClick={() => setShowCreateModal(true)}>Create New Section</button>
        </div>
        
        <section>
          <h2 className="section-title">Current Sections</h2>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Course Name</th>
                  <th>Section</th>
                  <th>Students</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course.id}>
                    <td>{course.name}</td>
                    <td>{course.section}</td>
                    <td>{course.students}</td>
                    <td>
                      <a href="#" className="action-link" onClick={(e) => { e.preventDefault(); handleManageCourse(course.id); }}>
                        Manage
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        
        <section>
          <h2 className="section-title">Recent Activity</h2>
          <div>
            {activities.map((activity) => (
              <div key={activity.id} className="activity-item">
                <div className="activity-icon">{activity.icon}</div>
                <div className="activity-content">
                  <h4>{activity.type}</h4>
                  <p>{activity.description}</p>
                  <small className="activity-time">{activity.time}</small>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Create New Section</h2>
              <button className="close-button" onClick={() => setShowCreateModal(false)}>×</button>
            </div>
            <form onSubmit={handleCreateCourse}>
              <div className="form-group">
                <label className="form-label">Course Name</label>
                <input type="text" className="form-input" value={newCourse.name} onChange={(e) => setNewCourse({...newCourse, name: e.target.value})} required />
              </div>
              <div className="form-group">
                <label className="form-label">Section</label>
                <input type="text" className="form-input" value={newCourse.section} onChange={(e) => setNewCourse({...newCourse, section: e.target.value})} required />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-input" rows="3" value={newCourse.description} onChange={(e) => setNewCourse({...newCourse, description: e.target.value})} />
              </div>
              <div className="modal-actions">
                <button type="button" className="cancel-button" onClick={() => setShowCreateModal(false)}>Cancel</button>
                <button type="submit" className="create-button">Create Section</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default FacultyDashboard;
