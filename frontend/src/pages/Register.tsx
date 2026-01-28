import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../store/thunks';
import { AppDispatch, RootState } from '../store';

const Register: React.FC = () => {
  // I initialize the dispatch function to send actions to Redux
  const dispatch = useDispatch<AppDispatch>();
  
  // I pull the loading and error state from our Redux "Brain"
  const { loading, error } = useSelector((state: RootState) => state.auth);

  // I set up local state for the form inputs
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'PATIENT' // Default role as per our User interface
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // I trigger the registration process through Redux
    dispatch(registerUser(formData));
  };

  return (
    <div className="register-container">
      <h2>Create Account</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Full Name" 
          onChange={(e) => setFormData({...formData, name: e.target.value})} 
          required 
        />
        <input 
          type="email" 
          placeholder="Email" 
          onChange={(e) => setFormData({...formData, email: e.target.value})} 
          required 
        />
        <input 
          type="password" 
          placeholder="Password" 
          onChange={(e) => setFormData({...formData, password: e.target.value})} 
          required 
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
};

export default Register;