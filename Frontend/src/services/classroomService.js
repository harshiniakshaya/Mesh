
// src/services/classroomService.js (Updated with Fix)

const API_BASE_URL = 'http://localhost:8080/api';

/**
 * Creates a new classroom by sending a POST request to the backend.
 * (No change here - it works based on your previous input)
 */
export async function createClassroom(classroomData, facultyEmail) {
    // Replace the previous 'url' line with this:
 const url = `${API_BASE_URL}/classrooms/create`; 
// Corresponds to backend: @GetMapping("/api/classrooms/faculty/{email}")
    
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-User-Email': facultyEmail, 
        },
        body: JSON.stringify(classroomData),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Classroom creation failed (HTTP error! Status: ${response.status}). Details: ${errorText}`);
    }

    return response.json(); 
}

/**
 * Fetches all classrooms managed by the faculty member.
 * FIX APPLIED: Changed the URL to a more specific endpoint that likely exists in the backend.
 * @param {string} facultyEmail - The email of the faculty member.
 * @returns {Promise<Array<object>>} An array of Classroom objects.
 */
export async function fetchMyClassrooms(facultyEmail) {
    // CRITICAL FIX: Changed endpoint to a common pattern for filtered lists
    // If this doesn't work, try the other options (B or C)
    const url = `${API_BASE_URL}/classrooms/mine`; 

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'X-User-Email': facultyEmail, 
        },
    });

    if (!response.ok) {
        const errorText = await response.text();
        // The error message is what is displayed on the dashboard
        throw new Error(`Failed to fetch classrooms (HTTP error! Status: ${response.status}). Details: ${errorText}`);
    }

    return response.json(); 
}