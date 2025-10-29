import Sidebar from './Sidebar';
import { useState, useEffect } from 'react'; 
import { submitAssignment, fetchClassroomDetails } from '../services/studentServices.js';
import './ClassroomView.css';

// Component for the Assignment submission form
function AssignmentSubmission({ assignment, classroomId, studentEmail, onClose, onSuccess }) {
    const [file, setFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            setError('Please select a file to submit.');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('file', file); // Ensure your backend expects key 'file'

            // Call the actual submitAssignment service function
            await submitAssignment(classroomId, assignment.id, formData, studentEmail); 

            // Handle success
            onSuccess();
        } catch (err) {
            console.error("Submission error:", err);
            setError(err.message || "Failed to submit assignment. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="submission-form">
            <h3>Submit Assignment: {assignment.title}</h3>
            <p className="submission-description">{assignment.description}</p>
            <p className="submission-due-date">Due: {assignment.dueDate}</p>

            {error && <div className="status-message status-error">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label" htmlFor={`file-${assignment.id}`}>Upload File</label>
                    <input
                        type="file"
                        id={`file-${assignment.id}`}
                        className="file-input"
                        onChange={(e) => {
                            setFile(e.target.files[0]);
                            setError('');
                        }}
                        disabled={isSubmitting}
                        required
                    />
                </div>
                <div className="modal-actions">
                    <button type="button" className="cancel-button" onClick={onClose} disabled={isSubmitting}>
                        Cancel
                    </button>
                    <button type="submit" className="create-button" disabled={isSubmitting || !file}>
                        {isSubmitting ? 'Submitting...' : 'Submit'}
                    </button>
                </div>
            </form>
        </div>
    );
}


// Main Classroom View Component
function ClassroomView({ classroomData: initialClassroomData, onBack, studentName, studentEmail }) {
    const [classroomDetails, setClassroomDetails] = useState(initialClassroomData); 
    const [isDetailsLoading, setIsDetailsLoading] = useState(true);

    const [activeTab, setActiveTab] = useState('materials'); // 'materials' or 'assignments'
    const [selectedAssignment, setSelectedAssignment] = useState(null); // Assignment object for submission modal
    
    // AI Assistant State (local to the classroom context)
    const [aiQuery, setAiQuery] = useState('');
    const [aiResponse, setAiResponse] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // ⭐ FIX: Destructure the ID from the prop for a stable dependency
    const { id: classroomId } = initialClassroomData || {};

    const sections = classroomDetails?.sections ?? [];
    const assignments = classroomDetails?.assignments ?? [];

    const handleAiQuery = () => {
        if (!aiQuery.trim()) return;
        setIsLoading(true);
        setAiResponse('');
        
        // Simulating an AI call that is context-aware (knows the classroom title)
        setTimeout(() => {
            const context = `(in ${classroomDetails?.title})`;
            setAiResponse(`**AI Response ${context}:** Here is a summary of the topic related to "${aiQuery}". This AI is contextually aware of the course materials.`);
            setIsLoading(false);
        }, 2500);
    };

    const loadClassroomDetails = async () => {
        // Check if we have an ID to fetch details for
        if (!classroomId) {
            console.error("Error: Classroom ID is missing.");
            setIsDetailsLoading(false);
            return;
        }

        // If we have an ID, start loading the details
        setIsDetailsLoading(true);
        try {
            // Call the service function with the classroom's ID
            const fetchedDetails = await fetchClassroomDetails(classroomId, studentEmail); 

            // MAPPING: Overwrite with the full data (sections, assignments, etc.)
            const fullData = {
                ...initialClassroomData, // Keep the initial minimal data (title, professor)
                ...fetchedDetails, // Overwrite with the full data (sections, assignments, etc.)
            };

            setClassroomDetails(fullData);
            console.log("Successfully loaded classroom details:", fullData);

        } catch (err) {
            console.error("ERROR: Failed to load classroom details:", err);
            setClassroomDetails(null); // Indicate failure to load
        } finally {
            setIsDetailsLoading(false);
        }
    };

    useEffect(() => {
        // Run the data load function
        loadClassroomDetails();
        
        // ⭐ FIX: Dependency array now uses the stable classroomId and studentEmail
        // This prevents the infinite loop caused by initialClassroomData changing every render.
    }, [classroomId, studentEmail]); 


    const handleSubmissionSuccess = () => {
        alert(`Successfully submitted ${selectedAssignment.title}!`);
        // Refresh the classroom data to show the updated status (e.g., 'submitted')
        setSelectedAssignment(null); // Close the modal
        loadClassroomDetails(); 
    }

    if (isDetailsLoading) {
         return (
             <main className="main-content classroom-page">
                 <p>Loading classroom details...</p>
                 <button className="back-button" onClick={onBack}>
                     ← Back to Dashboard
                 </button>
             </main>
         );
    }

    if (!classroomDetails) {
         return (
             <main className="main-content classroom-page">
                 <p>Failed to load data.</p>
                 <button className="back-button" onClick={onBack}>
                     ← Back to Dashboard
                 </button>
             </main>
         );
    }

    if (selectedAssignment) {
        return (
            <main className="main-content classroom-page">
                <button className="back-button" onClick={() => setSelectedAssignment(null)}>
                    ← Back to Assignments
                </button>
                <AssignmentSubmission 
                    assignment={selectedAssignment}
                    classroomId={classroomDetails.id}
                    studentEmail={studentEmail}
                    onClose={() => setSelectedAssignment(null)}
                    onSuccess={handleSubmissionSuccess}
                />
            </main>
        );
    }


    return (
        <main className="main-content classroom-page">
            <button className="back-button" onClick={onBack}>
                ← Back to Dashboard
            </button>
            <h1 className="page-title fade-in">{classroomDetails.title}</h1>
            <p className="classroom-professor-detail">Taught by {classroomDetails.professor}</p>

            <div className="classroom-tabs">
                <button 
                    className={`tab-button ${activeTab === 'materials' ? 'active' : ''}`}
                    onClick={() => setActiveTab('materials')}
                >
                    Materials
                </button>
                <button 
                    className={`tab-button ${activeTab === 'assignments' ? 'active' : ''}`}
                    onClick={() => setActiveTab('assignments')}
                >
                    Assignments
                </button>
                <button 
                    className={`tab-button ${activeTab === 'ai' ? 'active' : ''}`}
                    onClick={() => setActiveTab('ai')}
                >
                    AI Assistant
                </button>
            </div>

            {/* TAB CONTENT */}
            <div className="tab-content">
                
                {/* 1. MATERIALS VIEW */}
                {activeTab === 'materials' && (
                    <div className="materials-view fade-in">
                        {sections.length === 0 ? (
                            <p className="no-data-message">No course materials have been added to this classroom yet.</p>
                        ) : (
                            sections.map(section => (
                                <div key={section.id} className="section-container">
                                    <h3 className="section-title-inside">{section.title}</h3>
                                    <div className="materials-grid">
                                        {(section.materials ?? []).map(material => (
                                            <div key={material.id} className="material-card">
                                                <div className="material-icon">
                                                    {material.type === 'FILE' ? '📁' : '📝'}
                                                </div>
                                                <div className="material-details">
                                                    <h4>{material.title}</h4>
                                                    <p className="material-date">Uploaded: {material.uploadedAt}</p>
                                                    <a 
                                                        href={material.fileUrl || '#'} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="action-link"
                                                        onClick={(e) => {
                                                            if (material.type === 'TEXT') {
                                                                e.preventDefault();
                                                                alert(`Text Content for ${material.title}:\n\n${material.textContent}`);
                                                            }
                                                        }}
                                                    >
                                                        {material.type === 'FILE' ? 'Download/View File' : 'View Text'}
                                                    </a>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* 2. ASSIGNMENTS VIEW */}
                {activeTab === 'assignments' && (
                    <div className="assignments-view fade-in">
                        {assignments.length === 0 ? (
                            <p className="no-data-message">There are no assignments for this classroom.</p>
                        ) : (
                            <div className="table-container">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Assignment</th>
                                            <th>Due Date</th>
                                            <th>Points</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {assignments.map(assignment => (
                                            <tr key={assignment.id}>
                                                <td>{assignment.title}</td>
                                                <td>{assignment.dueDate}</td>
                                                <td>{assignment.points}</td>
                                                <td>
                                                    <span className={`status-badge status-${assignment.status}`}>
                                                         {(assignment.status || 'Pending').charAt(0).toUpperCase() + (assignment.status || 'Pending').slice(1).replace('-', ' ')}
                                                    </span>
                                                </td>
                                                <td>
                                                    <a 
                                                        href="#" 
                                                        className="action-link"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            setSelectedAssignment(assignment);
                                                        }}
                                                    >
                                                        {assignment.status === 'submitted' ? 'View/Resubmit' : 'View/Submit'}
                                                    </a>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* 3. AI ASSISTANT VIEW */}
                {activeTab === 'ai' && (
                    <div className="ai-view fade-in">
                        <div className="ai-assistant">
                            <h3 className="section-title-inside">AI Course Helper for {classroomDetails.title}</h3>
                            <div className="ai-input-row">
                                <input
                                    type="text"
                                    className="ai-input"
                                    placeholder={`Ask about ${classroomDetails.title} materials...`}
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
                                Example: Summarize the key points of the 'Week 1: Foundations' materials.
                            </p>
                        </div>
                    </div>
                )}

            </div>
        </main>
    );
}

export default ClassroomView;