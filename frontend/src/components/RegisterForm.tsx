import React, { useState } from 'react';
import axios from 'axios';

const RegisterForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/users', { name, email, password });
      alert("Registration Successful! Now please Login.");
    } catch (error: any) {
      alert(error.response?.data?.error || "Registration Failed");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Name</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div className="form-group">
        <label>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div className="form-group">
        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>
      <button type="submit" className="btn-primary">Register</button>
    </form>
  );
};

export default RegisterForm;