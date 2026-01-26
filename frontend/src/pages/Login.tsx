import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
// I fixed the path to include the 'slices' folder
// I changed 'setCredentials' to 'loginSuccess' to match our authSlice.ts
import { loginSuccess } from '../store/slices/authSlice';
import './Login.css';

const Login: React.FC = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // I am sending the user to Redux
    dispatch(loginSuccess({
      user: { id: 1, name: 'Betelhem', email, role: 'PATIENT' },
      token: 'fake-jwt-token'
    }));
  };

  return (
    <div className="login-container">
      <div className="glass-card">
        <h2>Family Emergency App</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="login-button">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;