import Sidebar from './Sidebar';
import { useState, useEffect } from 'react';
import './StudentDashboard.css';
import { joinClassroom, fetchMyClassrooms, fetchClassroomDetails } from '../services/studentServices.js'; 
import ClassroomView from './ClassroomView';

// MOCK CONSTANTS
const MOCK_STUDENT_NAME = "Sarah Lee"; 
const MOCK_STUDENT_EMAIL = "ada.lovelace@example.com"; 
const INITIAL_CLASSROOMS = []; 


function StudentDashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedClassroom, setSelectedClassroom] = useState('all');
    const [aiQuery, setAiQuery] = useState('');
    const [aiResponse, setAiResponse] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    // State for classrooms initialized to empty array
    const [classrooms, setClassrooms] = useState(INITIAL_CLASSROOMS); 

    // NEW STATE FOR JOIN MODAL
    const [showJoinModal, setShowJoinModal] = useState(false);
    const [joinCode, setJoinCode] = useState('');
    const [joinLoading, setJoinLoading] = useState(false);
    const [joinSuccess, setJoinSuccess] = useState(null); 
    const [joinError, setJoinError] = useState('');

    // CRITICAL: This state holds the classroom object to display the detailed view
    const [viewingClassroom, setViewingClassroom] = useState(); 

    // ----------------------------------------------------------------------
    // useEffect Hook to fetch DETAILED classroom data on selection
    // ----------------------------------------------------------------------
    useEffect(() => {
        // Only proceed if a classroom object is available (i.e., a card was clicked)
        if (viewingClassroom) {
            const loadDetailedClassroomData = async () => {
                try {
                    // Use the classroom's ID to fetch its detailed content
                    const detailedData = await fetchClassroomDetails(viewingClassroom.id);
                    console.log(viewingClassroom);

                    // Update the state by merging the full data with the existing object
                    setViewingClassroom(prev => ({
                        ...prev,
                        ...detailedData, // Spread the new data, which should contain assignments, etc.
                    }));
                    
                    console.log("Successfully fetched detailed classroom data:", detailedData);

                } catch (err) {
                    // Log error and handle gracefully (e.g., go back to dashboard)
                    console.error(`ERROR: Failed to load details for classroom ID ${viewingClassroom.id}:`, err);
                    // handleBackToDashboard(); // Uncomment this line if you want to automatically go back on error
                }
            };

            loadDetailedClassroomData();
        }
    }, [viewingClassroom]); // Rerun when viewingClassroom changes (from null to object, or object to object)

    // ----------------------------------------------------------------------
    // useEffect Hook for Initial Dashboard Data Fetch (Unchanged, but included for completeness)
    // ----------------------------------------------------------------------
    useEffect(() => {
        const loadClassrooms = async () => {
            try {
                const fetchedClassrooms = await fetchMyClassrooms(MOCK_STUDENT_EMAIL);
                const formattedClassrooms = fetchedClassrooms.map(c => ({
                    id: c.id, 
                    title: c.classroomName,
                    professor: c.facultyName,
                    image: 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=400',
                }));
                setClassrooms(formattedClassrooms);
                console.log("Successfully loaded and formatted classrooms on refresh:", formattedClassrooms); 
            } catch (err) {
                console.error("ERROR: Failed to load classrooms on refresh:", err);
                setClassrooms([]);
            } 
        };
        loadClassrooms();
    }, []); // Empty dependency array: runs only ONCE when component mounts

    // ----------------------------------------------------------------------
    // Handlers (Unchanged, but included for completeness)
    // ----------------------------------------------------------------------

    const studentNav = [
        { name: 'Home', icon: '🏠', active: true, path: '/student' },
        { name: 'Classrooms', icon: '👥', path: '/student/classrooms' },
        { name: 'Assignments', icon: '📄', path: '/student/assignments' },
        { name: 'Grades', icon: '📊', path: '/student/grades' },
        { name: 'Settings', icon: '⚙️', path: '/student/settings' }
    ];

    // Assignments array (remains hardcoded for now)
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
          name: 'World History',
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

    /**
     * Toggles the view from Dashboard to ClassroomView.
     * @param {object} classroom The classroom object to display.
     */
    const handleClassroomClick = (classroom) => {
        setViewingClassroom(classroom);
    };

    /**
     * Toggles the view from ClassroomView back to Dashboard.
     */
    const handleBackToDashboard = () => {
    console.log("Classroom clicked! ID:", classroom.id, "Title:", classroom.title); // ADD THIS LINE
        setViewingClassroom(null);
    }; 
      
    // HANDLER TO CLOSE MODAL AND RESET STATE
    const handleCloseJoinModal = () => {
        setShowJoinModal(false);
        setJoinCode('');
        setJoinError('');
        setJoinSuccess(null);
    }
    
    // HANDLER FOR JOIN API CALL
    const handleJoinClassroom = async (e) => {
        e.preventDefault();
        if (!joinCode.trim()) return;

        setJoinLoading(true);
        setJoinError('');
        setJoinSuccess(null);

        try {
            const newClassroom = await joinClassroom(joinCode.trim(), MOCK_STUDENT_EMAIL); 

            const formattedClassroom = {
                id: newClassroom.id, 
                title: newClassroom.classroomName,
                professor: newClassroom.facultyName, 
                image: 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=400', 
            };

            setClassrooms(prevClassrooms => [...prevClassrooms, formattedClassroom]);
            setJoinSuccess(formattedClassroom); 

        } catch (err) {
            console.error("Error joining classroom:", err);
            setJoinError(err.message || `HTTP Error: ${err.status} - Could not connect to service.`);
        } finally {
            setJoinLoading(false);
        }
    };


    // ----------------------------------------------------------------------
    // CONDITIONAL RENDERING OF CLASSROOM VIEW VS DASHBOARD
    // ----------------------------------------------------------------------

    if (viewingClassroom) {
        // If a classroom card was clicked, render the detailed view
        return (
             <ClassroomView 
            classroomData={viewingClassroom}
            onBack={handleBackToDashboard} 
            studentName={MOCK_STUDENT_NAME}
            studentEmail={MOCK_STUDENT_EMAIL} 
        />
        );
    }

    // Otherwise, render the main dashboard
    return (
        <div className="dashboard">
            <button
                className="mobile-menu-toggle"
                onClick={() => setSidebarOpen(!sidebarOpen)}
            >
                ☰
            </button>

            <Sidebar
                user={MOCK_STUDENT_NAME}
                navItems={studentNav}
                avatar="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop"
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            <main className="main-content">
                <h1 className="page-title fade-in">Welcome back, {MOCK_STUDENT_NAME}!</h1>

                <section>
                    <div className="section-header-row">
                      <h2 className="section-title">My Classrooms</h2>
                      <button className="create-button" onClick={() => setShowJoinModal(true)}>
                          + Join Classroom
                      </button>
                    </div>
<br />
<br />

                    <div className="classrooms-grid">
                        {classrooms.length === 0 ? (
                            <p>You are not currently enrolled in any classrooms.</p>
                        ) : (
                            classrooms.map(classroom => (
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
                            ))
                        )}
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

                {/* AI Assistant section commented out for brevity, as per your code */}
            </main>

            {/* JOIN CLASSROOM MODAL JSX (omitted for brevity) */}
            {showJoinModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>Join Classroom</h2>
                        </div>
                        {joinSuccess && (
                            <div className="status-message status-success">
                                Successfully joined **{joinSuccess.title}**!
                                <p style={{ marginTop: '10px', fontWeight: 'normal' }}>
                                    You can now see the course on your dashboard.
                                </p>
                            </div>
                        )}
                        {joinError && (
                            <div className="status-message status-error">
                                Join Failed: {joinError}
                            </div>
                        )}
                        {!joinSuccess && (
                            <form onSubmit={handleJoinClassroom}>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="classroomCode">
                                        Enter Classroom Code
                                    </label>
                                    <input
                                        type="text"
                                        id="classroomCode"
                                        className="form-input"
                                        value={joinCode}
                                        onChange={(e) => setJoinCode(e.target.value)}
                                        placeholder="E.g., 3QSQ7C or 3qsq7c"
                                        maxLength="6"
                                        disabled={joinLoading}
                                        required
                                    />
                                </div>
                                <div className="modal-actions">
                                    <button
                                        type="button"
                                        className="cancel-button"
                                        onClick={handleCloseJoinModal}
                                        disabled={joinLoading}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="join-button"
                                        disabled={joinLoading || joinCode.length !== 6} 
                                    >
                                        {joinLoading ? 'Joining...' : 'Join'}
                                    </button>
                                </div>
                            </form>
                        )}
                        {joinSuccess && (
                            <div className="modal-actions">
                                <button
                                    type="button"
                                    className="join-button"
                                    onClick={handleCloseJoinModal}
                                >
                                    Done
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default StudentDashboard;