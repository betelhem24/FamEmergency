import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

// Word-by-Word: We add the 'type' keyword here to satisfy 'verbatimModuleSyntax'
// This fixes the 'ts(1484)' error for RootState.
import type { RootState } from '../store'; 

interface ContactItem {
  id: number;
  name: string;
  phone: string;
  relation: string;
}

interface ContactFormProps {
  onContactAdded: () => void;
  editData?: ContactItem | null;
  onCancelEdit?: () => void;
}

const ContactForm: React.FC<ContactFormProps> = ({ onContactAdded, editData, onCancelEdit }) => {
  const user = useSelector((state: RootState) => state.auth.user);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    relation: 'Family'
  });

  // Word-by-Word: To avoid "Cascading Renders," we check if the data is 
  // ACTUALLY different before we call setFormData.
  useEffect(() => {
    if (editData) {
      // Word: We only update if the name in the form is different from the edit data
      if (formData.name !== editData.name) {
        setFormData({
          name: editData.name,
          phone: editData.phone,
          relation: editData.relation
        });
      }
    } else {
      // Word: If no editData, ensure the form is empty
      if (formData.name !== '') {
        setFormData({ name: '', phone: '', relation: 'Family' });
      }
    }
  }, [editData, formData.name]); // Word: The 'Effect' now watches both

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      if (editData && editData.id) {
        await axios.put(`http://localhost:5000/contacts/${editData.id}`, formData);
        alert("Updated!");
      } else {
        await axios.post('http://localhost:5000/contacts', {
          ...formData,
          userId: user.id
        });
        alert("Saved!");
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