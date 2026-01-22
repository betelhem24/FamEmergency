// 1. IMPORTS: Bringing in our tools
import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  // 2. STATE: Creating the 3 memory boxes for our user data
  // <string> tells TypeScript to only allow text here
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  // 3. THE BRIDGE: The function that talks to the Backend
  const handleRegister = async (e: React.FormEvent) => {
    // This prevents the page from refreshing when we click the button
    e.preventDefault();

    try {
      // Sending the 3 pieces of data to our Backend port 5000
      const response = await axios.post('http://localhost:5000/users', {
        name: name,
        email: email,
        password: password
      });

      // If successful, show an alert with the new user's name
      console.log("Success:", response.data);
      alert('Success! User created: ' + response.data.name);
      
    } catch (error) {
      // If the Backend is off or the email is a duplicate, this runs
      console.error("Error details:", error);
      alert('Error creating user. Check if the server is running!');
    }
  };

  // 4. THE UI: What actually appears on your website
  return (
    <div className="glass-card">
      <h2>Join FamEmergency</h2>
      
      <form onSubmit={handleRegister}>
        {/* Name Input */}
        <input 
          placeholder="Full Name" 
          value={name}
          onChange={(e) => setName(e.target.value)} 
          required 
        />

        {/* Email Input */}
        <input 
          placeholder="Email Address" 
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />

        {/* Password Input */}
        <input 
          placeholder="Password" 
          type="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />

        {/* The Action Button */}
        <button type="submit">Register</button>
      </form>

      {/* Visual confirmation for you to see the memory working */}
      <div style={{ marginTop: '20px', fontSize: '12px', opacity: 0.6 }}>
        <p>Typing: {name} | {email}</p>
      </div>
    </div>
  );
}

export default App;