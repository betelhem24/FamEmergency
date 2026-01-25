import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from './store/authSlice';
import type { RootState } from './store'; // Added 'type' here to stop TS errors
import './App.css';
import RegisterForm from './components/RegisterForm'; 

function App() {
  // Word-by-Word: We ask the store if 'user' is inside the 'auth' slice
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="container">
      {user ? (
        <div className="glass-card">
          <h1>Welcome, {user.name}! 👋</h1>
          <p>You are now logged into FamEmergency.</p>
          <button onClick={handleLogout} className="btn-secondary">
            Logout
          </button>
        </div>
      ) : (
        <div className="glass-card">
          <h2>Create Account</h2>
          {/* Word-by-Word: This is the component we just created in Step 1 */}
          <RegisterForm /> 
          <p className="auth-link">
            Already have an account? <a href="/login">Login here</a>
          </p>
        </div>
      )}
    </div>
  );
}

export default App;