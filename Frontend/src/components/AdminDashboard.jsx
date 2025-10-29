import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import './AdminDashboard.css';
// Import both API functions
import { createNewUser, getAllUsers } from '../services/adminService.js';

function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('Students');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [showCreateModal, setShowCreateModal] = useState(false);

    // New state variables for loading and errors
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [newUser, setNewUser] = useState({
        name: '',
        email: '',
        password: '',
        role: 'student'
    });

    // Initialize users as an empty array to be filled by the API
    const [users, setUsers] = useState([]);

    const adminNav = [
        { name: 'Dashboard', icon: '🏠', active: true, path: '/admin' },
        { name: 'Students', icon: '👥', path: '/admin/students' },
        { name: 'Faculty', icon: '👨‍🏫', path: '/admin/faculty' },
        { name: 'Admins', icon: '👨‍💼', path: '/admin/admins' },
        { name: 'Settings', icon: '⚙️', path: '/admin/settings' }
    ];

    // --- Data Fetching Logic ---
    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await getAllUsers();
            
            // FIX APPLIED: SAFELY MAP DATA FROM BACKEND AND ENSURE LOWERCASE STRINGS
            setUsers(data.map(user => {
                // Use optional chaining for safety, then provide a default string.
                const name = user.name || 'Unknown User';
                const email = user.email || 'no_email@provided.com';
                // Ensure role and status are lower-cased and have defaults
                const role = user.role?.toLowerCase() || 'student'; 
                const status = user.status?.toLowerCase() || 'active'; 

                return {
                    ...user, // Keep any other properties the API returns
                    name,
                    email,
                    role,
                    status,
                    // Use the MongoDB _id field as the React key, fallback to email
                    id: user._id || user.email, 
                };
            }));
            
            setError(null);
        } catch (err) {
            console.error("Failed to fetch users:", err);
            setError("Failed to load user data from the server. Please check your backend services.");
        } finally {
            setLoading(false);
        }
    };

    // useEffect runs once on mount to fetch all users
    useEffect(() => {
        fetchUsers();
    }, []); 
    // ---------------------------

    const getStats = () => {
        // Stats logic relies on the standardized, lower-cased roles/statuses set in fetchUsers
        const totalStudents = users.filter(u => u.role === 'student').length;
        const totalFaculty = users.filter(u => u.role === 'faculty').length;
        const activeUsers = users.filter(u => u.status === 'active').length;
        
        return [
            { title: 'Total Students', value: totalStudents },
            { title: 'Total Faculty', value: totalFaculty },
            { title: 'Active Users', value: activeUsers }
        ];
    };

    const getFilteredUsers = () => {
        // Ensure users array is initialized before filtering
        if (!users || users.length === 0) return [];
        
        // This search term is safe because it's a state variable, but we wrap it for robustness
        const searchLower = searchTerm?.toLowerCase() || '';

        return users.filter(user => {
            
            // FIX APPLIED: Use optional chaining in the filtering function as a final safeguard.
            // This is the most direct fix for 'Cannot read properties of null (reading 'toLowerCase')'
            const matchesSearch = user.name?.toLowerCase().includes(searchLower) ||
                                user.email?.toLowerCase().includes(searchLower);
                                
            // The user.status and user.role are already standardized to lowercase strings 
            // in the fetchUsers function, so direct comparison is safe here.
            const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
            
            // Determine the role required by the active tab
            const requiredRole = activeTab.toLowerCase().slice(0, -1); // 'Students' -> 'student'
            const matchesTab = user.role === requiredRole;

            return matchesSearch && matchesStatus && matchesTab;
        });
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        
        const payload = {
            name: newUser.name,
            email: newUser.email,
            password: newUser.password, 
            role: newUser.role,
        };
        
        if (!payload.name || !payload.email || !payload.password) {
            alert("Please fill in all required fields (Name, Email, Password).");
            return;
        }

        try {
            // Note: The backend might return the created user object or just a success message.
            const responseMessage = await createNewUser(payload);
            
            console.log('User created successfully:', responseMessage);
            alert('User successfully created: ' + (typeof responseMessage === 'string' ? responseMessage : 'User registered successfully'));
            
            // Re-fetch the entire list to get the latest data from the database
            await fetchUsers(); 
            
            // Reset state and close modal
            setNewUser({ name: '', email: '', password: '', role: 'student' });
            setShowCreateModal(false);

        } catch (error) {
            console.error('API Error:', error);
            // Show a concise error message to the user
            alert(`User Creation Failed: ${error.message.substring(0, 100)}`);
        }
    };

    // NOTE: These actions need corresponding API calls in adminService.js for persistence
    const toggleUserStatus = (id) => {
        // Toggles local state status for demonstration
        setUsers(users.map(user =>
            user.id === id ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' } : user
        ));
        // TODO: Call API function here to update status on the backend
        // Example: await updateStatus(id, newStatus); 
    };

    const deleteUser = (id) => {
        if (window.confirm('Are you sure you want to delete this user? This action is irreversible.')) {
            // Deletes from local state for demonstration
            setUsers(users.filter(user => user.id !== id));
            // TODO: Call API function here to delete user from the backend
            // Example: await deleteUser(id);
        }
    };

    return (
        <div className="dashboard">
            <button className="mobile-menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
            
            <Sidebar 
                user="MESH" 
                navItems={adminNav}
                isAdmin={true}
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />
            
            <main className="main-content">
                <h1 className="page-title">Admin Dashboard</h1>
                
                <section>
                    <h2 className="section-title">System Overview</h2>
                    <div className="stats-grid">
                        {getStats().map((stat, i) => (
                            <div key={i} className="stat-card">
                                <div className="stat-title">{stat.title}</div>
                                <div className="stat-value">{stat.value}</div>
                            </div>
                        ))}
                    </div>
                </section>
                
                <section>
                    <div className="section-header">
                        <h2 className="section-title">Manage Accounts</h2>
                        <button className="create-button" onClick={() => setShowCreateModal(true)}>Add New User</button>
                    </div>
                    
                    <div className="tabs">
                        {['Students', 'Faculty', 'Admins'].map(tab => (
                            <button
                                key={tab}
                                className={`tab-button ${activeTab === tab ? 'active' : ''}`}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                    
                    <div className="search-filter-bar">
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <select
                            className="filter-select"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                    
                    {/* Display Loading/Error or Table */}
                    {loading && <div className="loading-message">Loading users...</div>}
                    {error && <div className="error-message">{error}</div>}
                    
                    {!loading && !error && (
                        <div className="table-container">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {getFilteredUsers().map(user => (
                                        <tr key={user.id}>
                                            <td>{user.name}</td>
                                            <td>{user.email}</td>
                                            <td>
                                                <span className={`status-badge status-${user.status}`}>
                                                    {user.status === 'active' ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td>
                                                <a href="#" className="action-link">View</a>
                                                <a 
                                                    href="#" 
                                                    className="action-link"
                                                    onClick={(e) => { e.preventDefault(); toggleUserStatus(user.id); }}
                                                >
                                                    {user.status === 'active' ? 'Deactivate' : 'Activate'}
                                                </a>
                                                <a 
                                                    href="#" 
                                                    className="action-link delete"
                                                    onClick={(e) => { e.preventDefault(); deleteUser(user.id); }}
                                                >
                                                    Delete
                                                </a>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {getFilteredUsers().length === 0 && (
                                <div className="empty-message">No users found matching your criteria.</div>
                            )}
                        </div>
                    )}
                </section>
            </main>

            {showCreateModal && (
                <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="modal-title">Add New User</h2>
                            <button className="close-button" onClick={() => setShowCreateModal(false)}>×</button>
                        </div>
                        <form onSubmit={handleCreateUser}>
                            <div className="form-group">
                                <label className="form-label">Full Name</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={newUser.name}
                                    onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Email</label>
                                <input
                                    type="email"
                                    className="form-input"
                                    value={newUser.email}
                                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Password</label> 
                                <input
                                    type="password"
                                    className="form-input"
                                    value={newUser.password}
                                    onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Role</label>
                                <select
                                    className="form-input"
                                    value={newUser.role}
                                    onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                                >
                                    <option value="student">Student</option>
                                    <option value="faculty">Faculty</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="cancel-button" onClick={() => setShowCreateModal(false)}>Cancel</button>
                                <button type="submit" className="create-button">Add User</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminDashboard;