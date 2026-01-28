import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom'; // 1. Added this
import { registerUser } from '../store/thunks';
import { clearError } from '../store/slices/authSlice'; // 2. Added this
import type { AppDispatch, RootState } from '../store';
import './Register.css';

const Register: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);

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
      <div className="glass-card">
        <h2>Create Account</h2>
        <p>Join our medical family</p>
        
        {error && <p style={{ color: '#ff6b6b', marginBottom: '10px' }}>{error}</p>}
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Full Name</label>
            <input 
              type="text" 
              placeholder="Enter your name" 
              onChange={(e) => setFormData({...formData, name: e.target.value})} 
              required 
            />
          </div>

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

          <div className="input-group">
            <label>I am a:</label>
            <select 
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value as 'PATIENT' | 'DOCTOR'})}
            >
              <option value="PATIENT">Patient</option>
              <option value="DOCTOR">Doctor</option>
            </select>
          </div>

          <button className="register-button" type="submit" disabled={loading}>
            {loading ? 'Processing...' : 'Register'}
          </button>
        </form>

        {/* 3. ADD THIS SECTION BELOW THE FORM */}
        <p style={{ marginTop: '15px', fontSize: '14px', color: 'white' }}>
          Already have an account?{' '}
          <Link 
            to="/login" 
            onClick={() => dispatch(clearError())} 
            style={{ color: 'var(--primary-blue)', fontWeight: 'bold', textDecoration: 'none' }}
          >
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;