import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import './Sidebar.css';

function Sidebar({ user, navItems, avatar, isAdmin, isOpen, onClose }) {
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024 && onClose) {
        onClose();
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [onClose]);

  const handleNavClick = (item) => {
    if (item.path) navigate(item.path);
    if (onClose) onClose();
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) navigate('/');
  };

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
      <aside className={`sidebar ${isOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          {!isAdmin && avatar && <img src={avatar} alt={user} className="user-avatar" />}
          {isAdmin && <div className="user-avatar admin-avatar">M</div>}
          <span className="user-name">{user}</span>
        </div>
        <nav>
          <ul className="nav-menu">
            {navItems.map((item, index) => (
              <li key={index} className="nav-item">
                <button className={`nav-link ${item.active ? 'active' : ''}`} onClick={() => handleNavClick(item)}>
                  <span className="nav-icon">{item.icon}</span>
                  <span>{item.name}</span>
                </button>
              </li>
            ))}
            <li className="nav-item logout-item">
              <button className="nav-link logout-link" onClick={handleLogout}>
                <span className="nav-icon">🚪</span>
                <span>Logout</span>
              </button>
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;
