import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  return (
    <div className="glass-card">
      <h2>Join FamEmergency</h2>
      <input 
        placeholder="Type Name" 
        value={name}
        onChange={(e) => setName(e.target.value)} 
      />
      <p>Current Name in Memory: {name}</p>
    </div>
  );
}

export default App;