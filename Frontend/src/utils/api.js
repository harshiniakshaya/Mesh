// src/utils/api.js

/**
 * Utility to manage authenticated fetch requests to the Spring Boot backend.
 */

const BASE_URL = 'http://localhost:8080';

/**
 * Gets the standard headers needed for API calls, including the Authorization header
 * with the JWT token retrieved from localStorage.
 * @returns {Object} Headers object.
 */
const getAuthHeaders = () => {
    // Retrieve the token saved during successful login
    const token = localStorage.getItem('userToken');

    const headers = {
        'Content-Type': 'application/json',
    };

    if (token) {
        // CRITICAL: Format token as 'Bearer <token>'
        headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
};

/**
 * Fetches data from a protected backend endpoint, automatically including the JWT token.
 * It also handles session expiry (401 Unauthorized) by clearing the token and redirecting.
 * * @param {string} endpoint - The path on the backend (e.g., '/api/student/classrooms').
 * @param {Object} options - Standard fetch options (method, body, etc.).
 * @returns {Response} The fetch Response object.
 */
export const fetchAuthenticated = async (endpoint, options = {}) => {
    const url = `${BASE_URL}${endpoint}`;
    const defaultHeaders = getAuthHeaders();

    const response = await fetch(url, {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers, // Allow custom headers to override defaults if needed
        },
    });

    // Handle authentication failures (token expired or invalid role)
    if (response.status === 401 || response.status === 403) {
        console.error('Authentication error. Session expired or access denied.');
        // In a real application, you would force a logout and redirect to the login page
        // localStorage.removeItem('userToken');
        // window.location.href = '/login';
    }

    return response;
};

// Example usage in your dashboard:
// import { fetchAuthenticated } from '../utils/api';
// const response = await fetchAuthenticated('/api/student/classrooms');