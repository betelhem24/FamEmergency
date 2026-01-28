import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { registerUser } from '../store/thunks';
import { clearError } from '../store/slices/authSlice';
import type { AppDispatch, RootState } from '../store';
import './Register.css';

const Register: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'PATIENT' as 'PATIENT' | 'DOCTOR'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(registerUser(formData));
  };

  return (
    <div className="register-container">
      <div className="glass-card register-card">
        <h2>Create Account</h2>
        <p>Join our medical network</p>
        
        {error && <p className="error-text">{error}</p>}
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Full Name</label>
            <input 
              type="text" 
              placeholder="Your Name" 
              onChange={(e) => setFormData({...formData, name: e.target.value})} 
              required 
            />
          </div>

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

          <div className="input-group">
            <label>Account Type</label>
            <select 
              value={formData.role} 
              onChange={(e) => setFormData({...formData, role: e.target.value as 'PATIENT' | 'DOCTOR'})}
            >
              <option value="PATIENT">Patient</option>
              <option value="DOCTOR">Doctor</option>
            </select>
          </div>

          <button className="register-button" type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Register'}
          </button>
        </form>

        <p className="auth-footer">
          Joined already? <Link to="/login" onClick={() => dispatch(clearError())}>Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;