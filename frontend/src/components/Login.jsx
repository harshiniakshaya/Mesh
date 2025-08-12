import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './Login.css';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      navigate('/student');
    }, 1500);
  };

  const handleRoleLogin = (role) => {
    navigate(`/${role}`);
  };

  return (
    <div className="login-container">
      <div className="login-header">
        MESH
      </div>

      <div className="login-card">
        <h1 className="login-title">Welcome back</h1>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              type="text"
              name="username"
              className="form-input"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-input"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="remember-row">
            <div className="checkbox-group">
              <input
                type="checkbox"
                id="remember"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleInputChange}
              />
              <label htmlFor="remember">Remember me</label>
            </div>
            <a href="#" className="forgot-link">Forgot password?</a>
          </div>

          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Login'}
          </button>
        </form>

        <div className="divider">
          <span>Or sign in with</span>
        </div>

        <div className="role-buttons">
          <button
            className="role-button"
            onClick={() => handleRoleLogin('student')}
          >
            Sign in as Student
          </button>
          <button
            className="role-button"
            onClick={() => handleRoleLogin('faculty')}
          >
            Sign in as Faculty
          </button>
          <button
            className="role-button"
            onClick={() => handleRoleLogin('admin')}
          >
            Sign in as Admin
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
