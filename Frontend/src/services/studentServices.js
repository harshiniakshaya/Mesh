const BASE_URL = 'http://localhost:8080/api';

/**
 * POST: Attempts to join a classroom using a unique classroom code.
 * @param {string} classroomCode The unique code for the classroom.
 * @param {string} studentEmail The email/ID of the student joining.
 * @returns {Promise<Object>} The Classroom object the student successfully joined.
 */
export async function joinClassroom(classroomCode, studentEmail) {
    const url = `${BASE_URL}/student/classrooms/join`;

    const payload = {
        classroomCode: classroomCode
    };

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-User-Email': studentEmail, 
            // 'Authorization': `Bearer ${localStorage.getItem('studentAuthToken')}`, 
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to join classroom (HTTP error! Status: ${response.status}). Details: ${errorText}`);
    }

    return response.json();
}

// ----------------------------------------------------------------------

/**
 * GET: Fetches all classrooms the student is currently enrolled in.
 * @param {string} studentEmail The email/ID of the student.
 * @returns {Promise<Array<Object>>} An array of Classroom objects.
 */
export async function fetchMyClassrooms(studentEmail) {
    const url = `${BASE_URL}/student/classrooms`; 

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            // NOTE: Replace hardcoded email with the dynamic variable if you use one
            'X-User-Email': studentEmail, // Assuming studentEmail is passed correctly
            // 'Authorization': `Bearer ${localStorage.getItem('studentAuthToken')}`, 
        },
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch classrooms (HTTP error! Status: ${response.status}). Details: ${errorText}`);
    }

    return response.json(); 
}

// ----------------------------------------------------------------------

/**
 * GET: Fetches detailed classroom data (sections/materials, assignments) for student view.
 * @param {string} classroomId The ID of the classroom to fetch.
 * @param {string} studentEmail The email/ID of the student (for contextual data, like submission status).
 * @returns {Promise<Object>} The full classroom data object.
 */
export async function fetchClassroomDetails(classroomId, studentEmail) {
    // This GET endpoint is CRITICAL for fetching faculty-created sections/materials/assignments
    const url = `${BASE_URL}/classrooms/${classroomId}`; 

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            // Include student's email/ID for authorization
            'X-User-Email': studentEmail, 
            // 'Authorization': `Bearer ${localStorage.getItem('studentAuthToken')}`, 
        },
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch classroom details (Status: ${response.status}). Details: ${errorText}`);
    }

    return response.json();
}

// ----------------------------------------------------------------------

/**
 * POST: Submits a student's assignment file to the backend.
 * Uses the exact confirmed URL structure: /classrooms/{classroomId}/assignments/{assignmentId}/submit
 * @param {string} classroomId The ID of the classroom.
 * @param {string} assignmentId The ID of the specific assignment.
 * @param {FormData} formData The form data containing the 'file'.
 * @param {string} studentEmail The email/ID of the submitting student.
 * @returns {Promise<Object>} The submission record.
 */
export async function submitAssignment(classroomId, assignmentId, formData, studentEmail) {
    const url = `${BASE_URL}/classrooms/${classroomId}/assignments/${assignmentId}/submit`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            // Do NOT set 'Content-Type' for FormData; the browser sets 'multipart/form-data'
            'X-User-Email': 'ada.lovelace@example.com', 
            // 'Authorization': `Bearer ${localStorage.getItem('studentAuthToken')}`, 
        },
        body: formData, // Send the FormData object directly
    });

    if (!response.ok) {
        let errorMessage = `Failed to submit assignment: ${response.status}`;
        try {
            // Attempt to parse JSON error message from the backend
            const errorData = await response.json();
            // Assuming the backend uses a 'message' field for errors
            errorMessage = errorData.message || errorMessage; 
        } catch (e) {
            // Fallback for non-JSON error responses (e.g., plain text or HTML error pages)
            const errorText = await response.text();
            errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
    }

    return response.json();
}