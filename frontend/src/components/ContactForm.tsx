import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
// Word: We check the path. If your store is in 'src/store/index.ts', we use '../store'
import { RootState } from '../store'; 

interface ContactFormProps {
  onContactAdded: () => void;
  editData?: { id: number; name: string; phone: string; relation: string } | null;
  onCancelEdit?: () => void;
}

const ContactForm: React.FC<ContactFormProps> = ({ onContactAdded, editData, onCancelEdit }) => {
  const user = useSelector((state: RootState) => state.auth.user);
  
  // Word-by-Word: We explicitly tell React what 'formData' looks like
  // This prevents the red line on setFormData.
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    relation: 'Family'
  });

  useEffect(() => {
    // Word: If editData exists and is NOT null
    if (editData) {
      setFormData({
        name: editData.name,
        phone: editData.phone,
        relation: editData.relation
      });
    } else {
      // Word: Reset to empty strings if we are adding a new contact
      setFormData({ name: '', phone: '', relation: 'Family' });
    }
  }, [editData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      if (editData) {
        // Word: PUT means "Update existing"
        await axios.put(`http://localhost:5000/contacts/${editData.id}`, formData);
      } else {
        // Word: POST means "Create new"
        await axios.post('http://localhost:5000/contacts', {
          ...formData,
          userId: user.id
        });
      }
      
      onContactAdded(); 
    } catch (error) {
      console.error("Save Error:", error);
      alert("Failed to save contact.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="contact-form">
      <h3>{editData ? "Edit Contact" : "Add Emergency Contact"}</h3>
      
      <input
        type="text"
        placeholder="Name"
        value={formData.name}
        // Word: '...formData' keeps the other fields safe while we change 'name'
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