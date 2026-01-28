import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { loginUser } from '../store/thunks';
import { clearError } from '../store/slices/authSlice';
import type { AppDispatch, RootState } from '../store';
import './Login.css';

const Login: React.FC = () => {
  // I initialize the dispatch function to send actions to our Redux store
  const dispatch = useDispatch<AppDispatch>();
  
  // I pull the loading and error states from the global auth state
  const { loading, error } = useSelector((state: RootState) => state.auth);
  
  // I track if the password should be visible (text) or hidden (dots)
  const [showPassword, setShowPassword] = useState(false);

  // I keep track of the email and password the user types
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    // I prevent the page from refreshing when the form is submitted
    e.preventDefault();
    // I trigger the login process via our modular Thunk
    dispatch(loginUser(formData));
  };

  return (
    <div className="login-container">
      <div className="glass-card">
        <h2>Login</h2>
        <p>Welcome back to FamEmergency</p>
        
        {/* I display the error message in red if the login fails */}
        {error && <p style={{ color: '#ff6b6b', marginBottom: '10px' }}>{error}</p>}
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email Address</label>
            <input 
              type="email" 
              placeholder="email@example.com" 
              onChange={(e) => setFormData({...formData, email: e.target.value})} 
              required 
            />
          </div>

          <div className="input-group" style={{ position: 'relative' }}>
            <label>Password</label>
            <input 
              // I change the input type dynamically based on showPassword state
              type={showPassword ? 'text' : 'password'} 
              placeholder="••••••••" 
              onChange={(e) => setFormData({...formData, password: e.target.value})} 
              required 
            />
            {/* Professional text-based toggle button */}
            <span 
              onClick={() => setShowPassword(!showPassword)}
              style={{ 
                position: 'absolute', 
                right: '15px', 
                top: '38px', 
                cursor: 'pointer',
                fontSize: '12px',
                color: 'var(--primary-blue)',
                fontWeight: 'bold',
                textTransform: 'uppercase'
              }}
            >
              {showPassword ? 'Hide' : 'Show'}
            </span>
          </div>

          <button className="login-button" type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Navigation link to the Register page */}
        <p style={{ marginTop: '15px', fontSize: '14px', color: 'white' }}>
          Don't have an account?{' '}
          <Link 
            to="/register" 
            onClick={() => dispatch(clearError())} 
            style={{ color: 'var(--primary-blue)', fontWeight: 'bold', textDecoration: 'none' }}
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;