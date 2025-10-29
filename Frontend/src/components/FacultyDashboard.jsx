import Sidebar from './Sidebar';
import { useState, useEffect, useCallback } from 'react'; 
import './FacultyDashboard.css';
// Ensure you have this service file
import { createClassroom, fetchMyClassrooms } from '../services/classroomService.js'; 
// Import the component created in the previous step
import FacultyClassroomView from './FacultyClassroomView.jsx'; 


// IMPORTANT: Replace this with a function that retrieves the actual
// faculty email from your authentication context.
const MOCK_FACULTY_EMAIL = "alan.turing@example.com";

function FacultyDashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newCourse, setNewCourse] = useState({
        name: '',    
        subject: '',  
        description: '' 
    });

    // --- State for Data and View Management ---
    const [loading, setLoading] = useState(true); // Start as loading
    const [error, setError] = useState(null);
    const [createdClassroom, setCreatedClassroom] = useState(null);
    const [courses, setCourses] = useState([]); 
    
    // View Management States
    const [viewMode, setViewMode] = useState('dashboard'); // 'dashboard' or 'manage'
    const [managingClassroom, setManagingClassroom] = useState(null); // Stores the full classroom object or at least the ID
    // ------------------------------------------

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

    // CRITICAL FIX: Centralized data fetching function
    const loadClassrooms = useCallback(async () => {
        setLoading(true);
        setError(null);
        console.log("Attempting to load faculty classrooms...");

        try {
            // This relies on the fetchMyClassrooms function working correctly
            const fetchedClassrooms = await fetchMyClassrooms(MOCK_FACULTY_EMAIL);

            const formattedCourses = fetchedClassrooms.map(c => ({
                id: c.id, 
                name: c.classroomName, 
                subject: c.subject,    
                // Ensure studentCount is correctly pulled or defaults to 0
                students: c.studentCount !== undefined && c.studentCount !== null ? c.studentCount : 0, 
                classroomCode: c.classroomCode 
            }));

            setCourses(formattedCourses);
            console.log("Successfully loaded faculty classrooms:", formattedCourses); 
            
        } catch (err) {
            console.error("ERROR: Failed to load faculty classrooms:", err);
            setCourses([]); 
            setError(`Failed to load courses: ${err.message.split('Details:')[0].trim()}`);
        } finally {
            setLoading(false);
        }
    }, []); 

    // useEffect Hook for Initial Data Fetch
    useEffect(() => {
        loadClassrooms();
    }, [loadClassrooms]); // Run when component mounts and on subsequent component changes (for robustness)


    // Function to close all modal states (form, success, or error)
    const closeModal = () => {
        setShowCreateModal(false);
        setCreatedClassroom(null);
        // Do NOT clear dashboard-level error here (it requires loadClassrooms to clear)
    };
    
    // Handles the classroom creation form submission
    const handleCreateCourse = async (e) => {
        e.preventDefault();
        setLoading(true); // Use the general loading state for the modal submission
        setError(null);
        setCreatedClassroom(null);

        const classroomPayload = {
            classroomName: newCourse.name,
            subject: newCourse.subject 
        };
        
        try {
            const result = await createClassroom(classroomPayload, MOCK_FACULTY_EMAIL);
            
            setCreatedClassroom(result);
            
            // Re-fetch ALL classrooms to ensure list consistency from the backend
            await loadClassrooms();
            
            setNewCourse({ name: '', subject: '', description: '' });

        } catch (err) {
            console.error("Classroom Creation Failed:", err);
            const detail = err.message.includes("Details:") ? err.message.split("Details:")[1].trim() : "Please check your network and API URL.";
            setError(`Creation failed (${err.message.split("!")[0]}). ${detail}`);
        } finally {
            setLoading(false);
        }
    };

    // Handler for the "Manage" action
    const handleManageCourse = (course) => {
        setManagingClassroom(course);
        setViewMode('manage');
        setSidebarOpen(false); // Close sidebar on mobile
    };
    
    // Handler for the "Back to Dashboard" action in FacultyClassroomView
    const handleBackToDashboard = () => {
        setManagingClassroom(null);
        setViewMode('dashboard');
        // Re-fetch dashboard data after returning from management view 
        // in case sections/assignments were created
        loadClassrooms(); 
    };

    // --- RENDER LOGIC FOR CLASSROOM MANAGEMENT VIEW ---
    if (viewMode === 'manage' && managingClassroom) {
        return (
            <FacultyClassroomView 
                classroomId={managingClassroom.id} 
                initialData={managingClassroom}     
                onBack={handleBackToDashboard}
            />
        );
    }

    // --- RENDER LOGIC FOR MAIN DASHBOARD VIEW ---
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
                    <h1 className="page-title">Classrooms</h1> 
                    <button className="create-button" onClick={() => {setShowCreateModal(true); setError(null); setCreatedClassroom(null);}}>
                        Create New Classroom
                    </button>
                </div>
                
                <section>
                    <h2 className="section-title">Current Classrooms</h2>
                    {/* Display general dashboard error (from refresh) */}
                    {error && !showCreateModal && (
                        <div className="alert alert-error">
                            🚨 **Error:** {error}
                        </div>
                    )}
                    {loading && <p>Loading courses...</p>}
                    {!loading && !error && (
                        <div className="table-container">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Course Name</th>
                                        <th>Subject</th> 
                                        <th>Students</th>
                                        <th>Class Code</th> 
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* Renders the list of courses from state */}
                                    {courses.map((course) => (
                                        <tr key={course.id}>
                                            <td>{course.name}</td>
                                            <td>{course.subject}</td> 
                                            <td>{course.students}</td>
                                            <td><span className="code-display">{course.classroomCode}</span></td>
                                            <td>
                                                {/* CRITICAL: Changed to pass the full course object */}
                                                <a href="#" className="action-link" onClick={(e) => { e.preventDefault(); handleManageCourse(course); }}>
                                                    Manage
                                                </a>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {courses.length === 0 && (
                                <div className="no-data-message">
                                    No classrooms found. Create your first one to get started!
                                </div>
                            )}
                        </div>
                    )}
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
            
            {/* -------------------- MAIN MODAL WRAPPER -------------------- */}
            {(showCreateModal || createdClassroom || (error && showCreateModal)) && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="modal-title">
                                {createdClassroom ? 'Classroom Created!' : 'Create New Classroom'}
                            </h2>
                            <button className="close-button" onClick={closeModal}>×</button>
                        </div>

                        {/* 1. SUCCESS DISPLAY (Conditional) */}
                        {createdClassroom && (
                            <div className="success-message">
                                <h3>Success! Your classroom is ready.</h3>
                                <p>Share this unique code with students so they can join:</p>
                                <div className="classroom-code-box">
                                    <span className="final-code">{createdClassroom.classroomCode}</span>
                                    <button className="copy-button" onClick={() => navigator.clipboard.writeText(createdClassroom.classroomCode)}>
                                        <span role="img" aria-label="copy">📋</span> Copy Code
                                    </button>
                                </div>
                                <button className="create-button" onClick={closeModal}>Done</button>
                            </div>
                        )}
                        
                        {/* 2. ERROR DISPLAY (Conditional) - Only for creation errors in the modal */}
                        {error && !createdClassroom && showCreateModal && (
                            <div className="error-message">
                                <p>An error occurred:</p>
                                <p><strong>{error}</strong></p>
                                <div className="modal-actions">
                                    <button className="cancel-button" onClick={closeModal}>Close</button>
                                </div>
                            </div>
                        )}

                        {/* 3. CREATION FORM (Conditional) */}
                        {showCreateModal && !createdClassroom && (
                            <form onSubmit={handleCreateCourse}>
                                <div className="form-group">
                                    <label className="form-label">Course Name (Maps to classroomName)</label>
                                    <input 
                                        type="text" 
                                        className="form-input" 
                                        value={newCourse.name} 
                                        onChange={(e) => setNewCourse({...newCourse, name: e.target.value})} 
                                        required 
                                        disabled={loading}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Subject (Maps to subject)</label> 
                                    <input 
                                        type="text" 
                                        className="form-input" 
                                        value={newCourse.subject} 
                                        onChange={(e) => setNewCourse({...newCourse, subject: e.target.value})} 
                                        required 
                                        disabled={loading}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Description (Optional)</label>
                                    <textarea 
                                        className="form-input" 
                                        rows="3" 
                                        value={newCourse.description} 
                                        onChange={(e) => setNewCourse({...newCourse, description: e.target.value})} 
                                        disabled={loading}
                                    />
                                </div>

                                <div className="modal-actions">
                                    <button type="button" className="cancel-button" onClick={closeModal} disabled={loading}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="create-button" disabled={loading || !newCourse.name || !newCourse.subject}>
                                        {loading ? 'Creating...' : 'Create Classroom'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default FacultyDashboard;