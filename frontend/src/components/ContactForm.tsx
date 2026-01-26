import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { contactApi } from '../api/contactApi';
import type { RootState } from '../store';
// I added the 'type' keyword here to fix the red line.
// This tells the compiler that Contact is a blueprint, not a variable.
import type { Contact } from '../types/contact';

interface ContactFormProps {
  onContactAdded: () => void;
  editData: Contact | null;
  onCancelEdit: () => void;
}

const ContactForm: React.FC<ContactFormProps> = ({ onContactAdded, editData, onCancelEdit }) => {
  const user = useSelector((state: RootState) => state.auth.user);
  
  // I initialize the form state. If editData exists, I fill the boxes.
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
        // I use the dedicated API service to send the update
        await contactApi.update(editData.id, formData);
      } else {
        // I use the API service to create a new entry
        await contactApi.create({ ...formData, userId: user.id });
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
        <button type="submit" className="btn-primary">{editData ? "Update" : "Save"}</button>
        {editData && (
          <button type="button" onClick={onCancelEdit} className="btn-secondary">Cancel</button>
        )}
      </div>
    </form>
  );
};

export default ContactForm;