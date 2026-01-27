import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { contactApi } from '../api/contactApi';
import type { RootState } from '../store';
import type { Contact } from '../types/contact';

interface ContactFormProps {
  onContactAdded: () => void;
  editData: Contact | null;
  onCancelEdit: () => void;
}

const ContactForm: React.FC<ContactFormProps> = ({ onContactAdded, editData, onCancelEdit }) => {
  const user = useSelector((state: RootState) => state.auth.user);
  
  // I initialize the form. Using 'Number()' ensures the ID is never a string.
  const [formData, setFormData] = useState({
    name: editData?.name || '',
    phone: editData?.phone || '',
    relation: editData?.relation || 'Family'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // I check if the user exists and has a valid ID
    if (!user?.id) return;

    try {
      if (editData) {
        await contactApi.update(editData.id, formData);
      } else {
        // I explicitly convert userId to a number to satisfy TypeScript
        await contactApi.create({ ...formData, userId: Number(user.id) });
      }
      onContactAdded();
    } catch (error) {
      console.error("Save Error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="contact-form">
      <h3>{editData ? "Edit" : "Add"} Contact</h3>
      <input
        type="text"
        placeholder="Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
      />
      <input
        type="text"
        placeholder="Phone"
        value={formData.phone}
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        required
      />
      <select value={formData.relation} onChange={(e) => setFormData({ ...formData, relation: e.target.value })}>
        <option value="Family">Family</option>
        <option value="Friend">Friend</option>
        <option value="Work">Work</option>
        <option value="Other">Other</option>
      </select>
      <div className="form-actions">
        <button type="submit" className="btn-primary">{editData ? "Update" : "Save"}</button>
        {editData && <button type="button" onClick={onCancelEdit} className="btn-secondary">Cancel</button>}
      </div>
    </form>
  );
};

export default ContactForm;