import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { RootState } from '../store';

//  I define the Props to include the new edit data
interface ContactFormProps {
  onContactAdded: () => void;
  editData?: { id: number; name: string; phone: string; relation: string } | null;
  onCancelEdit?: () => void;
}

const ContactForm: React.FC<ContactFormProps> = ({ onContactAdded, editData, onCancelEdit }) => {
  const user = useSelector((state: RootState) => state.auth.user);
  
  //  State for the input fields
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    relation: 'Family'
  });

  //  When 'editData' changes (the user clicks Edit), we fill the form
  useEffect(() => {
    if (editData) {
      setFormData({
        name: editData.name,
        phone: editData.phone,
        relation: editData.relation
      });
    } else {
      // Word: If editData is null, clear the form (Add mode)
      setFormData({ name: '', phone: '', relation: 'Family' });
    }
  }, [editData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      if (editData) {
        //  If we are editing, use the PUT route with the contact ID
        await axios.put(`http://localhost:5000/contacts/${editData.id}`, formData);
        alert("Contact Updated!");
      } else {
        // If we are NOT editing, use the POST route to create new
        await axios.post('http://localhost:5000/contacts', {
          ...formData,
          userId: user.id
        });
        alert("Contact Saved!");
      }
      
      onContactAdded(); // Refresh the list
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
          {editData ? "Update Contact" : "Save Contact"}
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