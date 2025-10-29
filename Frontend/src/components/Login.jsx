// import { useNavigate } from 'react-router-dom';
// import { useState } from 'react';
// import { loginUser } from '../services/authServices.js';
// import './Login.css';

// function Login() {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     username: '',
//     password: '',
//     rememberMe: false
//   });
//   const [isLoading, setIsLoading] = useState(false);
//    const [error, setError] = useState(''); 

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value
//     }));
//   };

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError(''); // Clear previous errors

//     // 1. INPUT VALIDATION: Stop if fields are empty
//     // We map frontend 'username' input to backend 'email'
//     if (!formData.username || !formData.password) {
//         setError('Please enter both email and password.');
//         setIsLoading(false);
//         return; 
//     }

//     try {
//         // 2. REAL API CALL: Passes frontend username (email) and password
//         const { role } = await loginUser(formData.username, formData.password);
        
//         // 3. SUCCESS: Navigation only if the backend confirms success and returns a role
//         navigate(`/${role}`); 

//     } catch (err) {
//         // 4. FAILURE: Catch network or backend login errors
//         const errorMessage = err.message || 'Login failed. Please try again.';
//         setError(errorMessage); 
//         console.error("Login Error:", err);

//     } finally {
//         // 5. Cleanup: Stop loading indicator
//         setIsLoading(false);
//     }
// };

//   // const handleRoleLogin = (role) => {
//   //   navigate(`/${role}`);
//   // };

//   return (
//     <div className="login-container">
//       <div className="login-header">
//         MESH
//       </div>

//       <div className="login-card">
//         <h1 className="login-title">Welcome back</h1>

//           {error && <div className="error-message">{error}</div>} 

//         <form onSubmit={handleLogin}>
//           <div className="form-group">
//             <label className="form-label">Username</label>
//             <input
//               type="text"
//               name="username"
//               className="form-input"
//               placeholder="Enter your username"
//               value={formData.username}
//               onChange={handleInputChange}
//               required
//             />
//           </div>

//           <div className="form-group">
//             <label className="form-label">Password</label>
//             <input
//               type="password"
//               name="password"
//               className="form-input"
//               placeholder="Enter your password"
//               value={formData.password}
//               onChange={handleInputChange}
//               required
//             />
//           </div>

//           <div className="remember-row">
//             <div className="checkbox-group">
//               <input
//                 type="checkbox"
//                 id="remember"
//                 name="rememberMe"
//                 checked={formData.rememberMe}
//                 onChange={handleInputChange}
//               />
//               <label htmlFor="remember">Remember me</label>
//             </div>
//             <a href="#" className="forgot-link">Forgot password?</a>
//           </div>

//           <button type="submit" className="login-button" disabled={isLoading}>
//             {isLoading ? 'Signing in...' : 'Login'}
//           </button>
//         </form>

//         <div className="divider">
//           <span>Or sign in with</span>
//         </div>

//         {/* <div className="role-buttons">
//           <button
//             className="role-button"
//             onClick={() => handleRoleLogin('student')}
//           >
//             Sign in as Student
//           </button>
//           <button
//             className="role-button"
//             onClick={() => handleRoleLogin('faculty')}
//           >
//             Sign in as Faculty
//           </button>
//           <button
//             className="role-button"
//             onClick={() => handleRoleLogin('admin')}
//           >
//             Sign in as Admin
//           </button>
//         </div> */}
//       </div>
//     </div>
//   );
// }

// export default Login;


// src/components/Login.jsx

import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { loginUser } from '../services/authServices.js';
import './Login.css';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false
  });
  const [isLoading, setIsLoading] = useState(false);
  // State to hold the string error message
  const [error, setError] = useState(''); 

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
    setError(''); // Clear previous errors

    if (!formData.username || !formData.password) {
        setError('Please enter both email and password.');
        setIsLoading(false);
        return; 
    }

    try {
        // 1. Get the role from the service
        const { role } = await loginUser(formData.username, formData.password);
        
        // 2. SUCCESS: Dynamic Redirection 🚀
        // This relies on the role being 'admin', 'faculty', or 'student'
        // and your App.js having routes: /admin, /faculty, /student.
        navigate(`/${role}`); 

    } catch (err) {
        // 3. FAILURE: Catch the string error
        const errorMessage = err.message || 'Login failed. Please try again.';
        setError(errorMessage); 
        console.error("Login Error:", err);

    } finally {
        setIsLoading(false);
    }
};

  return (
    <div className="login-container">
      <div className="login-header">
        MESH
      </div>

      <div className="login-card">
        <h1 className="login-title">Welcome back</h1>

        {/* FIX: Ensure error is displayed clearly and styled (add red color via CSS/inline style if needed) */}
          {error && <div className="error-message" style={{color: 'red', fontWeight: 'bold', marginBottom: '10px'}}>{error}</div>} 

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

      </div>
    </div>
  );
}

export default Login;