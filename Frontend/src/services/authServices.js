



// src/services/authServices.js

import axios from 'axios';

// Confirmed URL from your backend setup
const LOGIN_URL = 'http://localhost:8080/users/login'; 

/**
 * Attempts to log in a user by sending credentials.
 * It parses the successful STRING response from the backend to extract the role.
 * * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {Promise<{role: string}>} - The extracted user role (e.g., 'admin').
 */
export const loginUser = async (email, password) => {
    try {
        const response = await axios.post(LOGIN_URL, {
            email: email, 
            password: password 
        });

        // Backend returns a simple success string, e.g., "Login successful as admin"
        const responseMessage = response.data; 

        // CRUCIAL FIX: Extract Role using Regex to handle the string response
        const roleMatch = responseMessage.match(/Login successful as\s+(faculty|student|admin)/i);
        const role = roleMatch ? roleMatch[1].toLowerCase() : 'unknown';

        if (role === 'unknown') {
             // If login was successful (200 OK) but we couldn't parse the role
             throw new Error('Login succeeded, but user role could not be identified for redirection.');
        }

        // Return the extracted role to Login.jsx
        return { role: role };
        
    } catch (error) {
        // FIX for [object Object] error: We ensure a clear string error is thrown.
        let errorMessage = "Login failed due to a network or server error.";
        
        if (error.response) {
            // Check for specific error message strings from the backend (e.g., "Email not found", "Incorrect password")
            if (typeof error.response.data === 'string' && error.response.data.length > 0) {
                 errorMessage = error.response.data; 
            } else {
                 errorMessage = `Login failed. Status: ${error.response.status}.`;
            }
        } else if (error.request) {
            errorMessage = 'Cannot connect to the server. Check if all services are running.';
        }
        
        // Throw the simple string error back to Login.jsx
        throw new Error(errorMessage);
    }
};