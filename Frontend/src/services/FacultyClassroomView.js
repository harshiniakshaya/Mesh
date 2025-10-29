const getToken = () => localStorage.getItem('authToken');

// --- API Calls ---

// Using the confirmed working port (8080) for all classroom-related endpoints
const BASE_URL = 'http://localhost:8080/api/classrooms'; 

/**
 * GET: Fetches detailed classroom data (sections, assignments, etc.) for faculty management.
 * * @param {string} classroomId The ID of the classroom to fetch.
 * @returns {Promise<object>} The full classroom data object.
 */
export const fetchClassroomDetailsForFaculty = async (classroomId) => {
    const response = await fetch(`${BASE_URL}/${classroomId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${getToken()}`,
        },
    });

    if (!response.ok) {
        let errorMessage = `Failed to fetch classroom details: ${response.status}`;
        try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
        } catch (e) {
            // Ignore if JSON parsing fails
        }
        throw new Error(errorMessage);
    }

    // This is the call that must return the full, updated list of 'sections'.
    return response.json();
};

/**
 * POST: Faculty adds a new Section to the Classroom.
 * * @param {string} classroomId The ID of the classroom.
 * @param {string} sectionName The title of the new section.
 * @returns {Promise<object>} The newly created section object.
 */
export const createSection = async (classroomId, sectionName) => {
    const requestBody = {
        title: sectionName
    };

    const response = await fetch(`${BASE_URL}/${classroomId}/sections`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`,
            // 'X-User-Email' is kept here as it was in your original code
            'X-User-Email' : 'alan.turing@example.com'
        },
        body: JSON.stringify(requestBody), 
    });

    if (!response.ok) {
        let errorMessage = `Failed to create section: ${response.status}`;
        try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
        } catch (e) {
            // Ignore if JSON parsing fails
        }
        throw new Error(errorMessage);
    }

    return response.json();
};

/**
 * POST: Faculty adds a new Material to a specific Section.
 * * @param {string} classroomId The ID of the classroom.
 * @param {string} sectionId The ID of the target section.
 * @param {FormData} formData The form data containing file and title.
 * @returns {Promise<object>} The created material object.
 */
export const addMaterial = async (classroomId, sectionId, formData) => {
    const response = await fetch(`${BASE_URL}/${classroomId}/sections/${sectionId}/materials`, {
        method: 'POST',
        headers: {
            // Do NOT set 'Content-Type' for FormData requests; browser sets it correctly
            'Authorization': `Bearer ${getToken()}`,
            'X-User-Email' : 'alan.turing@example.com'
        },
        body: formData,
    });

    if (!response.ok) {
        let errorMessage = `Failed to add material: ${response.status}`;
        try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
        } catch (e) {
             // Ignore if JSON parsing fails
        }
        throw new Error(errorMessage);
    }

    return response.json();
};

/**
 * POST: Faculty creates a new Assignment for the Classroom.
 * * @param {string} classroomId The ID of the classroom.
 * @param {object} assignmentData The data for the new assignment.
 * @returns {Promise<object>} The created assignment object.
 */
export const createAssignment = async (classroomId, assignmentData) => {
    const response = await fetch(`${BASE_URL}/${classroomId}/assignments`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`,
            'X-User-Email' : 'alan.turing@example.com'
        },
        body: JSON.stringify(assignmentData),
    });

    if (!response.ok) {
        let errorMessage = `Failed to create assignment: ${response.status}`;
        try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
        } catch (e) {
            // Ignore if JSON parsing fails
        }
        throw new Error(errorMessage);
    }

    return response.json();
};