import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../store/slices/authSlice';
import './Login.css'; // I will create this next

const Login: React.FC = () => {
  const dispatch = useDispatch();
  // I track the input fields in local state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // For now, I am simulating a successful login
    // I am sending a dummy PATIENT role to test the dashboard
    dispatch(loginSuccess({
      user: { id: 1, name: 'Betelhem', email, role: 'PATIENT' },
      token: 'fake-jwt-token'
    }));
  };

  return (
    <div className="login-container">
      {/* This is the Glassmorphism Card */}
      <div className="glass-card">
        <h2>Family Emergency App</h2>
        <p>Please sign in to continue</p>
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="name@example.com" 
              required 
            />
          </div>
          
          <div className="input-group">
            <label>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="••••••••" 
              required 
            />
          </div>
          
          <button type="submit" className="login-button">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;