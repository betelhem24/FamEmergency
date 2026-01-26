import React from 'react';
import type { Contact } from '../types/contact';

interface ContactListProps {
  contacts: Contact[];
  onEdit: (contact: Contact) => void;
  onDelete: (id: number) => void;
}

const ContactList: React.FC<ContactListProps> = ({ contacts, onEdit, onDelete }) => {
  if (contacts.length === 0) {
    return <p>No contacts added yet.</p>;
  }

  return (
    <ul className="contact-list">
      {contacts.map((c) => (
        <li key={c.id} className="contact-item">
          <div className="contact-info">
            <strong>{c.name}</strong> ({c.relation}) - {c.phone}
          </div>
          <div className="contact-actions">
            <button onClick={() => onEdit(c)} className="btn-edit">Edit</button>
            <button onClick={() => onDelete(c.id)} className="btn-delete">Delete</button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default ContactList;