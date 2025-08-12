import { useState } from 'react';
import Sidebar from './Sidebar';
import './AdminDashboard.css';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('Students');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'student'
  });
  const [users, setUsers] = useState([
    { id: 1, name: 'Ethan Harper', email: 'ethan.harper@email.com', status: 'active', role: 'student' },
    { id: 2, name: 'Olivia Bennett', email: 'olivia.bennett@email.com', status: 'inactive', role: 'student' },
    { id: 3, name: 'Noah Carter', email: 'noah.carter@email.com', status: 'active', role: 'faculty' },
    { id: 4, name: 'Ava Morgan', email: 'ava.morgan@email.com', status: 'active', role: 'student' },
    { id: 5, name: 'Liam Foster', email: 'liam.foster@email.com', status: 'inactive', role: 'faculty' }
  ]);

  const adminNav = [
    { name: 'Dashboard', icon: '🏠', active: true, path: '/admin' },
    { name: 'Students', icon: '👥', path: '/admin/students' },
    { name: 'Faculty', icon: '👨‍🏫', path: '/admin/faculty' },
    { name: 'Admins', icon: '👨‍💼', path: '/admin/admins' },
    { name: 'Settings', icon: '⚙️', path: '/admin/settings' }
  ];

  const getStats = () => {
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
    return users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
      const matchesTab =
        activeTab.toLowerCase() === 'students' ? user.role === 'student' :
        activeTab.toLowerCase() === 'faculty' ? user.role === 'faculty' :
        activeTab.toLowerCase() === 'admins' ? user.role === 'admin' : true;

      return matchesSearch && matchesStatus && matchesTab;
    });
  };

  const handleCreateUser = (e) => {
    e.preventDefault();
    const newId = Math.max(...users.map(u => u.id)) + 1;
    setUsers([...users, {
      id: newId,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      status: 'active'
    }]);
    setNewUser({ name: '', email: '', role: 'student' });
    setShowCreateModal(false);
  };

  const toggleUserStatus = (id) => {
    setUsers(users.map(user =>
      user.id === id ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' } : user
    ));
  };

  const deleteUser = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(user => user.id !== id));
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
