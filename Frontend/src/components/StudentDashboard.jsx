import Sidebar from './Sidebar';
import { useState } from 'react';
import './StudentDashboard.css';

function StudentDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClassroom, setSelectedClassroom] = useState('all');
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const studentNav = [
    { name: 'Home', icon: '🏠', active: true, path: '/student' },
    { name: 'Classrooms', icon: '👥', path: '/student/classrooms' },
    { name: 'Assignments', icon: '📄', path: '/student/assignments' },
    { name: 'Grades', icon: '📊', path: '/student/grades' },
    { name: 'Settings', icon: '⚙️', path: '/student/settings' }
  ];

  const classrooms = [
    {
      id: 1,
      title: 'Introduction to Psychology',
      professor: 'Professor Emily Carter',
      image: 'https://images.pexels.com/photos/207691/pexels-photo-207691.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 2,
      title: 'Calculus I',
      professor: 'Professor David Chen',
      image: 'https://images.pexels.com/photos/289740/pexels-photo-289740.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 3,
      title: 'World History',
      professor: 'Professor Robert Green',
      image: 'https://images.pexels.com/photos/256541/pexels-photo-256541.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ];

  const assignments = [
    {
      id: 1,
      name: 'Psychology Paper',
      classroom: 'Introduction to Psychology',
      dueDate: 'Oct 20, 2024',
      status: 'progress'
    },
    {
      id: 2,
      name: 'Calculus Problem Set',
      classroom: 'Calculus I',
      dueDate: 'Oct 22, 2024',
      status: 'not-started'
    },
    {
      id: 3,
      name: 'History Essay',
      classroom: 'World History',
      dueDate: 'Oct 25, 2024',
      status: 'not-started'
    }
  ];

  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = assignment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.classroom.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClassroom = selectedClassroom === 'all' || assignment.classroom === selectedClassroom;
    return matchesSearch && matchesClassroom;
  });

  const handleAiQuery = () => {
    if (!aiQuery.trim()) return;
    setIsLoading(true);
    setTimeout(() => {
      setAiResponse(`Here's what I found about "${aiQuery}": This is a simulated AI response that would provide helpful information about your courses and assignments.`);
      setIsLoading(false);
    }, 2000);
  };

  const handleClassroomClick = (classroom) => {
    alert(`Opening ${classroom.title}...`);
  };

  return (
    <div className="dashboard">
      <button 
        className="mobile-menu-toggle"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        ☰
      </button>
      
      <Sidebar 
        user="Sarah Lee" 
        navItems={studentNav}
        avatar="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop"
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      
      <main className="main-content">
        <h1 className="page-title fade-in">Welcome back, Sarah Lee!</h1>
        
        <section>
          <h2 className="section-title">My Classrooms</h2>
          <div className="classrooms-grid">
            {classrooms.map(classroom => (
              <div 
                key={classroom.id} 
                className="classroom-card fade-in"
                onClick={() => handleClassroomClick(classroom)}
              >
                <img 
                  src={classroom.image} 
                  alt={classroom.title}
                  className="classroom-image"
                />
                <div className="classroom-info">
                  <h3 className="classroom-title">{classroom.title}</h3>
                  <p className="classroom-professor">{classroom.professor}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
        
        <section>
          <h2 className="section-title">Upcoming Assignments</h2>
          
          <div className="search-filter-bar">
            <input
              type="text"
              className="search-input"
              placeholder="Search assignments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="filter-select"
              value={selectedClassroom}
              onChange={(e) => setSelectedClassroom(e.target.value)}
            >
              <option value="all">All Classrooms</option>
              {classrooms.map(classroom => (
                <option key={classroom.id} value={classroom.title}>
                  {classroom.title}
                </option>
              ))}
            </select>
          </div>
          
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Assignment</th>
                  <th>Classroom</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssignments.map((assignment) => (
                  <tr key={assignment.id}>
                    <td>{assignment.name}</td>
                    <td>
                      <a href="#" className="action-link">{assignment.classroom}</a>
                    </td>
                    <td>{assignment.dueDate}</td>
                    <td>
                      <span className={`status-badge status-${assignment.status}`}>
                        {assignment.status === 'progress' ? 'In Progress' : 'Not Started'}
                      </span>
                    </td>
                    <td>
                      <a href="#" className="action-link">View Details</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredAssignments.length === 0 && (
              <div className="no-data-message">
                No assignments found matching your criteria.
              </div>
            )}
          </div>
        </section>
        
        <section>
          <h2 className="section-title">AI Assistant</h2>
          <div className="ai-assistant">
            <div className="ai-input-row">
              <input 
                type="text" 
                className="ai-input"
                placeholder="Ask me anything about your courses..."
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAiQuery()}
              />
              <button 
                onClick={handleAiQuery}
                className="create-button"
                disabled={isLoading || !aiQuery.trim()}
              >
                {isLoading ? 'Thinking...' : 'Ask'}
              </button>
            </div>
            
            {aiResponse && (
              <div className="ai-response-box">
                <strong>AI Response:</strong>
                <p>{aiResponse}</p>
              </div>
            )}
            
            {isLoading && (
              <div className="loading">
                <div className="spinner"></div>
              </div>
            )}
            
            <p className="ai-example">
              Example: What are the key concepts in the Psychology Paper?
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default StudentDashboard;
