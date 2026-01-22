// 1. IMPORTS
import React, { useState } from 'react';
// Word-by-Word: AxiosError is a "Type" that describes exactly what a failure looks like
import axios, { AxiosError } from 'axios'; 
import './App.css';

function App() {
  // 2. STATE
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  // 3. THE BRIDGE
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/users', {
        name: name,
        email: email,
        password: password
      });

      console.log("Success:", response.data);
      alert('Success! User created: ' + response.data.name);
      
    } catch (err) {
      // 🔍 THE PRO FIX:
      // Word-by-Word:
      // 'as' = I are telling TypeScript: "Trust me, I know this error comes from Axios."
      // '<{error: string}>' = We are defining that the server's JSON has a key called 'error' which is text.
      const error = err as AxiosError<{error: string}>;

      if (error.response && error.response.data && error.response.data.error) {
        // Now TypeScript knows exactly what 'error.response.data.error' is!
        alert(error.response.data.error);
      } else {
        alert('Error: Cannot reach the server.');
      }
    }
  };

  // 4. THE UI
  return (
    <div className="glass-card">
      <h2>Join FamEmergency</h2>
      <form onSubmit={handleRegister}>
        <input 
          placeholder="Full Name" 
          value={name}
          onChange={(e) => setName(e.target.value)} 
          required 
        />
        <input 
          placeholder="Email Address" 
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        <input 
          placeholder="Password" 
          type="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default App;