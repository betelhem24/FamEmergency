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
  
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginUser(formData));
  };

  return (
    <div className="login-container">
      <div className="glass-card auth-card">
        <h2>Login</h2>
        <p>Welcome to FamEmergency</p>
        
        {error && <p className="error-text">{error}</p>}
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email</label>
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
              type={showPassword ? 'text' : 'password'} 
              placeholder="••••••••" 
              onChange={(e) => setFormData({...formData, password: e.target.value})} 
              required 
            />
            <span className="toggle-pass" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? 'Hide' : 'Show'}
            </span>
          </div>

          <button className="login-button" type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="auth-footer">
          New here? <Link to="/register" onClick={() => dispatch(clearError())}>Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;