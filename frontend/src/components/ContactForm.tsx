import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import type { RootState } from '../store'; 

// Word: The blueprint for the data itself
interface Contact {
  id: number;
  name: string;
  phone: string;
  relation: string;
}

// Word-by-Word: This is the "Door" that tells App.tsx what is allowed.
// We MUST define these here so App.tsx doesn't show the 'IntrinsicAttributes' error.
interface ContactFormProps {
  onContactAdded: () => void;
  editData: Contact | null;
  onCancelEdit: () => void;
}

// Word: React.FC<ContactFormProps> tells TypeScript: 
// "This function is a component that MUST accept the props we defined above."
const ContactForm: React.FC<ContactFormProps> = ({ 
  onContactAdded, 
  editData, 
  onCancelEdit 
}) => {
  const user = useSelector((state: RootState) => state.auth.user);
  
  // Word: We set the state immediately from the props.
  const [formData, setFormData] = useState({
    name: editData?.name || '',
    phone: editData?.phone || '',
    relation: editData?.relation || 'Family'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      if (editData) {
        // Word: PUT route for Update
        await axios.put(`http://localhost:5000/contacts/${editData.id}`, formData);
      } else {
        // Word: POST route for Create
        await axios.post('http://localhost:5000/contacts', {
          ...formData,
          userId: user.id
        });
      }
      onContactAdded();
    } catch (error) {
      console.error("Save Error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="contact-form">
      <h3>{editData ? "Edit Contact" : "Add Emergency Contact"}</h3>
      <input
        type="text"
        placeholder="Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
      />
      <input
        type="text"
        placeholder="Phone Number"
        value={formData.phone}
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        required
      />
      <select 
        value={formData.relation}
        onChange={(e) => setFormData({ ...formData, relation: e.target.value })}
      >
        <option value="Family">Family</option>
        <option value="Friend">Friend</option>
        <option value="Work">Work</option>
        <option value="Other">Other</option>
      </select>

      <div className="form-actions">
        <button type="submit" className="btn-primary">
          {editData ? "Update" : "Save"}
        </button>
        {editData && (
          <button type="button" onClick={onCancelEdit} className="btn-secondary">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default ContactForm;