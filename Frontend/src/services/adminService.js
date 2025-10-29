// src/services/adminService.js

// The base URL for your API Gateway
const API_BASE_URL = 'http://localhost:8080'; 

// --- 1. CREATE USER (Your existing function) ---

/**
 * Creates a new user by sending a POST request to the Admin Service via the API Gateway.
 * @param {object} userData - The user data (name, email, role, password).
 * @returns {Promise<string>} The response message from the API.
 */
export const createNewUser = async (userData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/admin/users/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Include any necessary authentication token here
            },
            body: JSON.stringify(userData),
        });

        const textResponse = await response.text();
        
        if (!response.ok) {
            // Throw an error with the status and response body for robust error handling
            throw new Error(`HTTP error! Status: ${response.status}. Message: ${textResponse}`);
        }

        // Return the plain text message from the backend (e.g., "User created successfully")
        return textResponse; 
        
    } catch (error) {
        console.error('Error creating new user:', error.message);
        throw error;
    }
};

// -----------------------------------------------------------------------
// --- 2. READ ALL USERS (New function to be added) ---

/**
 * Sends a GET request to retrieve all users for the dashboard table.
 * Corresponds to the Admin Service endpoint: GET /api/admin/users
 * @returns {Promise<Array<object>>} The list of user objects.
 */
export const getAllUsers = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/admin/users`, {
            method: 'GET',
            headers: {
                // 'Authorization': 'Bearer ...'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        // Use .json() because the backend AdminController GET method returns a List<User>
        return await response.json(); 
        
    } catch (error) {
        console.error('Error fetching users:', error.message);
        throw error;
    }
};

// -----------------------------------------------------------------------

// You will add updateUser and deleteUser functions here later.