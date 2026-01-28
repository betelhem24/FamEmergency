import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom'; // 1. Added this
import { loginUser } from '../store/thunks';
import { clearError } from '../store/slices/authSlice'; // 2. Added this
import type { AppDispatch, RootState } from '../store';
import './Login.css';

const Login: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);

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

          <div className="input-group">
            <label>Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              onChange={(e) => setFormData({...formData, password: e.target.value})} 
              required 
            />
          </div>

          <button className="login-button" type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* 3. ADD THIS SECTION BELOW THE FORM */}
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