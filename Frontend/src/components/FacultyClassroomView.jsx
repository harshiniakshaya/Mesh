// src/components/FacultyClassroomView.jsx
import React, { useState, useEffect } from 'react';
import './FacultyClassroomView.css';
import { 
    fetchClassroomDetailsForFaculty, 
    createSection, 
    addMaterial, 
    createAssignment 
} from '../services/FacultyClassroomView.js';

// Component for adding Materials
function MaterialForm({ classroomId, sections, onActionSuccess }) {
    const [title, setTitle] = useState('');
    const [type, setType] = useState('FILE'); // FILE or TEXT
    const [selectedSectionId, setSelectedSectionId] = useState('');
    const [file, setFile] = useState(null);
    const [textContent, setTextContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatusMessage(null);
        if (!selectedSectionId) {
            setStatusMessage({ type: 'error', text: 'Please select a section.' });
            return;
        }

        setIsLoading(true);

        try {
            const formData = new FormData();
            formData.append('title', title);
            
            // Logic for dynamically appending content based on type
            if (type === 'FILE') {
                 if (!file) {
                     setStatusMessage({ type: 'error', text: 'Please select a file.' });
                     setIsLoading(false);
                     return;
                 }
                 formData.append('file', file);
            } else { // TEXT
                 if (!textContent.trim()) {
                     setStatusMessage({ type: 'error', text: 'Text content cannot be empty.' });
                     setIsLoading(false);
                     return;
                 }
                 formData.append('textContent', textContent);
            }
            
            // Backend might require the type explicitly
            formData.append('type', type); 

            await addMaterial(classroomId, selectedSectionId, formData);
            
            setStatusMessage({ type: 'success', text: `Material '${title}' added successfully!` });
            
            // Clear form and trigger data refresh
            setTitle('');
            setFile(null);
            setTextContent('');
            document.getElementById('file-upload').value = null; // Reset file input
            onActionSuccess();

        } catch (error) {
            console.error('Add material failed:', error);
            setStatusMessage({ type: 'error', text: error.message });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="management-form">
            <h3>Add New Course Material</h3>
            {statusMessage && <div className={`status-message status-${statusMessage.type}`}>{statusMessage.text}</div>}
            
            <div className="form-group">
                <label>Target Section</label>
                <select value={selectedSectionId} onChange={(e) => setSelectedSectionId(e.target.value)} required disabled={isLoading} className="input-field">
                    <option value="">Select a Section</option>
                    {(sections ?? []).map(section => (
                        <option key={section.id} value={section.id}>{section.title}</option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label>Material Title</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required disabled={isLoading} className="input-field" />
            </div>

            <div className="form-group">
                <label>Material Type</label>
                <select value={type} onChange={(e) => setType(e.target.value)} disabled={isLoading} className="input-field">
                    <option value="FILE">File Upload (PDF, Image, etc.)</option>
                    <option value="TEXT">Text/Link Content</option>
                </select>
            </div>

            {type === 'FILE' && (
                <div className="form-group">
                    <label>Upload File</label>
                    <input type="file" id="file-upload" onChange={(e) => setFile(e.target.files[0])} disabled={isLoading} className="file-input" />
                </div>
            )}

            {type === 'TEXT' && (
                <div className="form-group">
                    <label>Text Content / URL</label>
                    <textarea value={textContent} onChange={(e) => setTextContent(e.target.value)} disabled={isLoading} rows="4" className="input-field"></textarea>
                </div>
            )}
            
            <button type="submit" disabled={isLoading || !title.trim() || !selectedSectionId || (type === 'FILE' && !file) || (type === 'TEXT' && !textContent.trim())} className="create-button">
                {isLoading ? 'Adding...' : 'Add Material'}
            </button>
        </form>
    );
}

// Component for creating Assignments
function AssignmentForm({ classroomId, onActionSuccess }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [points, setPoints] = useState(100);
    const [isLoading, setIsLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatusMessage(null);
        setIsLoading(true);

        // ⭐ FIX: Append time component to dueDate for ISO 8601 compliance.
        // This prevents the 400 Bad Request error from the backend.
        const formattedDueDate = dueDate ? `${dueDate}T23:59:59` : ''; 
        // NOTE: Some backends require Z for UTC, e.g., `${dueDate}T23:59:59.000Z`. 
        // We'll use the simpler version first, based on your Postman example.

        const assignmentData = {
            title,
            description,
            dueDate: formattedDueDate, // ⭐ FIXED FORMAT
            points: Number(points)
        };

        try {
            await createAssignment(classroomId, assignmentData);
            
            setStatusMessage({ type: 'success', text: `Assignment '${title}' created successfully!` });
            
            // Clear form and trigger data refresh
            setTitle('');
            setDescription('');
            setDueDate('');
            setPoints(100);
            
            // ⭐ CRITICAL: Call the loadClassroomData function passed as a prop
            // to refresh the Current Assignments list below the form.
            onActionSuccess();

        } catch (error) {
            console.error('Create assignment failed:', error);
            // Provide a better error message if possible
            const errorMessage = error.message.includes('400') ? 
                "Failed to create assignment. Check due date format or required fields." : 
                error.message;

            setStatusMessage({ type: 'error', text: errorMessage || 'Failed to create assignment.' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="management-form">
            <h3>Create New Assignment</h3>
            {statusMessage && <div className={`status-message status-${statusMessage.type}`}>{statusMessage.text}</div>}
            
            <div className="form-group">
                <label>Title</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required disabled={isLoading} className="input-field" />
            </div>

            <div className="form-group">
                <label>Description</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows="3" disabled={isLoading} className="input-field"></textarea>
            </div>

            <div className="form-group">
                <label>Due Date</label>
                {/* Note: type="date" gives YYYY-MM-DD format, which we now fix in handleSubmit */}
                <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required disabled={isLoading} className="input-field" />
            </div>
            
            <div className="form-group">
                <label>Points</label>
                <input type="number" value={points} onChange={(e) => setPoints(e.target.value)} min="1" required disabled={isLoading} className="input-field" />
            </div>
            
            <button type="submit" disabled={isLoading || !title.trim() || !dueDate} className="create-button">
                {isLoading ? 'Creating...' : 'Create Assignment'}
            </button>
        </form>
    );
}


// --- Main Faculty Classroom View Component ---
function FacultyClassroomView({ classroomId, onBack, initialData }) {
    const [activeTab, setActiveTab] = useState('sections'); 
    const [classroomData, setClassroomData] = useState(initialData || null);
    const [loadingDetails, setLoadingDetails] = useState(true);
    const [error, setError] = useState(null);

    // Function to fetch or refresh the detailed classroom data
    const loadClassroomData = async () => {
        setLoadingDetails(true);
        setError(null);
        try {
            const data = await fetchClassroomDetailsForFaculty(classroomId);
            setClassroomData(data);
        } catch (err) {
            setError(err.message);
            console.error('Failed to load full classroom data:', err);
        } finally {
            setLoadingDetails(false);
        }
    };

    // Load data on component mount and whenever classroomId changes
    useEffect(() => {
        loadClassroomData();
    }, [classroomId]);

    // SECTION MANAGEMENT (Create Section)
    const [sectionName, setSectionName] = useState('');
    const [isCreatingSection, setIsCreatingSection] = useState(false);
    const [sectionStatus, setSectionStatus] = useState(null);

    const handleCreateSection = async () => {
        setSectionStatus(null);
        if (!sectionName.trim()) {
            setSectionStatus({ type: 'error', text: 'Section name cannot be empty.' });
            return;
        }

        setIsCreatingSection(true);

        try {
            await createSection(classroomId, sectionName);
            setSectionStatus({ type: 'success', text: `Section '${sectionName}' created successfully!` });
            setSectionName('');
            await loadClassroomData(); // Refresh data

        } catch (err) {
            console.error('Create section failed:', err);
            setSectionStatus({ type: 'error', text: err.message });
        } finally {
            setIsCreatingSection(false);
        }
    };
    
    if (loadingDetails) {
        return <div className="loading-message">Loading classroom details...</div>;
    }

    if (error || !classroomData) {
        return (
            <main className="main-content faculty-classroom-page">
                <p className="status-error">Error: {error || 'Failed to load classroom data.'}</p>
                <button className="back-button" onClick={onBack}>← Back to Dashboard</button>
            </main>
        );
    }

    const sections = classroomData.sections ?? [];
    const assignments = classroomData.assignments ?? [];

    return (
        <main className="main-content faculty-classroom-page">
            <button className="back-button" onClick={onBack}>
                ← Back to Dashboard
            </button>
            <h1 className="page-title">{classroomData.title} Management</h1>
            <p className="classroom-professor-detail">Class Code: {classroomData.classroomCode}</p>

            <div className="classroom-tabs">
                <button className={`tab-button ${activeTab === 'sections' ? 'active' : ''}`} onClick={() => setActiveTab('sections')}>Sections</button>
                <button className={`tab-button ${activeTab === 'materials' ? 'active' : ''}`} onClick={() => setActiveTab('materials')}>Add Material</button>
                <button className={`tab-button ${activeTab === 'assignments' ? 'active' : ''}`} onClick={() => setActiveTab('assignments')}>Create Assignment</button>
            </div>

            <div className="tab-content">

                {/* 1. SECTIONS VIEW (Current sections + Create Section Form) */}
                {activeTab === 'sections' && (
                    <div className="section-management fade-in">
                        <div className="card">
                            <h3 className="section-title-inside">Create New Section</h3>
                            {sectionStatus && <div className={`status-message status-${sectionStatus.type}`}>{sectionStatus.text}</div>}
                            <div className="create-section-form">
                                <input
                                    type="text"
                                    placeholder="e.g., Module 1: String Theory"
                                    value={sectionName}
                                    onChange={(e) => setSectionName(e.target.value)}
                                    disabled={isCreatingSection}
                                    className="input-field"
                                />
                                <button onClick={handleCreateSection} disabled={isCreatingSection || !sectionName.trim()} className="create-button">
                                    {isCreatingSection ? 'Creating...' : 'Create Section'}
                                </button>
                            </div>
                        </div>

                        <div className="card" style={{ marginTop: '20px' }}>
                            <h3 className="section-title-inside">Current Sections ({sections.length})</h3>
                            {sections.length === 0 ? (
                                <p className="no-data-message">No sections exist yet.</p>
                            ) : (
                                <ul className="section-list">
                                    {sections.map(section => (
                                        <li key={section.id} className="section-list-item">
                                            <span>{section.title ?? 'Untitled Section (Check Data Key)'}</span>
                                            <span className="section-material-count">({(section.materials ?? []).length} materials)</span>
                                            {/* Delete button can be added here */}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                )}

                {/* 2. ADD MATERIAL VIEW */}
                {activeTab === 'materials' && (
                    <div className="add-material-view fade-in">
                        <MaterialForm 
                            classroomId={classroomId}
                            sections={sections}
                            onActionSuccess={loadClassroomData}
                        />
                    </div>
                )}

                {/* 3. CREATE ASSIGNMENT VIEW */}
                {activeTab === 'assignments' && (
                    <div className="create-assignment-view fade-in">
                        <AssignmentForm 
                            classroomId={classroomId}
                            onActionSuccess={loadClassroomData}
                        />

                        <div className="card" style={{ marginTop: '20px' }}>
                            <h3 className="section-title-inside">Current Assignments ({assignments.length})</h3>
                            {assignments.length === 0 ? (
                                <p className="no-data-message">No assignments exist yet.</p>
                            ) : (
                                <ul className="section-list">
                                    {assignments.map(a => (
                                        <li key={a.id} className="assignment-list-item">
                                            <span>{a.title}</span> 
                                            <span className="assignment-details">
                                                (ID: {a.id}) - Due: {a.dueDate}
                                            </span>
                                            {/* Placeholder for future Submission Management button */}
                                            <button className="view-submissions-button">
                                                View Submissions (0) 
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}

export default FacultyClassroomView;