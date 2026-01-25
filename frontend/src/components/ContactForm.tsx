import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';

const ContactForm = ({ onContactAdded }: { onContactAdded: () => void }) => {
  // 1. STATE: Memory for the form inputs
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [relation, setRelation] = useState('');

  // 2. BRAIN: Get the logged-in user's ID from Redux
  const { user } = useSelector((state: RootState) => state.auth);

  // 3. LOGIC: Sending the data to the Backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Word: If no user is logged in, we can't save a contact
    if (!user) return;

    try {
      // Word-by-Word: axios.post sends the data to our new /contacts route
      await axios.post('http://localhost:5000/contacts', {
        name,
        phone,
        relation,
        userId: user.id, // Word: We attach the ID of the owner
      });

      // Word: Clear the form after success
      setName('');
      setPhone('');
      setRelation('');
      
      // Word: This tells the parent page to refresh the list of contacts
      onContactAdded();
      alert("Emergency Contact Saved!");

    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        alert(err.response?.data?.error || "Failed to save contact");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="contact-form">
      <h3>Add Emergency Contact</h3>
      <div className="form-group">
        <input 
          type="text" 
          placeholder="Contact Name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required 
        />
      </div>
      <div className="form-group">
        <input 
          type="text" 
          placeholder="Phone Number" 
          value={phone} 
          onChange={(e) => setPhone(e.target.value)} 
          required 
        />
      </div>
      <div className="form-group">
        <input 
          type="text" 
          placeholder="Relation (e.g. Mother)" 
          value={relation} 
          onChange={(e) => setRelation(e.target.value)} 
          required 
        />
      </div>
      <button type="submit" className="btn-primary">Save Contact</button>
    </form>
  );
};

export default ContactForm;