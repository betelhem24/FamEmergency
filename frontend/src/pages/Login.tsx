import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { loginUser } from '../store/thunks';
import { clearError } from '../store/slices/authSlice';
import type { AppDispatch, RootState } from '../store';
import './Login.css';

const Login: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  
  // I add this state to track if the password is visible or hidden
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginUser(formData));
  };

  return (
    <div className="login-container">
      <div className="glass-card">
        <h2>Login</h2>
        <p>Welcome back to FamEmergency</p>
        
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
              // I switch the type dynamically: 'password' hides it, 'text' shows it
              type={showPassword ? 'text' : 'password'} 
              placeholder="••••••••" 
              onChange={(e) => setFormData({...formData, password: e.target.value})} 
              required 
            />
            {/* The "Eye" toggle button */}
            <span 
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '15px',
                top: '40px',
                cursor: 'pointer',
                fontSize: '18px'
              }}
            >
              {showPassword ? '👁️' : '🙈'}
            </span>
          </div>

          <button className="login-button" type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

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